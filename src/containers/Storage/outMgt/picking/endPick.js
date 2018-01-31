/**
 * @file 拣货单-完结
 */
import React from 'react';
import {  Row, Col, Breadcrumb ,Table,Collapse, message } from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { storage } from 'api';
const Panel = Collapse.Panel;

class EndPicking extends React.Component{
    state = {
        dataSource : []
    }
    //根据申请单id查询table 数据
    componentDidMount = () =>{
        fetchData(storage.SEARCHPICKDETAILS,querystring.stringify({applyId:this.props.location.state.applyId}),(data)=>{
            if(data.status){
                this.setState({dataSource:data.result});
            }else{
                message.error('后台异常！');
            }
        })
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
        const dataSource = this.state.dataSource;
        const baseData = this.props.location.state;
        const columns = [{
            title : '申请数量',
            dataIndex : 'amount',
        },{
            title:'出库数量',
            dataIndex :'cksl'
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
            title:'供应商',
            dataIndex:'fOrgName'
        },{
            title:'生产商',
            dataIndex:'produceName'
        }];
        const footer = () => {
            return <Row><Col className="ant-col-6">总金额:{this.total()}</Col></Row>
        }
        return (
        <div>
            <Row>
                <Col className="ant-col-6">
                    <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/outMgt',query:{activeKey:'1'}}}>出库记录</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/outMgt/picking'}}>拣货</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>拣货单</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>
            <Collapse defaultActiveKey={['1','2']}>
                    <Panel header="单据信息" key="1">
                        <Row>
                            <Col className="ant-col-6">
                                <div className="ant-row">
                                    <div className="ant-col-6 ant-form-item-label-left">
                                        <label>拣货单</label>
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
                                        <label>申请单</label>
                                    </div>
                                    <div className="ant-col-18">
                                        <div className="ant-form-item-control">
                                            { baseData.applyNo }
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
                                            { baseData.pickFstate==='10'?'待确认':'完结'}
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
                            <Col className="ant-col-6">
                                <div className="ant-row">
                                    <div className="ant-col-6 ant-form-item-label-left">
                                        <label>科室地址</label>
                                    </div>
                                    <div className="ant-col-18">
                                        <div className="ant-form-item-control">
                                        { baseData.tfAddress }
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col className="ant-col-6">
                                <div className="ant-row">
                                    <div className="ant-col-6 ant-form-item-label-left">
                                        <label>申请时间</label>
                                    </div>
                                    <div className="ant-col-18">
                                        <div className="ant-form-item-control">
                                            { baseData.applyTime }
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
                            rowKey='applyDetailGuid'
                            footer={footer}
                            scroll={{ x: '150%' }}
                        />
                    </Panel>
                </Collapse>
        </div>
        )
    }
}
module.exports = EndPicking;