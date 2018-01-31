/**
 * @file 使用登记
 */
 import React from 'react';
 import { Form, Row, Col, Input, Button, Select, DatePicker, Popconfirm, message} from 'antd';
 import querystring from 'querystring';
 import FetchTable from 'component/FetchTable';
 import { actionHandler, fetchData, CommonData } from 'utils/tools';
 import { hashHistory } from 'react-router';  
 import { department } from 'api';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class UseSearchForm extends React.Component{
    state = { 
        deptOptions : [],
        fstateOptions: [],
    }
    componentDidMount = ()=>{
        CommonData('CHARGE_FSTATE',(data)=>{
            this.setState({fstateOptions:data})
        })
        fetchData(department.FINDDEPTSTORAGEBYUSER,{},(data)=>{
            this.setState({deptOptions : data });
        });

    }
    handleSearch = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {  
        const registerTime = values.registerTime === undefined ? "" : values.registerTime;
        if(registerTime.length>0) {
            values.createTimeStart = registerTime[0].format('YYYY-MM-DD');
            values.createTimeEnd = registerTime[1].format('YYYY-MM-DD');
        }
        console.log("查询条件",values);
        this.props.query(values);
      });
    }
    handReset = ()=>{
        this.props.form.resetFields();
        this.props.query({});
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row>
                    <Col span={4} key={1}>
                        <FormItem {...formItemLayout} label={'登记科室'}>
                            {
                                getFieldDecorator('deptGuid',{
                                    initialValue:''
                               })(
                                   <Select 
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                   >
                                    <Option  key={-1} value=''>全部</Option>
                                       {
                                            this.state.deptOptions.map( (item, index) => {
                                            return <Option key={index} value={item.value} children={item.children}>{item.label}</Option>
                                          })
                                       }
                                   </Select>
                               )
                            }
                        </FormItem>
                    </Col>
                    <Col span={5} key={2}>
                        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label={'使用清单状态'}>
                            {
                                getFieldDecorator('chargeFstate',{
                                    initialValue:""
                               })(
                                   <Select>
                                    <Option value="">全部</Option>
                                       {
                                           this.state.fstateOptions.map((item,index) => {
                                               return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                                           })
                                       }
                                   </Select>
                               )
                            }
                        </FormItem>
                    </Col>
                    <Col span={5} key={3}>
                        <FormItem {...formItemLayout} label={'登记时间'}>
                            {
                                getFieldDecorator('registerTime')(
                                   <RangePicker format="YYYY-MM-DD" style={{width:'100%'}}/>
                               )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} key={4} style={{marginLeft:20}}>
                        <FormItem>
                            {
                                getFieldDecorator('searchName',{
                                    initialValue:""
                               })(
                                   <Input placeholder='使用清单号/就诊号/供应商/患者姓名/送货单号'/>
                               )
                            }
                        </FormItem>
                    </Col>
                    <Col span={3} key={5} style={{textAlign:'right'}}>
                        <Button type="primary" htmlType="submit">搜索</Button>
                        <Button type='primary' style={{marginLeft:8}} onClick={this.handReset}>清空</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const SearchBox = Form.create()(UseSearchForm);
const actions = {
    details : (action) => <a onClick={action}>查看</a>,
    edit : (action) => <a onClick={action}>编辑</a>,
    delete: (action) => <Popconfirm title="是否删除?" onConfirm={action}>
                            <a>删除</a>
                        </Popconfirm>,
    register: (action) => <a onClick={action}>重新登记</a>
}
class UseRegister extends React.Component{
    state = {
        query : {

        },
    }
    queryHandle = (query) =>{
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    
    getActions = (text, record, index)=>{
        switch(record.chargeFstate){
            //待计费
            case '00': 
                return <span>
                            {actions.details(this.details.bind(this, record))}
                            <span className="ant-divider" />
                            {actions.edit(this.edit.bind(this, record))}
                            <span className="ant-divider" />
                            {actions.delete(this.delete.bind(this, record))}
                        </span>
            //已计费
            case '01':
                return  <span>
                            {actions.details(this.details.bind(this, record))}
                        </span>
            //已退费
            case '02':
                return <span>
                            {actions.details(this.details.bind(this, record))}
                            <span className="ant-divider" />
                            {actions.register(this.register.bind(this, record))}
                        </span>
            default:
                break;
        }
    }
    redirect = (url, record) => {
        hashHistory.push({
            pathname: url,
            state: record
        })
    }
    //查看详情
    details = (record)=>{
        this.redirect('/department/useRegister/details',record)
    }
    //编辑
    edit = (record)=>{
        this.redirect('/department/useRegister/edit',record)
    }
    //删除
    delete = (record)=>{
        fetchData(department.DELETEUSEREGISTERBYID,querystring.stringify({chargeGuid:record.chargeGuid}),(data)=>{
            if(data.status){
                message.success('删除成功！');
                this.refs.table.fetch();
            }else{
                message.error(data.msg);
            }
        })
    }
    //重新登记
    register = (record)=>{
        this.redirect('/department/useRegister/register',record);
    }
    render() {
        const columns = [{
            title: '操作',
            dataIndex: 'actions',
            width: 130,
            fixed: 'left',
            render: (text,record,index)=>{
               return this.getActions(text, record, index);
            }
        },{
            title:'状态',
            dataIndex: 'chargeFstate',
            render:(text,record,index)=>{
                if(record.chargeFstate ==='00'){
                    return '待计费'
                }else if( record.chargeFstate === '01'){
                    return '已计费'
                }else if( record.chargeFstate === '02'){
                    return '已退费'
                }else if( record.chargeFstate === '08'){
                    return '计费失败'
                }else if( record.chargeFstate === '09'){
                    return '退费失败'
                }
            }
        },{
            title:'使用清单号',
            dataIndex: 'chargeNo'
        },{
            title:'就诊号',
            dataIndex: 'treatmentNo'
        },{
            title:'手术名称',
            dataIndex: 'operName'
        },{
            title:'患者姓名',
            dataIndex: 'hzName'
        },{
            title:'申请科室',
            dataIndex: 'sqDeptName'
        },{
            title:'供应商',
            dataIndex: 'fOrgName'
        },{
            title:'登记科室',
            dataIndex: 'deptName'
        },{
            title:'登记人',
            dataIndex: 'reateUserName'
        },{
            title:'登记时间',
            dataIndex: 'createTime'
        },{
            title:'送货单号',
            dataIndex: 'sendNo'
        }];
        const query = this.state.query;
        const exportHref = department.EXPORTUSEREGISTERLIST+"?"+querystring.stringify(query);
        return (
            this.props.children || 
            <div>
                <SearchBox query={(query) => this.queryHandle(query)}/>
                <Row>
                    <Col>
                        <Button type='primary' onClick={actionHandler.bind(null,this.props.router,`/department/useRegister/register`,{})}>登记</Button>
                        <a href={exportHref}><Button type='primary' ghost style={{marginLeft:8}}>导出</Button></a>
                    </Col>
                </Row>
                <FetchTable 
                    style={{marginTop:12}}
                    columns={columns}
                    url={department.SELECRUSEREGISTER}
                    rowKey={'chargeGuid'}
                    query={query}
                    size={'small'}
                    ref='table'
                    scroll={{ x: '140%' }}
                />
            </div>
            
        )
    }
}
module.exports = UseRegister;