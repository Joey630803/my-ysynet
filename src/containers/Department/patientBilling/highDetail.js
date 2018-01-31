/**
 * @file 患者计费--高值详情
 */
import React from 'react';
import { Row, Col, Table, Breadcrumb, Button, Collapse, message } from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { department } from 'api';
const Panel = Collapse.Panel;

class HighDetail extends React.Component{
    state = {
        dataSource: [],
        totalPrice: '',
        hisPrice: ''
    }
    componentDidMount = () =>{
        fetchData(department.GETCHARGEDETAIL,querystring.stringify({chargeGuid:this.props.location.state.chargeGuid}),(data)=>{
            if(data.status){
                this.setState({ dataSource: data.result});
            }else{
                message.error(data.msg);
            }
        })
    }
    total = ()=>{
        let price = {
            tenderTotal: 0,
            hisTotal: 0
        };
        const { dataSource } = this.state;
        dataSource.forEach((item,index)=>{
            let amount = typeof item.sl === 'undefined'? '0.00': item.sl;
            price.tenderTotal += amount*item.purchasePrice;
            price.hisTotal += amount*item.hisPrice;
        });
        return price;
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
        const baseData = this.props.location.state;
        const price = this.total();
        const columns = [{
            title : '状态',
            dataIndex : 'chargeFstateName'
        },{
            title : '二维码',
            dataIndex : 'qrcode'
        },{
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
            dataIndex : 'fmodel'
        },{
            title : '采购单位',
            dataIndex : 'purchaseUnit'
        },{
            title : '包装规格',
            dataIndex : 'tfPacking'
        },{
            title : '使用数量',
            dataIndex : 'sl',
        },{
            title : '采购价格',
            dataIndex : 'purchasePrice',
            render:(text,record)=>{
                return text === 'undefined'|| text===null ? '0':text.toFixed(2);
            }
        },{
            title : 'HIS计费价',
            dataIndex : 'hisPrice'
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
        const footer = ()=>{
            return <Row style={{fontSize:'1.1rem'}}>
            <Col className="ant-col-4">总金额:<span style={{color:'red'}}>{price.tenderTotal.toFixed(2)}</span></Col>
            <Col className="ant-col-6">HIS计费总金额:<span style={{color:'red'}}>{price.hisTotal.toFixed(2)}</span></Col>
        </Row>
        };
        const exportHref = department.EXPORTCHARGEDETAIL+"?"+querystring.stringify({
            chargeGuid:this.props.location.state.chargeGuid,chargeType:'01',
            totalPrice:price.tenderTotal.toFixed(2),
            hisPrice:price.hisTotal.toFixed(2)
        })
        return (
        <div>
            <Row>
                <Col className="ant-col-6">
                    <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                        <Breadcrumb.Item><Link to='/department/patientBilling'>患者计费</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>详情</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col className='ant-col-18' style={{textAlign:'right'}}>
                    <a href={exportHref}><Button type='primary'>导出</Button></a>
                </Col>
            </Row>
            <Collapse defaultActiveKey={['1','2','3','4']}>
                <Panel key='1' header='计费清单信息'>
                    <Row>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>计费清单号</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { baseData.chargeNo }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>清单类型</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { baseData.chargeType==='00'? '手术计费': "高值计费" }
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
                                        { this.showFstate(baseData.chargeFstate) }
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
                                        { baseData.sendNo }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>计费科室</label>
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
                                    <label>计费人</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { baseData.chargeUserName }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-6 ant-form-item-label-left">
                                    <label>计费时间</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { baseData.chargeTime }
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
                                        { baseData.treatmentNo }
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
                                        { baseData.operNo + (baseData.operName===null?'': "|" + baseData.operName) }
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
                <Panel key='3' header='手术信息'>
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
                                    <label>手术日期</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        { baseData.operDate }
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
                        <Col className="ant-col-6">
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
                    </Row>
                </Panel>
                <Panel key='4' header='产品信息'>
                    <Table 
                        columns={columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        rowKey={'chargeDetailGuid'}
                        scroll={{x : '140%'}}
                        footer={footer}
                    />
                </Panel>
            </Collapse>
        </div>
        )
    }
}
module.exports = HighDetail;