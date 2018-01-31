/**
 * 我的送货单
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker, message,Icon } from 'antd';
import querystring from 'querystring';
import FetchTable from 'component/FetchTable';
import { actionHandler,CommonData} from 'utils/tools';
import FetchSelect from 'component/FetchSelect';
import { purchase }  from 'api';
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;


class SearchForm extends React.Component {
    state = {
        storageOptions: [],
        deliveryFstate: [],
        deliveryType: [],
        fOrgId:'',
        rStorageName:''
    }
    componentDidMount = () => {
        console.log(this.props)
        //送货单状态
        CommonData('DELIVERY_FSTATE', (data) => {
            this.setState({deliveryFstate:data})
        })
        //送货单类型
        CommonData('DELIVERY_TYPE', (data) => {
            this.setState({deliveryType:data})
        })
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
            if(data.status){
                this.setState({storageOptions: data.result})
            }
            else{
                message.error(data.msg)
            }
            
        })
        .catch(e => console.log("Oops, error", e))
    }
    //查询
    search = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            values.rStorageName = this.state.rStorageName;
            const sendTime = values.sendTime === undefined ? "" : values.sendTime;
            values.fOrgId = this.state.fOrgId;
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
                    {getFieldDecorator(`rStorageGuid`)(
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
                    <FormItem {...formItemLayout} label={`供应商`}>
                      <FetchSelect placeholder="请输入"  allowClear={true} style={{width:200}} ref='fetchs' url={purchase.FINDORGLISTFORSELECT} 
                            cb={(value) => this.setState({fOrgId: value})}/>
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
        this.setState({ query: query })
    }

    render(){
        const columns = [{
                title: '操作',
                key: 'action',
                fixed: 'left',
                width: 60,
                render: (text,record,index) => {
                    return (
                        record.orderType === 'OPER_DELIVERY' ?
                        <span>
                              <a onClick={
                            actionHandler.bind(
                            null, this.props.router, `/purchase/myDelivery/operDetails` , {...record}
                            )}>
                            {`查看`}
                            </a>
                          </span>
                        :
                          <span>
                              <a onClick={
                            actionHandler.bind(
                            null, this.props.router, `/purchase/myDelivery/show` , {...record}
                            )}>
                            {`查看`}
                            </a>
                          </span>
                    )
                }},{
                    title : '状态',
                    dataIndex : 'fstateName',
                    fixed: 'left',
                    width: 100
                },{
                    title : '送货单类型',
                    dataIndex : 'orderType',
                    fixed : 'left',
                    width : 100,
                    render : orderType=>{
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
                    title : '收货地址',
                    dataIndex : 'tfAddress'
                },{
                    title : '供应商',
                    dataIndex : 'fOrgName'
                },{
                    title : '制单人',
                    dataIndex : 'sendUsername'
                },{
                    title : '制单时间',
                    dataIndex : 'sendDate'
                },{
                    title : '验收人',
                    dataIndex : 'checkUserName'
                },{
                    title : '验收时间',
                    dataIndex : 'checkTime'
                }];
                const exportHref = purchase.EXPORTDELIVERYLIST+"?"+querystring.stringify(this.state.query);
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
                        url={purchase.DELIVERYLIST}
                        columns={columns}
                        size='small' 
                        scroll={{ x: '150%' }}
                    />
                </div>
                 }
            </div>
        )
    }
}

module.exports = MyDelivery;

