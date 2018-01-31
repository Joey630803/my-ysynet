/**
 * 我的发票
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker,Icon } from 'antd';
import FetchTable from 'component/FetchTable';
import querystring from 'querystring';
import { actionHandler} from 'utils/tools';
import { sales } from 'api'
import FetchSelect from 'component/FetchSelect';
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;


class SearchForm extends React.Component {
    state = {
        storageOptions: [],
        rOrgId:''
    }
    componentDidMount = () => {
       fetch(sales.FINDSTORAGEBYUSER, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
            'Content-Type':'application/json'
        }
        })
        .then(res => res.json())
        .then(data => {
        this.setState({storageOptions: data.result})
        })
        .catch(e => console.log("Oops, error", e))
    }
    //查询
    search = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const startInvoice = values.startInvoice === undefined ? "":values.startInvoice;
            const createTime = values.createTime === undefined ? "" : values.createTime;
            values.rOrgId = this.state.rOrgId;
            if(startInvoice.length>0) {
                values.startInvoiceDate = startInvoice[0].format('YYYY-MM-DD');
                values.endInvoiceDate = startInvoice[1].format('YYYY-MM-DD');
            }
            if(createTime.length>0) {
                values.startTime = createTime[0].format('YYYY-MM-DD');
                values.endTime = createTime[1].format('YYYY-MM-DD');
            }
            console.log('查询条件: ', values)
            this.props.query(values);
        })
    }
    //重置
    reset = () => { 
        this.props.form.resetFields();
        this.props.query({})
    }
  render = () => {
        const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        };
        const { getFieldDecorator } = this.props.form;
        return (
        <Form
            className="ant-advanced-search-form"
            onSubmit={this.search}
        >
             <Row>
                <Col span={6} key={1}>
                    <FormItem  {...formItemLayout} label={`库房`}>
                    {getFieldDecorator(`fStorageGuid`)(
                        <Select
                        placeholder="请选择"
                        allowClear={true}
                        >
                        {
                            this.state.storageOptions.map(
                            (item, index) => <Option key={index} value={item.value}>{item.text}</Option>)
                        }
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col span={6} key={2}>
                    <FormItem {...formItemLayout} label={`医疗机构`}>
                        <FetchSelect allowClear={true}  placeholder="请输入" style={{width:200}} ref='fetchs' url={sales.FINDORGLISTFORSELECT} 
                            cb={(value) => this.setState({rOrgId: value,disabled:false})}/>
                    </FormItem>
                </Col>
                <Col span={6} key={3}>
                    <FormItem {...formItemLayout} label={`状态`}>
                    {getFieldDecorator(`fstate`,{
                           initialValue:' ',
                    })(
                        <Select
                        placeholder="请选择"
                        >
                            <Option value=" ">全部</Option>
                            <Option value="0">待验收</Option>
                            <Option value="1">通过</Option>
                            <Option value="9">不通过</Option>
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col span={6} key={4}>
                    <FormItem {...formItemLayout} label={`发票号码`}>
                    {getFieldDecorator(`invoiceNo`)(
                        <Input/>
                    )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={6} key={5}>
                    <FormItem {...formItemLayout} label={`开票日期`}>
                    {getFieldDecorator(`startInvoice`)(
                        <RangePicker />
                    )}
                    </FormItem>
                </Col>
                    <Col span={6} key={6}>
                    <FormItem {...formItemLayout} label={`制单时间`}>
                    {getFieldDecorator(`createTime`)(
                        <RangePicker />
                    )}
                    </FormItem>
                </Col>
                <Col span={6} key={7}>
                    <FormItem {...formItemLayout} label={`送货单号`}>
                    {getFieldDecorator(`sendNo`)(
                        <Input/>
                    )}
                    </FormItem>
                </Col>
                <Col span={6} key={8}>
                    <FormItem {...formItemLayout} label={`发票代码`}>
                    {getFieldDecorator(`invoiceCode`)(
                        <Input/>
                    )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={24} key={9} style={{textAlign: 'right'}}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.reset}>
                    清空
                    </Button>
                </Col>
            </Row>
        </Form>
        )
    }
}

const WrappedSearchForm = Form.create()(SearchForm);

class MyInvoice extends React.Component{
    state = {
        query: ''
    }
    search = (query) => {
        this.refs.table.fetch(query);
        this.setState({
        query: query
        })
    }

    render(){
        const columns = [{
                title: '操作',
                key: 'action',
                fixed: 'left',
                width: 120,
                render: (text,record,index) => {
                    return (
                         
                        <span>
                           <a onClick={
                            actionHandler.bind(
                            null, this.props.router, `/sales/salesMyInvoice/show` , {...record}
                            )}>
                            {`查看`}
                           </a>
                          {record.fstate !== "1" ? 
                           <span>
                                <span className="ant-divider"></span>
                                 <a onClick={
                                    actionHandler.bind(
                                    null, this.props.router, `/sales/salesMyInvoice/edit` , {...record}
                                    )}>
                                    {`编辑`}
                                </a>
                           </span>
                            :
                            null
                            }
                        </span>
                    )
                }},{
                    title : '状态',
                    dataIndex : 'fstate',
                    fixed: 'left',
                    width: 150,
                    render: (text,record,index) => {
                        if(text === "0"){
                            return "待验收"
                        }else if(text === "1"){
                            return "通过"
                        }else if(text === "9"){
                            return "不通过"
                        }
                    }
                },{
                    title : '发票代码',
                    dataIndex : 'invoiceCode',
                    fixed: 'left',
                    width: 150
                },{
                    title : '发票号码',
                    dataIndex : 'invoiceNo',
                    fixed: 'left',
                    width: 150
                },{
                    title : '发票金额',
                    dataIndex : 'accountPayed',
                    render: (text,record,index) => {
                    return text === 'undefined' ? '0.00' : text.toFixed(2)
                }
                },{
                    title : '开票日期',
                    dataIndex : 'invoiceDate'
                },{
                    title : '供应商',
                    dataIndex : 'fOrgName'
                },{
                    title : '医疗机构',
                    dataIndex : 'rOrgName'
                },{
                    title : '制单人',
                    dataIndex : 'createUserName'
                },{
                    title : '制单时间',
                    dataIndex : 'createTime'
                }];
            const exportHref = sales.EXPORTINVOICELIST+"?"+querystring.stringify(this.state.query);
        return (
            
            <div>
                { this.props.children 
                ||  
                <div>
                    <WrappedSearchForm  
                    query={(query) => this.search(query)}
                    />
                    <div>
                         <a  href={exportHref}><Icon type="export" />导出Excel</a>  
                    </div>
                    <FetchTable 
                        query={this.state.query}
                        ref='table'
                        rowKey={'invoiceId'}
                        url={sales.FINDMYINVOICELIST}
                        columns={columns} 
                        scroll={{ x: '120%' }}
                    />
                </div>
                 }
            </div>
        )
    }
}

module.exports = MyInvoice;

