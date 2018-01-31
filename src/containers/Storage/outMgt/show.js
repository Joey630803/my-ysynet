/**
 * @file 出库记录 详情
 */
import React from 'react';
import {  Row, Col, Breadcrumb ,Table, Collapse, message,Button } from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { storage } from 'api';
const Panel = Collapse.Panel;

class OutOrderDetail extends React.Component{
    state = {
        dataSource : []
    }
    //根据出库单Guid 查询详情
    componentDidMount = () =>{
        fetchData(storage.SELECTOUTPORTDETAILLIST,querystring.stringify({outId:this.props.location.state.outId}),(data)=>{
            if(data.status){
                this.setState({ dataSource:data.result });
            }else{
                message.error('后台异常！');
            }
        })
    }
    total = () => {
        let total = 0;
        this.state.dataSource.map( (item, index) => {
          let money = typeof item.tenderMoney === 'undefined' ? 0 : item.tenderMoney
          return total += money;
        })
        return total.toFixed(2);
    }
    getOutTypes = (value)=>{
        if(value === '01'){
            return '拣货单出库'
        }else if(value === '02'){
            return '科室领用出库'
        }else if(value === '03'){
            return '申购出库'
        }else if(value === '04'){
            return '盘亏出库'
        }else if(value === '05'){
            return '退库出库'
        }else if(value === '06'){
            return '结算出库'
        }
    }
    render(){
        const dataSource = this.state.dataSource;
        const baseData = this.props.location.state;
        const columns = [{
            title : '二维码',
            dataIndex : 'qrcode'
        },{
            title:'产品名称',
            dataIndex :'materialName'
        },{
            title :'通用名称',
            dataIndex :'geName'
        },{
            title:'型号',
            dataIndex:'fmodel'
        },{
            title:'规格',
            dataIndex:'spec'
        },{
            title:'采购单位',
            dataIndex:'purchaseUnit'
        },{
            title:'生产批号',
            dataIndex:'flot'
        },{
            title:'生产日期',
            dataIndex:'prodDate'
        },{
            title:'有效期',
            dataIndex:'usefulDate'
        },{
            title:'出库数量',
            dataIndex:'cksl'
        },{
            title:'采购价格',
            dataIndex:'purchasePrice',
            render: (text, record, index)=>{
                return text === undefined ? '0.00':text.toFixed(2);
            }
        },{
            title:'金额',
            dataIndex:'tenderMoney',
            render: (text, record, index)=>{
                return text === undefined ? '0.00':text.toFixed(2);
            }
        },{
            title:'供应商',
            dataIndex:'fOrgName'
        },{
            title:'生产商',
            dataIndex:'produceName'
        }];
        const footer = () => {
            return <Row style={{fontSize: '1.5em'}}><Col className="ant-col-6">总金额:{this.total()}</Col></Row>
        }
        return (
        <div>
            <Row>
                <Col className="ant-col-6">
                    <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/outMgt',query:{activeKey:'1'}}}>出库记录</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>出库单详情</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col className="ant-col-18" style={{textAlign:'right'}}>
                    <Button type='primary' onClick={()=>window.open(storage.PRINTOUTDETAIL+"?"+querystring.stringify({ outId:this.props.location.state.outId }))}>打印</Button>
                    <a href={storage.EXPORTOUTDETAIL+"?"+querystring.stringify({outId:this.props.location.state.outId})}><Button type="primary" style={{marginRight:8,marginLeft:8}}>导出</Button></a>
                </Col>
            </Row>
            <Collapse defaultActiveKey={['1','2']}>
                    <Panel header="单据信息" key="1">
                        <Row>
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
                                            { baseData.createUserName }
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col className="ant-col-6">
                                <div className="ant-row">
                                    <div className="ant-col-6 ant-form-item-label-left">
                                        <label>出库方式</label>
                                    </div>
                                    <div className="ant-col-18">
                                        <div className="ant-form-item-control">
                                            { this.getOutTypes(baseData.outType) }
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col className="ant-col-6">
                                <div className="ant-row">
                                    <div className="ant-col-6 ant-form-item-label-left">
                                        <label>出库时间</label>
                                    </div>
                                    <div className="ant-col-18">
                                        <div className="ant-form-item-control">
                                            { baseData.outDate }
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col className="ant-col-6">
                                <div className="ant-row">
                                    <div className="ant-col-6 ant-form-item-label-left">
                                        <label>出库单号</label>
                                    </div>
                                    <div className="ant-col-18">
                                        <div className="ant-form-item-control">
                                            { baseData.outNo }
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col className="ant-col-6">
                                <div className="ant-row">
                                    <div className="ant-col-6 ant-form-item-label-left">
                                        <label>拣货单号</label>
                                    </div>
                                    <div className="ant-col-18">
                                        <div className="ant-form-item-control">
                                            { baseData.pickNo }
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col className="ant-col-6">
                                <div className="ant-row">
                                    <div className="ant-col-6 ant-form-item-label-left">
                                        <label>领用科室</label>
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
                                        <label>领用人</label>
                                    </div>
                                    <div className="ant-col-18">
                                        <div className="ant-form-item-control">
                                            { baseData.lyr }
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
                                            { baseData.tfRemark  }
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Panel>
                    <Panel header="产品信息" key="2">
                        <Table 
                            columns={columns} 
                            dataSource={dataSource} 
                            pagination={false}
                            size="small"
                            rowKey='outportDetailGuid'
                            footer={footer}
                            scroll={{ x: '150%' }}
                        />
                    </Panel>
                </Collapse>
        </div>
        )
    }
}
module.exports = OutOrderDetail;