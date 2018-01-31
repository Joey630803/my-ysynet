/**
 * 我的送货单
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker, message,Popconfirm,Icon } from 'antd';
import querystring from 'querystring';
import FetchTable from 'component/FetchTable';
import { actionHandler,CommonData,fetchData} from 'utils/tools';
import { sales } from 'api'
import FetchSelect from 'component/FetchSelect';
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;


class SearchForm extends React.Component {
    state = {
        storageOptions: [],
        deliveryFstate: [],
        deliveryType: [],
        rOrgId:'',
        rStorageName:''
    }
    componentDidMount = () => {
        //送货单状态
        CommonData('DELIVERY_FSTATE', (data) => {
            this.setState({deliveryFstate:data})
        })
        //送货单类型
        CommonData('DELIVERY_TYPE', (data) => {
            this.setState({deliveryType:data})
        })
        //库房
        fetchData(sales.FINDSTORAGEBYUSER,{},(data)=>{
            this.setState({storageOptions: data.result})
        })
    }
    //查询
     search = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const sendTime = values.sendTime === undefined ? "" : values.sendTime;
            values.rOrgId = this.state.rOrgId;
            if(sendTime.length>0) {
                values.sendStartDate = sendTime[0].format('YYYY-MM-DD');
                values.sendEndDate = sendTime[1].format('YYYY-MM-DD');
            }
            console.log('查询条件: ', values)
            this.props.query(values);
        })
    }
    //重置
    reset = () => {
        this.props.form.resetFields();
        this.props.query({});
    }
    render = () => {
        const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        };
        const { getFieldDecorator } = this.props.form;
        const { deliveryFstate } = this.state;
        const { deliveryType } = this.state;
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
                        onSelect={(value,Option)=>{
                            this.setState({rStorageName:Option.props.children})
                        }}  
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
                            <FetchSelect placeholder="请输入" allowClear={true} style={{width:200}} ref='fetchs' url={sales.FINDORGLISTFORSELECT} 
                            cb={(value) => this.setState({rOrgId: value})}/>
                    </FormItem>
                </Col>
                <Col span={6} key={3}>
                    <FormItem {...formItemLayout} label={`送货单类型`}>
                    {getFieldDecorator(`orderType`)(
                        <Select>
                            <Option value=''>全部</Option>
                            {
                                deliveryType.map((item,index)=>{
                                    return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                                })
                            }
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col span={6} key={4}>
                    <FormItem {...formItemLayout} label={`状态`}>
                    {getFieldDecorator(`sendFstates`)(
                        <Select
                        placeholder="请选择"
                        mode="multiple"
                        >
                        {
                            deliveryFstate.map((item,index) => {
                            return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                            })
                        }
                        </Select>
                    )}
                    </FormItem>
                </Col>
                <Col span={6} key={5}>
                    <FormItem {...formItemLayout} label={`制单时间`}>
                    {getFieldDecorator(`sendTime`)(
                        <RangePicker />
                    )}
                    </FormItem>
                </Col>
                <Col span={6} key={6}>
                    <FormItem {...formItemLayout} label={`送货单号`}>
                    {getFieldDecorator(`sendNo`)(
                        <Input/>
                    )}
                    </FormItem>
                </Col>
                <Col span={6} key={7}>
                    <FormItem {...formItemLayout} label={`订单号`}>
                    {getFieldDecorator(`orderNo`)(
                        <Input/>
                    )}
                    </FormItem>
                </Col>
                <Col span={6} key={8} style={{textAlign: 'right'}}>
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

class MyDelivery extends React.Component{
    state = {
        query: ''
    }
    search = (query) => {
        this.refs.table.fetch(query);
        this.setState({
        query: query
        })
    }
    handlePrint = (record) =>{
        if(record.qrFlag === "01" && record.orderType !== "SETTLE_DELIVERY"){
            window.open(sales.PRINTQRCODE+"?"+querystring.stringify({sendId:record.sendId}));
        }
    }
    //送货单发货
    handleSend = (record) => {
        fetchData(sales.SHIPMENTDELIVERY,querystring.stringify({sendId:record.sendId}),(data)=>{
            if(data.status){
            
                message.success("发货成功!")
                this.refs.table.fetch();
                this.handlePrint(record);
            }
            else{
                message.error(data.msg)
            }
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
                        {record.orderType==='OPER_DELIVERY'?
                              <a onClick={
                                actionHandler.bind(
                                null, this.props.router, `/sales/salesMyDelivery/operDetails` , {...record}
                                )}>
                                {`查看`}
                             </a>
                             :
                             <a onClick={
                                actionHandler.bind(
                                null, this.props.router, `/sales/salesMyDelivery/show` , {...record}
                                )}>
                                {`查看`}
                             </a>
                        }
                          {record.sendFstate === "40" ? 

                           <span>
                                <span className="ant-divider"></span>
                                <Popconfirm title={ "是否发货？"} onConfirm={() => this.handleSend(record)}>
                                    <a href="#">发货</a>
                                </Popconfirm>
                           </span>
                            :
                            null
                            }
                        </span>
                    )
                }},{
                    title : '状态',
                    dataIndex : 'fstateName',
                    fixed: 'left',
                    width: 100
                },{
                    title: '送货单类型',
                    dataIndex : 'orderType',
                    fixed : 'left',
                    width : 100,
                    render : orderType => {
                        if(orderType === 'DELIVERY'){
                            return '普耗送货单'
                        }else if(orderType === 'HIGH_DELIVERY'){
                            return '高值送货单'
                        }else if(orderType === 'OPER_DELIVERY'){
                            return '手术送货单'
                        }else if(orderType === 'SETTLE_DELIVERY'){
                            return '结算送货单'
                        }
                    }
                },{
                    title : '送货单号',
                    dataIndex : 'sendNo',
                    fixed: 'left',
                    width: 150
                },{
                    title : '订单号',
                    dataIndex : 'orderNo',
                    fixed: 'left',
                    width: 150
                },{
                    title : '医疗机构',
                    dataIndex : 'rOrgName',
                    width: 150
                },{
                    title : '制单人',
                    dataIndex : 'sendUsername',
                    width: 150
                },{
                    title : '制单时间',
                    dataIndex : 'sendDate',
                    width: 160
                },{
                    title : '收货地址',
                    dataIndex : 'tfAddress'
                },{
                    title : '验收人',
                    dataIndex : 'checkUserName',
                    width: 120
                },{
                    title : '验收时间',
                    dataIndex : 'checkTime',
                    width: 160
                }];
                const exportHref = sales.EXPORTDELIVERYLIST+"?"+querystring.stringify(this.state.query);
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
                        rowKey={'sendId'}
                        url={sales.DELIVERYLIST}
                        columns={columns} 
                        scroll={{ x: '150%' }}
                    />
                </div>
                 }
            </div>
        )
    }
}

module.exports = MyDelivery;

