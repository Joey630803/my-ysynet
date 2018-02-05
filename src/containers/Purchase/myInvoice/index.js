/**
 * 我的发票
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker,Icon } from 'antd';
import FetchTable from 'component/FetchTable';
import querystring from 'querystring';
import { actionHandler } from 'utils/tools';
import { purchase }  from 'api';
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;


class SearchForm extends React.Component {
    state = {
        storageOptions: [],
        OrgOptions: [],
    }
    componentDidMount = () => {
        //库房
       fetch(purchase.FINDSTORAGEBYUSER, {
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
        if (data.result.length > 0) {
            this.props.defaultQuery({rStorageGuid: data.result[0].value})
        }
        })
        .catch(e => console.log("Oops, error", e))
        //供应商
        fetch(purchase.FINDORGLISTFORSELECT, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
            'Content-Type':'application/json'
        }
        })
        .then(res => res.json())
        .then(data => {
            this.setState({OrgOptions: data})
        })
        .catch(e => console.log("Oops, error", e))
    }
    //查询
    search = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const startInvoice = values.startInvoice === undefined ? "":values.startInvoice;
            const createTime = values.createTime === undefined ? "" : values.createTime;
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
        this.props.query({rStorageGuid : this.state.storageOptions.length > 0 ? this.state.storageOptions[0].value : null})
    }
  render = () => {
        const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        };
        const { getFieldDecorator } = this.props.form;
        //库房
        const storageOptions = () => {
            let options = [];
            let storageOptions =this.state.storageOptions;
            storageOptions.forEach((item) => {
                options.push(<Option key={item.value} value={item.value}>{item.text}</Option>)
            })
            return options;
        }
        //供应商
        const OrgOptions = () => {
            let options = [];
            let OrgOptions =this.state.OrgOptions;
            OrgOptions.forEach((item) => {
                options.push(<Option key={item.value} value={item.value.toString()}>{item.text}</Option>)
            })
            return options;
        }
        

        return (
        <Form
            className="ant-advanced-search-form"
            onSubmit={this.search}
        >
            <Row>
                <Col span={6} key={1}>
                    <FormItem  {...formItemLayout} label={`库房`}>
                    {getFieldDecorator(`rStorageGuid`, {
                        initialValue: this.state.storageOptions.length > 0 
                                    ? this.state.storageOptions[0].value : null
                    })(
                        <Select
                        >
                        {
                            storageOptions()
                        }
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col span={6} key={2}>
                    <FormItem {...formItemLayout} label={`供应商`}>
                    {getFieldDecorator(`fOrgId`,{

                    })(
                        <Select
                        placeholder='请选择'
                        >
                        {
                             OrgOptions()
                        }
                       
                        </Select>
                    )}
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
                    <FormItem {...formItemLayout} label={`单号`}>
                    {getFieldDecorator(`sendNo`)(
                        <Input placeholder="请输入入库单号/送货单号"/>
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
    defaultQuery = (query) => {
        this.setState({
        query: query
        })
    }

    render(){
        const columns = [{
                title: '操作',
                key: 'action',
                fixed: 'left',
                width: 60,
                render: (text,record,index) => {
                    return (
                          <a onClick={
                            actionHandler.bind(
                            null, this.props.router,record.generalFlag === "01" ? `/purchase/myInvoice/zwShow` :`/purchase/myInvoice/show`, {...record}
                            )}>
                            {`查看`}
                         </a>
                         
                    )
                }},{
                    title : '状态',
                    dataIndex : 'fstate',
                    fixed: 'left',
                    width: 100,
                    render: (text,record,index) => {
                        if(text === '0'){
                            return "待验收"
                        }
                        else if(text === '1'){
                            return "通过"
                        }else if(text === '9' ){
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
                    title : '制单时间',
                    dataIndex : 'createTime'
                }];
                const exportHref = purchase.EXPORTINVOICELIST+"?"+querystring.stringify(this.state.query);
        return (
            
            <div>
                { this.props.children 
                ||  
                <div>
                    <WrappedSearchForm  
                    defaultQuery={(query) => this.defaultQuery(query)}
                    query={(query) => this.search(query)}
                    />
                    <div>
                        <a  href={exportHref}><Icon type="export" />导出Excel</a>   
                    </div>  
                    {
                    this.state.query === '' ? null :

                    <FetchTable 
                        query={this.state.query}
                        ref='table'
                        rowKey={'invoiceId'}
                        url={purchase.FINDMYINVOICELIST}
                        columns={columns} 
                        scroll={{ x: '120%' }}
                    />
                    }
                </div>
                 }
            </div>
        )
    }
}

module.exports = MyInvoice;

