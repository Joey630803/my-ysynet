/**
 * 财务结算详情
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Select,Breadcrumb } from 'antd';
import FetchTable from 'component/FetchTable';
import { Link } from 'react-router';
import { purchase }  from 'api';
const Option = Select.Option;
const FormItem = Form.Item;


class SearchForm extends React.Component {
    state = {
        OrgOptions: [],
    }
    componentDidMount = () => {
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
                    <FormItem {...formItemLayout} label={`发票号码`}>
                    {getFieldDecorator(`invoiceNo`)(
                        <Input/>
                    )}
                    </FormItem>
                </Col>

                <Col span={6} key={2}>
                    <FormItem {...formItemLayout} label={`发票代码`}>
                    {getFieldDecorator(`invoiceCode`)(
                        <Input/>
                    )}
                    </FormItem>
                </Col>
                <Col span={6} key={3}>
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
            </Row>
            <Row>

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

class FinanceShow extends React.Component{
    state = {
        query: {
            acctYh: this.props.location.state.acctYh
        }
    }
    search = (query) => {
        query.acctYh = this.props.location.state.acctYh;
        this.refs.table.fetch(query);
        this.setState({
            query: query
        })
    }
    render(){
        const columns = [{
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
                    title : '供应商',
                    dataIndex : 'fOrgName'
                },{
                    title : '结账金额',
                    dataIndex : 'money',
                }];
        return (
            
            <div>
                { this.props.children 
                ||  
                <div>
                     <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                        <Breadcrumb.Item><Link to='/purchase/finance'>财务结账</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>详情</Breadcrumb.Item>
                    </Breadcrumb>
                    <WrappedSearchForm  
                    query={(query) => this.search(query)}

                    />
    
                    <FetchTable 
                        query={this.state.query}
                        ref='table'
                        rowKey={'invoiceId'}
                        url={purchase.SELECTINVOICEDETAILBYMONTH}
                        columns={columns} 
                        scroll={{ x: '100%' }}
                    />
                </div>
                 }
            </div>
        )
    }
}

module.exports = FinanceShow;

