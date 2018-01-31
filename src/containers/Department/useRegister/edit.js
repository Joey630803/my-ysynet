/**
 * @file 使用登记--编辑
 */

import React from 'react';
import { Row, Col,Form, Table, Breadcrumb, Button, Input, message } from 'antd';
import { Link, hashHistory } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { department } from 'api';
const FormItem = Form.Item;
class WrapShowForm extends React.Component{
    render(){
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const baseData = this.props.data;
        return (
            <Form>
                <Row>
                    <Col span={6} key={0}>
                        <FormItem {...formItemLayout} label={'登记科室'}>
                            <Input value={baseData.deptName ? baseData.deptName : ''} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={1}>
                        <FormItem {...formItemLayout} label={'送货单号'}>
                            <Input value={baseData.sendNo ? baseData.sendNo : ''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={2}>
                        <FormItem {...formItemLayout} label={'供应商'}>
                            <Input value={baseData.fOrgName ? baseData.fOrgName : ''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={3}>
                        <FormItem {...formItemLayout} label={'就诊号'}>
                            <Input value={baseData.treatmentNo ? baseData.treatmentNo : ''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={4}>
                        <FormItem {...formItemLayout} label={'手术申请单'}>
                            <Input value={baseData.operNo ? baseData.operNo+" | "+baseData.operName : ''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={5}>
                        <FormItem {...formItemLayout} label={'患者姓名'}>
                            <Input value={baseData.hzName ? baseData.hzName : ''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={6}>
                        <FormItem {...formItemLayout} label={'性别'}>
                            <Input value={baseData.dender ? baseData.dender : ''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={7}>
                        <FormItem {...formItemLayout} label={'年龄'}>
                            <Input value={baseData.age ? baseData.age : ''} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={8}>
                        <FormItem {...formItemLayout} label={'手术名称'}>
                            <Input value={baseData.operName ? baseData.operName : ''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={9}>
                        <FormItem {...formItemLayout} label={'手术医生'}>
                            <Input value={baseData.operDoctor ? baseData.operDoctor : ''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={10}>
                        <FormItem {...formItemLayout} label={'手术日期'}>
                            <Input value={baseData.operDate ? baseData.operDate : ''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={11}>
                        <FormItem {...formItemLayout} label={'麻醉方式'}>
                            <Input value={baseData.mzff ? baseData.mzff : ''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={12}>
                        <FormItem {...formItemLayout} label={'手术间'}>
                            <Input value={baseData.operRoom ? baseData.operRoom : ''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={13}>
                        <FormItem {...formItemLayout} label={'巡回护士'}>
                            <Input value={baseData.circuitNurse ? baseData.circuitNurse : ''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={14}>
                        <FormItem {...formItemLayout} label={'床位号'}>
                            <Input value={baseData.bedNum ? baseData.bedNum : ''} disabled/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const ShowForm  = Form.create()(WrapShowForm);
class RegisterEdit extends React.Component{
    state = {
        dataSource: [],
        operData: ''
    }
    componentDidMount = ()=>{
        fetchData(department.SELECTUSEREGISTERBYCHARGEGUID,querystring.stringify({chargeGuid:this.props.location.state.chargeGuid}),(data)=>{
            if(data.status){
                this.setState({ operData: data.result, dataSource:data.result.detail});
            }else{
                message.error(data.msg);
            }
        })
    }
    total = ()=>{
        let total = 0;
        this.state.dataSource.map((item,index)=>{
            let amount = typeof item.sysl === 'undefined' ? 1: item.sysl;
            return total += amount * item.tenderPrice;
        });
        return total.toFixed(2);
    }
    handleChange = (record, index, e)=>{
        let amount = e.target.value;
        if(/^\d+$/.test(amount)){
            if(amount > record.amount){
                return message.warn('使用数量不得大于发货数量！');
            }else{
                let { dataSource } = this.state; 
                dataSource[index].sysl = amount;
                this.setState({ dataSource });
            }
        }else{
            return message.warn('请输入非0正整数');
        }
        
    }
    //提交
    submitHandle = () =>{
        const { dataSource } = this.state;
        if(dataSource.length > 0){
            let postData = {}, detail = [];
            dataSource.map((item,index)=>{
                if(item.sysl > 0){
                    return detail.push({
                        sendDetailGuid: item.sendDetailGuid,
                        chargeDetallGuid: item.chargeDetallGuid,
                        sysl: item.sysl,
                        tenderPrice: item.tenderPrice
                    });
                }
                return null;
            });
            postData.chargeGuid = this.props.location.state.chargeGuid;
            postData.detail = detail;
            fetchData(department.UPDATAUSEREGISTER,JSON.stringify(postData),(data)=>{
                if(data.status){
                    message.success('操作成功！');
                    hashHistory.push('/department/useRegister');
                }else{
                    message.error(data.msg);
                }
            },'application/json')
        }else{
            message.warn('无产品数据，无法提交');
        }
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
            dataIndex : 'fModel'
        },{
            title : '招标单位',
            dataIndex : 'tenderUnit'
        },{
            title : '包装规格',
            dataIndex : 'tfPacking'
        },{
            title : '发货数量',
            dataIndex : 'amount'
        },{
            title : '使用数量',
            dataIndex : 'sysl',
            width: 90,
            render: (text, record, index)=>{
                return <Input defaultValue={text} min={0} onChange={this.handleChange.bind(this, record, index)}/>
            }
        },{
            title : '价格',
            dataIndex : 'tenderPrice',
            render:( text, record )=>{
                return text==='undefined'? '0.00': text.toFixed(2);
            }
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
        const footer = this.state.dataSource.length === 0 ? null : () => <span style={{fontSize: '1.5em'}}>总金额:
                        <a style={{color: '#f46e65'}}>
                        {this.total()}
                        </a>
                    </span>  
        return (
        <div>
            <Row>
                <Col className="ant-col-6">
                    <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                        <Breadcrumb.Item><Link to='/department/useRegister'>使用登记</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>编辑</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col className="ant-col-18" style={{textAlign:'right'}}>
                    <Button type='primary' onClick={this.submitHandle} style={{marginRight:8}}>提交</Button>
                </Col>
            </Row>
            <ShowForm data={this.state.operData}/>
            <Table 
                columns={columns}
                dataSource={this.state.dataSource}
                rowKey={'chargeDetallGuid'}
                pagination={false}
                scroll={{x:'150%'}}
                size={'small'}
                footer={footer}
            />
        </div>
        )
    }
}
module.exports = RegisterEdit;