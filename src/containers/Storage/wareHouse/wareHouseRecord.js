/**
 * 入库记录
 */
import React from 'react';
import { Form, Row, Col, Input, DatePicker,Button,Select } from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler,fetchData } from 'utils/tools';
import { storage } from 'api';  

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class SearchForm extends React.Component{
    state={
        fOrgOptions:[],
        storageOptions: []
    }
    componentDidMount = () => {
         //库房列表
        fetchData(storage.FINDSTORAGEBYMYUSER,{},(data)=>{
             this.setState({ storageOptions : data.result})
        })
        //供应商列表
        fetchData(storage.FINDSUPPLIERLISTBYORGID,{},(data)=>{
            this.setState({ fOrgOptions : data.result})
       })
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const inDateTime = values.inDateTime === undefined ? "":values.inDateTime;
            if(inDateTime.length>0) {
                values.inDateStart = inDateTime[0].format('YYYY-MM-DD');
                values.inDateEnd = inDateTime[1].format('YYYY-MM-DD');
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
                    <FormItem {...formItemLayout} label={'入库时间'}>
                        {getFieldDecorator('inDateTime')(
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
                 <Col span={8} key={3}>
                    <FormItem {...formItemLayout} label={'入库分类'}>
                        {getFieldDecorator('inMode',{
                            initialValue:""
                        })(
                            <Select>
                                <Option value="" key={-1}>全部</Option>
                                <Option value="01">采购入库</Option>
                                <Option value="04">盘盈</Option>
                                <Option value="05">初始化</Option>
                                <Option value="06">退货</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={4}>
                    <FormItem {...formItemLayout} label={'供应商'}>
                        {getFieldDecorator('fOrgId',{
                            initialValue:""
                        })(
                            <Select placeholder={'请选择'}>
                                <Option value="" key={-1}>全部</Option>
                                {
                                    this.state.fOrgOptions.map((item,index) => {
                                    return <Option key={index} value={item.value.toString()}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
               
                <Col span={8} key={5}>
                    <FormItem {...formItemLayout} label={'单号'}>
                        {getFieldDecorator('searchName')(
                             <Input placeholder="请输入库单号/送货单号/订单号"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={6} style={{textAlign:'right'}}>
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

class WareHouseRecord extends React.Component{
    state = {
        query:{}
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
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
                        null, this.props.router,`/storage/wareHouse/show`, {...record}
                    )}>
                   详情
                </a>
                </span>
            }

        },{
            title : '入库单',
            dataIndex : 'InNo',
            width: 200,
           
        },{
            title : '送货单',
            dataIndex : 'Send_Id',
            width: 200,
        },{
            title : '订单',
            dataIndex : 'orderNo',
            width: 150,
        },{
            title : '入库分类',
            dataIndex : 'inMode',
            width: 100,
        },{
            title : '库房',
            dataIndex : 'storageName',
            width: 150,
        },{
            title : '供应商',
            dataIndex : 'forgName',
            width: 200
        },{
            title : '操作员',
            dataIndex : 'create_Username',
            width: 100
        },{
            title : '入库时间',
            dataIndex : 'inDate',
            width: 140
        },{
            title : '备注',
            dataIndex : 'remark',
            width: 150
        }];
        let query =  this.state.query;
        return(
            <div>
                { this.props.children || 
                <div>
                    <SearchBox query={this.queryHandler}/>
                    <Row>
                        <Col>
                            <Button type="primary" 
                            onClick={actionHandler.bind(
                                null, this.props.router, `/storage/wareHouse/add`, { }
                            )}>
                            入库</Button>
                            <Button type="primary" style={{marginLeft:16,marginRight:16}}
                            onClick={actionHandler.bind(
                                null, this.props.router, `/storage/wareHouse/refund`, { }
                            )}>
                            退货</Button>
                            <Button type="primary"
                            onClick={actionHandler.bind(
                                null, this.props.router, `/storage/wareHouse/initialization`, { }
                            )}>
                            初始化</Button>
                        </Col>
                    </Row>
                    <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={storage.WAREHOUSELIST}
                        rowKey='inId'
                        scroll={{ x: '180%' }}
                    />
                </div>
                }
            </div>
        )
    }
}
module.exports = WareHouseRecord;