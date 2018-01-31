/**
 * 盘点管理
 */
import React from 'react';
import { Form, Row, Col, Input, DatePicker,Button,Select,Modal ,message} from 'antd';
import FetchTable from 'component/FetchTable';
import uuid from 'uuid';
import { actionHandler,fetchData } from 'utils/tools';
import querystring from 'querystring';
import { storage } from 'api';  
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class SearchForm extends React.Component{
    state={
        storageOptions: []
    }
    componentDidMount = () => {
        //库房列表
       fetchData(storage.FINDSTORAGEBYMYUSER,{},(data)=>{
            this.setState({ storageOptions : data.result})
       })
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const createTime = values.createTime === undefined ? "":values.createTime;
            if(createTime.length>0) {
                values.createTimeStart = createTime[0].format('YYYY-MM-DD');
                values.createTimeEnd = createTime[1].format('YYYY-MM-DD');
            }
            console.log(values,"搜索数据")
            this.props.query(values); 
       });
    }
    //重置
    handleReset = () => {
        this.props.form.resetFields();
        this.props.query({});
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 },
        };
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row>
                 <Col span={8} key={1}>
                    <FormItem {...formItemLayout} label={'制单时间'}>
                        {getFieldDecorator('createTime')(
                            <RangePicker showTime format="YYYY-MM-DD" style={{width:"100%"}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={2}>
                    <FormItem {...formItemLayout} label={'库房'}>
                        {getFieldDecorator('storageGuid',{
                            initialValue: ""
                        })(
                            <Select placeholder={'请选择'}>
                                <Option value="" key={-1}>全部</Option>
                                {
                                    this.state.storageOptions.map((item,index) => {
                                    return <Option key={index} value={item.value}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={4}>
                    <FormItem {...formItemLayout} label={'状态'}>
                        {getFieldDecorator('fstate',{
                            initialValue:""
                        })(
                            <Select placeholder={'请选择'}>
                                <Option value="" key={-1}>全部</Option>
                                <Option value="0" key={0}>待确认</Option>
                                <Option value="1" key={1}>已确认</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
               
                <Col span={8} key={5}>
                    <FormItem {...formItemLayout} label={'单号'}>
                        {getFieldDecorator('searchName')(
                             <Input placeholder="请输入盘点单号"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={4} key={6} style={{textAlign:'right'}}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                        清除
                    </Button>
                </Col>
              </Row>
            </Form>
        )
    
    }
}
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);


//添加盘点数据
class InventoryForm extends React.Component {
    state={
        storageOptions: []
    }
    componentDidMount = () => {
        //库房列表
       fetchData(storage.FINDSTORAGEBYMYUSER,{},(data)=>{
            this.setState({ storageOptions : data.result})
       })
    }
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (err) {
          return;
        } else {
            //添加交互数据
            console.log(values)
            fetchData(storage.STARTINVENTORY,querystring.stringify(values),(data)=>{
                if(data.status){
                    message.success("操作成功!")
                    this.props.cb();
                }else{
                    this.handleError(data.msg)
                }
            })
        }
      });
    }
    render () {
      const { getFieldDecorator } = this.props.form;
      const addrWrapper = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={24} key={4} >
              <FormItem {...addrWrapper} label={`库房`}>
                {getFieldDecorator(`storageGuid`)(
                    <Select placeholder={'请选择'}>
                        {
                            this.state.storageOptions.map((item,index) => {
                            return <Option key={index} value={item.value}>{item.text}</Option>
                            })
                        }
                    </Select>
                )}
              </FormItem>
            </Col> 
     
            <Col span={24} key={6} >
              <FormItem {...addrWrapper} label={`备注`}>
                {getFieldDecorator(`tfRemark`)(
                  <Input/>
                )}
              </FormItem>
            </Col> 
    
            <Col span={24} key={8} style={{textAlign: 'right'}}>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button style={{marginLeft: 10}} onClick={this.props.cb}>取消</Button>
            </Col> 
          </Row> 
        </Form>  
      )
    }
  }
  
  const WrappedInventoryForm = Form.create()(InventoryForm);

class WareHouseRecord extends React.Component{
    state = {
        visible: false,
        query :{}
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    handleReset = () =>{
        this.setState({visible: false});
        this.refs.table.fetch();
    }
    render(){
        const columns = [{
            title : '操作',
            dataIndex : 'action',
            width: 80 ,
            render : (text,record)=>{
                return <span>
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router,(record.fstate===0? `/storage/inventoryMgt/show`:`/storage/inventoryMgt/showC` ), {...record}
                    )}>
                   详情
                </a>
                </span>
            }

        },{
            title : '盘点单',
            dataIndex : 'kcpdNo',
            width: 160,
           
        },{
            title : '状态',
            dataIndex : 'fstateName',
            width: 120,
        },{
            title : '库房',
            dataIndex : 'rStorageName',
            width: 100,
        },{
            title : '盘点周期',
            dataIndex : 'kcpdDate',
            width: 150,
        },{
            title : '操作员',
            dataIndex : 'createUserName',
            width: 120,
        },{
            title : '制单时间',
            dataIndex : 'createTime',
            width: 150
        },{
            title : '备注',
            dataIndex : 'tfRemark'
        }];
        const query = this.state.query;
        return(
            <div>
                { this.props.children || 
                <div>
                    <Modal
                        key={uuid()}
                        title="新增盘点"
                        visible={this.state.visible}
                        footer={null}
                        onCancel={() => this.setState({visible: false})}
                        okText="确认"
                        cancelText="取消"
                    >    
                    <WrappedInventoryForm 
                        cb={this.handleReset}
                    />
                    </Modal>
                    <SearchBox query={this.queryHandler}/>
                    <Row>
                        <Col>
                            <Button type="primary" 
                            onClick={() => this.setState({visible: true})} 
                            >
                            新建</Button>
                        </Col>
                    </Row>
                    <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={storage.GETSTOCKTAKINGLIST}
                        rowKey='kcpdId'
                        scroll={{ x: '120%' }}
                    />
                </div>
                }
            </div>
        )
    }
}
module.exports = WareHouseRecord;