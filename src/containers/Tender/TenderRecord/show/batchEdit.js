/**
 * @file 招标记录--招标详情--批量编辑
 */
import React from 'react';
import { Form, Row, Col, Select, Input, Breadcrumb, Button, Table, message } from 'antd';
import { Link, hashHistory } from 'react-router';
import { fetchData } from 'utils/tools';
import { tender } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;
class WrapperEditForm extends React.Component{
    save = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                let Materialis = {},tenderDetailGuidList = [];
                const dataSource = this.props.data.dataSource;
                dataSource.map((item,index)=>{
                    return tenderDetailGuidList.push(item.tenderDetailGuid);
                });
                Materialis.tenderDetailGuidList = tenderDetailGuidList;
                Materialis.key = values.key;
                Materialis.value = values.value;
                fetchData(tender.TENDERDETAILBATCHSAVE,JSON.stringify(Materialis),(data)=>{
                    if(data.status){
                        message.success('保存成功！');
                        hashHistory.push({
                            pathname:'/tender/tenderRecord/show',
                            state:{
                                tenderGuid:this.props.data.tenderGuid,
                                rStorageGuid:this.props.data.rStorageGuid,
                                releaseFlag:this.props.data.releaseFlag
                            }
                        })
                    }else{
                        message.error(data.msg);
                    }
                },'application/json')

            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          };
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.save}>
                <Row>
                    <Col span={8} key={1}>
                        <FormItem {...formItemLayout} label={`编辑属性`}>
                            {
                                getFieldDecorator(`key`,{
                                    initialValue: '',
                                    rules:[{required:true,message:'请选择要编辑的属性'}]
                                })(
                                    <Select>
                                        <Option key={-1} value=''>请选择</Option>
                                        <Option key={1} value='GE_NAME'>通用名称</Option>
                                        <Option key={2} value='TENDER_PRICE'>招标价</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8} key={2}>
                        <FormItem {...formItemLayout} label={`属性值`}>
                            {
                                getFieldDecorator(`value`,{
                                    initialValue: '',
                                    rules:[{required:true,message:'请输入属性值'}]
                                })(
                                    <Input placeholder='请输入'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={2} style={{textAlign:'right'}}>
                        <Button type='primary' htmlType='submit'>保存</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const EditForm = Form.create()(WrapperEditForm);
class BatchEdit extends React.Component{
    render(){
        console.log(this.props,'props')
        const columns = [{
            title: '组件名称',
            dataIndex: 'suitName'
        },{
            title: '型号',
            dataIndex:'fModel'
        },{
            title: '规格',
            dataIndex:'spec'
        },{
            title: '最小单位',
            dataIndex:'leastUnit'
        },{
            title: 'REF',
            dataIndex:'REF'
        },]
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
                                    <Breadcrumb.Item><Link to={{pathname:'/tender/tenderRecord/show',state:{
                                        tenderGuid:this.props.location.state.tenderGuid,
                                        rStorageGuid:this.props.location.state.rStorageGuid,
                                        releaseFlag:this.props.location.state.releaseFlag
                                    }}}>招标详情</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item>编辑</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <EditForm data={this.props.location.state}/>
                        <Table 
                            columns={columns}
                            style={{marginTop:12}}
                            rowKey={'tenderDetailGuid'}
                            pagination={false}
                            size={'small'}
                            dataSource={this.props.location.state.dataSource}

                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = BatchEdit;