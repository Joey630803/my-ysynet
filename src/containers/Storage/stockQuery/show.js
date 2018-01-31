/**
 * 库存查询详情
 */
import React from 'react';
import {  Row, Col, Breadcrumb,Table } from 'antd';
import { Link } from 'react-router';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { storage } from 'api';  

class StockQueryShow extends React.Component{
    state = {
        dataSource:[]
    }
    componentDidMount = () => {
        //产品库存详情列表
        const reData = this.props.location.state;
      fetchData(storage.LARGEWAREHOUSEQUERYDETAIL,
        querystring.stringify({
            tenderMaterialGuid:reData.tenderMaterialGuid,
            storageGuid:reData.rStorageGuid,
            fOrgId:reData.fOrgId,
            materialName:reData.materialName
        }),(data=>{
          this.setState({dataSource: data.result})
       }));
    }
    total = () => {
        let total = 0;
        this.state.dataSource.map( (item, index) => {
          //let amount = typeof item.amount === 'undefined' ? 1 : item.amount
          return total += Number(item.money);
        })
        return total.toFixed(2);
    }
    render(){
        const columns = [{
            title: '二维码',
            dataIndex: 'qrCode',
            },{
            title: '入库单号',
            dataIndex: 'inno',
            },{
            title: '入库方式',
            dataIndex: 'inmode',
            },{
            title: '生产批号',
            dataIndex: 'flot',
            }, {
            title: '生产日期',
            dataIndex: 'prodDate',
            }, {
            title: '有效期',
            dataIndex: 'usefulDate',
            }, {
            title: '数量',
            dataIndex: 'amount',
            }, {
            title: '采购价格',
            dataIndex: 'purchasePrice',
            }, {
            title: '金额',
            dataIndex: 'money',
            },{
            title: '供应商',
            dataIndex: 'fOrgName',
            }
        ];
        const footer = () => {
            return <Row><Col className="ant-col-6">总金额:{this.total()}</Col></Row>
        }; 
        const baseData = this.props.location.state;
        return (
            <div>
            { this.props.children || 
                <div>
                     <Row>
                        <Col className="ant-col-6">
                            <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                <Breadcrumb.Item><Link to={{pathname:'/storage/stockQuery'}}>库存查询</Link></Breadcrumb.Item>
                                <Breadcrumb.Item>详情</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
        
                    </Row>
                    <Row>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>产品名称</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        {baseData.materialName}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>通用名称</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                    {baseData.geName}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>注册证号</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                    {baseData.registerNo}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>型号</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                    {baseData.fmodel}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>规格</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                    {baseData.spec}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>品牌</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                    {baseData.tfBrandName}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>生产商</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                    {baseData.productName}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Table 
                    columns={columns} 
                    dataSource={this.state.dataSource} 
                    pagination={false}
                    size="small"
                    rowKey='importDetailGuid'
                    footer={footer}
                    scroll={{ x: '150%' }}
                    />
                </div>
            }
            </div>
        )
    }
}
module.exports = StockQueryShow;