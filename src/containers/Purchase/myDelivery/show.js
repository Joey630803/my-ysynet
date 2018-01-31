/**
 * 我的送货单详情
 */
import React from 'react';
import {  Row, Col, Breadcrumb ,Table,Button,message } from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { purchase } from 'api'

class MyDeliveryShow extends React.Component{
     state = {
        dataSource:[]
    }
     componentDidMount = () => {
        //根据送货单id查询送货单产品列表
         fetchData(purchase.DELIVERYDTTAILS,querystring.stringify({sendId:this.props.location.state.sendId}),(data)=>{
             if(data.status){
                this.setState({ dataSource: data.result.rows })
             }else{
                 message.error("后台异常!")
             }
   
         })
    }
    getDeliveryType = (value) =>{
        if(value === 'DELIVERY'){
            return '普耗送货单'
        }else if(value === 'HIGH_DELIVERY'){
            return '高值送货单'
        }else if(value === 'OPER_DELIVERY'){
            return '手术送货单'
        }else if(value === 'SETTLE_DELIVERY'){
            return '结算送货单'
        }
    }
    render(){
          const columns = [{
                title: '通用名称',
                dataIndex: 'geName',
                }, {
                title: '产品名称',
                dataIndex: 'materialName',
                }, {
                title: '规格',
                dataIndex: 'spec',
                }, {
                title: '型号',
                dataIndex: 'fmodel',
                }, {
                title: '采购单位',
                dataIndex: 'purchaseUnit',
                }, {
                title: '包装规格',
                dataIndex: 'tfPacking',
                }, {
                title: '采购价格',
                dataIndex: 'purchasePrice',
                render: (text,record,index) => {
                    return text === 'undefined' || text === null ? '0.00' : text.toFixed(2)
                }
                }, {
                title: '发货数量',
                dataIndex: 'amount',
                }, {
                title: '金额',
                dataIndex: 'amountMoney',
                render: (text,record,index) => {
                    return text === 'undefined' ? '0.00' : text.toFixed(2)
                }
                }, {
                title: '生产批号',
                dataIndex: 'flot',
                }, {
                title: '生产日期',
                dataIndex: 'prodDate',
                }, {
                title: '有效期至',
                dataIndex: 'usefulDate',
                }
            ];
        const { dataSource  } = this.state;
        const baseData = this.props.location.state;
        const exportHref = purchase.EXPORTDELIVERYDETAILS+"?"+querystring.stringify({sendId:baseData.sendId});
        const printHref = purchase.PRINTDELIVERYDETAILS+"?"+querystring.stringify({sendId:baseData.sendId});
        const footer = () => {
            return <Row><Col className="ant-col-6">送货单总金额:{baseData.totalPrice ==="" ? "" : (baseData.totalPrice).toFixed(2)}</Col></Row>
        }; 
        return (
            <div>
                <Row>
                    <Col className="ant-col-6">
                         <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to='/purchase/myDelivery'>我的送货单</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>详情</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col className="ant-col-18" style={{textAlign:'right'}}>
                        <a href={exportHref}><Button type="primary" style={{marginRight:8}}>导出</Button></a>
                        <a href={printHref} target="_blank"><Button type="primary">打印</Button></a>
                    </Col>
                </Row>
                <h2 style={{marginBottom:16}}>基本信息</h2>
                <Row>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>送货单号</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.sendNo }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>订单号</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                      { baseData.orderNo }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>收货地址</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.tfAddress }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>送货单类型</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { this.getDeliveryType(baseData.orderType) }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>制单人</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.sendUsername }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>制单时间</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.sendDate }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>验收人</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.checkUserName }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>验收时间</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.checkTime }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>状态</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.fstateName }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>供应商</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                      { baseData.fOrgName }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>驳回说明</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.rejectReson }
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <h2 style={{marginTop:16,marginBottom:16}}>产品信息</h2>
                <Table 
                columns={columns} 
                dataSource={dataSource} 
                pagination={false}
                size="small"
                rowKey='sendDetailGuid'
                footer={footer}
                scroll={{ x: '150%' }}
                />
            </div>
        )
    }
}
module.exports = MyDeliveryShow;
