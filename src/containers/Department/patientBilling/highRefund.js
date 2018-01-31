/**
 * @file 患者计费--高值退费
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
        let baseData = this.props.data;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <Form>
                <Row>
                    <Col span={6} key={1}>
                        <FormItem {...formItemLayout} label={'就诊号'}>
                            <Input defaultValue={baseData?baseData.treatmentNo:''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={12} key={2}>
                        <FormItem labelCol={{span:3}} wrapperCol={{span:21}} label={'手术申请单'}>
                            <Input defaultValue={baseData?baseData.operNumber:''} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={3}>
                        <FormItem {...formItemLayout} label={'患者姓名'}>
                            <Input  defaultValue={baseData?baseData.name:''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={4}>
                        <FormItem {...formItemLayout} label={'性别'}>
                            <Input  defaultValue={baseData?baseData.gender:''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={5}>
                        <FormItem {...formItemLayout} label={'年龄'}>
                            <Input  defaultValue={baseData?baseData.age:''} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={6}>
                        <FormItem {...formItemLayout} label={'手术名称'}>
                            <Input  defaultValue={baseData?baseData.operName:''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={7}>
                        <FormItem {...formItemLayout} label={'手术医生'}>
                            <Input  defaultValue={baseData?baseData.operDoctor:''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={8}>
                        <FormItem {...formItemLayout} label={'手术日期'}>
                            <Input  defaultValue={baseData?baseData.operDate:''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={9}>
                        <FormItem {...formItemLayout} label={'麻醉方式'}>
                            <Input  defaultValue={baseData?baseData.mzff:''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={10}>
                        <FormItem {...formItemLayout} label={'手术间'}>
                            <Input defaultValue={baseData?baseData.operRoom:''} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={11}>
                        <FormItem {...formItemLayout} label={'巡回护士'}>
                            <Input defaultValue={baseData?baseData.circuitNurse:''}  disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={12}>
                        <FormItem {...formItemLayout} label={'床位号'}>
                            <Input  defaultValue={baseData?baseData.bedNum:''} disabled/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const ShowForm = Form.create()(WrappShowForm);
class HighRefund extends React.Component{
    state = {
        dataSource:[],
        selected: [],
        selectedRows: []
    }
    componentDidMount = () =>{
        fetchData(department.FINDHIGHVALUEREFUND,querystring.stringify({chargeGuid:this.props.location.state.chargeGuid}),(data)=>{
            if(data.status){
                this.setState({ baseData:data.result,dataSource:data.result.list });
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
            price.tenderTotal += amount*item.purchasePrice;
            price.hisTotal += amount*item.hisPrice;
        });
        return price;
    }
    refund = ()=>{
        const selectedRows = this.state.selectedRows;
        if(selectedRows.length === 0){
            return message.warn('请至少选择一条');
        }
        let list = [],postData = {};
        selectedRows.map((item,index)=>{
            return list.push({
                qrcode: item.qrcode,
                chargeDetailGuid: item.chargeDetailGuid,
            })
        });
        postData.chargeGuid = this.props.location.state.chargeGuid;
        postData.list = list;
        fetchData(department.HIGHVALUEREFUND,JSON.stringify(postData),(data)=>{
            if(data.status){
                message.success('操作成功！');
                hashHistory.push('/department/patientBilling');
            }else{
                message.error(data.msg);
            }
        },'application/json')
    }
    render(){
        const columns = [{
            title: '二维码',
            dataIndex: 'qrcode'
        },{
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
            dataIndex : 'purchaseUnit'
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
            title : 'HIS计费价',
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
                                <Breadcrumb.Item>高值退费</Breadcrumb.Item>
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
                        rowKey={'qrcode'}
                        pagination={false}
                        scroll={{x:'150%'}}
                        footer={footer}
                        rowSelection={{
                            selectedRowKeys: this.state.selected,
                            onChange: (selectedRowKeys, selectedRows) => {
                            this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                            }
                        }}
                    />
                </div>
            }
        </div>
        )
    }
}
module.exports = HighRefund;