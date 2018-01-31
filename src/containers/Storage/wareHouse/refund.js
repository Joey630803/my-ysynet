/**
 * 退货
 */
import React from 'react';
import {  Row, Col, Breadcrumb,Table,Collapse,Input ,Button,message,Modal  } from 'antd';
import { Link ,hashHistory} from 'react-router';
import { fetchData } from 'utils/tools';
import { storage } from 'api';  
import querystring from 'querystring';

const Panel = Collapse.Panel;
class WareHouseRefund extends React.Component{
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
    handleSearch = () =>{
        //获取input的值
        const searchName = this.refs.searchName.refs.input.value ;
        console.log(searchName,"送货单号")
        //根据送货单号查询信息
        fetchData(storage.FINDBACKINNODETAILS,querystring.stringify({searchName:searchName}),(data)=>{
            if(data.result){
                this.setState({ baseData : data.result,dataSource : data.result.detailList})
            }else{
                message.info("该单号无数据信息!")
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
    handleChange = (record, index,e) => {
        const value = e.target.value;
        let { dataSource } = this.state; 
        dataSource[index].thsl = value;
        this.setState({dataSource : dataSource})
        if (/^\d+$/.test(value)) {
            if(value > record.xcsl){
                return message.warn("退货数量不能大于可退数量")
            }
        }else {
            return message.warn('请输入非0正整数')
        }
       
    }
    handleOk = () =>{
        let postData = {};
        const dataSource  = this.state.dataSource;
        postData.inId  = this.state.baseData.inId;
        postData.remark = this.refs.remark.refs.input.value ;
        const detailList = [];
        dataSource.forEach((item) => {
            detailList.push({
                importDetailGuid:item.importDetailGuid,
                thsl:item.thsl ,
            })
        })
        postData.detailList = detailList;
        console.log(postData,"保存数据");
        fetchData(storage.INSERTBACKNODETAILS,JSON.stringify(postData),(data)=>{
            if(data.status){
                message.success("操作成功!")
                hashHistory.push({pathname:'/storage/wareHouse',query:{activeKey:'1'}});
            }else{
                this.handleError(data.msg)
            }
            
        },'application/json')
    }
    render(){
        const columns = [{
            title: '退货数量',
            dataIndex: 'thsl',
            width: 100,
            render: (text, record, index) => {
                return <Input
                        defaultValue={text || 0}
                        min={1} onInput={this.handleChange.bind(this, record, index)}/>
              }
            }, {
            title: '入库数量',
            dataIndex: 'rksl',
            width: 100,
            }, {
            title: '可退数量',
            dataIndex: 'xcsl',
            width: 100,
            }, {
            title: '二维码',
            dataIndex: 'qrcode  ',
            width: 150,
            },{
            title: '通用名称',
            dataIndex: 'geName',
            width: 200,
            }, {
            title: '产品名称',
            dataIndex: 'materialName',
            width: 200,
            }, {
            title: '规格',
            dataIndex: 'spec',
            width: 120,
            }, {
            title: '型号',
            dataIndex: 'fmodel',
            width: 120,
            }, {
            title: '采购单位',
            dataIndex: 'purchaseUnit',
            width: 100,
            }, {
            title: '生产批号',
            dataIndex: 'flot',
            width: 150,
            }, {
            title: '生产日期',
            dataIndex: 'prodDate',
            width: 150,
            }, {
            title: '有效期',
            dataIndex: 'usefulDate',
            width: 150,
            }, {
            title: '供应商',
            dataIndex: 'orgName',
            width: 180,
            }, {
            title: '生产商',
            dataIndex: 'produceName',
            width: 180,
            }
        ];
       
        const footer = () => {
            return <Row><Col className="ant-col-6">总金额:{this.total()}</Col></Row>
        }; 
        const { baseData } = this.state;
        return (
            <div>
            { this.props.children || 
                <div>
                     <Row>
                        <Col className="ant-col-6">
                            <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                <Breadcrumb.Item><Link to={{pathname:'/storage/wareHouse',query:{activeKey:'1'}}}>入库管理</Link></Breadcrumb.Item>
                                <Breadcrumb.Item>退货</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
        
                    </Row>
                    <Row>
                        <Col className="ant-col-8">
                            <div className="ant-row">
                                <div className="ant-col-4" style={{textAlign:'right',marginTop:10,color:"#ff00ff"}}>
                                    *
                                </div>
                                <div className="ant-col-18">
                                    <div className="ant-form-item-control">
                                      <Input placeholder="输入入库单号/送货单号或扫描产品二维码" ref="searchName"/>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-4">
                            <Button type="primary" onClick={this.handleSearch}> 搜索</Button>
                        </Col>
                        <Col className="ant-col-12" style={{textAlign:'right'}}>
                            <Button type="primary" onClick={this.handleOk}> 确认</Button>
                        </Col>
                    </Row>
                    <Row>
                    <Col className="ant-col-8">
                            <div className="ant-row">
                                <div className="ant-col-4 ant-form-item-label-left">
                                    <label>退货备注</label>
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
                                            <label>入库单</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                {baseData==="" ? "" :baseData.inNo}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
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
                                            <label>供应商</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                {baseData==="" ? "" :baseData.orgName}
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
                                            <label>操作员</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                            {baseData==="" ? "" :baseData.createUsername}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>入库方式</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                {baseData==="" ? "" :baseData.inmode}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>入库时间</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                {baseData==="" ? "" :baseData.indate}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>入库备注</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                {baseData==="" ? "" :baseData.inRemark}
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
                        rowKey='importDetailGuid'
                        footer={footer}
                        scroll={{ x: '160%' }}
                        />
                        </Panel>
                    </Collapse>
                </div>
            }
            </div>
        )
    }
}
module.exports = WareHouseRefund;