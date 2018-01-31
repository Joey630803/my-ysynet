/**
 * @file 招标记录
 */
import React from 'react';
import { Form, Row, Col, Button, Select, Input, DatePicker, Popconfirm, message } from 'antd';
import FetchTable from 'component/FetchTable';
import { hashHistory } from 'react-router'; 
import querystring from 'querystring';
import { fetchData, actionHandler } from 'utils/tools';
import { tender } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class SearchForm extends React.Component{
    state = {
        storageOptions: [],
        rStorageGuid:''
    }
    componentDidMount = ()=>{
        fetchData(tender.FINDTOPSTORAGEBYUSER,{},(data)=>{
            if(data.result.length > 0){
                this.setState({ storageOptions:data.result,rStorageGuid:data.result[0].value });
                this.props.defaultQuery({rStorageGuid: data.result[0].value})
            }
        })
    }
    searchHandle = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            const tenderTime = values.tenderTime === undefined ? "" : values.tenderTime;
            if( tenderTime.length > 0 ){
              values.startTime = tenderTime[0].format('YYYY-MM-DD');
              values.endTime = tenderTime[1].format('YYYY-MM-DD');
            }
            console.log('查询条件: ', values);
            this.props.query(values);
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
          };
        
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.searchHandle}>
                <Row>
                    <Col span={6} key={1}>
                        <FormItem {...formItemLayout} label={`库房`}>
                            {
                                getFieldDecorator(`rStorageGuid`,{
                                    initialValue: this.state.storageOptions.length > 0 
                                    ? this.state.storageOptions[0].value : null
                                })(
                                    <Select>
                                        {
                                            this.state.storageOptions.map((item,index)=>{
                                                return <Option key={index} value={item.value}>{item.text}</Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={2}>
                        <FormItem {...formItemLayout} label={`时间`}>
                            {
                                getFieldDecorator('tenderTime')(
                                    <RangePicker format="YYYY-MM-DD" style={{width:'100%'}} />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={1} key={3}></Col>
                    <Col span={6} key={4}>
                        <FormItem>
                            {
                                getFieldDecorator(`searchName`,{
                                    initialValue:''
                                })(
                                    <Input placeholder='请输入供应商名称/编号' style={{width:'100%'}}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={2} key={5} style={{textAlign:'right'}}>
                        <Button type='primary' htmlType='submit'>搜索</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const WrapperSearchForm = Form.create()(SearchForm);
const actions = {
    details: (action) => <a onClick={action}>详情</a>,
    edit: (action) => <a onClick={action}>编辑</a>,
    delete: (action) => <Popconfirm title="是否确认删除?" onConfirm={action}>
                          <a>删除</a>
                        </Popconfirm>,
    publish: (action) => <Popconfirm title="是否确认发布?" onConfirm={action}>
                            <a>发布</a>
                        </Popconfirm>
  }
class TenderRecord extends React.Component{
    state = {
        query:{ }
    }
    queryHandle = (query)=>{
        this.refs.table.fetch(query);
        this.setState({ query: query});
    }
    getAction = (text,record)=>{
        if(text ==='01'){
            return <span>
                        {actions.details(this.details.bind(this,record))}
                    </span>
        }else{
            return <span>
                        {actions.details(this.details.bind(this,record))}
                        <span className="ant-divider" />
                        {actions.edit(this.edit.bind(this,record))}
                        <span className="ant-divider" />
                        {actions.delete(this.delete.bind(this,record))}
                        <span className="ant-divider" />
                        {actions.publish(this.publish.bind(this,record))}
                    </span>
        }
    }
    redirect = (url, record) => {
        hashHistory.push({
          pathname: url,
          state: record
        })
    }
    details = (record)=>{
        this.redirect('/tender/tenderRecord/show',record);
    }
    edit = (record)=>{
        this.redirect('/tender/tenderRecord/edit',record);
    }
    //删除
    delete = (record)=>{
        fetchData(tender.DELETETENDERINFO,querystring.stringify({tenderGuid:record.tenderGuid}),(data)=>{
            if(data.status){
                this.refs.table.fetch();
                message.success('删除成功！');
            }else{
                message.error(data.msg);
            }
        })
    }
    //发布
    publish = (record)=>{
        fetchData(tender.TENDERINFORELEASE,querystring.stringify({tenderGuid:record.tenderGuid}),(data)=>{
            if(data.status){
                this.refs.table.fetch();
                message.success('操作成功！');
            }else{
                message.error(data.msg);
            }
        })
    }
    defaultQuery = (query)=>{
        this.setState({query : query});
      }
    render(){
        const columns = [{
            title: '操作',
            dataIndex: 'action',
            width: 180,
            fixed:'left',
            render: (text,record)=>{
                return this.getAction(record.releaseFlag,record);
            }
        },{
            title: '状态',
            dataIndex: 'releaseFlag',
            render: (text, record)=>{
                if(text === '01'){
                    return <span style={{color: '#3dbd7d'}}>已发布</span>;
                }else{
                    return <span style={{color: '#ffbf00'}}>未发布</span>;
                }
            }
        },{
            title: '库房',
            dataIndex: 'rStorageName'
        },{
            title: '供应商',
            dataIndex: 'supplierName'
        },{
            title: '编号',
            dataIndex: 'supplierCode'
        },{
            title: '联系人',
            dataIndex: 'lxr'
        },{
            title: '联系电话',
            dataIndex: 'lxdh'
        },{
            title: '发布人',
            dataIndex: 'modifyUserName'
        },{
            title: '发布时间',
            dataIndex: 'modifyTime'
        }];
        return (
            <div>
                {
                    this.props.children
                    ||
                    <div>
                        <Row>
                            <Col span={22}>
                                <WrapperSearchForm 
                                    query={(query) => this.queryHandle(query)} 
                                    defaultQuery={(query) => this.defaultQuery(query)}
                                />
                            </Col>
                            <Col span={2} style={{textAlign:'right'}}>
                                <Button type='primary' onClick={actionHandler.bind(null,this.props.router,`/tender/tenderRecord/add`,{})}>添加</Button>
                            </Col>
                        </Row>
                        {
                            this.state.query.rStorageGuid 
                            &&
                            <FetchTable 
                                ref='table'
                                columns={columns}
                                query={this.state.query}
                                url={tender.FINDTENDERRECORDLIST}
                                rowKey={'tenderGuid'}
                                scroll={{x:'130%'}}
                            />
                        }
                        
                    </div>
                }
            </div>
        )
    }
}
module.exports = TenderRecord;