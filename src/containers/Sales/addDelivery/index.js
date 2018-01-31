/**
 * 新增发票
 */
import React from 'react';
import {Form,Row, Col, Input, Button, Select, Table, message,Icon,DatePicker,Modal } from 'antd';
import querystring from 'querystring';
import { sales } from 'api'
import FetchSelect from 'component/FetchSelect';
import { fetchData } from 'utils/tools';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;

class AddForm extends React.Component {
    state = {
        invoiceQrcode:'',//发票二维码
        storageOptions:[], //库房列表
        rStorageGuid:'',//库房id,
        storageName:'',
        rOrgId:'',//医疗机构
        invoiceCode : '',//根据发票二维码获取的数据
        invoiceDate : '',//根据发票二维码获取的数据
        invoiceNo :'',//根据发票二维码获取的数据
        dataSourceLeft:[],//需要保存的数据
        dataSourceRight:[],
        dataLeftTotal:0
    }
    //处理错误信息
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    
    handleFetchSelect = (value) => {
         //库房
         fetchData(sales.FINDTOPSTORAGEBYUSER,querystring.stringify({rOrgId:value}),(data) =>{
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
         })

        this.setState({
            rOrgId: value
        })
    }
     //选中库房
    handleOnSelect = (value,Option) => {
        this.setState({
            rStorageGuid : value,
            storageName : Option.props.children
        })
        const rOrgId = this.state.rOrgId;
        const rStorageGuid = value;
        //根据医疗机构id和库房id查询发票列表
        fetchData(sales.SEARCHDELIVERYLIST,querystring.stringify({rOrgId:rOrgId,rStorageGuid:rStorageGuid}),(data)=>{
            if(data.status){
                this.setState({
                    dataSourceRight: data.result,
                    dataSourceLeft: [],
                    dataLeftTotal: 0
                })
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
            const { rOrgId,rStorageGuid ,dataSourceLeft}= this.state;
            const sendIds = [];
            dataSourceLeft.forEach((item) => {
                sendIds.push({sendId:item.sendId});
            })
            values.rOrgId = rOrgId;
            values.rStorageGuid = rStorageGuid;
            values.sendIds = sendIds;
            //保存
            fetchData(sales.SAVEINVOICE,JSON.stringify(values),(data) => {
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
                    })
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
            title: '送货单号',
            dataIndex: 'sendNo',
            render: text => <a href="#">{text}</a>,
            }, {
            title: '送货单金额',
            dataIndex: 'totalPrice',
            render: (text,record,index) => {
                return text === 'undefined' ? '0.00' : text.toFixed(2)
            }
            }, {
            title: '状态',
            dataIndex: 'sendFstate',
            render: (text,record,index) => {
                if(text === "40"){
                    return "待发货"
                }else if(text === "50"){
                    return "待验收"
                }else if(text === "60"){
                    return "验收通过"
                }else if(text === "80"){
                    return "已完结"
                }else if(text === "90"){
                    return "验收不通过"
                }
            }
            }, {
            title: '收货地址',
            dataIndex: 'address',
            },{
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 60,
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
            width: 60,
            render: (text,record,index) => {
                return (
                        <a onClick={
                        this.onSelectRight.bind(null, record,index)}>
                        关联
                    </a>
                )
            }},{
            title: '送货单号',
            dataIndex: 'sendNo',
            }, {
            title: '送货单金额',
            dataIndex: 'totalPrice',
            render: (text,record,index) => {
                    return text === 'undefined' ? '0.00' : text.toFixed(2)
                }
            }, {
            title: '状态',
            dataIndex: 'sendFstate',
            render: (text,record,index) => {
                if(text === "40"){
                    return "待发货"
                }else if(text === "50"){
                    return "待验收"
                }else if(text === "60"){
                    return "验收通过"
                }else if(text === "80"){
                    return "已完结"
                }else if(text === "90"){
                    return "验收不通过"
                }
            }
            }, {
            title: '收货地址',
            dataIndex: 'address'
            }
        ];
        const { dataSourceLeft, dataSourceRight,invoiceQrcode,dataLeftTotal } = this.state;
        const suffix = invoiceQrcode ? <Icon type="close-circle" onClick={this.editEmpty} /> : null; 
        const footer = () => {
            return <Row><Col>送货单总金额:{dataLeftTotal.toFixed(2)}</Col></Row>
        }; 
    return (
        <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
            <Row>
                <Col span={6} key={1}>
                    <FormItem
                    {...formItemLayout}
                    label='发票二维码'
                    >
                    {getFieldDecorator('invoiceQrcode',
                    {
                        initialValue:invoiceQrcode,
                    }
                    )(
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
                    <FormItem
                    {...formItemLayout}
                    label='发票金额'
                    >
                    {getFieldDecorator('accountPayed',{
                        rules:[
                            {required: true, message: '发票金额不能为空', whitespace: true }]
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
                    <FormItem
                    {...formItemLayout}
                    label='发票代码'
                    >
                    {getFieldDecorator('invoiceCode',{
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
                    <FormItem
                    {...formItemLayout}
                    label='开票日期'
                    >
                    {getFieldDecorator('invoiceDate',{
                        initialValue:this.state.invoiceDate === "" ? null : moment(this.state.invoiceDate),
                        rules: [{ type: 'object', required: true, message: '请选择开票日期!' }],
                    })(
                        <DatePicker />
                    )
                    }
                    </FormItem>
                </Col>
                <Col span={6} key={6}>
                    <FormItem
                    {...formItemLayout}
                    label='发票号码'
                    >
                    {getFieldDecorator('invoiceNo',{
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
                    <FormItem
                    {...formItemLayout}
                    label='医疗机构'
                    >
                        <FetchSelect placeholder="请输入" style={{width:200}} ref='fetchs' url={sales.ADDINVOICEORGLIST} 
                            cb={this.handleFetchSelect}/>
                    </FormItem>
                </Col>
                <Col span={6} key={8}>
                    <FormItem
                    {...formItemLayout}
                    label='库房'
                    >
                    <Select
                    style={{width:200}}
                    onSelect={this.handleOnSelect}
                    value={this.state.storageName}
                    >
                    {
                        this.state.storageOptions.map(
                        (item, index) => <Option key={index} value={item.value}>{item.text}</Option>)
                    }
                    </Select>
                    </FormItem>
                </Col>
            </Row>
              <Row>
                    <Col className="ant-col-11">
                        <Table 
                        columns={columnsLeft} 
                        dataSource={dataSourceLeft} 
                        pagination={false}
                        size="small"
                        rowKey='sendId'
                        scroll={{ x : '120%'}}
                        footer={footer}
                        title={() => '已关联送货单'}
                        />
                    </Col>
                    <Col className="ant-col-2" style={{textAlign:'center'}}>
                        {/*<Button type="primary" style={{marginBottom:16}}>关联</Button>
                        <br/>
                        <Button type="primary" ghost>移除</Button>*/}
                    </Col>
                    <Col className="ant-col-11">
                        <Table 
                        columns={columnsRight} 
                        dataSource={dataSourceRight} 
                        pagination={false}
                        size="small"
                        scroll={{ x : '120%'}}
                        rowKey='sendId'
                        title={() => '未关联送货单'}
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
            <WrappedRegistrationForm/>
        </div>
        );
     }
}
module.exports = AddDelivery;