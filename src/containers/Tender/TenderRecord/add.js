/**
 * @file 招标记录--添加招标
 */
import React from 'react';
import {Breadcrumb, Form, Row, Col, Button, Select, Input, message } from 'antd';
import { Link ,hashHistory } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { tender } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;
class AddForm extends React.Component{
    state={
        storageOptions: [],
        fOrgOptions: [],
        fOrgStorage: [],
        dirtyClick: false
    }
    componentDidMount = ()=>{
        fetchData(tender.FINDTOPSTORAGEBYUSER,{},(data)=>{
            this.setState({ storageOptions:data.result })
        });
        fetchData(tender.SEARCHORGLIST,querystring.stringify({orgType:'02'}),(data)=>{
            this.setState({ fOrgOptions:data })
        })
    }
    handleSubmit = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                console.log('保存条件',values);
                this.setState({dirtyClick: true });
                fetchData(tender.INSERTTENDERINFO,querystring.stringify(values),(data)=>{
                    this.setState({dirtyClick: false });
                    if(data.status){
                        message.success('保存成功！');
                        hashHistory.push('/tender/tenderRecord');
                    }else{
                        message.error(data.msg);
                    }
                })
            }
        })
    }
    showOrgInfo = (value)=>{
        let rStorageGuid = this.props.form.getFieldValue('rStorageGuid');
        console.log(rStorageGuid,'guid')
        fetchData(tender.FINDLXR,querystring.stringify({rStorageGuid:rStorageGuid,fOrgId:value}),(data)=>{
            if(data.status && Object.keys(data.result).length !== 0){
                this.props.form.setFieldsValue({
                    'supplierCode':data.result.supplierCode,
                    'lxr':data.result.lxr,
                    'lxdh':data.result.lxdh
                })
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 9 },
          };
          const tailFormItemLayout = {
            wrapperCol: {
              span: 14,
              offset: 8,
            },
          };
        return (
            <Form className="ant-advanced-search-form show-form" onSubmit={this.handleSubmit}>
                <Row>
                    <Col>
                        <FormItem {...formItemLayout} label={`库房`}>
                            {
                                getFieldDecorator('rStorageGuid',{
                                    initialValue:'',
                                    rules:[{required:true,message:'请选择库房'}]
                                })(
                                    <Select>
                                        <Option key={-1} value=''>请选择</Option>
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
                    <Col>
                        <FormItem {...formItemLayout} label={`供应商`}>
                            {
                                getFieldDecorator('fOrgId',{
                                    initialValue:'',
                                    rules:[{required:true,message:'请选择供应商'}]
                                })(
                                    <Select 
                                        onSelect={this.showOrgInfo}
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option key={-1} value=''>请选择</Option>
                                        {
                                            this.state.fOrgOptions.map((item,index)=>{
                                                return <Option key={index} value={item.value+''}>{item.text}</Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem {...formItemLayout} label={`供应商库房`}>
                            {
                                getFieldDecorator('fStorageGuid',{
                                    initialValue:'',
                                })(
                                    <Select>
                                        <Option key={-1} value=''>默认库房</Option>
                                        {
                                            this.state.fOrgStorage.map((item,index)=>{
                                                return <Option key={index} value={item.value}>{item.text}</Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem {...formItemLayout} label={`供应商编号`}>
                            {
                                getFieldDecorator('supplierCode',{
                                    initialValue:'',
                                })(
                                    <Input placeholder='请输入'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem {...formItemLayout} label={`联系人`}>
                            {
                                getFieldDecorator('lxr',{
                                    initialValue:'',
                                })(
                                    <Input placeholder='请输入'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem {...formItemLayout} label={`联系电话`}>
                            {
                                getFieldDecorator('lxdh',{
                                    initialValue:'',
                                    
                                })(
                                    <Input placeholder='请输入'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col> 
                        <FormItem {...tailFormItemLayout}>
                            <Button type='primary' htmlType='submit' loading={this.state.dirtyClick}>保存</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const WrapperAddForm = Form.create()(AddForm);
class AddTender extends React.Component{
    render(){
        return (
            <div>
                {
                    this.props.children
                    ||
                    <div>
                        <Row>
                            <Col>
                                <Breadcrumb style={{fontSize: '1.1em',marginBottom : 24}}>
                                    <Breadcrumb.Item><Link to={{pathname:'/tender/tenderRecord',}}>招标记录</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item>添加招标</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <WrapperAddForm />
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        )
    }
}
module.exports = AddTender;