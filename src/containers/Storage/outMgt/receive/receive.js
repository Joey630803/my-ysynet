/**
 * @file 出库记录/领用
 */
import React from 'react';
import { Breadcrumb, Form, Select, Input, Button, Row, Col, Steps,message} from 'antd';
import { Link , hashHistory } from 'react-router';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { storage } from 'api';
const FormItem = Form.Item;
const Step = Steps.Step;
const Option = Select.Option;

class SearchForm extends React.Component{
    state = {
        storageOptions: [],
        deptOptions: [],
        addressOptions: [],
        storageName: '',
        deptName: '',
        addressName: '',
        patientInfo: '',
        operInfo: '',
        index: '', // 选中的病人手术信息 index
        isDisabled: false, //表单是否可编辑
        isOper : false // 结算方式判断是否是手术类型
    }
    componentDidMount = () =>{
        //库房
        fetchData(storage.FINDSTORAGEBYMYUSER,{},(data)=>{
            if(data.status){
                this.setState({ storageOptions:data.result });
            }else{
                message.error(data.msg);
            }
        });
    }
    handleSubmit = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            values.storageName = this.state.storageName;
            values.deptName = this.state.deptName;
            console.log('查询条件: ', values);
            let isEdit = false;
            for(let key in values){
                if(values.hasOwnProperty(key) && values['storageGuid'] !== '' && values['deptGuid'] !=='' && values['deptAddress'] !==''){
                    isEdit = true;
                }else{
                    isEdit = false;
                }
            }
            if(isEdit){
                values.addressName = this.state.addressName;
                if(this.state.isOper){
                    values.operInfo = values.operInfo ? values.operInfo: this.state.operInfo;
                    values.treatmentNo = this.refs.treatment.refs.input.value;
                    this.redirect('/storage/outMgt/operReceive',{ values, patinent: this.state.patientInfo[this.state.index]});
                }else{
                    this.redirect('/storage/outMgt/phReceive',values);
                }
            }else{
                message.warn('请填写完整信息');
            }
          })
    }
    
    redirect = (url,state)=>{
        hashHistory.push({
            pathname: url,
            state : {
              ...state
            }
          })
    }
    cancle = ()=>{
        hashHistory.push({
            pathname:'/storage/outMgt',
            query:{
                    activeKey:'1'
                }
        })
    }
    getChildren = (value,option)=>{
        this.props.form.setFieldsValue({deptGuid: "" ,receiveUserName: "", deptAddressGuid: ""});
        if(value){
            fetchData(storage.SEARCHOPENDEPTSBYSTORAGEID,querystring.stringify({storageId:value}),(data)=>{
                this.setState({deptOptions:data})
            })
            let isOper =  option.props.jsfs ==='01'? true:false;
            this.setState({ storageName:option.props.children, isOper : isOper});
        }else{
            this.setState({isOper : false });
        }
        this.setState({ isDisabled: false});
    }
    //获取科室地址
    getDeptName = (value,option)=>{
        this.props.form.setFieldsValue({ deptAddressGuid:"" });
        if(value){
            fetchData(storage.FINDDEPTADDRESS,querystring.stringify({ deptGuid : value}),(data)=>{
                if(data.status && data.result.length > 0){
                    this.setState({addressOptions:data.result});
                }else{
                    this.setState({ addressOptions: [] })
                }
            })
        }
        if(option.props.children){
            this.setState({deptName:option.props.children});
        }else{
            this.setState({deptName:''})
        }
    }
    getDeptAdress = ( value, option )=>{
        if(value){
            this.setState({addressName : option.props.children })
        }else{
            this.setState({ addressName: ""});
        }
    }
    getInfo = (e)=>{
        e.preventDefault();
        this.setState({operInfo : "" });
        let value = this.refs.treatment.refs.input.value;
        fetchData(storage.FINDTREATMENTOPERS,querystring.stringify({treatmentNo:value}),(data)=>{
            if(data.status){
                let patientInfo = data.result;
                this.setValue('0',patientInfo);
                this.setState({ patientInfo: patientInfo, isDisabled: true, index : 0, operInfo:data.result[0].operInfo});
            }
            else{
                this.clearVal();
                message.info(data.msg);
                this.setState({ patientInfo: [] });
            }
        })
    }
    
    showInFo = ( value, option )=>{
        if(option.props.index===0){
            this.clearVal();
        }else{
            this.setValue(Number(option.props.index-1),this.state.patientInfo);
            this.setState({ operInfo: value });
        }
        
    }
    clearVal = ()=>{
        this.props.form.setFieldsValue({
            name: '',
            gender: '',
            age: '',
            operName: '',
            operDoctor: '',
            operTime: '',
            mzff: '',
            operRoom: '',
            circuitNurse: '',
            bedNum: '',
            operExplain: ''
        });
        this.setState({ operInfo : ''});
    }
    setValue = (index,patientInfo) => {
        this.props.form.setFieldsValue({
            name: patientInfo[index].treatmentRecord.name,
            gender: patientInfo[index].treatmentRecord.gender,
            age: patientInfo[index].treatmentRecord.age,
            operName: patientInfo[index].operRecord.operName,
            operDoctor: patientInfo[index].operRecord.operDoctor,
            operTime: patientInfo[index].operRecord.operDate,
            mzff: patientInfo[index].operRecord.mzff,
            operRoom: patientInfo[index].operRecord.operRoom,
            circuitNurse: patientInfo[index].operRecord.circuitNurse,
            bedNum: patientInfo[index].operRecord.bedNum,
            operExplain: patientInfo[index].operRecord.operName
        });
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
        const children = [ 
                    <Row key={0}>
                        <Col span={6} push={3} style={{textAlign:'left',marginBottom:'16px'}}><h2>患者及手术信息</h2></Col>     
                    </Row>,
                    <Col key={1}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 9}} label='就诊号'>
                            <div>
                                <Input placeholder='请输入' style={{width:'75%',marginRight:'1%'}} ref="treatment" onPressEnter={this.getInfo}/>
                                <Button type='primary' ghost onClick={this.getInfo}>获取</Button>
                            </div>
                        </FormItem>
                    </Col>,
                    <Col key={2}>
                        {
                            this.state.isDisabled ?
                            <FormItem {...formItemLayout} label='手术申请单'>
                                <Select onSelect={this.showInFo} value={this.state.operInfo}>
                                    <Option key={-1} value=''>请选择</Option>
                                    {
                                        this.state.patientInfo.map((item,index)=>{
                                            return <Option key={index} value={item.operInfo}>{item.operInfo}</Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                            :
                            <FormItem {...formItemLayout} label='手术申请单'>
                                {getFieldDecorator('operInfo', {
                                        initialValue: '',
                                        rules:[
                                        {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                        {max: 50, message: '长度不能超过50'}],
                                    })(
                                        <Input placeholder='请输入'/>
                                    )
                                }
                            </FormItem>
                        }
                    </Col>,
                    <Col key={3}>
                        <FormItem {...formItemLayout} label='姓名'>
                            {getFieldDecorator('name', {
                                    initialValue : '',
                                    rules:[
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}],
                                })(
                                    <Input placeholder='请输入' disabled={this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>,
                    <Col key={4}>
                        <FormItem {...formItemLayout} label='性别'>
                            {getFieldDecorator('gender', {
                                    initialValue: '',
                                    rules:[
                                    {pattern:/男|女/,message:'只能是男或女'},
                                    {max: 1, message: '只能是男或女'}],
                                })(
                                    <Input placeholder='请输入' disabled={this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>,
                    <Col key={5}>
                        <FormItem {...formItemLayout} label='年龄'>
                            {getFieldDecorator('age', {
                                    initialValue : '',
                                    rules:[
                                    {pattern:/\d+$/,message:'只能是数字'},
                                    {max: 3, message: '年龄格式不正确'}]
                                })(
                                    <Input placeholder='请输入' disabled={this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>,
                    <Col key={6}>
                        <FormItem {...formItemLayout} label='手术名称'>
                            {getFieldDecorator('operName', {
                                    initialValue : '',
                                    rules:[
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}],
                                })(
                                    <Input placeholder='请输入' disabled={this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>,
                    <Col key={7}>   
                        <FormItem {...formItemLayout} label='手术医生'>
                            {getFieldDecorator('operDoctor', {
                                    initialValue: '',
                                    rules:[
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}],
                                })(
                                    <Input placeholder='请输入' disabled={this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>,
                    <Col key={8}>
                        <FormItem {...formItemLayout} label='手术时间'>
                            {getFieldDecorator('operTime', {
                                    initialValue: '',
                                    rules:[
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}],
                                })(
                                    <Input placeholder='请输入' disabled={this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>,
                    <Col key={9}>
                        <FormItem {...formItemLayout} label='麻醉方式'>
                            {getFieldDecorator('mzff', {
                                    initialValue : '',
                                    rules:[
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}],
                                })(
                                    <Input placeholder='请输入' disabled={this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>,
                    <Col key={10}>
                        <FormItem {...formItemLayout} label='手术间'>
                            {getFieldDecorator('operRoom', {
                                    initialValue: '',
                                    rules:[
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}],
                                })(
                                    <Input placeholder='请输入' disabled={this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>,
                    <Col key={11}>
                        <FormItem {...formItemLayout} label='巡回护士'>
                            {getFieldDecorator('circuitNurse', {
                                    initialValue : '',
                                    rules:[
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}],
                                })(
                                    <Input placeholder='请输入' disabled={this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>,
                    <Col key={12}>
                        <FormItem {...formItemLayout} label='床位号'>
                            {getFieldDecorator('bedNum', {
                                    initialValue : '',
                                    rules:[
                                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                    {max: 50, message: '长度不能超过50'}],
                                })(
                                    <Input placeholder='请输入' disabled={this.state.isDisabled}/>
                                )
                            }
                        </FormItem>
                    </Col>,
                    <Col key={13}>
                        <FormItem {...formItemLayout} label="手术说明">
                            {getFieldDecorator('operExplain',{
                                initialValue: '',
                                rules:[
                                {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                {max: 200, message: '长度不能超过200'}]
                            })(
                                <Input type="textarea" rows={4} disabled={this.state.isDisabled}/>
                            )}
                        </FormItem>
                    </Col>,
                    <Col key={14}>
                        <FormItem {...formItemLayout} label="手术备注">
                            {getFieldDecorator('tfRemark',{
                                initialValue : '',
                                rules:[
                                {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                                {max: 200, message: '长度不能超过200'}]
                            })(
                                <Input type="textarea" rows={4} disabled={this.state.isDisabled}/>
                            )}
                        </FormItem>
                    </Col>
        ];
        const isOper = this.state.isOper;
        const shownCount = isOper ? children.length : 0;
        return (
            <div>
                <Row>
                    <Col span={6} push={4} style={{textAlign:'left',marginBottom:'16px'}}><h2>领用信息</h2></Col>
                </Row>
                <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label="库房" hasFeedback>
                    {getFieldDecorator('storageGuid',{
                            initialValue: '',
                            rules:[{required: true,message:'请选择库房'}]
                        })(
                            <Select  
                                onSelect={this.getChildren}
                            >
                                <Option value="" key={-1}>请选择</Option>
                                {
                                    this.state.storageOptions.map((item,index)=>{
                                        return <Option value={item.value} key={index} jsfs={item.jsfs}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )
                    }
                    </FormItem>
                    <FormItem {...formItemLayout} label="领用科室" hasFeedback>
                    {getFieldDecorator('deptGuid', {
                            initialValue: '',
                            rules:[{required: true,message:'请选择领用科室'},
                            ]
                        })(
                            <Select 
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onSelect={this.getDeptName}
                            >
                                <Option value='' key={-1}>请选择</Option> 
                                {
                                    this.state.deptOptions.map((item,index)=>{
                                        return <Option value={item.value} key={item.RN}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )
                    }
                    </FormItem>
                    <FormItem {...formItemLayout} label="领用人" hasFeedback>
                    {getFieldDecorator('receiveUserName', {
                            initialValue : '',
                            rules: [
                            {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                            {max: 50, message: '长度不能超过50'}],
                            
                        })(
                            <Input placeholder='请输入'/>
                        )
                    }
                    </FormItem>
                    <FormItem {...formItemLayout} label="科室地址" hasFeedback>
                    {getFieldDecorator('deptAddressGuid', {
                            initialValue : '',
                            rules:[{required: true,message:'请选择科室地址'}],
                        })(
                            <Select onSelect={this.getDeptAdress}>
                                <Option value='' key={-1}>请选择</Option> 
                                {
                                    this.state.addressOptions.map((item,index)=>{
                                        return <Option value={item.value} key={index}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )
                    }
                    </FormItem>
                    <Row>
                        { children.slice(0, shownCount) }
                    </Row>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" size="large" style={{marginRight:20}}>下一步</Button>
                        <Button type="primary"  size="large" onClick={this.cancle}>取消</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
const ReceiveForm = Form.create()(SearchForm);

class Receive extends React.Component{
    render(){
        return (
            <div>
                <Breadcrumb style={{fontSize: '1.1em',marginBottom : 24}}>
                    <Breadcrumb.Item><Link to={{pathname:'/storage/outMgt',query:{activeKey:'1'}}}>出库记录</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>领用</Breadcrumb.Item>
                </Breadcrumb>
                <Row style={{marginBottom:24}}>
                    <Col span={18} push={3}>
                        <Steps>
                            <Step key={'1'} title="填写单据信息" status="process"/>
                            <Step key={'2'} title="添加领用产品" status="process"/>
                            <Step key={'3'} title="确认领用单" status="process"/>
                        </Steps>
                    </Col>
                </Row>
                <ReceiveForm />
            </div>
        )
    }
}
module.exports = Receive;