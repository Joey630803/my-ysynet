/**
 * @file 拣货单
 */
import React from 'react';
import { Form, Row, Col, Input, DatePicker, Button, Select, Breadcrumb, message} from 'antd';
import FetchTable from 'component/FetchTable';
import { Link } from 'react-router';
import { actionHandler, fetchData} from 'utils/tools';
import { storage } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class SearchForm extends React.Component{
    state = {
        query : {},
        storageOptions : [],
        deptOptions : []
    }
    componentDidMount = () =>{
        //库房
        fetchData(storage.FINDSTORAGEBYMYUSER,{},(data)=>{
            if(data.status){
                this.setState({ storageOptions:data.result });
            }else{
                message.error('后台异常！');
            }
        });
        //科室
    }
    search = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
           const outTime = values.outTime === undefined ? "":values.outTime;
           if(outTime.length>0) {
               values.applyStartDate = outTime[0].format('YYYY-MM-DD');
               values.applyEndDate = outTime[1].format('YYYY-MM-DD');
           }
           console.log('查询条件',values);
           this.props.query(values);
       });
    }
    handleReset = () => {
       this.props.form.resetFields();
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const lableWrapper = {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        }
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.search}>
                <Row>
                    <Col span={8} key={1} >
                        <FormItem {...lableWrapper} label={`出库时间`}>
                            {getFieldDecorator(`outTime`)(
                                <RangePicker style={{width:'100%'}}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} key={2} >
                        <FormItem {...lableWrapper} label={`库房`}>
                            {getFieldDecorator(`storageGuid`,{
                                initialValue: ''
                            })(
                                <Select>
                                    <Option value=''>全部</Option>
                                    {
                                        this.state.storageOptions.map((item,index)=>{
                                            return <Option value={item.value} key={index}>{item.text}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} key={3} >
                        <FormItem {...lableWrapper} label={`状态`}>
                            {getFieldDecorator(`pickFstate`,{
                                initialValue: ''
                            })(
                                <Select>
                                    <Option value=''>全部</Option>
                                    <Option value='10'>待确认</Option>
                                    <Option value='80'>完结</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} key={4}>
                        <FormItem {...lableWrapper} label={`其他`}>
                            {getFieldDecorator(`searchNo`)(
                                <Input placeholder='请输入申请单/拣货单/科室'/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={16} key={6} style={{textAlign: 'right'}}>
                        <Button  htmlType="submit" type='primary'>搜索</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.reset}>清空</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const SearchBox = Form.create()(SearchForm);

class Picking extends React.Component{
    state = {
        query:{},
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query: query })
    }
    render(){
        const columns = [{
            title:'操作',
            dataIndex :' actions',
            width: 60,
            render : (text, record )=>{
                return <span>
                    {
                        record.pickFstate === "10" ? 
                        //待确认
                        <a onClick={
                            actionHandler.bind(
                                null, this.props.router,`/storage/outMgt/confirm`, {...record}
                            )}>
                                详情
                        </a>
                            :
                            //完结
                        <a onClick={
                            actionHandler.bind(
                                null, this.props.router,`/storage/outMgt/endPick`, {...record}
                            )}>
                            详情
                        </a>
                    }
                </span>
                }
            },{
                title : '拣货单',
                dataIndex :'pickNo',
                width: 100
            },{
                title:'状态',
                dataIndex:'pickFstate',
                width: 100,
                render: pickFstate=>{
                    if(pickFstate === '10'){
                        return '待确认'
                    }else if(pickFstate === '80'){
                        return '完结'
                    }else if(pickFstate === '81'){
                        return '完结'
                    }
                }
            },{
                title: '申请单',
                dataIndex:'applyNo',
                width: 100
            },{
                title: '库房 ',
                dataIndex:'storageName',
                width: 100
            },{
                title: '科室',
                dataIndex:'deptName',
                width: 100
            },{
                title: '科室地址',
                dataIndex:'tfAddress',
                width: 120
            },{
                title: '申请人',
                dataIndex:'applyUsername',
                width: 100
            },{
                title: '申请时间',
                dataIndex:'applyTime',
                width: 100
            }];
        return (
            <div>
            {
                this.props.children || 
                <div>
                    <Row>
                        <Col className="ant-col-6">
                            <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                    <Breadcrumb.Item><Link to={{pathname:'/storage/outMgt',query:{activeKey:'1'}}}>出库记录</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item>拣货</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row>
                    <SearchBox query={this.queryHandler} />
                    <FetchTable
                        query={this.state.query} 
                        columns={columns}
                        ref='table'
                        url={storage.SEARCHPICKLIST}
                        rowKey='applyId'
                        size="small"
                    />
                    
                </div>
            }
            </div>
            )
    }
}
module.exports = Picking;