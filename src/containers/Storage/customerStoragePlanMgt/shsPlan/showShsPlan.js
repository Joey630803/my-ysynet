/**
 * 手术计划详情
 */
import React from 'react';
import {  Row, Col, Breadcrumb ,Table,Collapse } from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { storage } from 'api'

const Panel = Collapse.Panel;

class ShsPlanShow extends React.Component{
     state = {
        dataSource:[],
        billTypes: []
    }
     componentDidMount = () => {
        //根据普耗计划id查询品牌列表
        fetchData(storage.FINDSURGERYDETAILBYID,querystring.stringify({planId:this.props.location.state.planId}),(data)=>{
            this.setState({
                dataSource: data.result,
            });
        });
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
        }else if(value==="40"){
            return "采购中"
        }else if(value==="60"){
            return "完结"
        }
    }
    render(){
          const columns = [{
                title: '品牌',
                dataIndex: 'tfBrandName',
                }, {
                title: '供应商',
                dataIndex: 'fOrgName',
                }, {
                title: '联系人',
                dataIndex: 'lxr',
                }, {
                title: '联系电话',
                dataIndex: 'lxdh',
                }
            ];
        const { dataSource  } = this.state;
        const baseData = this.props.location.state;

        return (
            <div>
                <Row>
                    <Col className="ant-col-6">
                         <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/customerStoragePlanMgt',query:{activeKey:'3'}}}>手术计划单</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>详情</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row>
                <Collapse defaultActiveKey={['1','2','3','4']}>
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
                                    <div className="ant-col-3 ant-form-item-label-left">
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
                                    <div className="ant-col-3 ant-form-item-label-left">
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
                    <Panel header="品牌信息" key="2">
                    <Table 
                    columns={columns} 
                    dataSource={dataSource} 
                    pagination={false}
                    size="small"
                    rowKey='planOperDetailGuid'
                    />
                    </Panel>
                </Collapse>
            </div>
        )
    }
}
module.exports = ShsPlanShow;
