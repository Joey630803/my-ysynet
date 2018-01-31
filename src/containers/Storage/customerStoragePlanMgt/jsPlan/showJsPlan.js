/**
 * 结算计划详情
 */
import React from 'react';
import {  Row, Col, Breadcrumb ,Table, message } from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { storage } from 'api'

class JsPlanShow extends React.Component{
     state = {
        dataSource:[]
    }
     componentDidMount = () => {
        //根据普耗计划id查询产品列表
        fetchData(storage.SERACHSETTLEPLANDETAILS,querystring.stringify({planId:this.props.location.state.planId}),(data)=>{
            if(data.status){
                this.setState({ dataSource: data.result });
            }else{
                message.error('后台异常！');
            }
        });
    }

    total = (record) => {
        let total = 0;
        record.map( (item, index) => {
      
          return total += Number(item.price) ;
        })
        return total.toFixed(2);
      }
    handleValue = (fstate) => {
        if(fstate === "00"){
            return "草稿"
        }else if(fstate === "20"){
            return "待确认"
        }else if(fstate === "30"){
           return "已确认"
       }else if(fstate === "34"){
           return "已驳回"
       }else if(fstate === "40"){
           return "采购中"
       }else if(fstate === "60"){
           return "完结"
       }
    }
    render(){
          const columns = [{
                title: '二维码',
                dataIndex: 'qrcode',
                }, {
                title: '出库单号',
                dataIndex: 'outNo',
                }, {
                title: '领用科室',
                dataIndex: 'deptName',
                }, {
                title: '物资编码',
                dataIndex: 'aa',
                }, {
                title: '产品名称',
                dataIndex: 'materialName',
                }, {
                title: '通用名称',
                dataIndex: 'geName',
                }, {
                title: '型号',
                dataIndex: 'fmodel',
                }, {
                title: '规格',
                dataIndex: 'spec',
                }, {
                title: '采购单位',
                dataIndex: 'purchaseUnit',
                }, {
                title: '数量',
                dataIndex: 'sl',
                }, {
                title: '生产批号',
                dataIndex: 'flot',
                }, {
                title: '采购价格',
                dataIndex: 'purchasePrice',
                render: (text,record)=>{
                    return text === 'undefined' ? '0.00':text.toFixed(2);
                }
                }, {
                title: '金额',
                dataIndex: 'price',
                }
            ];
        const { dataSource  } = this.state;
        const baseData = this.props.location.state;
        const footer = () => {
            return <Row><Col className="ant-col-6">总金额: {this.total(dataSource)}</Col></Row>
        }; 
        return (
            <div>
                <Row>
                    <Col className="ant-col-6">
                         <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/customerStoragePlanMgt',query:{activeKey:'4'}}}>结算计划</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>详情</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    
                </Row>
                <h2 style={{marginBottom:16}}>基本信息</h2>
                <Row>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>单据号</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.planNo }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>单据类型</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                      { baseData.planTypeName }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>单据状态</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                      { this.handleValue(baseData.fstate)}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>制单时间</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.planTime }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>库房</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.storageName }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>操作员</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.planUsername }
                                </div>
                            </div>
                        </div>
                    </Col>
                     <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>收货信息</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.shippingAddress }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>期望到货</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.expectDate }
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
                                    { baseData.tfRemark }
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
                rowKey='chargeDetailGuid'
                footer={footer}
                scroll={{ x: '150%' }}
                />
            </div>
        )
    }
}
module.exports = JsPlanShow;
