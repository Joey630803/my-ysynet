/**
 * 新增发票
 */
import React from 'react';
import {Form,Row, Col, Input, Button, Select, Table, message,Icon,Breadcrumb,DatePicker,Modal } from 'antd';
import querystring from 'querystring';
import { Link ,hashHistory} from 'react-router';
import { sales } from 'api'
import FetchSelect from 'component/FetchSelect';
import { fetchData } from 'utils/tools';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
class EditForm extends React.Component {

    state = {
        invoiceId:this.props.data.invoiceId,
        invoiceQrcode:'',//发票二维码
        storageOptions:[], //库房列表
        rStorageGuid: this.props.data.rStorageGuid,//库房id,
        storageName: this.props.data.rStorageName,
        rOrgId: this.props.data.rOrgId,//医疗机构
        invoiceCode : this.props.data.invoiceCode,//根据发票二维码获取的数据
        invoiceDate : this.props.data.invoiceDate,//根据发票二维码获取的数据
        invoiceNo :this.props.data.invoiceNo,//根据发票二维码获取的数据
        accountPayed: this.props.data.accountPayed,//发票金额
        dataSourceLeft:[],//需要保存的数据
        dataSourceRight:[],
        dataLeftTotal:this.props.data.accountPayed
    }
    componentDidMount = () => {
        //库房
        fetchData(sales.FINDSTORAGEBYORGLIST,querystring.stringify({rOrgId:this.state.rOrgId}),(data)=>{
            this.setState({
                storageOptions: data,
            })
        })
        //左边
        const rOrgId = this.state.rOrgId;
        const invoiceId = this.state.invoiceId;
        const rStorageGuid = this.state.rStorageGuid;
        //根据医疗机构id和库房id查询发票列表
        fetchData(sales.SEARCHDELIVERYLIST,querystring.stringify({invoiceId:invoiceId,rOrgId:rOrgId,rStorageGuid:rStorageGuid}),(data)=>{
            if(data.status){
                const dataSourceLeft = [],dataSourceRight = [];
                if(data.result.length > 0){
                    data.result.forEach((item)=>{
                        if(item.is_selected){
                            dataSourceLeft.push(item)
                        }
                        else{
                            dataSourceRight.push(item);
                        }
                    })
                }
                this.setState({
                    dataSourceRight: dataSourceRight,
                    dataSourceLeft : dataSourceLeft,
                })
            }
            else{
                this.handleError(data.msg);
            }
            
        })
        .catch(e => console.log("Oops, error", e))
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
        fetchData(sales.FINDSTORAGEBYORGLIST,querystring.stringify({rOrgId:value}),(data) => {
            this.setState({
                storageOptions: data,
            })
            if (data.length >0) {
                this.setState({
                    rStorageGuid:data[0].value,
                    storageName:data[0].text
                })
            }else{
                this.setState({
                    rStorageGuid:'',
                    storageName:''
                })
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
            storageName : Option.props.children,
            dataLeftTotal : 0
        })
        const rOrgId = this.state.rOrgId;
        const invoiceId = this.state.invoiceId;
        const rStorageGuid = value;
        let dataLeftTotal = 0;
        //根据医疗机构id和库房id查询发票列表
        fetchData(sales.SEARCHDELIVERYLIST,querystring.stringify({invoiceId:invoiceId,rOrgId:rOrgId,rStorageGuid:rStorageGuid}),(data) => {
            if(data.status){
                const dataSourceLeft = [],dataSourceRight = [];
                if(data.result.length > 0){
                    data.result.forEach((item)=>{
                        if(item.is_selected){
                            dataSourceLeft.push(item);
                            dataLeftTotal += item.totalPrice;
                        }
                        else{
                            dataSourceRight.push(item);
                        }
                    })
                }
                this.setState({
                    dataSourceRight: dataSourceRight,
                    dataSourceLeft : dataSourceLeft,
                    dataLeftTotal : dataLeftTotal
                })
            }
            else{
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
        const invoiceQrcode= e.target.value;
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
        this.props.form.validateFields((err, values) => {
            if (!err) {
            const { invoiceId,rOrgId,rStorageGuid ,dataSourceLeft}= this.state;
            const sendIds = [];
            dataSourceLeft.forEach((item) => {
                sendIds.push({sendId:item.sendId});
            })
            values.invoiceDate = moment(values.invoiceDate).format('YYYY-MM-DD');
            values.rOrgId = rOrgId;
            values.invoiceId = invoiceId;
            values.rStorageGuid = rStorageGuid;
            values.sendIds = sendIds;
            //保存
            fetchData(sales.SAVEINVOICE,JSON.stringify(values),(data) => {
                if(data.status){
                    hashHistory.push('/sales/salesMyInvoice');
                    message.success("保存成功!");
                    
                }else {
                    this.handleError(data.msg);
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
                        rules:[{required: true, message: '发票金额不能为空'}],
                        initialValue:this.state.accountPayed,
                        validateTrigger: ['onChange', 'onBlur']
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
                        rules:[{required: true, message: '发票代码不能为空'}],
                        initialValue:this.state.invoiceCode,
                        validateTrigger: ['onChange', 'onBlur']
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
                        rules: [{ type: 'object', required: true, message: '请选择开票日期!' }],
                        validateTrigger: ['onChange', 'onBlur'],
                        initialValue:this.state.invoiceDate === "" ? null : moment(this.state.invoiceDate),
                        
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
                        rules:[{required: true, message: '发票代码不能为空'}],
                        initialValue:this.state.invoiceNo,
                        validateTrigger: ['onChange', 'onBlur'],
                        
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
                        <FetchSelect defaultValue={this.props.data.rOrgName} placeholder="请输入" style={{width:200}} ref='fetchs' url={sales.ADDINVOICEORGLIST} 
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
                    allowClear={true}
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
                        footer={footer}
                        scroll={{ x : '120%'}}
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
                        rowKey='sendId'
                        title={() => '未关联送货单'}
                        />
                    </Col>
                </Row>
      </Form>
    )
  }
}
const WrappedRegistrationForm = Form.create()(EditForm);
class AddDelivery extends React.Component{
    render() {
                   console.log(this.props.location.state)  
        return (
        <div>
            <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                <Breadcrumb.Item><Link to='/sales/salesMyInvoice'>我的发票</Link></Breadcrumb.Item>
                <Breadcrumb.Item>编辑</Breadcrumb.Item>
            </Breadcrumb>
            <WrappedRegistrationForm data={this.props.location.state}/>
        </div>
        );
     }
}
module.exports = AddDelivery;