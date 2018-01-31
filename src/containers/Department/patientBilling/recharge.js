/**
 * @file 患者计费--高值补计费
 */
import React from 'react';
import { Form, Input, Row, Col, Breadcrumb, Button, Table, message } from 'antd';
import { fetchData } from 'utils/tools';
import { Link, hashHistory } from 'react-router';
import querystring from 'querystring';
import { department } from 'api';

const FormItem = Form.Item;
class WrappHighValueForm extends React.Component{
    render(){
        const baseData = this.props.data;
        const formItemLayout = {
           labelCol: { span: 6 },
           wrapperCol: { span: 18 },
        }
        return (
            <Form>
                <Row>
                    <Col span={6} key={1}>
                        <FormItem {...formItemLayout} label={'计费科室'}>
                            <Input defaultValue={baseData.deptName ? baseData.deptName:''} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={2}>
                        <FormItem {...formItemLayout} label={'就诊号'}>
                            <Input defaultValue={baseData.treatmentNo ? baseData.treatmentNo:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={9} key={3}>
                        <FormItem labelCol={{span:4}} wrapperCol={{span:20}} label={'手术申请单'}>
                            <Input defaultValue={baseData.operNumber ? baseData.operNumber:""} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={5}>
                        <FormItem {...formItemLayout} label={'患者姓名'}>
                            <Input defaultValue={baseData.name ? baseData.name:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={6}>
                        <FormItem {...formItemLayout} label={'性别'}>
                            <Input defaultValue={baseData.gender ? baseData.gender:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={7}>
                        <FormItem {...formItemLayout} label={'年龄'}>
                            <Input defaultValue={baseData.age ? baseData.age:""} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={8}>
                        <FormItem {...formItemLayout} label={'手术名称'}>
                            <Input defaultValue={baseData.operName ? baseData.operName:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={9}>
                        <FormItem {...formItemLayout} label={'手术医生'}>
                            <Input defaultValue={baseData.operDoctor ? baseData.operDoctor:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={10}>
                        <FormItem {...formItemLayout} label={'手术日期'}>
                            <Input defaultValue={baseData.operDate ? baseData.operDate:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={11}>
                        <FormItem {...formItemLayout} label={'麻醉方式'}>
                            <Input defaultValue={baseData.mzff ? baseData.mzff:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={12}>
                        <FormItem {...formItemLayout} label={'手术间'}>
                            <Input defaultValue={baseData.operRoom ? baseData.operRoom:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={13}>
                        <FormItem {...formItemLayout} label={'巡回护士'}>
                            <Input defaultValue={baseData.circuitNurse ? baseData.circuitNurse:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={14}>
                        <FormItem {...formItemLayout} label={'床位号'}>
                            <Input defaultValue={baseData.bedNum ? baseData.bedNum:""} disabled/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const WrapperShowForm = Form.create()(WrappHighValueForm);
class HighAccount extends React.Component{
    state = {
        dataSource: [],
        operData:'',
        selected: [],
        selectedRows: []
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
    getProductData = ()=>{
        const qrcode = this.refs.qrcode.refs.input.value;
        console.log(qrcode,'二维码');
        if(qrcode){
            fetchData(department.FINDGZCHARGEPRODUCT,querystring.stringify({qrcode:qrcode}),(data)=>{
                if(data.status){
                    const dataSource = this.state.dataSource;
                    let flag = true;
                    dataSource.map((item,index)=>{
                        if(item.qrcode === data.result.qrcode){
                            flag = false;
                            return null;
                        }
                        return null;
                    });
                    if(flag){
                        let totalDataSource = dataSource.concat([data.result]);
                        this.setState({ dataSource : totalDataSource });
                    }else{
                        message.info('请勿重复添加产品！');
                    }
                }else{
                    message.info(data.msg);
                }
            });
        }else{
            message.warn('请扫描或输入二维码！');
        }
    }
    delete = ()=>{
        const { selected, dataSource } = this.state;
        if(selected.length === 0){
            return message.warn('请至少选择一条!');
        }else{
            let result = [];
            dataSource.map((item,index)=>{
                const a = selected.find((value,index,arr)=>{
                    return value === item.qrcode
                });
                if (typeof a === 'undefined') {
                    result.push(item)
                }
                return null;
            });
            this.setState({dataSource : result});
        }
    }
    charge = ()=>{
        const { dataSource } = this.state;
        let list = [],postData = {};
        if(dataSource.length>0){
            dataSource.map((item,index)=>{
                return list.push({
                    qrcode: item.qrcode,
                    hisPrice: item.hisPrice
                })
            });
            postData.list = list;
            postData.chargeGuid = this.props.location.state.chargeGuid;
            fetchData(department.HVSUPPLEMENTCHARGE,JSON.stringify(postData),(data)=>{
                if(data.status){
                    message.success('操作成功！');
                    hashHistory.push('/department/patientBilling');
                }else{
                    message.error(data.msg);
                }
            },'application/json')
        }else{
            message.warn('请扫描或输入产品二维码')
        }
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
            render: (text, record)=>{
                return text === 'undefined'||text === null ? '0.00':text.toFixed(2);
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
                this.props.children ||
                <div>
                    <Row>
                        <Col className="ant-col-6">
                            <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                <Breadcrumb.Item><Link to='/department/patientBilling'>患者计费</Link></Breadcrumb.Item>
                                <Breadcrumb.Item>补计费</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row>
                    <WrapperShowForm data={this.props.location.state}/>
                    <Row>
                        <Col className="ant-col-8">
                            <div className="ant-row">
                                <div className="ant-col-4 ant-form-item-label">
                                    <label>二维码</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        <Input ref="qrcode" placeholder='请扫描或输入产品二维码' onPressEnter={this.getProductData}/>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className='ant-col-2' style={{textAlign:'center'}}>
                            <Button type='primary' onClick={this.charge}>补计费</Button>
                        </Col>
                        <Col className='ant-col-14' style={{textAlign:'right'}}>
                            <Button type='danger' ghost onClick={this.delete}>删除产品</Button>
                        </Col>
                    </Row>
                    <Table 
                        style={{marginTop:12}}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        scroll={{x:'150%'}}
                        rowKey='qrcode'
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
module.exports = HighAccount;