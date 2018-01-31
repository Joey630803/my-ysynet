/**
 * @file 产品审核
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Select,DatePicker,message,Modal } from 'antd';
import FetchTable from 'component/FetchTable';
import { hashHistory} from 'react-router';
import { fetchData ,CommonData } from 'utils/tools';
import { department } from 'api'
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const confirm = Modal.confirm;

class SearchForm extends React.Component {
  state = {
      departData: [],
      storageData: [],
      storageGuid: '',
      planTypes:[]
  }
    //用户所属科室
  componentDidMount = () => {
    fetchData(department.FINDDEPTSTORAGEBYUSER,{},(data)=>{
      if(data.length>0){
        this.setState({ departData: data })
      }
    });
    CommonData('DEPT_BTYPE',(data)=>{
      this.setState({ planTypes:data })
    })
  }  
  //查询
  search = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const applyTime = values.applyTime === undefined ? "":values.applyTime;
      values.storageGuid = this.state.storageGuid;
      if(applyTime.length>0) {
        values.applyStartDate = applyTime[0].format('YYYY-MM-DD');
        values.applyEndDate = applyTime[1].format('YYYY-MM-DD');
      }
      console.log('查询条件:',values)
      this.props.query(values);
    })
  }
  //重置
  reset = () => {
    this.setState({storageGuid: ""});
    this.props.form.resetFields();
    this.props.query({});
  }
   //科室联动库房
  handleChange = (value) => {
      if(value===""){
          return this.setState({storageGuid: ""})
      }
      //加库房接口 科室id
      const departData = this.state.departData;
      departData.map((item, index) => {
          if(item.value === value){
              this.setState({ 
                  storageData: item.children,
                  storageGuid: item.children.length === 0 ? "" : item.children[0].value
              });
          }
          return null;
      })
  }
  render = () => {
    const getOptions =()=>{
      let options = [];
      let planTypes = this.state.planTypes;
      planTypes.forEach((item)=>{
        options.push(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
      })
      return options;
    }
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="ant-advanced-search-form" onSubmit={this.search}>
         <Row >
          <Col span={6} key={1}>
            <FormItem {...formItemLayout} label={'申请科室'}>
                  {getFieldDecorator('deptId',{
                     initialValue:""
                  })(
                      <Select 
                      placeholder="请选择" 
                      onChange={this.handleChange}
                      >
                          <Option value="">全部</Option>
                          {
                              this.state.departData.map((item,index) => {
                                  return <Option key={index} value={item.value}>{item.label}</Option>
                              })
                          }
                      </Select>
                  )}
              </FormItem>
          </Col>
          <Col span={6} key={2}>
              <FormItem {...formItemLayout} label={'备货库房'}>
                  <Select 
                      value={this.state.storageGuid}
                      showSearch
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={
                          (value)=>{
                              this.setState({storageGuid: value})
                            }
                      }
                      >
                          <Option value="">全部</Option>
                          {
                              this.state.storageData.map((item,index) => {
                                  return <Option key={index} value={item.value}>{item.label}</Option>
                              })
                          }
                  </Select>
              </FormItem>
          </Col>
          <Col span={6} key={3}>
              {
                <FormItem {...formItemLayout} label={'申请单类型'}>
                  {
                    getFieldDecorator('applyType',{
                      initialValue:''
                    })(
                      <Select>
                          <Option  value=''>全部</Option>
                          {
                            getOptions()
                          }
                      </Select>
                    )
                  }

                </FormItem>
              }
          </Col>
          <Col span={6} key={4}>
            <FormItem {...formItemLayout} label={'申请单状态'}>
                {getFieldDecorator('applyFstate',{
                   initialValue:"01"
                })(
                    <Select>
                        <Option value="">全部</Option>
                        <Option value="01">待审核</Option>
                        <Option value="02">审核通过</Option>
                        <Option value="03">审核不通过</Option>
                    </Select>
                )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={6} key={5}>
              <FormItem {...formItemLayout} label={'申请日期'}>
                  {getFieldDecorator('applyTime')(
                          <RangePicker showTime format="YYYY-MM-DD" style={{width:'100%'}}/>
                  )}
              </FormItem>
          </Col>
          <Col span={6} key={6}>
            <FormItem {...formItemLayout} label={'其他'}>
                {getFieldDecorator('treatmentNo')(
                    <Input placeholder="申请单号/就诊号/患者姓名"/>
                )}
            </FormItem>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button type='primary' onClick={this.reset} style={{marginLeft:8}}>清空</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedSearchForm = Form.create()(SearchForm);
const redirect = (url,record) => {
  hashHistory.push({
    pathname: url,
    state: {
      ...record,
    }
  })
}
const colRender = (text, type, state) => {
     switch (text) {
    case '01':
      return <span style={{color: '#ffbf00'}}>待审核</span>;
    case '02':
      return <span style={{color: 'green'}}>审核通过</span>;
    case '03':
      return <span>审核不通过</span>;
    default:
      break;
  }
}
const redirectURL = (applyFstate,record)=>{
  if(applyFstate === '01'){
      if(record.applyType === 'APPLY'){
        return <a onClick={redirect.bind(this, '/department/departCheck/check', record)}>审核</a> 
      }
      else if(record.applyType === 'HIGH_APPLY'){
        return <a onClick={redirect.bind(this, '/department/departCheck/hvCheck', record)}>审核</a> 
      }
      else if(record.applyType ==='OPER_APPLY'){
        return <a onClick={redirect.bind(this, '/department/departCheck/opCheck', record)}>审核</a> 
      }
  }else{
       if(record.applyType === 'APPLY'){
        return <a onClick={redirect.bind(this, '/department/departCheck/show', record)}>查看</a>
       }
       else if(record.applyType === 'HIGH_APPLY'){
          return <a onClick={redirect.bind(this, '/department/departCheck/hvShow', record)}>查看</a>
       }
       else if(record.applyType === 'OPER_APPLY'){
          return <a onClick={redirect.bind(this, '/department/departCheck/opShow', record)}>查看</a>
       }
    }
  }
const columns = [{
      title : '操作',
      dataIndex : 'applyId',
      fixed: 'left',
      width: 80,
      render: (text, record) => {
        return redirectURL(record.applyFstate,record)
      }
  },{
      title : '状态',
      dataIndex : 'applyFstate',
      width: 100,
      fixed:'left',
      render: applyFstate => {
      	return colRender(applyFstate)
      }
  },{
      title : '申请单类型',
      dataIndex : 'applyType',
      width: 180,
      render: applyType =>{
        if(applyType==='APPLY'){
          return '普耗申请单'
        }
        else if(applyType==='HIGH_APPLY'){
          return '高值备货单'
        }
        else if(applyType==='OPER_APPLY'){
          return '手术备货单'
        }
      }
  },{
      title : '申请单号',
      dataIndex : 'applyNo',
      width: 180
  },{
      title : '申请单总金额',
      dataIndex : 'totalPrice',
      width: 120,
      /* render: (text,record,index) => {
            return text === 'undefined'? '0.00' : text.toFixed(2)
        } */
  },{
      title : '申请科室',
      dataIndex : 'deptName',
      width: 150,
  },{
      title : '收货地址',
      dataIndex : 'tfAddress',
      width: 260,
  },{
      title : '备货库房',
      dataIndex : 'storageName',
  },{
      title : '申请人',
      dataIndex : 'applyUsername',
      fixed: 'right',
      width: 120,
  },{
      title : '申请时间',
      dataIndex : 'applyTime',
      fixed: 'right',
      width: 150,
  }
]
class Apply extends React.Component {
  state ={
    visible: false,
    disabled:false,
    selectReason:'',
    dirtyClick: false,//通过
    selectd:''  ,//审核ID
    selectedRowKeys:[],
    query:''
  }
  handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
      });
  }
  //审核通过
  handerPass = ()=>{
    const selectedRows = this.state.selectd;
    console.log(selectedRows);
    if(selectedRows.length===0){
      return message.warn('请至少选择一条待审核有效数据')
    }
    const that = this;
    confirm({
      title: '提示',
      okText:'确认',
      cancelText:'取消' ,
      content: '是否确认审核通过？',
      onOk() {
              that.setState({dirtyClick: true});
              const applyFstates = [];
              let  values = {};
              that.state.selectd.map((item,index) => {
              return applyFstates.push({applyId:item.applyId,applyNowFstate:item.applyFstate})
              })
              values.applyNextFstate = '0';
              values.applyFstates = applyFstates;
              console.log('审核通过参数',values)
              //审核交互
              fetchData(department.BATCHCHECK,JSON.stringify(values),(data)=>{
                that.setState({dirtyClick: false});
                if(data.status){
                  message.success("审核通过");
                  that.refs.table.fetch({});
                }else{
                   this.handleError(data.msg);
                }
                that.setState({ selectedRowKeys: []})
              },'application/json');
            },
      onCancel() {
       that.setState({ selectedRowKeys : []})
     }
    })
      
  };
  //审核不通过
  handerNotPass = () => {
    const selectedRows = this.state.selectd;
    console.log(selectedRows);
    if(selectedRows.length===0){
      return message.warn('请至少选择一条待审核有效数据')
    }
    const that = this;
    confirm({
      title: '提示',
      okText:'确认',
      cancelText:'取消' ,
      content: '是否确认审核不通过？',
      onOk() {
        that.setState({ loading: true });
        const applyFstates = [];
        let  values = {};
        that.state.selectd.map((item,index) => {
        return applyFstates.push({applyId:item.applyId,applyNowFstate:item.applyFstate})
        })
        values.applyNextFstate = '1';
        values.applyFstates = applyFstates;
        console.log('审核不通过数据',values)
        //审核交互
        fetchData(department.BATCHCHECK,JSON.stringify(values),(data)=>{
          that.setState({ loading: false, visible: false });
          if(data.status){
            message.success("操作成功!");
            that.refs.table.fetch({});
          }else{
            this.handleError(data.msg);
          }
          that.setState({ selectedRowKeys: []})

        },'application/json');
      },
      onCancel() {
        that.setState({ selectedRowKeys : []})
      }
      })
  }
  search = (query) => {
    this.refs.table.fetch(query);
     this.setState({ query })
  }
  render() {
     const query = this.state.query;
    return (
      this.props.children || 
      <div>
        <WrappedSearchForm  
          query={(query) => this.search(query)}
        />
        <div style={{marginBottom:16,marginLeft:16}}>
          <Button type="primary" style={{marginRight:8}} onClick={this.handerPass}>通过</Button>
          <Button type="primary" ghost onClick={this.handerNotPass}>不通过</Button>
        </div>
        <FetchTable 
          query={query}
          ref='table'
          rowKey={'applyId'}
          url={department.DEPARTCHECK_LIST}
          columns={columns} 
          scroll={{ x: '140%' }}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({ selectd: selectedRows,selectedRowKeys:selectedRowKeys});
            },
            selectedRowKeys:this.state.selectedRowKeys
          }}
        />
      </div>  
    )
  }
}
module.exports = Apply