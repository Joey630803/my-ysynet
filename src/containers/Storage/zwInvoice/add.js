/**
 * 总务发票--新增发票
 */
import React from 'react';
import {Breadcrumb,Form,Row, Col, Input, Button, Select, Table, message,Icon,DatePicker,Modal } from 'antd';
import { Link, hashHistory } from 'react-router';
import querystring from 'querystring';
import { storage } from 'api'
import { fetchData } from 'utils/tools';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;

class AddForm extends React.Component {
    state = {
        invoiceQrcode:'',//发票二维码
        storageOptions:[], //库房列表
        forgOptions: [],
        rStorageGuid:'',//库房id,
        storageName:'',
        fOrgId:'',//供应商id
        invoiceCode : '',//根据发票二维码获取的数据
        invoiceDate : '',//根据发票二维码获取的数据
        invoiceNo :'',//根据发票二维码获取的数据
        dataSourceLeft:[],//需要保存的数据
        dataSourceRight:[],
        cacheData: [],//未关联的缓存数据
        dataLeftTotal:0,
        sendNo:''
    }
    //处理错误信息
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    componentWillMount = ()=>{
        //所属一级库房
        fetchData(storage.FINDTOPSTORAGEBYUSER,{},(data) =>{
            if(data.status){
                if (data.result.length >0) {
                    this.setState({
                        storageOptions: data.result,
                        rStorageGuid:data.result[0].value,
                        storageName:data.result[0].text
                    })
                }else{
                    this.setState({
                        rStorageGuid:'',
                        storageName:''
                    })
                }
            }else{
                this.handleError(data.msg)
            }
         });
         

       /*  this.setState({
            fOrgId: value
        }) */
    }
    //选中库房查询对应的供应商
    findForgList = (value,option) => {
        fetchData(storage.FINDGENERALFORGLIST,querystring.stringify({ searchParams:value }),(data)=>{
            this.setState({ forgOptions: data,rStorageGuid: value })
        })
         
    }
     //选中供应商
    handleOnSelect = (value,Option) => {
        this.setState({
            fOrgId : value,
            storageName : Option.props.children
        })
        const rStorageGuid = this.state.rStorageGuid;
        //根据医疗机构id和库房id查询发票列表
        fetchData(storage.SEARCHDELIVERYLIST,querystring.stringify({fOrgId:value,rStorageGuid:rStorageGuid}),(data)=>{
            if(data.status){
                console.log(data,'data')
                let dataSourceLeft = [],dataSourceRight = [];
                if(data.result.length > 0){
                    data.result.forEach((item)=>{
                        if(item.is_selected === 1){
                            //已关联
                            dataSourceLeft.push(item)
                        }else{
                            dataSourceRight.push(item);
                        }
                    })
                    this.setState({ dataSourceLeft,dataSourceRight,cacheData : dataSourceRight });
                }else{
                    this.setState({ dataSourceLeft:[], dataSourceRight:[]});
                }
            }else{
                this.handleError(data.msg)
            }
        })
     
    }
    editEmpty = () => {
        this.invoiceQrcodeInput.focus();
        this.setState({ invoiceQrcode: '' });
    }
    handleInvoiceQrcode = (qrcode) => {
        let strs= []; 
        while( qrcode.indexOf( "，" ) !== -1 ) {
            qrcode=qrcode.replace("，",","); 
        }
        strs=qrcode.split(","); 
        let data={};
        if(strs.length<6){
            data.error="二维码不能被识别，请重新扫码或手动录入发票信息";
            return data;
        }
        data.invoiceCode=strs[2]
        data.invoiceNo=strs[3]
        let date=strs[5];
        if(date.length<8){
            data.error = "二维码不能被识别，请重新扫码或手动录入发票信息";
            return data;
        }
        let da=date.substr(0,4)+"-"+date.substr(4,2)+"-"+date.substr(6,2)
        data.invoiceDate = da
        return data;
    }
    //input onPressEnter
    handleInputEnter = (e) => {
        const resetFields = ['invoiceCode', 'invoiceNo']
        this.props.form.resetFields(resetFields);
        const invoiceQrcode = e.target.value;
        //根据二维码获取发票代码 发票日期 发票号码
        const data = this.handleInvoiceQrcode(invoiceQrcode);
        if(data.error){
            this.handleError(data.error);
        }else if(data.invoiceCode){
             this.setState({
                invoiceCode : data.invoiceCode,
                invoiceDate : data.invoiceDate,
                invoiceNo : data.invoiceNo
             })
        }
        
    }
       //保存
    handleSave = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            const { fOrgId,rStorageGuid ,dataSourceLeft}= this.state;
            const sendIds = [];
            dataSourceLeft.forEach((item) => {
                sendIds.push({sendId:item.sendId});
            })
            values.fOrgId = fOrgId;
            values.rStorageGuid = rStorageGuid;
            values.sendIds = sendIds;
            //保存
            fetchData(storage.SAVEORUPDATEINVOICE,JSON.stringify(values),(data) => {
                if(data.status){
                    message.success("保存成功!")
                    this.props.form.resetFields();
                      this.setState({
                        rStorageGuid:'',//库房id,
                        storageName:'',
                        invoiceCode : '',//根据发票二维码获取的数据
                        invoiceDate : '',//根据发票二维码获取的数据
                        invoiceNo :'',//根据发票二维码获取的数据
                        dataSourceLeft:[],//需要保存的数据
                        dataSourceRight:[],
                        dataLeftTotal:0
                    });
                    hashHistory.push({ pathname:'/storage/zwInvoice'});
                }else {
                    this.handleError(data.msg)
                }
            },'application/json')
           
        }
        });
       

    }
    //已关联送货单移除
    onSelectLeft = (record, index) => {
        const dataLeftTotal = this.state.dataLeftTotal - record.totalPrice; //左边送货单总金额
        const dataSourceLeft =[ ...this.state.dataSourceLeft];
         dataSourceLeft.splice(index,1);
        this.setState({
            dataSourceLeft : dataSourceLeft,
            dataLeftTotal : dataLeftTotal,
            dataSourceRight: [...this.state.dataSourceRight,record]
            
        })
    }
    //未关联送货单关联
    onSelectRight= (record, index) => {
        const dataLeftTotal = this.state.dataLeftTotal + record.totalPrice; //左边送货单总金额
        const dataSourceRight =[ ...this.state.dataSourceRight];
         dataSourceRight.splice(index,1);
        this.setState({
            dataSourceRight : dataSourceRight,
            dataLeftTotal : dataLeftTotal, 
            dataSourceLeft: [...this.state.dataSourceLeft,record]
        })
    }
    search = ()=>{
        let { sendNo, dataSourceRight,cacheData } = this.state;
        if(sendNo){
            console.log('有单号')
            let result = [];
            dataSourceRight.map((item,index)=>{
                if(item.sendNo === sendNo){
                    result.push(item);
                    return null;
                }
                return null;
            });
            this.setState({ dataSourceRight: result });
        }else if(sendNo === ''){
            console.log('单号为空.....')
            this.setState({ dataSourceRight:cacheData });
        }
    }
    checkPrice = (rule, value, callback)=>{
        //无小数点
        if(!isNaN(value)){
            if(value.indexOf('.') === -1 ){
                //无小数点
                if(value.length > 8){
                    callback('发票金额总数不得超过8位数');
                }else{
                    callback();
                }
            }else{
                //有小数点
                let val = value.split('.')[1];
                if(val.length > 4){
                    callback('发票金额总数最多4位小数');
                }else{
                    callback();
                }
            }
        }else{
            callback('发票金额格式不正确');
        }
    }
    render() {    
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        };
        const tailFormItemLayout = {
        wrapperCol: {
            span: 14,
            offset: 6,
        },
        };
        const columnsLeft = [{
            title: '入库单号',
            dataIndex: 'sendNo',
            render: text => <a href="#">{text}</a>,
            }, {
            title: '入库单金额',
            dataIndex: 'totalPrice',
            render: (text,record,index) => {
                return text === 'undefined' ? '0.00' : text.toFixed(2)
            }
            }, {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (text,record,index) => {
                return (
                        <a onClick={
                        this.onSelectLeft.bind(null, record,index)}>
                        移除
                    </a>
                )
            }}
        ];
        const columnsRight = [{
            title: '操作',
            key: 'action',
            fixed: 'left',
            width: 100,
            render: (text,record,index) => {
                return (
                        <a onClick={
                        this.onSelectRight.bind(null, record,index)}>
                        关联
                    </a>
                )
            }},{
            title: '入库单号',
            dataIndex: 'sendNo',
            }, {
            title: '入库单金额',
            dataIndex: 'totalPrice',
            render: (text,record,index) => {
                    return text === 'undefined' ? '0.00' : text.toFixed(2)
                }
            }
        ];
        const { dataSourceLeft, dataSourceRight,invoiceQrcode,dataLeftTotal } = this.state;
        const suffix = invoiceQrcode ? <Icon type="close-circle" onClick={this.editEmpty} /> : null; 
        const footer = () => {
            return <Row><Col>入库单总金额:{dataLeftTotal.toFixed(2)}</Col></Row>
        }; 
    return (
        <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
            <Row>
                <Col span={6} key={1}>
                    <FormItem {...formItemLayout} label='发票二维码'>
                    {
                        getFieldDecorator('invoiceQrcode',
                            {
                                initialValue:invoiceQrcode,
                            })(
                                <Input 
                                suffix={suffix}
                                //onChange={this.onChangeinvoiceQrcode}
                                ref={node => this.invoiceQrcodeInput = node}
                                onPressEnter={this.handleInputEnter}
                                />
                            )
                    }
                    </FormItem>
                </Col>
                <Col span={6} key={2}>
                    <FormItem {...formItemLayout} label='发票金额'>
                    {
                        getFieldDecorator('accountPayed',{
                            rules:[
                                {required: true, message: '发票金额不能为空', whitespace: true },
                                { validator: this.checkPrice }
                            ]
                        })(
                            <Input/>
                        )
                    }
                    </FormItem>
                </Col>
                <Col span={12} key={3} style={{textAlign:'right'}}>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" onClick={this.handleSave} size="large">保存</Button>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={6} key={4}>
                    <FormItem {...formItemLayout} label='发票代码' >
                    {
                        getFieldDecorator('invoiceCode',{
                            initialValue:this.state.invoiceCode,
                            rules:[
                                {required: true, message: '发票代码不能为空', whitespace: true }]
                        })(
                                <Input />
                            )
                    }
                    </FormItem>
                </Col>
                <Col span={6} key={5}>
                    <FormItem {...formItemLayout} label='开票日期'>
                    {
                        getFieldDecorator('invoiceDate',{
                            initialValue:this.state.invoiceDate === "" ? null : moment(this.state.invoiceDate),
                            rules: [{ type: 'object', required: true, message: '请选择开票日期!' }],
                        })(
                            <DatePicker style={{width:'100%'}}/>
                        )
                    }
                    </FormItem>
                </Col>
                <Col span={6} key={6}>
                    <FormItem {...formItemLayout} label='发票号码'>
                    {
                        getFieldDecorator('invoiceNo',{
                            initialValue:this.state.invoiceNo,
                            rules:[
                                {required: true, message: '发票号码不能为空', whitespace: true }]
                        })(
                            <Input />
                        )
                    }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={6} key={7}>
                    <FormItem {...formItemLayout} label='库房'>
                       {
                           getFieldDecorator(`storageGuid`,{
                               initialValue:''
                           })(
                            <Select onSelect={this.findForgList}>
                                <Option key={'-1'} value=''>请选择</Option>
                                {
                                    this.state.storageOptions.map((item,index)=>{
                                        return <Option key={index} value={item.value}>{item.text}</Option>
                                    })
                                }
                            </Select>
                           )
                       }
                    </FormItem>
                </Col>
                <Col span={6} key={8}>
                    <FormItem {...formItemLayout} label='供应商' >
                    {
                        getFieldDecorator(`fOrgId`,{
                            initialValue:''
                        })(
                        <Select
                            showSearch
                            style={{width:'100%'}}
                            onSelect={this.handleOnSelect}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option key={'-1'} value=''>请选择</Option>
                                {
                                    this.state.forgOptions.map(
                                    (item, index) => <Option key={index} value={item.value+""}>{item.text}</Option>)
                                }
                        </Select>
                        )
                    }
                    </FormItem>
                </Col>
            </Row>
              <Row>
                    <Col className="ant-col-11">
                        <p style={{marginBottom:8}}>已关联入库单</p>
                        <Table 
                            columns={columnsLeft} 
                            dataSource={dataSourceLeft} 
                            pagination={false}
                            size="small"
                            rowKey='sendId'
                            footer={footer}
                        />
                    </Col>
                    <Col className="ant-col-2">
                    </Col>
                    <Col className="ant-col-11">
                        <p style={{marginBottom:8}}>未关联入库单</p>
                        <Table 
                            columns={columnsRight} 
                            dataSource={dataSourceRight} 
                            pagination={false}
                            size="small"
                            rowKey='sendId'
                            title={()=>(
                                <div>
                                    <Input placeholder='入库单号' style={{width:250}} onBlur={(e)=>this.setState({ sendNo:e.target.value })}/>
                                    <Button type='primary' style={{marginLeft:8}} onClick={this.search}>搜索</Button>
                                </div>
                            )}
                        />
                    </Col>
                </Row>
      </Form>
    )
  }
}
const WrappedRegistrationForm = Form.create()(AddForm);
class AddDelivery extends React.Component{
    render() {
        return (
        <div>
            {
                this.props.children ||
                <div>
                    <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                        <Breadcrumb.Item><Link to='/storage/zwInvoice'>我的发票</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>新增发票</Breadcrumb.Item>
                    </Breadcrumb>
                    <WrappedRegistrationForm/>
                </div>
            }
        </div>
        );
     }
}
module.exports = AddDelivery;