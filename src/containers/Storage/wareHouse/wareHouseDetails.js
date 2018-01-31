/**
 * 入库明细
 */
import React from 'react';
import { Form, Row, Col, Input, DatePicker,Button,Select } from 'antd';
import FetchTable from 'component/FetchTable';
import {fetchData } from 'utils/tools';
import { storage } from 'api';  

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class SearchForm extends React.Component{
    state={
        fOrgOptions:[],
        storageOptions: []
    }
    componentDidMount = () => {
         //库房列表
        fetchData(storage.FINDSTORAGEBYMYUSER,{},(data)=>{
             this.setState({ storageOptions : data.result})
        })
        //供应商列表
        fetchData(storage.FINDSUPPLIERLISTBYORGID,{},(data)=>{
            this.setState({ fOrgOptions : data.result})
       })
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const inDateTime = values.inDateTime === undefined ? "":values.inDateTime;
            if(inDateTime.length>0) {
                values.inDateStart = inDateTime[0].format('YYYY-MM-DD');
                values.inDateEnd = inDateTime[1].format('YYYY-MM-DD');
            }
            console.log(values,"搜索数据")
            this.props.query(values); 
       });
    }
    //重置
    handleReset = () => {
        this.props.form.resetFields();
        this.props.query({});
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 },
        };
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row>
                 <Col span={8} key={1}>
                    <FormItem {...formItemLayout} label={'入库时间'}>
                        {getFieldDecorator('inDateTime')(
                            <RangePicker showTime format="YYYY-MM-DD" style={{width:"100%"}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={2}>
                    <FormItem {...formItemLayout} label={'库房'}>
                        {getFieldDecorator('storageGuid',{
                            initialValue: ""
                        })(
                            <Select placeholder={'请选择'}>
                                <Option value="" key={-1}>全部</Option>
                                {
                                    this.state.storageOptions.map((item,index) => {
                                    return <Option key={index} value={item.value}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
           
                 <Col span={8} key={3}>
                    <FormItem {...formItemLayout} label={'供应商'}>
                        {getFieldDecorator('fOrgId',{
                            initialValue:""
                        })(
                            <Select placeholder={'请选择'}>
                                <Option value="" key={-1}>全部</Option>
                                {
                                    this.state.fOrgOptions.map((item,index) => {
                                    return <Option key={index} value={item.value.toString()}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
               
                <Col span={8} key={4}>
                    <FormItem {...formItemLayout} label={'单号/名称'}>
                        {getFieldDecorator('searchName')(
                             <Input placeholder="请输入库单号/产品名称/通用名称"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={4} key={5} style={{textAlign:'right'}}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                        清除
                    </Button>
                </Col>
              </Row>
            </Form>
        )
    
    }
}
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

class WareHouseDetails extends React.Component{
    state = {
        query:{}
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    render(){
        const columns = [{
            title : '入库单',
            dataIndex : 'InNo',
            width: 180,
           
        },{
            title : '二维码',
            dataIndex : 'qrCode',
            width: 120,
        },{
            title : '产品名称',
            dataIndex : 'materialName',
            width: 200,
        },{
            title : '通用名称',
            dataIndex : 'geName',
            width: 200,
        },{
            title : '型号',
            dataIndex : 'fModel',
            width: 120,
        },{
            title : '规格',
            dataIndex : 'Spec',
            width: 150
        },{
            title : '采购单位',
            dataIndex : 'purchaseUnit',
            width: 100
        },{
            title : '数量',
            dataIndex : 'rksl',
            width: 100
        },{
            title : '生产批号',
            dataIndex : 'flot',
            width: 120
        },{
            title : '有效期',
            dataIndex : 'usefulDate',
            width: 180
        },{
            title : '采购价格',
            dataIndex : 'purchasePrice',
            width: 120
        },{
            title : '金额',
            dataIndex : 'money',
            width: 120
        },{
            title : '供应商',
            dataIndex : 'forgName',
            width: 200
        },{
            title : '生产商',
            dataIndex : 'produceName',
            width: 200
        },{
            title : '入库时间',
            dataIndex : 'inDate',
            width: 180
        }];
        const query = this.state.query;
        return(
            <div>
                { this.props.children || 
                <div>
                    <SearchBox query={this.queryHandler}/>
                    <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={storage.WAREHOUSEDETAILLIST}
                        rowKey='ImportDerailGuid'
                        scroll={{ x: '180%' }}
                    />
                </div>
                }
            </div>
        )
    }
}
module.exports = WareHouseDetails;