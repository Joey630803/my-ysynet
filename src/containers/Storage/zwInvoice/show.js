/**
 * 总务发票详情
 */
import React from 'react';
import { Row, Col, Breadcrumb ,Table } from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { storage } from 'api'

class MyInvoiceShow extends React.Component{
     state = {
        deliveryTotal : 0,
        dataSource:[]
    }
    componentDidMount = () => {
        //根据发票查询关联的送货单列表
        fetchData(storage.SEARCHDELIVERYLISTBYINVOICEID,querystring.stringify({invoiceId:this.props.location.state.invoiceId}),(data)=>{
            if(data.status){
                this.setState({
                    dataSource: data.result.rows,
                    deliveryTotal: data.result.fieldName
                })
            }
        })
    }
    render(){
          const columns = [{
                title: '入库单号',
                dataIndex: 'sendNo',
                width: 300
                }, {
                title: '入库单金额',
                dataIndex: 'totalPrice',
                render: (text,record,index) => {
                    return text === 'undefined' ? '0.00' : text.toFixed(2)
                }
                }
            ];
        const { dataSource, deliveryTotal} = this.state;
        const baseData = this.props.location.state;
        const footer = () => {
            return <Row><Col className="ant-col-6">入库单总金额:{deliveryTotal}</Col></Row>
        }; 
        return (
            <div>
                <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                    <Breadcrumb.Item><Link to='/storage/zwInvoice'>我的发票</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>详情</Breadcrumb.Item>
                </Breadcrumb>
                <h2 style={{marginBottom:16}}>基本信息</h2>
                <Row>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>发票代码</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    {baseData.invoiceCode}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>发票号码</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    {baseData.invoiceNo}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>发票金额</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.accountPayed=== null ? "0.00" : baseData.accountPayed.toFixed(2) }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>开票日期</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    {baseData.invoiceDate}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>供应商</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    {baseData.fOrgName}
                                </div>
                            </div>
                        </div>
                    </Col>
                     <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>备注</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    {baseData.rejectReason}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <h2 style={{marginTop:16,marginBottom:16}}>入库单信息</h2>
                <Table 
                    bordered
                    columns={columns} 
                    dataSource={dataSource} 
                    pagination={false}
                    size="small"
                    rowKey={'sendId'}
                    footer={footer}
                />
            </div>
        )
    }
}
module.exports = MyInvoiceShow;
