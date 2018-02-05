/**
 * 申请查看s
 */
import React from 'react';
import { Button, Table, Row, Col ,Breadcrumb,message} from 'antd';
import { Link } from 'react-router';    
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { department } from 'api'

class InvoiceCheck extends React.Component{
    state = {
        dataSource:[],
    }
    componentDidMount = () => {
        //根据申请id查询产品
        fetchData(department.SEARCHAPPLYDETAILS,querystring.stringify({applyId:this.props.location.state.applyId}),(data)=>{
            if(data.status){
                this.setState({  dataSource: data.result });
            }else{
                message.error('后台异常！')
            }
        });
    }

    render(){
          const columns = [ {
                title: '通用名称',
                dataIndex: 'geName',
                width: 250
                }, {
                title: '产品名称',
                dataIndex: 'materialName',
                width: 250
                }, {
                title: '规格',
                dataIndex: 'spec',
                width: 200
                }, {
                title: '型号',
                dataIndex: 'fmodel',
                width: 150
                }, {
                title: '采购单位',
                dataIndex: 'purchaseUnit',
                width: 100
                }, {
                title: '采购价格',
                dataIndex: 'purchasePrice',
                width: 120,
                render: (text,record,index) => {
                    return text === 'undefined'|| text===null ? '0':text.toFixed(2);
                }
                }, {
                title: '包装规格',
                dataIndex: 'tfPacking',
                width: 150
                },{
                title : '需求数量',
                dataIndex : 'amount',
               width: 80
                }, {
                title: '金额',
                dataIndex: 'money',
                width: 100,
                render: (text,record,index) => {
                    return text === 'undefined'|| text===null ? '0':text.toFixed(2);
                }
                }, {
                title: '品牌',
                dataIndex: 'tfBrand',
                width: 150
                }, {
                title: '生产商',
                dataIndex: 'produceName',
                width: 200
                }
            ];
        const { dataSource  } = this.state;
        const baseData = this.props.location.state;
                const exportHref = department.EXPORTAPPLYDETAILS+"?"+querystring.stringify({applyId:baseData.applyId});
        const footer = () => {
            return <Row><Col className="ant-col-6">申请单总金额:{baseData.totalPrice}</Col></Row>
        }; 
        return (
            <div>
                <Row>
                    <Col className="ant-col-6">
                        <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to='/department/departApply'>申请管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>详情</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col className="ant-col-18" style={{textAlign:'right'}}>
                        <a href={exportHref}><Button type="primary" style={{marginRight:8}}>导出</Button></a>
                    </Col>
                </Row>
               
                <h2 style={{marginBottom:16}}>基本信息</h2>
                <Row>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>申请单号</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                     {baseData.applyNo}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>申请科室</label>
                            </div>
                            <div className="ant-col-18">
                                 <div className="ant-form-item-control">
                                     {baseData.deptName}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>备货库房</label>
                            </div>
                            <div className="ant-col-18">
                                 <div className="ant-form-item-control">
                                     {baseData.storageName}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>申请单状态</label>
                            </div>
                            <div className="ant-col-18">
                                 <div className="ant-form-item-control">
                                     {baseData.fstateName }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>申请人</label>
                            </div>
                            <div className="ant-col-18">
                                 <div className="ant-form-item-control">
                                    {baseData.applyUsername}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>申请时间</label>
                            </div>
                            <div className="ant-col-18">
                                 <div className="ant-form-item-control">
                                    {baseData.applyTime}
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
                                    {baseData.applyFail}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>收货地址</label>
                            </div>
                            <div className="ant-col-18">
                                 <div className="ant-form-item-control">
                                    {baseData.tfAddress}
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
                rowKey="applyDetailGuid"
                footer={footer}
                scroll={{ x: '180%' }}
                />
            </div>
        )
    }
}
module.exports = InvoiceCheck;
