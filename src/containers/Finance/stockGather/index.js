/**
 * @file 库存汇总
 */
import React from 'react';
import { Form, Row, Col, Select, Input, Button, DatePicker, Radio,message } from 'antd';
import querystring from 'querystring';
import FetchTable from 'component/FetchTable';
import { fetchData } from 'utils/tools';
import { finance } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
class SearchForm extends React.Component{
    state = {
        storageOptions: [],
        disabled: true
    }
    componentDidMount = ()=>{
        fetchData(finance.FINDSTORAGEBYUSER,{},(data)=>{
            if(data.result.length > 0){
                this.setState({storageOptions:data.result });
                this.props.defaultQuery({value:data.result[0].value,acctYH:'0',invoiceFstate:'0'});
            }
        })
    }
    handleSearch = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                values.time = values.time === null ? "" : values['time'].format('YYYY-MM');
                console.log(values,'查询条件')
                this.props.query(values);
            }
        })
    }
    selectChange = (value)=>{
        if(value==='0'){
            this.setState({ disabled: true});
        }else if(value === '1'){
            this.setState({ disabled: false});
        }
        this.props.form.setFieldsValue({'time':null});
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
           labelCol: { span: 6 },
           wrapperCol: { span: 18 },
        }
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row>
                    <Col span={8} key={1}>
                        <FormItem {...formItemLayout} label={'库房'}>
                            {
                                getFieldDecorator('value',{
                                    rules:[{required:true,message:'请选择库房'}],
                                    initialValue:this.state.storageOptions.length > 0 
                                    ? this.state.storageOptions[0].value : null
                                })(
                                <Select>
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
                        <FormItem {...formItemLayout} label={'其它'}>
                            {
                                getFieldDecorator('searchName')(
                                <Input placeholder='产品名称/通用名称/规格/型号'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8} key={3}>
                        <FormItem labelCol={{span:6}} wrapperCol={{span:18}} label={'会计月'}>
                            {getFieldDecorator('time',{
                                rules:[{required:!this.state.disabled,message:'请选择月份'}],
                                initialValue:null
                            })(
                                <MonthPicker 
                                    placeholder="选择月" 
                                    style={{width:'100%'}}
                                    disabled={this.state.disabled}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} key={8} style={{textAlign:'right'}}>
                        <Button type="primary" htmlType="submit">搜索</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const SearchBox = Form.create()(SearchForm);
class StockGather extends React.Component{
    state = {
        dataSource: [],
        query: ''
    }
    queryHandler = (query)=>{
        this.refs.table.fetch(query);
        this.setState({ query : query });
    }
    createForm = ()=>{
        const query = this.state.query;
        if(query.value){
            console.log(query.value,'库房')
            fetchData(finance.CREATEFORMS,querystring.stringify({value:query.value}),(data)=>{
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
    defaultQuery = (query) => {
        this.setState({
          query: query
        })
      }
    render(){
        const columns = [{
            title : '通用名称',
            dataIndex : 'geName'
        },{
            title : '产品名称',
            dataIndex : 'materialName'
        },{
            title : '规格',
            dataIndex : 'spec'
        },{
            title : '型号',
            dataIndex : 'fmodel'
        },{
            title : '采购单位',
            width: 100,
            dataIndex : 'purchaseUnit'
        },{
            title : '库存数量',
            width: 100,
            dataIndex : 'xcsl'
        },{
            title : '采购价格',
            dataIndex : 'purchasePrice',
            width: 100,
            render: (text, record)=>{
                return (text === 'undefined' || !text) ? Number('0.00') : Number(text).toFixed(2)
            }
        },{
            title : '金额',
            dataIndex : 'zje',
            render: (text, record)=>{
                return (text === 'undefined' || !text) ? Number('0.00') : Number(text).toFixed(2)
            }
        },{
            title : '供应商',
            dataIndex : 'fOrgName'
        },{
            title : '生产商',
            dataIndex : 'produceName'
        }];
        return (
        <div>
            {
                this.props.children ||
                <div>
                    <SearchBox 
                        query={this.queryHandler} 
                        defaultQuery={(query)=>this.defaultQuery(query)}
                    />
                    <Row>
                        <Col>
                            <Button type='primary' onClick={this.createForm}>生成报表</Button>
                        </Col>
                    </Row>
                    {
                        this.state.query === '' ? null :
                        <FetchTable
                            query={this.state.query}
                            url={finance.FINDSTOCKGATHER}
                            columns={columns}
                            rowKey={'guid'}
                            ref={'table'}
                            size={'small'}
                            scroll={{x:'180%'}}
                        />
                    }
                </div>
            }
        </div>
    )
    }
}
module.exports = StockGather;