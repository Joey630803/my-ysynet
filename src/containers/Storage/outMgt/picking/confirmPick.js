/**
 * @file 拣货单-待确认
 */
import React from 'react';
import {  Row, Col,Input, Breadcrumb , Table, Collapse, Button, Modal,message } from 'antd';
import { Link, hashHistory } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { storage } from 'api';
const Panel = Collapse.Panel;
const confirm = Modal.confirm;
class ConfirmPick extends React.Component{
    state = {
        dataSource : [],
        isConfirm : true//确认
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
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    total = () => {
        let total = 0;
        this.state.dataSource.map( (item, index) => {
          let amount = typeof item.pickNum === 'undefined' ? 1 : item.pickNum
          return total += amount * item.purchasePrice;
        })
        return total.toFixed(2);
    }
    handleChange = (record, index,e) => {
        let amount = e.target.value;
        if (/^\d+$/.test(amount)) {
            if( amount > record.xcsl){
                this.setState({isConfirm:false});
                return message.warn('拣货数量不得大于当前库存数量')
            }else if( amount > (record.amount - record.cksl) ){
                this.setState({isConfirm:false});
                return message.warn('拣货数量不得大于未出数量');
            }else{
                let { dataSource } = this.state; 
                dataSource[index].pickNum = amount;
                this.setState({ dataSource ,isConfirm: true });
            }
        }else{
            this.setState({isConfirm:false})
            return message.warn('请输入非0正整数');
        }
        
    }
    //确认
    admit = ()=>{
        const that = this;
        confirm({
            title: '提示',
            okText:'确认',
            cancelText:'取消' ,
            content: '是否确认此拣货单信息？',
            onOk() {
                if(that.state.isConfirm){
                    let dataSource = that.state.dataSource;
                    if(dataSource.length > 0){
                        let postData = {}, pickDetailList = [];
                        postData.applyId = that.props.location.state.applyId;
                        dataSource.map((item,index) =>{
                            if(item.xcsl > 0 && item.pickNum <= (item.amount-item.cksl) ){
                                return pickDetailList.push({
                                    tenderMaterialGuid: item.tenderMaterialGuid,
                                    applyDetailGuid: item.applyDetailGuid,
                                    pickNum: item.pickNum
                                })
                            }
                            return null;
                        });
                        if(pickDetailList.length > 0){
                            postData.pickDetailList = pickDetailList;
                            console.log(postData,'postData');
                            fetchData(storage.SAVEPICKDETAILSOUT,JSON.stringify(postData),(data)=>{
                                if(data.status){
                                    message.success('操作成功！');
                                    if(data.result.outId){
                                        window.open(storage.PRINTOUTDETAIL+"?"+querystring.stringify({ outId: data.result.outId }));
                                    }
                                    hashHistory.push({
                                        pathname:'/storage/outMgt/picking'
                                    })
                                }else{
                                    that.handleError(data.msg);
                                }
                            },'application/json');
                        }else{
                            message.warn('请检查当前产品信息');
                        }
                    }
                }else{
                    message.warn('请检查拣货数量是否填写正确');
                }
                
            }
        })
    }
    //完结
    endOrder = () =>{
        const that = this;
        confirm({
            title: '提示',
            okText:'确认',
            cancelText:'取消' ,
            content: '是否完结此拣货单信息？',
            onOk() {
                fetchData(storage.ENDPICKAPPLY,querystring.stringify({applyId:that.props.location.state.applyId}),(data)=>{
                    if(data.status){
                        message.success('操作成功！');
                        hashHistory.push({
                            pathname: '/storage/outMgt/picking'
                        })
                    }else{
                        this.handleError(data.msg);
                    }
                });
            }
        })
        
    }
    render(){
        const dataSource = this.state.dataSource;
        const baseData = this.props.location.state;
        const columns = [{
            title : '拣货数量',
            dataIndex : 'pickNum',
            width: 80,
            render: ( text, record, index )=>{
                return <Input  defaultValue={text} min={0} max={text} onChange={this.handleChange.bind(this, record, index)}/>
            }
        },{
            title:'当前库存',
            dataIndex :'xcsl'
        },{
            title:'申请数量',
            dataIndex :'amount'
        },{
            title:'已出数量',
            dataIndex :'cksl',
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
            return <Row style={{fontSize: '1.5em'}}><Col className="ant-col-6">总金额:{this.total()}</Col></Row>
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
                                            { baseData.pickFstate==='10'?'待确认':'完结' }
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
            <Row style={{marginTop:20}}>
                <Col span={11} style={{textAlign:'right',marginRight:10}}>
                    <Button type='primary' onClick={this.admit}>确认</Button>
                </Col>
                <Col span={11} style={{textAlign:'left',marginLeft:10}}>
                    <Button type='primary' onClick={this.endOrder}>完结</Button>
                </Col>
            </Row>
        </div>
        )
    }
}
module.exports = ConfirmPick;