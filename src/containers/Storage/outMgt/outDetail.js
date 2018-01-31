/**
 * @file 出库明细
 */
import React from 'react';
import { Form, Row, Col, Input, DatePicker,Button,Select, message } from 'antd';
import FetchTable from 'component/FetchTable';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { storage } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class SearchForm extends React.Component{
    state={
        storageOptions: [],
        fOrgOptions: [],
    }
    componentDidMount = () =>{
        //库房
        fetchData(storage.FINDSTORAGEBYMYUSER,{},(data)=>{
            if(data.status){
                this.setState({ storageOptions:data.result });
            }else{
                message.error('后台异常！');
            }
        });
         //供应商列表
         fetchData(storage.FINDSUPPLIERLISTBYORGID,{},(data)=>{
            this.setState({ fOrgOptions : data.result})
        })
    }
    handleSearch = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const outTime = values.outTime === undefined ? "" : values.outTime;
           if(outTime.length>0){
               values.outStartDate = outTime[0].format('YYYY-MM-DD');
               values.outEndDate = outTime[1].format('YYYY-MM-DD');
           }
          console.log('查询条件: ', values)
          this.props.query(values);
       });
    }
    handleReset = ()=>{
        this.props.form.resetFields();
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
                    <FormItem {...formItemLayout} label={'出库时间'}>
                        {getFieldDecorator('outTime')(
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
                        {getFieldDecorator('produceId',{
                            initialValue:""
                        })(
                            <Select placeholder={'请选择'}>
                                <Option value="" key={-1}>全部</Option>
                                {
                                    this.state.fOrgOptions.map((item,index) => {
                                    return <Option key={index} value={item.value}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={4}>
                    <FormItem {...formItemLayout} label={'单号/名称'}>
                        {getFieldDecorator('outNo')(
                             <Input placeholder="请输出库单号/产品名称/通用名称"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={16} key={5} style={{textAlign:'right'}}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button style={{ marginLeft: 18, marginRight:18 }} onClick={this.handleReset}>
                        清除
                    </Button>
                </Col>
              </Row>
            </Form>
        )
    }
 }
 
 const SearchBox = Form.create()(SearchForm);
class OutDetail extends React.Component{
    state = {
        query: '',
    }
    queryHandler = (query) => {
        console.log(query,'query')
        this.refs.table.fetch(query);
        this.setState({ query: query })
    };
    render(){
        const columns = [{
            title : '出库单',
            dataIndex : 'outNo',
            width: 170,
        },{
            title : '领用科室',
            dataIndex : 'deptName',
            width: 120
        },{
            title:'二维码',
            dataIndex : 'qrcode'
        },{
            title : '产品名称',
            dataIndex : 'materialName',
        },{
            title: '通用名称',
            dataIndex : 'geName'
        },{
            title : '型号',
            dataIndex : 'fmodel',
        },{
            title : '规格',
            dataIndex : 'spec',
        },{
            title : '采购单位',
            dataIndex : 'purchaseUnit',
        },{
            title : '数量',
            dataIndex : 'number',
        },{
            title:'采购价格',
            dataIndex : 'purchasePrice',
            render: (text, record, index)=>{
                return text === 'undefined' ? '0.0000' : text.toFixed(4)
            }
        },{
            title:'供应商',
            dataIndex:'fOrgName'
        },{
            title:'生产批号',
            dataIndex :'flot'
        },{
            title:'有效期',
            dataIndex:'usefulDate'
        },{
            title:'出库时间',
            dataIndex:'outDate'
        },{
            title:'入库单号',
            dataIndex :'inno'
        }];
        const query = this.state.query;
        return (
            <div>
            { this.props.children || 
            <div>
                <SearchBox query={(query)=>this.queryHandler(query)}/>
                <Row>
                    <Col>
                        <a href={storage.EXPORTTENDERDETAILLIST+"?"+querystring.stringify(query)}><Button type="primary">导出</Button></a>
                    </Col>
                </Row>
                <FetchTable 
                    query={query}
                    ref='table'
                    columns={columns}
                    url={storage.SELECTTENDERDETAILLIST}
                    rowKey='RN'
                    scroll={{ x: '200%' }}
                />
            </div>
            }
        </div>
        )
    }
}
module.exports = OutDetail;