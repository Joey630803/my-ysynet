/**
 * 高值计划详情
 */
import React from 'react';
import {  Row, Col, Breadcrumb ,Table,Collapse,message } from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { storage } from 'api'

const Panel = Collapse.Panel;

class GzPlanShow extends React.Component{
    state = {
        dataSource:[]
    }
     componentDidMount = () => {
        //根据普耗计划id查询送货单产品列表
        fetchData(storage.SERACHPLANDETAIL,querystring.stringify({planId:this.props.location.state.planId}),(data)=>{
           if(data.status){
                this.setState({ dataSource: data.result });
            }else{
                message.error('后台异常！');
            }
        })

    }
    handFstate = (value) => {
        if(value==="00"){
          return "草稿"
        }else if(value==="20"){
          return "待确认"
        }else if(value==="30"){
            return "已确认"
        }else if(value==="34"){
            return "已驳回"
        }else if(value === "36"){
            return "已汇总"
        }else if(value==="40"){
            return "采购中"
        }else if(value==="60"){
            return "完结"
        }
    }
    total = () => {
        let total = 0;
        this.state.dataSource.map( (item, index) => {
          let amount = typeof item.amount === 'undefined' ? 1 : item.amount
          return total += amount * item.purchasePrice;
        })
        return total.toFixed(2);
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
                title: '采购价格',
                dataIndex: 'purchasePrice',
                render: (text,record)=>{
                    return text === 'undefined' ? '0.00':text.toFixed(2);
                }
                }, {
                title: '申请数量',
                dataIndex: 'amount',
                }, {
                title: '生产商',
                dataIndex: 'productName',
                }
            ];
        const { dataSource  } = this.state;
        const baseData = this.props.location.state;
        const footer = () => {
            return <Row><Col className="ant-col-6">总金额:{this.total()}</Col></Row>
        }; 
        return (
            <div>
                <Row>
                    <Col className="ant-col-6">
                         <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/customerStoragePlanMgt',query:{activeKey:'2'}}}>高值计划</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>详情</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
      
                </Row>

                <Collapse defaultActiveKey={['1','2']}>
                    <Panel header="单据信息" key="1">
                    <Row>
                        <Col className="ant-col-6">
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
                        <Col className="ant-col-6">
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
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>单据状态</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { this.handFstate(baseData.fstate) }
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
                                        { baseData.planTime }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>科室</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { baseData.deptName }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>申请人</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { baseData.applyUsername }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-12">
                            <div className="ant-row">
                                <div className="ant-col-3 ant-form-item-label-left">
                                    <label>收货信息</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { baseData.shippingAddress }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
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
                        <Col className="ant-col-6">
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
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>驳回说明</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { baseData.planReject }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
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
                    </Panel>
                    {
                        baseData.fsource === "01"?
                        <div>
                        <Panel header="手术信息" key="3">
                            <Row>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>手术名称</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.operName }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>手术医生</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.operDoctor }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>手术时间</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.operTime }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>麻醉方式</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.mzff }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>手术间</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.operRoom }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>巡回护士</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.circuitNurse }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-12">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>床位号</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.bedNum }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-12">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>手术说明</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.operExplain }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-12">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>手术备注</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.operRemark }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                        </Panel>
                        <Panel header="患者信息" key="4">
                            <Row>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>就诊号</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.treatmentNo }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-18">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>手术申请单</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.operNo }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>姓名</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.name }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>性别</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.gender }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>年龄</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.age }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Panel>
                        </div>
                        :
                        null
                    }
                    <Panel header="产品信息" key="2">
                    <Table 
                    columns={columns} 
                    dataSource={dataSource} 
                    pagination={false}
                    size="small"
                    rowKey='planDetailGuid'
                    footer={footer}
                    scroll={{ x: '150%' }}
                    />
                    </Panel>
                </Collapse>
            </div>
        )
    }
}
module.exports = GzPlanShow;
