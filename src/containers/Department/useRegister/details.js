/**
 * @file 使用登记--详情
 */

import React from 'react';
import { Row, Col, Table, Breadcrumb, Button, Collapse, message } from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { department } from 'api';
const Panel = Collapse.Panel;

class Details extends React.Component{
    state = {
        dataSource: [],
        operData: ''
    }
    componentDidMount = ()=>{
        fetchData(department.SELECTUSEREGISTERBYCHARGEGUID,querystring.stringify({chargeGuid:this.props.location.state.chargeGuid}),(data)=>{
            if(data.status){
                this.setState({ operData: data.result, dataSource:data.result.detail});
            }else{
                message.error(data.msg);
            }
        })
    }
    total = ()=>{
        let total = 0;
        this.state.dataSource.map((item,index)=>{
            let amount = typeof item.sysl ==='undefined'? 1: item.sysl;
            return total += amount*item.tenderPrice;
        });
        return total.toFixed(2);
    }
    showFstate = (value)=>{
        switch(value){
            case '00':
                return '待计费';
            case '01':
                return '已计费';
            case '02':
                return '已退费';
            case '08':
                return '计费失败';
            case '09':
                return '退费失败';
            default:
                break;
        }
    }
    render(){
        const { operData } = this.state;
        const columns = [{
            title : '产品名称',
            dataIndex : 'materialName'
        },{
            title : '通用名称',
            dataIndex : 'geName'
        },{
            title : '规格',
            dataIndex : 'spec'
        },{
            title : '型号',
            dataIndex : 'fModel'
        },{
            title : '招标单位',
            dataIndex : 'tenderUnit'
        },{
            title : '包装规格',
            dataIndex : 'tfPacking'
        },{
            title : '发货数量',
            dataIndex : 'amount'
        },{
            title : '使用数量',
            dataIndex : 'sysl',
        },{
            title : '价格',
            dataIndex : 'tenderPrice',
            render:(text,record)=>{
                return text === 'undefined'? '0.00':text.toFixed(2);
            }
        },{
            title : '生产批号',
            dataIndex : 'flot'
        },{
            title : '生产日期',
            dataIndex : 'prodDate'
        },{
            title : '有效期至',
            dataIndex : 'usefulDate'
        }];
        const footer = this.state.dataSource.length === 0 ? null : () => <span style={{fontSize: '1.5em'}}>总金额:
                        <a style={{color: '#f46e65'}}>
                        {this.total()}
                        </a>
                    </span>  
        const exportHref = department.EXPORTUSEREGISTERONE+"?"+querystring.stringify({chargeGuid:this.props.location.state.chargeGuid,totalPrice:this.total()});
        const printHref = department.PRINTUSEREGISTERONE+"?"+querystring.stringify({chargeGuid:this.props.location.state.chargeGuid});
    return (
        <div>
            <Row>
                <Col className="ant-col-6">
                    <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                        <Breadcrumb.Item><Link to='/department/useRegister'>使用登记</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>详情</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col className="ant-col-18" style={{textAlign:'right'}}>
                    <a href={exportHref}><Button type='primary'>导出</Button></a>
                    <a href={printHref}><Button type='primary' ghost style={{marginLeft:8,marginRight:8}}>打印</Button></a>
                </Col>
            </Row>
            <Collapse defaultActiveKey={['1','2','3','4']}>
                <Panel key='1' header='清单信息'>
                    <Row>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>使用清单号</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { operData.chargeNo }
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
                                        { this.showFstate(operData.chargeFstate) }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>送货单号</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { operData.sendNo }
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
                                        { operData.fOrgName }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>登记科室</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { operData.deptName }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>登记人</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { operData.createUserName }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>登记时间</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { operData.createTime }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        
                    </Row>
                </Panel>
                <Panel key='2' header='患者信息'>
                    <Row>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>就诊号</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { operData.treatmentNo }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-18">
                            <div className="ant-row">
                                <div className="ant-col-2 ant-form-item-label-left">
                                    <label>手术申请单</label>
                                </div>
                                <div className="ant-col-22">
                                    <div className="ant-form-item-control">
                                        { operData.operNo+" | "+ operData.operName }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>患者姓名</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { operData.hzName }
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
                                        { operData.dender }
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
                                        { operData.age }
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Panel>
                <Panel key='3' header='手术信息'>
                    <Row>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>手术名称</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { operData.operName }
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
                                        { operData.operDoctor }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>手术日期</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { operData.operDate }
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
                                        { operData.mzff }
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
                                        { operData.operRoom }
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
                                        { operData.circuitNurse }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>床位号</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { operData.bedNum }
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
                                        { operData.tfRemark }
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Panel>
                <Panel key='4' header='产品信息'>
                    <Table 
                        columns={columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        rowKey={'chargeDetallGuid'}
                        scroll={{x : '150%'}}
                        footer={footer}
                    />
                </Panel>
            </Collapse>
        </div>
    )
    }
}
module.exports = Details;