/**
 * @file 招标记录--添加招标
 */
import React from 'react';
import {Breadcrumb, Form, Row, Col, Button, Input, message } from 'antd';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { tender } from 'api';
import { Link, hashHistory } from 'react-router';

const FormItem = Form.Item;
class EditForm extends React.Component{
    state={
        storageOptions: [],
        fOrgOptions: [],
        fOrgStorage: [],
        dirtyClick: false
    }
    handleSubmit = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            values.tenderGuid = this.props.data.tenderGuid;
            values.rStorageGuid = this.props.data.rStorageGuid;
            values.fOrgId = this.props.data.fOrgId;
            values.fStorageGuid = this.props.data.fStorageGuid?this.props.data.fStorageGuid:''
            console.log('保存条件',values);
            this.setState({ dirtyClick: true });
            fetchData(tender.UPDATETENDERINFO,querystring.stringify(values),(data)=>{
                this.setState({ dirtyClick: false });
                if(data.status){
                    message.success('编辑成功！');
                    hashHistory.push('/tender/tenderRecord');
                }else{
                    message.error(data.msg);
                }
            })
        })
        
    }
    render(){
        const data = this.props.data;
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
                            <Input defaultValue={data.rStorageName} disabled/>
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem {...formItemLayout} label={`供应商`}>
                            <Input defaultValue={data.supplierName} disabled/>
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem {...formItemLayout} label={`供应商库房`}>
                            <Input defaultValue={data.forgStorage?data.fOrgStorage:'默认库房'} disabled/>
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem {...formItemLayout} label={`供应商编号`}>
                            {
                                getFieldDecorator('supplierCode',{
                                    initialValue:data.supplierCode,
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
                                    initialValue:data.lxr,
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
                                    initialValue:data.lxdh,
                                    
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
const WrapperEditForm = Form.create()(EditForm);
class EditTender extends React.Component{
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
                                    <Breadcrumb.Item>编辑招标</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <WrapperEditForm data={this.props.location.state}/>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        )
    }
}
module.exports = EditTender;