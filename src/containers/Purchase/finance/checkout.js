/**
 * 结账
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Select,Breadcrumb,Modal,message } from 'antd';
import FetchTable from 'component/FetchTable';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { Link } from 'react-router';
import { purchase }  from 'api';
const Option = Select.Option;
const FormItem = Form.Item;


class SearchForm extends React.Component {
    state = {
        storageOptions: [],
        OrgOptions: [],
    }
    componentDidMount = () => {
        //库房
        fetchData(purchase.STORAGE_LIST,{},data => {   
            if (data.result.length > 0) {
                this.setState({storageOptions:data.result});
                this.props.defaultQuery({storageGuid: data.result[0].value})
                this.handleTotal({storageGuid : data.result[0].value});
            }
        });
         //供应商
        fetchData(purchase.FINDORGLISTFORSELECT,{},data => {this.setState({OrgOptions:data})});
    }

    //获取总金额
    handleTotal = (values) => {
        //总金额
        fetchData(purchase.SELECTINVOICEDETAILACCT,querystring.stringify(values),data => {   
            this.props.defaultTotal(data.result.fieldName[0],data.result.fieldName[1])
        })
    }
        

    //查询
    search = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('查询条件: ', values)
            this.handleTotal(values);
            this.props.query(values);
        })

    }
    //重置
    reset = () => {
        this.props.form.resetFields();
        const storageGuid = this.state.storageOptions.length > 0 ? this.state.storageOptions[0].value : null;
        this.handleTotal({storageGuid: storageGuid});
        this.props.query({storageGuid : storageGuid});
    }

    handleChange =(value) =>{
        this.props.query({storageGuid:value});
        this.handleTotal({storageGuid:value});
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
                    {getFieldDecorator(`storageGuid`, {
                        initialValue: this.state.storageOptions.length > 0 
                        ? this.state.storageOptions[0].value : null
                    })(
                     <Select onChange={this.handleChange}>
                        {
                            this.state.storageOptions.map((item,index)=>
                                <Option key={index} value={item.value}>{item.text}</Option>
                            )
                        }
                    </Select>
                    )}
                    </FormItem>
                </Col>
                <Col span={6} key={2}>
                    <FormItem {...formItemLayout} label={`供应商`}>
                    {getFieldDecorator(`fOrgId`,{

                    })(
                        <Select>
                            <Option  key={-1} value=''>全部</Option>
                            {
                                this.state.OrgOptions.map((item,index)=>
                                    <Option key={index} value={item.value}>{item.text}</Option>
                                )
                            }
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
        query: '',
        visible: false,
        loading: false,
        monthData: [],
        acctYh:'',
        totalMoney:'0.00',
        untotalMoney : '0.00'
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
    defaultTotal = (total,untotal) =>{
        this.setState({totalMoney : total,untotalMoney: untotal})
    }

    showModal = ()=>{
        //月份
		fetchData(purchase.SELECTINVOICEMONTH,querystring.stringify({storageGuid:this.state.query.storageGuid}),data => {
            if(data.result.length>0){
                this.setState({monthData:data.result});
                this.setState({visible:true});
            }else{
                if(!data.status){
                    message.error(data.msg);
                 }
            }
		});
    }
    handleModalChange = (value) =>{
        this.setState({acctYh : value})
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    handleOk = () =>{
       if(this.state.acctYh === ""){
           return message.info("请选择结账月份!")
       }else{
            fetchData(purchase.INVOICESETTLEACCOUNT,querystring.stringify({storageGuid:this.state.query.storageGuid,acctYh:this.state.acctYh}),data => {
                if(data.status){
                    message.success("操作成功!")
                    this.setState({ loading: true });
                    this.setState({visible:false})
                }else{
                    message.error(data.msg)
                }
		    });
       }
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
                console.log(this.state.monthData,"monthdata")
        return (
            
            <div>
                { this.props.children 
                ||  
                <div>
                    <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                        <Breadcrumb.Item><Link to='/purchase/finance'>财务结账</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>结账</Breadcrumb.Item>
                    </Breadcrumb>
                    <WrappedSearchForm  
                    query={(query) => this.search(query)}
                    defaultQuery={(query) => this.defaultQuery(query)}
                    defaultTotal={(total,untotal)=>this.defaultTotal(total,untotal)}
                    />
                    <div>
                        <Button type="primary" onClick={this.showModal}>确认结账</Button>
                    </div>
                    {
                    this.state.query === '' ? null :
                    <FetchTable 
                        query={this.state.query}
                        ref='table'
                        rowKey={'invoiceId'}
                        url={purchase.SELECTINVOICEDETAILACCT}
                        columns={columns} 
                        scroll={{ x: '100%' }}
                        footer={()=>{
                            return <span>合计金额:{this.state.totalMoney}</span>
                        }}
                    />
                    }
                    <Modal
                    visible={this.state.visible}
                    title="请选择结账月份"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                    <Button key="back" size="large"  onClick={this.handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                        提交
                    </Button>
                    ]}
                    >
                    <Select placeholder="请选择月份" style={{ width: 120 }} onChange={this.handleModalChange}>
                        {
                            this.state.monthData.map((item,index)=>
                                <Option key={index} value={item.value}>{item.text}</Option>
                            )
                        }
                 </Select>
                 <p>结账采购总金额<span style={{color:'#108ee9',fontSize:16}}>{this.state.untotalMoney}</span>元,结账后不可撤销，是否继续? </p>
               </Modal>
                </div>
                 }

            </div>
        )
    }
}

module.exports = MyInvoice;

