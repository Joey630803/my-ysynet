/**
 * @file 患者计费--手术退费
 */
import React from 'react';
import { Form, Row, Col, Table, Breadcrumb, Button, Input, message } from 'antd';
import { Link, hashHistory } from 'react-router';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { department } from 'api';
const FormItem = Form.Item;
class WrappShowForm extends React.Component{
    render(){
        const baseData = this.props.data;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <Form>
                <Row>
                    <Col span={6} key={1}>
                        <FormItem {...formItemLayout} label={'送货单号'}>
                            <Input defaultValue={baseData.sendNo ? baseData.sendNo :''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={2}>
                        <FormItem {...formItemLayout} label={'供应商'}>
                            <Input defaultValue={baseData.fOrgName ? baseData.fOrgName :''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={3}>
                        <FormItem {...formItemLayout} label={'就诊号'}>
                            <Input defaultValue={baseData.treatmentNo ? baseData.treatmentNo :''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={4}>
                        <FormItem {...formItemLayout} label={'手术申请单'}>
                            <Input defaultValue={baseData.operName ? baseData.operName :''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={5}>
                        <FormItem {...formItemLayout} label={'患者姓名'}>
                            <Input defaultValue={baseData.name ? baseData.name :''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={6}>
                        <FormItem {...formItemLayout} label={'性别'}>
                            <Input defaultValue={baseData.gender ? baseData.gender :''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={7}>
                        <FormItem {...formItemLayout} label={'年龄'}>
                            <Input defaultValue={baseData.age ? baseData.age :''} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={8}>
                        <FormItem {...formItemLayout} label={'手术名称'}>
                            <Input defaultValue={baseData.operName ? baseData.operName :''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={9}>
                        <FormItem {...formItemLayout} label={'手术医生'}>
                            <Input defaultValue={baseData.operDoctor ? baseData.operDoctor :''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={10}>
                        <FormItem {...formItemLayout} label={'手术日期'}>
                            <Input defaultValue={baseData.operDate ? baseData.operDate :''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={11}>
                        <FormItem {...formItemLayout} label={'麻醉方式'}>
                            <Input defaultValue={baseData.mzff ? baseData.mzff :''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={12}>
                        <FormItem {...formItemLayout} label={'手术间'}>
                            <Input defaultValue={baseData.operRoom ? baseData.operRoom :''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={13}>
                        <FormItem {...formItemLayout} label={'巡回护士'}>
                            <Input defaultValue={baseData.circuitNurse ? baseData.circuitNurse :''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={14}>
                        <FormItem {...formItemLayout} label={'床位号'}>
                            <Input defaultValue={baseData.bedNo ? baseData.bedNo :''} disabled/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const ShowForm = Form.create()(WrappShowForm);
class OperRefund extends React.Component{
    state = {
        dataSource:[],
        baseData: ''
    }
    componentDidMount = () =>{
        fetchData(department.FINDOPERATIONREFUND,querystring.stringify({chargeGuid:this.props.location.state.chargeGuid}),(data)=>{
            if(data.status){
                this.setState({ baseData: data.result,dataSource:data.result.list})
            }else{
                message.error(data.msg);
            }
        })
    }
    total = ()=>{
        let price = {
            tenderTotal: 0,
            hisTotal: 0
        };
        this.state.dataSource.forEach((item,index)=>{
            let amount = typeof item.sl === 'undefined'? '0.00': item.sl;
            price.tenderTotal += amount*item.purchasePice;
            price.hisTotal += amount*item.hisPrice;
        });
        return price;
    }
    refund = ()=>{
        fetchData(department.OPERATIONREFUND,querystring.stringify({chargeGuid:this.props.location.state.chargeGuid}),(data)=>{
            if(data.status){
                message.success('操作成功！');
                hashHistory.push('/department/patientBilling');
            }else{
                message.error(data.msg);
            }
        })
    }
    render(){
        const columns = [{
            title : '产品名称',
            dataIndex : 'materialName'
        },{
            title : '通用名称',
            dataIndex : 'geName'
        },{
            title : '规格',
            dataIndex : 'spec'
        },{
            title : '型号',
            dataIndex : 'fmodel'
        },{
            title : '采购单位',
            dataIndex : 'tenderUnit'
        },{
            title : '包装规格',
            dataIndex : 'tfPacking'
        },{
            title : '使用数量',
            dataIndex : 'sl',
        },{
            title : '采购价格',
            dataIndex : 'purchasePrice',
            render:(text,record)=>{
                return text === 'undefined'|| text===null ? '0':text.toFixed(2);
            }
        },{
            title : 'HIS价格',
            dataIndex : 'hisPrice'
        },{
            title : '生产批号',
            dataIndex : 'flot'
        },{
            title : '生产日期',
            dataIndex : 'prodDate'
        },{
            title : '有效期至',
            dataIndex : 'usefulDate'
        }];
        const footer = ()=>{
            return <Row style={{fontSize:'1.1rem'}}>
            <Col className="ant-col-4">总金额:<span style={{color:'red'}}>{this.total().tenderTotal.toFixed(2)}</span></Col>
            <Col className="ant-col-6">HIS计费总金额:<span style={{color:'red'}}>{this.total().hisTotal.toFixed(2)}</span></Col>
        </Row>
        }
        return (
        <div>
            {
                this.props.children||
                <div>
                    <Row>
                        <Col className="ant-col-6">
                            <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                <Breadcrumb.Item><Link to='/department/patientBilling'>患者计费</Link></Breadcrumb.Item>
                                <Breadcrumb.Item>手术退费</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col className='ant-col-18' style={{textAlign:'right'}}>
                            <Button type='primary' onClick={this.refund}>退费</Button>
                        </Col>
                    </Row>
                    <ShowForm data={this.props.location.state}/>
                    <Table 
                        columns={columns}
                        dataSource={this.state.dataSource}
                        rowKey={'chargeDetailGuid'}
                        pagination={false}
                        scroll={{x:'150%'}}
                        footer={footer}
                    />
                </div>
            }
        </div>
        )
    }
}
module.exports = OperRefund;