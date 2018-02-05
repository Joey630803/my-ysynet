/**
 * @file 出库记录
 */

 import React from 'react';
 import { Form, Row, Col, Input, DatePicker,Button,Select, message } from 'antd';
 import FetchTable from 'component/FetchTable';
 import { actionHandler, fetchData, CommonData } from 'utils/tools';
 import { storage } from 'api';
 const FormItem = Form.Item;
 const Option = Select.Option;
 const RangePicker = DatePicker.RangePicker;

 class SearchForm extends React.Component{
    state={
        deptOptions:[],
        storageOptions: [],
        outModeOptions:[]
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
        //出库方式
        CommonData('OUTMODE',(data)=>{
            this.setState({outModeOptions: data});
        });
        //科室
        fetchData(storage.FINDDEPTBYSTORAGEUSER,{},(data)=>{
            this.setState({ deptOptions : data.result });
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
                    <FormItem {...formItemLayout} label={'出库分类'}>
                        {getFieldDecorator('outType',{
                            initialValue:""
                        })(
                            <Select>
                                <Option value="" key={-1}>全部</Option>
                                { 
                                    this.state.outModeOptions.map((item,index) => {
                                        return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                                       })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={4}>
                    <FormItem {...formItemLayout} label={'科室'}>
                        {getFieldDecorator('deptGuid',{
                            initialValue:""
                        })(
                            <Select placeholder={'请选择'}>
                                <Option value="" key={-1}>全部</Option>
                                {
                                    this.state.deptOptions.map((item,index) => {
                                    return <Option key={index} value={item.value}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={5}>
                    <FormItem {...formItemLayout} label={'单号'}>
                        {getFieldDecorator('outNo')(
                             <Input placeholder="请输入出库单/拣货单号"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={6} style={{textAlign:'right'}}>
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
 
 const SearchBox = Form.create()(SearchForm);

 class OutRecord extends React.Component{
    state = {
        query: {},
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query: query })
    };
    getOutTypes = (value)=>{
        if(value === '01'){
            return '拣货单出库'
        }else if(value === '02'){
            return '科室领用出库'
        }else if(value === '03'){
            return '申购出库'
        }else if(value === '04'){
            return '盘亏出库'
        }else if(value === '05'){
            return '退库出库'
        }else if(value === '06'){
            return '结算出库'
        }
    }
    render(){
        const columns = [{
            title : '操作',
            dataIndex : 'action',
            width: 80 ,
            render : (text,record)=>{
                return <span>
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router,`/storage/outMgt/show`, {...record}
                    )}>
                   详情
                </a>
                </span>
            }

        },{
            title : '出库单',
            dataIndex : 'outNo',
            width: 170,
           
        },{
            title : '捡货单',
            dataIndex : 'pickNo',
            width: 140,
        },{
            title: '库房',
            dataIndex : 'storageName',
            width: 150
        },{
            title : '出库分类',
            dataIndex : 'outType',
            width: 150,
            render: (text, record)=>{
                return this.getOutTypes(text)
            }
        },{
            title : '操作员',
            dataIndex : 'createUserName',
            width: 120,
        },{
            title : '领用科室',
            dataIndex : 'deptName',
            width: 150
        },{
            title : '领用人',
            dataIndex : 'lyr',
            width: 100
        },{
            title : '科室地址',
            dataIndex : 'deptAddress',
            width: 250
        },{
            title:'出库时间',
            dataIndex : 'outDate',
            width: 160
        },{
            title : '备注',
            dataIndex : 'tfRemark'
        }];
        const query = this.state.query;
          return (
            <div>
            { this.props.children || 
            <div>
                <SearchBox query={(query)=>this.queryHandler(query)}/>
                <Row>
                    <Col>
                        <Button type="primary" onClick={actionHandler.bind(null, this.props.router, `/storage/outMgt/picking`, { })}>拣货</Button>
                        <Button type="primary" style={{marginLeft:16,marginRight:16}} onClick={actionHandler.bind(null, this.props.router, `/storage/outMgt/receive`, { })}>领用</Button>
                        <Button type="primary"
                            onClick={actionHandler.bind(
                                null, this.props.router, `/storage/outMgt/backStorage`, { }
                            )}>
                            退库
                        </Button>
                    </Col>
                </Row>
                <FetchTable 
                    query={query}
                    ref='table'
                    columns={columns}
                    url={storage.SELECTOUTPORTLIST}
                    rowKey='outId'
                    scroll={{ x: '130%' }}
                />
            </div>
            }
        </div>
          )
      }
  }
  module.exports = OutRecord;