/**
 * @file 患者计费--手术计费
 */
import React from 'react';
import { Form, Row, Col, Select, Input, Table, Button, message } from 'antd';
import { fetchData } from 'utils/tools';
import { department } from 'api';
import { hashHistory } from 'react-router';
import querystring from 'querystring';
const FormItem = Form.Item;
const Option = Select.Option;
class WrappInfoForm extends React.Component{
    state = {
        deptOptions: [],
        productData: [],
        operData:'',
        deptName:''
    }
    componentDidMount = ()=>{
        fetchData(department.FINDDEPTSTORAGEBYUSER,{},(data)=>{
            this.setState({deptOptions : data });
        });
    }
    getData = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(values.userNo){
                fetchData(department.FINDOPERATIONCHARGEINFO,querystring.stringify({userNo:values.userNo}),(data)=>{
                    if(data.status){
                        this.props.cb(data.result.list);
                        this.setState({ operData: data.result, productData: data.result.list});
                    }else{
                        message.error(data.msg);
                    }
                })
            }
        })
    }
    charge = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                if(this.state.operData.chargeGuid){
                    const { productData, deptName } = this.state;
                    if(productData.length > 0){
                        let postData = {},list = [];
                        productData.map((item,index)=>{
                            return list.push({
                                chargeDetailGuid: item.chargeDetailGuid,
                                sysl: item.sysl,
                                hisPrice: item.hisPrice
                            })
                        });
                        postData.list = list;
                        postData.chargeGuid = this.state.operData.chargeGuid;
                        postData.chargeDeptName = deptName;
                        postData.chargeDeptGuid = this.props.form.getFieldsValue().chargeDeptGuid;
                        fetchData(department.OPERATIONCHARGE,JSON.stringify(postData),(data)=>{
                            if(data.status){
                                message.success('操作成功！');
                                hashHistory.push('/department/patientBilling');
                            }else{
                                message.error(data.msg);
                            }
                        },'application/json')
                    }
                }else{
                    message.warn('请扫描使用清单二维码，或输入使用清单号');
                }
            }
        })
        
    }
    render(){
        const baseData = this.state.operData;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
           labelCol: { span: 6 },
           wrapperCol: { span: 18 },
        }
        
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.charge}>
                <Row>
                    <Col span={6} key={1}>
                        <FormItem {...formItemLayout} label={'计费科室'}>
                            {
                                getFieldDecorator('chargeDeptGuid',{
                                    initialValue:'',
                                    rules:[{required: true,message:'请选择计费科室'}]
                                })(
                                    <Select onSelect={(value,option)=>this.setState({deptName:option.props.children})}>
                                        <Option key={-1} value=''>请选择</Option>
                                        {
                                            this.state.deptOptions.map((item,index)=>{
                                                return <Option key={index} value={item.value}>{item.label}</Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={18} style={{textAlign:'right'}}>
                        <Button type='primary' htmlType="submit">计费</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={12} key={2}>
                        <FormItem labelCol={{span:3}} wrapperCol={{span:21}} label={'使用清单'}>
                            {
                                getFieldDecorator('userNo')(
                                    <Input placeholder='请扫描使用清单二维码，或输入使用清单号' onPressEnter={this.getData}/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={3}>
                        <FormItem {...formItemLayout} label={'送货单号'}>
                            <Input  value={baseData.sendNo?baseData.sendNo:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={4}>
                        <FormItem {...formItemLayout} label={'供应商'}>
                            <Input  value={baseData.fOrgName?baseData.fOrgName:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={5}>
                        <FormItem {...formItemLayout} label={'就诊号'}>
                            <Input value={baseData.treatmentNo?baseData.treatmentNo:""}  disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={6}>
                        <FormItem {...formItemLayout} label={'手术申请单'}>
                            <Input value={baseData.operNumber?baseData.operNumber:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={7}>
                        <FormItem {...formItemLayout} label={'患者姓名'}>
                            <Input  value={baseData.name?baseData.name:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={8}>
                        <FormItem {...formItemLayout} label={'性别'}>
                            <Input value={baseData.gender?baseData.gender:""}  disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={9}>
                        <FormItem {...formItemLayout} label={'年龄'}>
                            <Input value={baseData.age?baseData.age:""}  disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={10}>
                        <FormItem {...formItemLayout} label={'手术名称'}>
                            <Input  value={baseData.operName?baseData.operName:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={11}>
                        <FormItem {...formItemLayout} label={'手术医生'}>
                            <Input value={baseData.operDoctor?baseData.operDoctor:""}  disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={12}>
                        <FormItem {...formItemLayout} label={'手术日期'}>
                            <Input  value={baseData.operDate?baseData.operDate:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={13}>
                        <FormItem {...formItemLayout} label={'麻醉方式'}>
                            <Input  value={baseData.mzff?baseData.mzff:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={14}>
                        <FormItem {...formItemLayout} label={'手术间'}>
                            <Input  value={baseData.operRoom?baseData.operRoom:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={15}>
                        <FormItem {...formItemLayout} label={'巡回护士'}>
                            <Input  value={baseData.circuitNurse?baseData.circuitNurse:""} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={6} key={16}>
                        <FormItem {...formItemLayout} label={'床位号'}>
                            <Input  value={baseData.bedNum?baseData.bedNum:""} disabled/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const WrapOperForm = Form.create()(WrappInfoForm)
class OperAccount extends React.Component{
    state = {
        dataSource:[]
    }
    total = ()=>{
        let price = {
            tenderTotal: 0,
            hisTotal: 0
        };
        this.state.dataSource.forEach((item,index)=>{
            let amount = typeof item.sysl === 'undefined'? '0.00': item.sysl;
            price.tenderTotal += amount*item.purchasePrice;
            price.hisTotal += amount*item.hisPrice;
        });
        return price;
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
            dataIndex : 'purchaseUnit'
        },{
            title : '包装规格',
            dataIndex : 'tfPacking'
        },{
            title : '使用数量',
            dataIndex : 'sysl',
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
                this.props.children ||
                <div>
                    <WrapOperForm cb={(data) => this.setState({dataSource : data})}/>
                    <Table 
                        style={{marginTop:12}}
                        columns={columns}
                        pagination={false}
                        dataSource={this.state.dataSource}
                        rowKey={'chargeDetailGuid'}
                        scroll={{x:'150%'}}
                        size={'small'}
                        footer={footer}
                    />
                </div>
            }
        </div>
    )
    }
}
module.exports = OperAccount;