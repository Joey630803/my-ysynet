/**
 * 我的发票详情
 */
import React from 'react';
import { Row, Col, Breadcrumb ,Table } from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { FetchPost } from 'utils/tools';
import { sales } from 'api'

class MyInvoiceShow extends React.Component{
     state = {
        deliveryTotal : 0,
        dataSource:[]
    }
    componentDidMount = () => {
        //根据发票查询关联的送货单列表
         FetchPost(sales.SEARCHDELIVERYLISTBYINVOICEID,querystring.stringify({invoiceId:this.props.location.state.invoiceId}))
        .then(res => res.json())
        .then(data => {
            this.setState({
                dataSource: data.result.rows,
                deliveryTotal: data.result.fieldName
            })
        })
        .catch(e => console.log("Oops, error", e))
    }
    render(){
          const columns = [{
                title: '送货单号',
                dataIndex: 'sendNo',
                }, {
                title: '送货单金额',
                dataIndex: 'totalPrice',
                render: (text,record,index) => {
                    return text === 'undefined' ? '0.00' : text.toFixed(2)
                }
                }, {
                title: '收货地址',
                dataIndex: 'address',
                }, {
                title: '状态',
                dataIndex: 'sendFstate',
                render: (text,record,index) => {
                    if(text === "40"){
                        return "待发货"
                    }else if(text === "50"){
                        return "待验收"
                    }else if(text === "60"){
                        return "验收通过"
                    }else if(text === "90"){
                        return "验收不通过"
                    }
                }
                }
            ];
        const { dataSource  ,deliveryTotal} = this.state;
        const baseData = this.props.location.state;
        const footer = () => {
            return <Row><Col className="ant-col-6">送货单总金额:{deliveryTotal}</Col></Row>
        }; 
        return (
            <div>
                <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                    <Breadcrumb.Item><Link to='/sales/salesMyInvoice'>我的发票</Link></Breadcrumb.Item>
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
                <h2 style={{marginTop:16,marginBottom:16}}>送货单列表</h2>
                <Table 
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
