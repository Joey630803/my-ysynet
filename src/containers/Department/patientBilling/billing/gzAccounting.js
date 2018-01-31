/**
 * @file 患者计费--高值计费
 */
import React from 'react';
import { Form, Select, Input, DatePicker, Row, Col, Button, Table, message, Modal } from 'antd';
import { fetchData } from 'utils/tools';
import { hashHistory } from 'react-router';
import querystring from 'querystring';
import { department } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;
class WrappHighValueForm extends React.Component{
    state = {
        deptOptions: [],
        patientData: '',
        operApplyOptions: [],
        isDisabled: false,
    }
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    componentDidMount = ()=>{
        fetchData(department.FINDDEPTSTORAGEBYUSER,{},(data)=>{
            this.setState({deptOptions : data });
        });
        if(this.props.chargeGuid){
            fetchData(department.FINDHVSUPPLEMENTCHARGE,querystring.stringify({chargeGuid:this.props.chargeGuid}),(data)=>{
                if(data.status){
                    this.setState({patientData: data.result });
                }else{
                    this.handleError(data.msg);
                }
            })
        }
    }
    changeMode = ()=>{
        this.resetFields();
        this.props.cb([])
        this.setState({isDisabled : !this.state.isDisabled}); 
    }
    getHvInfo = (e)=>{
        e.preventDefault();
        if(this.state.isDisabled){
            return null;
        }else{
            this.props.form.validateFields((err,values)=>{
                    console.log(values,'数据');
                    fetchData(department.FINDHIGHVALUECHARGEINFO,querystring.stringify({chargeDeptGuid:values.chargeDeptGuid,treatmentNo:values.treatmentNo}),(data)=>{
                        if(data.status){
                            const patientData = data.result;
                            this.props.form.setFieldsValue({'name':patientData.name,'gender':patientData.gender,'age':patientData.age});
                            this.setState({patientData:data.result,operApplyOptions: data.result.list })
                        }else{
                            this.handleError(data.msg);
                        }
                    })
            })
        }
    }
    onSelect = (value,option)=>{
        fetchData(department.CHOOSEOPERATIONAPPLY,querystring.stringify({operRecordGuid:value}),(data)=>{
            if(data.status){
                console.log(data.result,'result');
                const operData = data.result;
                const setFields = ['operName','operDoctor','operDate','mzff','operRoom','circuitNurse','bedNum'];
                let Fieds = {};
                setFields.map((item,index)=> Fieds[item] = operData[item]);
                this.props.form.setFieldsValue(Fieds);
                this.setState({ operNo: option.props.operNo});
            }else{
                this.handleError(data.msg);
            }
        })
    }
    //表单重置
    resetFields = ()=>{
        const resetFields = ['chargeDeptGuid','treatmentNo','name','age','operName',
        'operDoctor','operRoom','circuitNurse','bedNum'];
        let setFileds = {};
        resetFields.map((item , index)=> setFileds[item] = '' );
        this.props.form.setFieldsValue(setFileds);
    }
    //计费
    charge = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                let values = this.props.form.getFieldsValue();
                values.chargeDeptName = this.state.DeptName;
                values.operNo = this.state.operNo;
                if(this.state.isDisabled){
                    values.operDate = this.state.operTime;
                    values.mzff = values.mzfs;
                    values.gender = values.sex;
                    values.operNo = values.operApply;
                }
                console.log(values,'values')
                const dataSource = this.props.dataSource;
                let list = [],postData = {};
                if(dataSource.length > 0){
                    dataSource.map((item,index)=>{
                        return list.push({
                            qrcode: item.qrcode,
                            hisPrice: item.hisPrice
                        })
                    });
                    for(var i in values){
                        if(values.hasOwnProperty(i) && i !== 'operTime' && i!== 'mzfs' && i!== 'sex' && i!== 'operApply'){
                            postData[i] = values[i];
                        }
                    }
                    postData.list = list;
                    fetchData(department.HIGHVALUECHARGE,JSON.stringify(postData),(data)=>{
                        if(data.status){
                            message.success('操作成功！');
                            hashHistory.push('/department/patientBilling');
                        }else{
                            this.handleError(data.msg);
                        }
                    },'application/json')
                }else{
                    message.info('请添加需要计费的产品');
                }
            }
        })
    }
    render(){
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
                                    <Select onSelect={(value,option)=>this.setState({ DeptName: option.props.chargeDeptName})}>
                                        <Option key={-1} value=''>请选择</Option>
                                        {
                                            this.state.deptOptions.map((item,index)=>{
                                                return <Option key={index} value={item.value} chargeDeptName={item.label}>{item.label}</Option>
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
                    <Col span={6} key={2}>
                        <FormItem {...formItemLayout} label={'就诊号'}>
                            {
                                getFieldDecorator('treatmentNo',{
                                    initialValue:'',
                                    rules:[{required: true,message:'请输入就诊号'},
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}
                                ]
                                })(
                                    <Input placeholder='请输入就诊号' onPressEnter={this.getHvInfo}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={9} key={3}>
                        {
                            !this.state.isDisabled ?
                            <FormItem labelCol={{span:4}} wrapperCol={{span:19}} label={'手术申请单'}>
                                {
                                    getFieldDecorator('operNo',{
                                        initialValue:'',
                                        rules:[{required: true,message:'请选择手术申请单'}]
                                    })(
                                        <Select 
                                            onSelect={this.onSelect}
                                        >
                                        <Option value=''>请选择</Option>
                                            {
                                                this.state.operApplyOptions.map((item,index)=>{
                                                    return <Option key={index} value={item.operRecordGuid} operNo={item.operNo}>{item.operNo+" | "+item.operName}</Option>
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                            :
                            <FormItem labelCol={{span:4}} wrapperCol={{span:19}} label={'手术申请单'}>
                                {
                                    getFieldDecorator('operApply',{
                                        initialValue:'',
                                    })(
                                        <Input placeholder='请输入'/>
                                    )
                                }
                            </FormItem>
                        }
                    </Col>
                    <Col span={3} key={4} style={{textAlign:'right'}}>
                        <Button type='primary' onClick={this.changeMode}>{this.state.isDisabled ? `接口获取信息` : `手动录入信息`}</Button>     
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={5}>
                        <FormItem {...formItemLayout} label={'患者姓名'}>
                            {
                                getFieldDecorator('name',{
                                    initialValue:'',
                                })(
                                    <Input disabled={!this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    {
                        this.state.isDisabled ?
                        <Col span={6} key={15}>
                            <FormItem {...formItemLayout} label={'证件号'}>
                                {
                                    getFieldDecorator('sfzh',{
                                        rules:[
                                        {pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,message:'身份证输入不合法'}
                                        ]
                                    })(
                                        <Input />
                                    )
                                }
                        </FormItem>
                        </Col>
                        :
                        null
                    }
                    <Col span={6} key={6}>
                        {
                            !this.state.isDisabled ?
                            <FormItem {...formItemLayout} label={'性别'}>
                                {
                                    getFieldDecorator('gender')(
                                        <Input disabled={!this.state.isDisabled}/>
                                    )
                                }
                            </FormItem>
                            :
                            <FormItem {...formItemLayout} label={'性别'}>
                            {
                                getFieldDecorator('sex')(
                                    <Select placeholder='请选择'>
                                        <Option key={1} value=''>请选择</Option>
                                        <Option key={2} value='男'>男</Option>
                                        <Option key={3} value='女'>女</Option>
                                    </Select>
                                )
                            }
                            </FormItem>
                        }
                    </Col>
                    <Col span={6} key={7}>
                        <FormItem {...formItemLayout} label={'年龄'}>
                            {
                                getFieldDecorator('age',{
                                    rules:[
                                    {pattern:/\d+$/,message:'只能是数字'},
                                    {max: 3, message: '年龄格式不正确'}]
                                })(
                                    <Input disabled={!this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} key={8}>
                        <FormItem {...formItemLayout} label={'手术名称'}>
                            {
                                getFieldDecorator('operName',{
                                    rules:[
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}]
                                })(
                                    <Input disabled={!this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={9}>
                        <FormItem {...formItemLayout} label={'手术医生'}>
                            {
                                getFieldDecorator('operDoctor',{
                                    rules:[
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}]
                                })(
                                    <Input disabled={!this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={10}>
                        {
                            !this.state.isDisabled ?
                            <FormItem {...formItemLayout} label={'手术日期'}>
                                {
                                    getFieldDecorator('operDate')(
                                        <Input disabled={!this.state.isDisabled}/>
                                    )
                                }
                            </FormItem>
                            :
                            <FormItem {...formItemLayout} label={'手术日期'}>
                                {
                                    getFieldDecorator('operTime')(
                                    <DatePicker 
                                        style={{width:'100%'}}
                                        onChange={(value,dateString)=>this.setState({operTime: dateString})} format="YYYY-MM-DD"
                                    />
                                    )
                                }
                            </FormItem>
                        } 
                    </Col>
                    <Col span={6} key={11}>
                        {
                            !this.state.isDisabled ?
                            <FormItem {...formItemLayout} label={'麻醉方式'}>
                                {
                                    getFieldDecorator('mzff')(
                                        <Input disabled={!this.state.isDisabled}/>
                                    )
                                }
                            </FormItem>
                            :
                            <FormItem {...formItemLayout} label={'麻醉方式'}>
                            {
                                getFieldDecorator('mzfs')(
                                    <Select 
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        placeholder='请选择'
                                    >
                                        <Option  value=''>请选择</Option>
                                        <Option  value='全身麻醉'>全身麻醉</Option>
                                        <Option  value='局部麻醉'>局部麻醉</Option>
                                        <Option  value='复合麻醉'>复合麻醉</Option>
                                        <Option  value='椎管内麻醉'>椎管内麻醉</Option>
                                    </Select>
                                )
                            }
                            </FormItem>

                        }
                    </Col>
                    <Col span={6} key={12}>
                        <FormItem {...formItemLayout} label={'手术间'}>
                            {
                                getFieldDecorator('operRoom',{
                                    rules:[
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}]
                                })(
                                    <Input disabled={!this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={13}>
                        <FormItem {...formItemLayout} label={'巡回护士'}>
                            {
                                getFieldDecorator('circuitNurse',{
                                    rules:[
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}]
                                })(
                                    <Input disabled={!this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={14}>
                        <FormItem {...formItemLayout} label={'床位号'}>
                            {
                                getFieldDecorator('bedNum',{
                                    rules:[
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}]
                                })(
                                    <Input disabled={!this.state.isDisabled}/>
                                )
                            }
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
                this.props.children ||
                <div>
                    <WrapperShowForm cb={(data)=>this.setState({dataSource: data})} chargeGuid={this.props.chargeGuid} dataSource={this.state.dataSource}/>
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
                        <Col className='ant-col-16' style={{textAlign:'right'}}>
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