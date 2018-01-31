/**
 * 入库
 */
import React from 'react';
import {  Row, Col, Breadcrumb,Table,Collapse,Input ,Button,Modal,message  } from 'antd';
import { Link ,hashHistory} from 'react-router';
import { fetchData } from 'utils/tools';
import { storage } from 'api';  
import querystring from 'querystring';

const Panel = Collapse.Panel;
class WareHouseAdd extends React.Component{
    state = {
        dataSource:[],
        baseData:""
    }
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    //搜索送货单
    handleSearch = (e) =>{
        e.preventDefault();
        //获取input的值
        const sendNo = this.refs.sendNo.refs.input.value ;
        console.log(sendNo,"送货单号")
        //根据送货单号查询信息
        fetchData(storage.FINDDELIVERYINFO,querystring.stringify({sendNo:sendNo}),(data)=>{
            if(data.result){
                const dataInfo = data.result;
                this.setState({ 
                    baseData : dataInfo,
                    dataSource : dataInfo.detailList
                })
            }else{
                message.info("该单号无数据信息!")
            }
        })
    }
    //提交
    handleSumbit = () =>{
        const orderType = this.state.baseData.orderType;
        let postData = {};
        postData.applyID = this.state.baseData.applyID;
        postData.sendId = this.state.baseData.sendId;
        postData.orderType = orderType;
        postData.remark = this.refs.remark.refs.input.value ;
        console.log(postData,"确认提交的数据")
        fetchData(storage.NEWINSTOCK,querystring.stringify(postData),(data) => {
            if(data.status){
                message.success("操作成功!");
                if(data.result.outId){
                    window.open(storage.PRINTOUTDETAIL+"?"+querystring.stringify({ outId: data.result.outId }));
                }
                window.open(storage.PRINTIMPORTDETAIL+"?"+querystring.stringify({ inId:data.result.inId }));          
                hashHistory.push({pathname:'/storage/wareHouse',query:{activeKey:'1'}});
            }else{
                this.handleError(data.msg)
            }

        })
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
            render:(text,record)=>{
                return text === 'undefined'|| text===null ? '0':text.toFixed(2);
            }
            }, {
            title: '数量',
            dataIndex: 'amount',
            }, {
            title: '金额',
            dataIndex: 'price',
            render:(text,record)=>{
                return text === 'undefined'|| text===null ? '0':text.toFixed(2);
            }
            }, {
            title: '生产批号',
            dataIndex: 'flot',
            }, {
            title: '生产日期',
            dataIndex: 'prodDate',
            }, {
            title: '有效期',
            dataIndex: 'usefulDate',
            }, {
            title: '供应商',
            dataIndex: 'orgName',
            }, {
            title: '生产商',
            dataIndex: 'produceName',
            }
        ];
   
        const { baseData } = this.state;
        const footer = () => {
            return <Row><Col className="ant-col-6">总金额:{baseData===""?"0.00": baseData.sumPrice.toFixed(2)}</Col></Row>
        }; 
        return (
            <div>
            { this.props.children || 
                <div>
                    <Row>
                        <Col className="ant-col-6">
                            <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                <Breadcrumb.Item><Link to={{pathname:'/storage/wareHouse',query:{activeKey:'1'}}}>入库管理</Link></Breadcrumb.Item>
                                <Breadcrumb.Item>新建入库</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-4" style={{textAlign:'right',marginTop:10,color:"#ff00ff"}}>
                                    *
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                      <Input placeholder="输入送货单号" ref="sendNo" onPressEnter={this.handleSearch}/>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-6">
                            <Button type="primary" onClick={this.handleSearch}> 搜索</Button>
                        </Col>
                        <Col className="ant-col-12" style={{textAlign:'right'}}>
                            <Button type="primary" onClick={this.handleSumbit}> 提交</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="ant-col-6">
                            <div className="ant-row">
                                <div className="ant-col-4 ant-form-item-label-left">
                                    <label>备注</label>
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                        <Input ref="remark"/>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Collapse defaultActiveKey={['1','2']}>
                        <Panel header="单据信息" key="1">
                            <Row>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>送货单</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                {baseData==="" ? "" :baseData.sendNo}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>订单</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                {baseData==="" ? "" :baseData.orderNo}
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
                                                {baseData==="" ? "" :baseData.storageName}
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
                                                {baseData==="" ? "" :baseData.fOgName}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>验收员</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                {baseData===""? "" :baseData.ysr}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>验收时间</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                {baseData==="" ? "" :baseData.yssj}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>收货信息</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                {baseData==="" ? "" :(baseData.lxr+baseData.lxdh+baseData.tfAddress)}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Panel>
                        <Panel header="产品信息" key="2">
                        <Table 
                        columns={columns} 
                        dataSource={this.state.dataSource} 
                        pagination={false}
                        size="small"
                        rowKey='sendDetailGuid'
                        footer={footer}
                        scroll={{ x: '150%' }}
                        />
                        </Panel>
                    </Collapse>
                </div>
            }
            </div>
        )
    }
}
module.exports = WareHouseAdd;