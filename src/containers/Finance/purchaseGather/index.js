/**
 * @file 采购汇总
 */
import React from 'react';
import { Form, Row, Col, Select, Input, Button, DatePicker, Radio, Table,message } from 'antd';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { finance } from 'api';
import uuid from 'uuid';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
class SearchForm extends React.Component{
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
        storageOptions: [],
        storageGuid:'',
        disabled: true
    }
    componentDidMount = ()=>{
        fetchData(finance.FINDSTORAGEBYUSER,{},(data)=>{
            if(data.result.length === 1){
                this.props.storageGuid(data.result[0].value);
                this.setState({storageGuid:data.result[0].value });
                let query={
                    value:data.result[0].value,
                    acctYH:'0',
                    invoiceFstate:'0'
                }
                this.getData(query)
            }
            this.setState({storageOptions:data.result });
        })
    }
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    onStartChange = (value) => {
        this.onChange('startValue', value);
    }

    onEndChange = (value) => {
        this.onChange('endValue', value);
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }
    handleSearch = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                values.beginTime = values.beginTime === null ? "" : values['beginTime'].format('YYYY-MM');
                values.endTime = values.endTime === null ? "" :  values['endTime'].format('YYYY-MM');
                console.log(values,'查询条件')
                this.getData(values);
            }
        })
    }
    getData = (query)=>{
        fetchData(finance.FINDPURCHASEGATHER,querystring.stringify(query),(data)=>{
            if(data.status){
                if(data.result.length>0){
                    const dataSource = data.result;
                    const totalData = [{
                        fOrgID:uuid(),
                        price:this.total(dataSource)}
                    ];
                    let newData = dataSource.concat(totalData);
                    this.props.dataSource(newData);
                }else{
                    this.props.dataSource([]);
                }
            }else{
                message.error(data.msg);
            }
        })
    }
    total = (values)=>{
        let total = 0;
        values.map((item,index)=>{
            let amount = typeof item.price === 'undefined' ? 0: item.price;
            return total += amount;
        });
        return total;
    }
    selectChange = (value)=>{
        if(value==='0'){
            this.setState({ disabled: true});
        }else if(value === '1'){
            this.setState({ disabled: false});
        }
        this.props.form.setFieldsValue({'beginTime':null,'endTime':null});
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const { startValue, endValue, endOpen } = this.state;
        const formItemLayout = {
           labelCol: { span: 6 },
           wrapperCol: { span: 18 },
        }
        const storageOptions = () => {
            let options = [];
            const selectData =  this.state.storageGuid===''? <Option value='' key={-1}>请选择</Option>:null;
            if(selectData){
                options.push(selectData);
            }
            let storageOptions = this.state.storageOptions;
            storageOptions.map((item,index) => {
               return options.push(<Option key={index} value={item.value}>{item.text}</Option>)
            })
            return options;
          }
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row>
                    <Col span={8} key={1}>
                        <FormItem {...formItemLayout} label={'库房'}>
                            {
                                getFieldDecorator('value',{
                                    rules:[{required:true,message:'请选择库房'}],
                                    initialValue:this.state.storageGuid
                                })(
                                <Select onSelect={(value)=>this.props.storageGuid(value)}
                                >
                                    {
                                         storageOptions()
                                    }
                                </Select>
                                )
                            }
                        </FormItem>
                    </Col> 
                    <Col span={8} key={2}>
                        <FormItem {...formItemLayout} label={'结账'}>
                            {
                                getFieldDecorator('acctYH',{
                                    initialValue:'0'
                                })(
                                    <Select onChange={this.selectChange}>
                                        <Option key={-1} value=''>请选择</Option>
                                        <Option key={1} value='0'>待结账</Option>
                                        <Option key={2} value='1'>已结账</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8} key={6}>
                        <FormItem labelCol={{span:8}} wrapperCol={{span:16}} label={'报表类型'}>
                            {
                                getFieldDecorator('invoiceFstate',{
                                    initialValue:'0'
                                })(
                                <RadioGroup>
                                        <Radio value='0'>财务帐</Radio>
                                        <Radio value='1'>实物帐</Radio>
                                </RadioGroup>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} key={7}>
                        <FormItem {...formItemLayout} label={'供应商'}>
                            {
                                getFieldDecorator('searchName',{rules: [{ max: 25, message: '长度不能超过25' }]})(
                                <Input placeholder='供应商'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8} key={9}>
                        <Col span={12} key={3} push={2}>
                            <FormItem labelCol={{span:8}} wrapperCol={{span:16}} label={'会计月'}>
                                {getFieldDecorator('beginTime',{
                                    rules:[{required:!this.state.disabled,message:'请选择月份'}],
                                    initialValue:startValue
                                })(
                                    <MonthPicker  
                                        disabledDate={this.disabledStartDate}
                                        onChange={this.onStartChange}
                                        onOpenChange={this.handleStartOpenChange}
                                        placeholder="选择月" 
                                        disabled={this.state.disabled}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2} key={4} push={2} style={{textAlign:'center'}}>
                            ~
                        </Col>
                        <Col span={10} key={5} push={2}>
                            <FormItem {...formItemLayout} label={''}>
                                {getFieldDecorator('endTime',{
                                    initialValue:endValue
                                })(
                                    <MonthPicker  
                                        disabledDate={this.disabledEndDate}
                                        placeholder="选择月"
                                        onChange={this.onEndChange}
                                        open={endOpen}
                                        onOpenChange={this.handleEndOpenChange}
                                        disabled={this.state.disabled}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Col>
                    <Col span={6} key={8} style={{textAlign:'right'}}>
                        <Button type="primary" htmlType="submit">搜索</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const SearchBox = Form.create()(SearchForm);
class PurchaseGather extends React.Component{
    state = {
        dataSource: [],
        storageGuid:'',
    }
    createForm = ()=>{
        const value = this.state.storageGuid;
        if(value){
            console.log(value,'库房')
            fetchData(finance.CREATEFORMS,querystring.stringify({value:value}),(data)=>{
                if(data.status){
                    message.success('操作成功！');
                }else{
                    message.error(data.msg);
                }
            })
        }else{
            message.warn('请选择库房!');
        }
    }
    render(){
        const columns = [{
            title: '序号',
            dataIndex :'Num',
            render:(text,record,index)=>{
                if(record.fOrgName){
                    return index + 1;
                }else{
                    return <span style={{fontSize:'1.1em'}}>合计</span>
                }
            }
        },{
            title: '供应商',
            dataIndex: 'fOrgName',
        },{
            title: '供应商编码',
            dataIndex: 'fOrgID',
            render:(text,record)=>{
                if(record.fOrgName){
                    return text;
                }else{
                    return null;
                }
            }
        },{
            title: '金额',
            dataIndex: 'price',
            render:(text,record)=>{
                if(record.fOrgName){
                    return text ==='undefined'? '0.00':text.toFixed(2);
                }else{
                    return <span style={{color:'red',fontSize:'1.1em'}}>{text ==='undefined'? '0.00':text.toFixed(2)}</span>
                }
            }
        }];
        // const query = this.state.query;
        return (
        <div>
            {
                this.props.children ||
                <div>
                    <SearchBox 
                        storageGuid={(value)=>this.setState({storageGuid:value})}
                        dataSource={(data)=>this.setState({dataSource:data})}
                    />
                    <Row>
                        <Col>
                            <Button type='primary' onClick={this.createForm}>生成报表</Button>
                        </Col>
                    </Row>
                    <Table
                        style={{marginTop:12}}
                        dataSource={this.state.dataSource}
                        columns={columns}
                        pagination={false}
                        rowKey={'fOrgID'}
                        size={'small'}
                    />
                </div>
            }
        </div>
    )
    }
}
module.exports = PurchaseGather;