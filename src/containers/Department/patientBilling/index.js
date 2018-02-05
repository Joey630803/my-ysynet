/**
 * @file 患者计费
 */
 import React from 'react';
 import { Form, Row, Col, Input, Button, Select, DatePicker} from 'antd';
 import querystring from 'querystring';
 import FetchTable from 'component/FetchTable';
 import { actionHandler, fetchData } from 'utils/tools';
 import { hashHistory } from 'react-router';
 import { department } from 'api';
 const FormItem = Form.Item;
 const RangePicker = DatePicker.RangePicker;
 const Option = Select.Option;

 class SearchForm extends React.Component{
     state = {
         deptOptions: [],
     }
     componentDidMount = ()=>{
        fetchData(department.FINDDEPTSTORAGEBYUSER,{},(data)=>{
            this.setState({deptOptions : data });
        });
     }
     handleSearch = (e)=>{
         e.preventDefault();
         this.props.form.validateFields((err,values)=>{
             if(!err){
                 const chargeTime = values.chargeTime === undefined ? "" : values.chargeTime;
                 if(chargeTime.length > 0){
                     values.chargeStartTime = chargeTime[0].format('YYYY-MM-DD');
                     values.chargeEndTime = chargeTime[1].format('YYYY-MM-DD');
                 }
                 console.log("查询条件",values);
                 this.props.query(values);
             }
         })
     }
     handReset = ()=>{
         this.props.form.resetFields();
         this.props.query({});
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
                    <Col span={6} key={1}>
                        <FormItem {...formItemLayout} label={'计费科室'}>
                            {
                                getFieldDecorator('chargeDeptGuid',{
                                    initialValue:''
                                })(
                                    <Select
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option key={-1} value=''>全部</Option>
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
                    <Col span={6} key={2}>
                        <FormItem {...formItemLayout} label={'清单类型'}>
                            {
                                getFieldDecorator('chargeType',{
                                    initialValue:''
                                })(
                                    <Select>
                                        <Option key={-1} value=''>全部</Option>
                                        <Option key={1} value='00'>手术计费</Option>
                                        <Option key={2} value='01'>高值计费</Option>
                                    </Select>
                                )
                            }
                        </FormItem>   
                    </Col>
                    <Col span={6} key={3}>
                        <FormItem {...formItemLayout} label={'计费清单状态'}>
                            {
                                getFieldDecorator('chargeFstate',{
                                    initialValue:''
                                })(
                                    <Select>
                                        <Option key={-1} value=''>全部</Option>
                                        <Option key={1} value='01'>已计费</Option>
                                        <Option key={2} value='02'>已退费</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={4}>
                        <FormItem {...formItemLayout} label={'计费时间'}>
                            {
                                getFieldDecorator('chargeTime')(
                                    <RangePicker format="YYYY-MM-DD" style={{width:'100%'}}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={5}>
                        <FormItem {...formItemLayout} label={`其他`}>
                            {
                                getFieldDecorator('searchName')(
                                    <Input placeholder='计费清单号/就诊号/患者姓名/送货单号'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={18} key={6} style={{textAlign:'right'}}>
                        <Button type="primary" htmlType="submit">搜索</Button>
                        <Button type='primary' style={{marginLeft:8}} onClick={this.handReset}>清空</Button>
                    </Col>
                </Row>
            </Form>
         )
     }
 }
 const SearchBox = Form.create()(SearchForm);
 const actions = {
     details: (action)=> <a onClick={(action)}>查看</a>,
     refund : (action)=> <a onClick={(action)}>退费</a>,
     reCharging : (action)=> <a onClick={(action)}>补计费</a>,
 }
 class PatientBill extends React.Component{
     state = {
         dataSource: [],
         query:{

         }
     }
     queryHandle = (query) =>{
         this.refs.table.fetch(query);
         this.setState({ query });
     }
     getActions = (text,record)=>{
         //手术 && 已计费
        if(record.chargeFstate ==='01' && record.chargeType==='00'){
            return <span>
                        {actions.details(this.details.bind(this,record))}
                        <span className="ant-divider" />
                        {actions.refund(this.refund.bind(this,record))}
                  </span>
         //手术 && 已退费
        }else if(record.chargeFstate ==='02' && record.chargeType==='00'){
            return <span>
                        {actions.details(this.details.bind(this,record))}
                 </span>
        //高值 && 已计费
        }else if(record.chargeFstate === '01' && record.chargeType === '01'){
            return <span>
                        {actions.details(this.details.bind(this,record))}
                        <span className="ant-divider" />
                        {actions.reCharging(this.reCharging.bind(this,record))}
                        <span className="ant-divider" />
                        {actions.refund(this.refund.bind(this,record))}
                    </span>
        //高值 && 已退费
        }else if(record.chargeFstate === '02' && record.chargeType === '01'){
            return  <span>
                        {actions.details(this.details.bind(this,record))}
                        <span className="ant-divider" />
                        {actions.reCharging(this.reCharging.bind(this,record))}
                    </span>
        }
     }
     redirect = (url, record) => {
        hashHistory.push({
            pathname: url,
            state: record
        })
     }
     details = (record)=>{
         if(record.chargeType === '00'){
             this.redirect('/department/patientBilling/operDetail',record);
         }else{
            this.redirect('/department/patientBilling/highDetail',record);
         }
     }
     //退费
     refund = (record)=>{
        if(record.chargeType === '00'){
            this.redirect('/department/patientBilling/operRefund',record);
        }else{
            this.redirect('/department/patientBilling/highRefund',record);
        }
     }
     //补计费
     reCharging = (record)=>{
        this.redirect('/department/patientBilling/recharge',record);
     }
    render() {
        const columns = [{
            title: '操作',
            dataIndex: 'actions',
            width: 140,
            fixed: 'left',
            render: (text, record)=>{
                return this.getActions(text,record)
            }
        },{
            title: '状态',
            dataIndex: 'chargeFstate',
            render:( text, record )=>{
                if( text ==='00'){
                    return '待计费'
                }else if( text === '01'){
                    return '已计费'
                }else if( text === '02'){
                    return '已退费'
                }else if( text === '08'){
                    return '计费失败'
                }else if( text === '09'){
                    return '退费失败'
                }
            }
        },{
            title: '计费清单号',
            dataIndex: 'chargeNo'
        },{
            title: '清单类型',
            dataIndex: 'chargeType',
            render: (text, record)=>{
                if(text==='00'){
                    return '手术计费'
                }else if(text === '01'){
                    return '高值计费'
                }
            }
        },{
            title: '就诊号',
            dataIndex: 'treatmentNo'
        },{
            title: '手术名称',
            dataIndex: 'operName'
        },{
            title: '患者姓名',
            dataIndex: 'name'
        },{
            title: '计费科室',
            dataIndex: 'deptName'
        },{
            title: '计费人',
            dataIndex: 'chargeUserName'
        },{
            title: '计费时间',
            dataIndex: 'chargeTime'
        },{
            title: '送货单号',
            dataIndex: 'sendNo'
        }];
        const query = this.state.query;
        const exportHref = department.EXPORTCHARGEINFO+"?"+querystring.stringify(query);
        return (
            <div>
                {
                    this.props.children || 
                    <div>
                        <SearchBox query={(query) => this.queryHandle(query)}/>
                        <Row>
                            <Col span={24}>
                                <Button type='primary' onClick={actionHandler.bind(null,this.props.router,`/department/patientBilling/billing`,{})}>计费</Button>
                                <a href={exportHref}><Button type='primary' ghost style={{marginLeft:8}}>导出</Button></a>
                            </Col>
                        </Row>
                        <FetchTable 
                            style={{marginTop:12}}
                            query={query}
                            columns={columns}
                            url={department.FINDCHARGEINFO}
                            rowKey={'chargeGuid'}
                            ref='table'
                            size={'small'}
                            scroll={{x:'150%'}}
                        />
                    </div>
                }
            </div>
        )
    }
 }
 module.exports = PatientBill;