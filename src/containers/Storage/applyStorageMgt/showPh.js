/**
 * 普耗计划详情
 */
import React from 'react';
import {  Row, Col, Breadcrumb ,Table,Collapse,Radio,Button,message,Modal,Input } from 'antd';
import { Link ,hashHistory} from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { storage } from 'api'

const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;

class PhPlanShow extends React.Component{
     state = {
        dataSource:[],
        billTypes: [],
        loading: false,
    }
    componentDidMount = () => {
        //根据普耗计划id查询产品列表
        fetchData(storage.SEARCHAPPLYDETAILSLIST,querystring.stringify({applyId:this.props.location.state.applyId,applyType:this.props.location.state.applyType}),(data)=>{
            if(data.result.length >0 ){
                const dataSource = data.result;
                dataSource.map((item,index)=>{
                    if(item.sendMode === null){
                        item.sendMode = '00';
                        return null;
                    }
                    return null;
                });
                this.setState({
                    dataSource: dataSource,
                })
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
    handPlanType = (value) => {
        if(value === "APPLY"){
            return "普耗申请单";
        }else if(value === "HIGH_APPLY"){
            return "高值备货单"
        }else if(value === "OPER_APPLY"){
            return "手术备货单"
        }
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
    handleRadioChange = (record, e) => {
        const dataSource = this.state.dataSource;
        console.log(e.target.value)
        dataSource.map((item,index) => {
            if(record.applyDetailGuid === item.applyDetailGuid){
                item.sendMode = e.target.value
            }
            return null;
        })
    }

    handerNotPass = ()=>{
        const that = this;
        that.showModal();
    }
    showModal = ()=>{
        this.setState({visible:true})
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    //驳回
    handleOk = () => {
        const selectReason = this.refs.failReason.refs.input.value;
        if(selectReason.length>200){
            return message.error('长度不能超过200')
        }

        const values = {};
        values.applyId = this.props.location.state.applyId;
        values.applyType = "APPLY";
        values.applyFstate = this.props.location.state.fstate;
        values.isExist = selectReason;
        const applyDetailList = [];
        const dataSource = this.state.dataSource;
        dataSource.map((item,index)=>{
           return applyDetailList.push({applyDetailGuid : item.applyDetailGuid,sendMode:item.sendMode});
        })
        values.applyDetailList = applyDetailList;
        this.setState({ loading: true });
        console.log('驳回postData',values);
        //驳回
        fetchData(storage.CREATEPLAN,JSON.stringify(values),(data)=>{
            this.setState({ loading: false, visible: false });
            if(data.status){
                message.success("操作成功!");
                hashHistory.push('/storage/applyStorageMgt');
            }
            else{
                message.error(data.msg);
            }
        },'application/json')
    }
    //确认
    handleConfirm = ()=>{
        const values = {};
        values.applyId = this.props.location.state.applyId;
        values.applyType = "APPLY";
        values.applyFstate = this.props.location.state.fstate;
        const applyDetailList = [];
        const dataSource = this.state.dataSource;
        dataSource.map((item,index)=>{
           return applyDetailList.push({applyDetailGuid : item.applyDetailGuid,sendMode:item.sendMode});
        })
        values.applyDetailList = applyDetailList;
        console.log(values,"确认信息")
        fetchData(storage.CREATEPLAN,JSON.stringify(values),(data)=>{
            if(data.status){
                hashHistory.push('/storage/applyStorageMgt');
                message.success("操作成功")
            }else{
                message.error(data.msg)
            }
        },'application/json')
    }

    render(){
        const { dataSource  } = this.state;
        const baseData = this.props.location.state;
        const columns = baseData.fstate==="20" ? [{
                    title : '操作',
                    dataIndex : 'sendMode',
                    width:120,
                    render : (text,record)=>{
                        return <RadioGroup defaultValue={text} onChange={this.handleRadioChange.bind(this,record)}>
                                <Radio value="00">采购</Radio>
                                <Radio value="01">派送</Radio>
                            </RadioGroup>
                    }

                },{
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
                title: '申请数量',
                dataIndex: 'amount',
                }, {
                title: '生产商',
                dataIndex: 'produceName',
                }
            ]:
            [{
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
            title: '申请数量',
            dataIndex: 'amount',
            }, {
            title: '生产商',
            dataIndex: 'produceName',
            }
            ]
            ;
 
        const footer = () => {
            return <Row><Col className="ant-col-6">总金额:{this.total()}</Col></Row>
        }; 
        return (
            <div>
                <Row>
                <Modal
                        visible={this.state.visible}
                        title={'驳回？'}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                        <Button key="back" size="large"  onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                            确认
                        </Button>
                        ]}
                    >
                        <Input style={{marginTop:'16px'}} placeholder="请填写驳回原因" ref='failReason' type="textarea" rows={4}/>
                 </Modal>
                    <Col className="ant-col-6">
                         <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/applyStorageMgt'}}>申请管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>详情</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    {
                        baseData.fstate==="20" ? 
                        <Col className="ant-col-18" style={{textAlign:'right'}}>
                            <Button  type="primary" onClick={this.handleConfirm} style={{marginRight:'16px'}}>确认</Button>
                            <Button type="primary" onClick={this.handerNotPass}>驳回</Button>
                        </Col>
                        :null
                    }
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
                                        { baseData.applyNo }
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
                                        { this.handPlanType(baseData.applyType) }
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
                                    { baseData.fstateName}
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
                                        { baseData.applyTime }
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
                                    { baseData.tfAddress +"|"+ baseData.lxr +"|"+ baseData.lxdh }
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
                                        { baseData.qrr  }
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
                                        { baseData.applyReject }
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
module.exports = PhPlanShow;
