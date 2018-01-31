/**
 * @file 汇总单管理
 */
import React from 'react';
import {Form, Row, Col, Input, Select, DatePicker, Button, Popconfirm, message} from 'antd';
import FetchTable from 'component/FetchTable';
import { hashHistory } from 'react-router'; 
import { purchase } from 'api'; 
import querystring from 'querystring';
import { CommonData, fetchData} from 'utils/tools'; 


const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class SearchForm extends React.Component {
  state = {
    gatherTypes:[],
    CheckGatherTypes:[]

  }
  componentDidMount = () => {
     CommonData('GATHER_TYPE', (data) => {
           this.setState({gatherTypes:data})
         });
      CommonData('GATHER_FSTATE',(data) =>{
        this.setState({CheckGatherTypes:data})
      });
  }
   //查询
  handleSearch = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err,values)=>{
        if(!err)
        {
          const sumaryTime = values.sumaryTime === undefined ? "" : values.sumaryTime;
          if( sumaryTime.length > 0 )
          {
            values.gatherStartDate = sumaryTime[0].format('YYYY-MM-DD');
            values.gatherEndDate = sumaryTime[1].format('YYYY-MM-DD');
          }
          values.storageGuid = this.props.defaultValue;
          console.log('查询条件: ', values);
          this.props.query(values);
        }
      })
  }
  handleReset = ()=>{
    this.props.form.resetFields();
    this.props.query({storageGuid: this.props.defaultValue});
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const getGatherTypes = () =>{
      let options = [];
      let gatherTypes = this.state.gatherTypes;
      gatherTypes.forEach((item) => {
        options.push(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
      })
      return options;
    }
    const getOptions =()=>{
      let options = [];
      let CheckGatherTypes = this.state.CheckGatherTypes;
      CheckGatherTypes.forEach((item)=>{
        options.push(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
      })
      return options;
    }
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row>
          <Col span={8} key={1}>
            <FormItem {...formItemLayout} label={'汇总单类型'}>
              {
                getFieldDecorator(`gatherType`,{
                  initialValue:''
                })(
                    <Select>
                      <Option value='' key={-1}>全部</Option>
                      {
                        getGatherTypes()
                      }
                    </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} key={2}>
            <FormItem {...formItemLayout} label={'汇总单状态'}>
              {
                getFieldDecorator(`gatherFstate`,{
                  initialValue:''
                })(
                    <Select>
                      <Option value=''>全部</Option>
                       {
                        getOptions()
                       }
                    </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={8} key={3}>
            <FormItem {...formItemLayout} label={'汇总时间'}>
              {
                getFieldDecorator(`sumaryTime`,)(
                    <RangePicker showTime format="YYYY-MM-DD" style={{width:"100%"}} />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} key={4}>
            <FormItem {...formItemLayout} label={'汇总单号'}>
              {
                getFieldDecorator(`gatherNo`,{
                rules: [
                  { max: 25, message: '长度不能超过25' }
                ]
                })(
                    <Input placeholder='汇总单号' />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} key={5} style={{textAlign:'right'}}>
            <Button type="primary" htmlType="submit" style={{marginLeft:'16px'}}>搜索</Button>
            <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleReset}>清空</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedSearchForm = Form.create()(SearchForm);
const actions = {
  details: (action) => <a onClick={action}>查看</a>,
  submit: (action) => <Popconfirm title="是否提交审批?" onConfirm={action}>
                        <a>提交审批</a>
                      </Popconfirm>,
  sendOneOrder: (action) => <Popconfirm title="是否发送订单?" onConfirm={action}>
                              <a>发送订单</a>
                            </Popconfirm>
}

class SummarySheet extends React.Component {
  state={
    query:'',
    storageData:[],
    selectedRowKeys:[],
    selectedRows:[]
  }
  componentDidMount = () => {
    //采购库房
      fetchData(purchase.FINDTOPSTORAGEBYUSER_LIST,{},data => { 
        if(data.result.length > 0){
          this.setState({
              query:{'storageGuid':this.props.router.location.search === "" ? data.result[0].value : this.props.router.location.query.storageGuid },
              storageData: data.result
          })
        }
      });
  }
   //库房变化
    handleSelectChange = (value) => {
      this.setState({
        query:{'storageGuid':value }
    })
      this.refs.table.fetch({'storageGuid':value });
    }
  search = (query) => {
      this.refs.table.fetch(query);
      this.setState({ query: query })
  }
  redirect = (url, record) => {
    hashHistory.push({
      pathname: url,
      state: record
    })
  }
  //查看
  details = (record) => {
    this.redirect('/purchase/summaryMgt/show', record)
  }
  //状态对应操作
  getActions = ( text, record )=>{
      switch(text){
        case '10' : 
          return <span>
                    {actions.details(this.details.bind(this,record))}
                    {
                      record.approvalFlag === '01'? null
                      :
                      <span>
                        <span className="ant-divider" />
                        {actions.submit(this.submit.bind(this,record))}
                      </span>
                    }
                  </span>
        default:
          return <span>
                    {actions.details(this.details.bind(this,record))}
                 </span>
      }
  }
  //单项提交审批
  submit = (record) =>{
    let submitData = [record];
    this.submitOrder(submitData)
  }
  //多项提交审批
  submitBill = ()=>{
    const selectedRows = this.state.selectedRows;
    console.log(selectedRows)
    if(selectedRows.length===0){
      return message.warn('请至少选择一条有效数据')
    }
     //待完善限制条件 selectedRows
    this.submitOrder(selectedRows)
     
  }
  //发送单条订单
  sendOneOrder = (record) =>{
    let sendData = [ record ];
    this.sendOrder(sendData);
  }
  //发送多条订单
  sendSureOrder =()=>{
    const selectedRows = this.state.selectedRows;
    if(selectedRows.length===0){
       return message.warn('请至少选择一条通过状态的有效数据')
    }
    //待完善限制条件 selectedRows
    this.sendOrder(selectedRows);
    
  }
  
  //提交审批处理
  submitOrder = (record) => {
    const values = {};
    const gatherList = [];
    record.forEach((item,index)=>{
      gatherList.push({gatherId:item.gatherId,gatherFstate:item.gatherFstate})
    });
    values.gatherList = gatherList;
    console.log('提交审批数据',values)
    fetchData(purchase.UPDATEGATHERAPPROVAL,JSON.stringify(values),(data)=>{
      if(data.result==='success'){
          this.refs.table.fetch();
          message.success("操作成功");
      }else{
          message.error(data.msg);
      }
    },'application/json')
  }
  //发送订单处理
  sendOrder = (record) => {
    const values = {};
    const gatherList = [];
    record.forEach((item)=>{
      gatherList.push({
        gatherId:item.gatherId,
        gatherType:item.gatherType,
        gatherFstate:item.gatherFstate
      })
    });
    values.gatherList = gatherList;
    console.log('发送订单数据',values)
    fetchData(purchase.CREATEGATHERORDER,JSON.stringify(values),(data)=>{
       if(data.result==='success'){
          this.refs.table.fetch();
          message.success("操作成功");
      }else{
          message.error(data.msg);
      }
    },'application/json')
  }

  onSelectChange = (selectedRowKeys,selectedRows) => {
     console.log('selectRowKeys',selectedRowKeys)
     console.log('selectRows',selectedRows)
     this.setState({ selectedRowKeys,selectedRows });
    }
  defaultQuery = (query) => {
      this.setState({ query: query })
    };
  render () {
    const columns = [{
      title:'操作',
      dataIndex:'actions',
      fixed:'left',
      width: 110,
      render: (text,record) =>{
        return this.getActions(record.gatherFstate, record)
      }
    },{
      title:'状态',
      dataIndex:'gatherFstateName',
      render : ( text, record )=>{
       if(record.approvalFlag === '01' ){
         return <span style={{color:"#e9002c"}}>{text + "(正在审批)"}</span>
       }else{
         return text
       }
      }
    },{
      title:'汇总单号',
      dataIndex:'gatherNo'
    },{
      title:'汇总单类型',
      dataIndex:'gatherType',
      render :gatherType => {
        if(gatherType === 'GATHER'){
          return '普耗汇总单'
        }
        else if(gatherType === 'HIGH_GATHER'){
          return '高值汇总单'
        }
        else if(gatherType === 'SETTLE_GATHER'){
          return '结算汇总单'
        }
      }
    },{
      title:'汇总金额',
      dataIndex:'totalPrice',
      render :(text, record) =>{
        return text === 'undefined' ? '0.00':text.toFixed(2)
      }
    },{
      title:'汇总人',
      dataIndex:'gatherUserName'
    },{
      title:'汇总时间',
      dataIndex:'gatherTime'
    }];
    const query = this.state.query;
    const exportHref = purchase.EXPORTGATHERLIST+"?"+querystring.stringify(query);
    const selectedRowKeys = this.state.selectedRowKeys;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (<div>
               {
              this.props.children || 
              <div>
                  <WrappedSearchForm query={(query) => this.search(query)} defaultValue={query.storageGuid}/>
                  {
                  query.storageGuid === undefined ? null :
                  <div>
                  <Row>
                    <Col span={8}>
                        <div className="ant-form-item-label">
                            <label>采购库房</label>
                        </div>
                        <Select
                        style={{width:200}}
                        value={this.state.query.storageGuid}
                        onChange={this.handleSelectChange}
                        >
                        {
                        this.state.storageData.map((item,index) => { 
                        return <Option key={index} value={item.value}>{item.text}</Option>
                        })
                        }
                        </Select>
                    </Col>
                    <Col span={16} style={{textAlign:'right'}}>
                      <Button type="primary" style={{marginRight:8}} onClick={this.submitBill}>提交审批</Button>
                      <Button type="primary" ghost style={{marginRight:8}} onClick={this.sendSureOrder}>发送订单</Button>
                       <a href={exportHref}><Button type="primary" ghost style={{marginRight:8}} >导出</Button></a>
                    </Col>
                  </Row>
                  <FetchTable 
                    style={{marginTop:10}}
                    columns={columns}
                    query={query}
                    ref='table'
                    url={purchase.SELECTGATHER_LIST}
                    rowKey='gatherId'
                    pagination={false}
                    scroll={{ x: '110%' }}
                    rowSelection={rowSelection}
                  />
                  </div>
                  }
              </div>
              }
            </div>)
  }
}

module.exports = SummarySheet;