/**
 * @file 使用登记--登记
 */
import React from 'react';
import { Form, Row, Col, Breadcrumb, Input, Button, Select, message, Table} from 'antd';
import { Link, hashHistory } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { department } from 'api';
const Option = Select.Option;
const FormItem = Form.Item;
class searchForm extends React.Component{
    state = {
        deptOptions: [],
        deptName:''
    }
    componentDidMount = ()=>{
        fetchData(department.FINDDEPTSTORAGEBYUSER,{},(data)=>{
            this.setState({deptOptions : data });
        });
    }
    getData = (e)=>{
        e.preventDefault();
        const SendId = this.refs.sendId.refs.input.value;
        this.props.form.validateFields((err,values)=>{
            if(!err){
                fetchData(department.SELECTUSEREGISTERBYSENDID,querystring.stringify({ SendId: SendId}),(data)=>{
                    if(data.status && data.result){
                        console.log(data.result);
                        const baseData = data.result;
                        const setFields = ['sendNo','fOrgName','treatmentNo','operNo','hzName','dender','age','operName',
                        'operDoctor','operDate','mzff','operRoom','circuitNurse','bedNum'];
                        let Fields = {};
                        setFields.map((item,index)=> Fields[item] = baseData[item]);
                        this.props.form.setFieldsValue(Fields);
                        let cbData = {};
                        cbData.SendNo = SendId;
                        cbData.deptGuid = values.deptGuid;
                        cbData.deptName =  this.state.deptName;
                        this.props.cb(data.result.detail, cbData);
                        this.setState({baseData: data.result });
                        
                    }else{
                        message.error(data.msg);
                    }
                })
            }
        })
        
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <Form>
                <Row>
                    <Col span={6} key={1}>
                        <FormItem {...formItemLayout} label={'登记科室'}>
                            {
                                getFieldDecorator('deptGuid',{
                                    rules:[{required: true,message:'请选择登记科室'},]
                            })(
                                <Select
                                    placeholder="请选择"
                                    showSearch
                                    onSelect={(value,option)=>this.setState({deptName:option.props.children})}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    
                                >
                                    {
                                        this.state.deptOptions.map( (item, index) => {
                                            return <Option key={index} value={item.value}>{item.label}</Option>
                                            })
                                    }
                                </Select>
                            )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12} key={2}>
                        <FormItem labelCol={{span:3}} wrapperCol={{span:18}} label={'送货单'}>
                            <Input placeholder='请扫描送货单二维码，或输入送货单号' ref='sendId' onPressEnter={this.getData}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={3}>
                        <FormItem {...formItemLayout} label={'送货单号'}>
                        {
                            getFieldDecorator('sendNo',{
                                initialValue: ''
                            })(
                                <Input disabled/>
                            )
                        } 
                        </FormItem>
                    </Col>
                    <Col span={6} key={4}>
                        <FormItem {...formItemLayout} label={'供应商'}>
                        {
                            getFieldDecorator('fOrgName',{
                                initialValue:''
                            })(
                                <Input disabled/>
                            )
                        }
                        </FormItem>
                    </Col>
                    <Col span={6} key={5}>
                        <FormItem {...formItemLayout} label={'就诊号'}>
                        {
                            getFieldDecorator('treatmentNo',{
                                initialValue:''
                            })(
                                <Input disabled/>
                            )
                        }
                        </FormItem>
                    </Col>
                    <Col span={6} key={6}>
                        <FormItem {...formItemLayout} label={'手术申请单'}>
                        {
                            getFieldDecorator('operNo',{
                                initialValue:''
                            })(
                                <Input disabled/>
                            )
                        }
                        </FormItem>
                    </Col>
                    <Col span={6} key={7}>
                        <FormItem {...formItemLayout} label={'患者姓名'}>
                        {
                            getFieldDecorator('hzName',{
                                initialValue:''
                            })(
                                <Input disabled/>
                            )
                        }
                        </FormItem>
                    </Col>
                    <Col span={6} key={8}>
                        <FormItem {...formItemLayout} label={'性别'}>
                            {
                                getFieldDecorator('dender',{
                                    initialValue:''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={9}>
                        <FormItem {...formItemLayout} label={'年龄'}>
                            {
                                getFieldDecorator('age',{
                                    initialValue:''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={10}>
                        <FormItem {...formItemLayout} label={'手术名称'}>
                            {
                                getFieldDecorator('operName',{
                                    initialValue:''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={11}>
                        <FormItem {...formItemLayout} label={'手术医生'}>
                            {
                                getFieldDecorator('operDoctor',{
                                    initialValue:''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={12}>
                        <FormItem {...formItemLayout} label={'手术日期'}>
                            {
                                getFieldDecorator('operDate',{
                                    initialValue:''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={13}>
                        <FormItem {...formItemLayout} label={'麻醉方式'}>
                            {
                                getFieldDecorator('mzff',{
                                    initialValue:''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={14}>
                        <FormItem {...formItemLayout} label={'手术间'}>
                            {
                                getFieldDecorator('operRoom',{
                                    initialValue:''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={15}>
                        <FormItem {...formItemLayout} label={'巡回护士'}>
                            {
                                getFieldDecorator('circuitNurse',{
                                    initialValue:''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={16}>
                        <FormItem {...formItemLayout} label={'床位号'}>
                            {
                                getFieldDecorator('bedNum',{
                                    initialValue:''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const WrappShowForm = Form.create()(searchForm);
class Register extends React.Component{
    state = {
        dataSource: [],
        deptData: {}
    }
    handleChange = (record,index,e)=>{
        let value = e.target.value;
        if(/^\d+$/.test(value)){
            if( value > record.amount){
                return message.warn('使用数量不得大于发货数量')
            }else{
                let { dataSource} = this.state;
                dataSource[index].sysl = value;
                this.setState({ dataSource });
            }
        }else{
            return message.warn('请输入正整数')
        }
    }
    total = ()=>{
        let total = 0;
        this.state.dataSource.map((item,index)=>{
            let amount = typeof item.sysl === 'undefined' ? 1: item.sysl;
            return total += amount * item.tenderPrice;
        });
        return total.toFixed(2);
    }
    //提交
    submitHandle = ()=>{
        const { dataSource, deptData } = this.state;
        console.log(dataSource,'data',deptData,'deptData')
        if(dataSource.length > 0){
            let postData = {},detail = [];
            postData.sendNo = deptData.SendNo;
            postData.deptGuid = deptData.deptGuid;
            postData.deptName = deptData.deptName;
            dataSource.map((item,index)=>{
                if(item.sysl > 0){
                    return detail.push({
                        chargeDetallGuid: item.chargeDetallGuid,
                        sysl: item.sysl
                    });
                }
                return null;
            });
            postData.detail = detail;
            fetchData(department.ADDUSEREGISTER,JSON.stringify(postData),(data)=>{
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
                return <Input defaultValue={text || 0} min={0} onChange={this.handleChange.bind(this, record, index)}/>
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
                    <Col span={6}>
                        <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to='/department/useRegister'>使用登记</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>登记</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col span={18} style={{textAlign:'right'}}>
                        <Button type='primary' onClick={this.submitHandle} style={{marginRight:8}}>提交</Button>
                    </Col>
                </Row>
                <Row>
                    <WrappShowForm 
                        cb={(data,deptData) => {this.setState({ dataSource: data,deptData: deptData})}}
                        data={this.state.operData}
                    />
                </Row>
                <Table 
                    columns={columns}
                    dataSource={this.state.dataSource}
                    pagination={false}
                    rowKey={'chargeDetallGuid'}
                    scroll={{x:'150%'}}
                    size={'small'}
                    footer={footer}
                />
            </div>
        )
    }
}
module.exports = Register;