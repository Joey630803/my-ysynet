/**
 * 盘点记录详情--已确认
 */
import React from 'react';
import {  Row, Col, Breadcrumb,Table,Collapse,Input  } from 'antd';
import { Link} from 'react-router';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { storage } from 'api';  

const Search = Input.Search;
const Panel = Collapse.Panel;
class InventoryMgtShowC extends React.Component{
    state = {
        dataSource:[]
    }
    componentDidMount = () => {
    //根据盘点Id查询产品列表
      fetchData(storage.GETSTOCKTAKINGDETAILLIST,querystring.stringify({kcpdId:this.props.location.state.kcpdId}),(data=>{
          this.setState({dataSource: data.result})
       }));
    }
    handleSearch = (value)=>{
     //根据查询添加查询产品列表
      fetchData(storage.GETSTOCKTAKINGDETAILLIST,querystring.stringify({searchName:value,kcpdId:this.props.location.state.kcpdId}),(data=>{
        this.setState({dataSource: data.result})
     }));
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
            },{
            title: '实际数量',
            dataIndex: 'sjsl',
            }, {
            title: '实际金额',
            dataIndex: 'actualPrice',
            }, {
            title: '账面数量',
            dataIndex: 'zmsl',
            }, {
            title: '账面金额',
            dataIndex: 'paperPrice',
            }, {
            title: '盈亏数量',
            dataIndex: 'yksl',
            render: (text,record,index)=>{
                return Number(record.sjsl) - Number(record.zmsl)
            }
            }, {
                title: '盈亏金额',
                dataIndex: 'ykPrice',
                render: (text,record,index)=>{
                    return (Number(record.sjsl) - Number(record.zmsl)) * record.purchasePrice
                }
            }, {
            title: '供应商',
            dataIndex: 'fOrgName',
            }, {
            title: '生产商',
            dataIndex: 'productName',
            }
        ];

        const baseData = this.props.location.state;
        return (
            <div>
            { this.props.children || 
                <div>
                     <Row>
                        <Col className="ant-col-6">
                            <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                <Breadcrumb.Item><Link to={{pathname:'/storage/inventoryMgt'}}>盘点管理</Link></Breadcrumb.Item>
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
                                            <label>盘点单号</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                            {baseData.kcpdNo}
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
                                            {baseData.fstateName}
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
                                            {baseData.rStorageName}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>盘点周期</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                            {baseData.kcpdDate}
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
                                            {baseData.createUserName}
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
                                            {baseData.createTime}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Panel>
                        <Panel header="产品信息" key="2">
                        <Row style={{marginBottom:8}}>
                            <Col span={12}>
                            <Search
                                placeholder="请输入产品名称/通用名称/供应商"
                                style={{ width: 300 }}
                                onSearch={this.handleSearch}
                            />
                            </Col>
                        </Row>
                        <Table 
                        columns={columns} 
                        dataSource={this.state.dataSource} 
                        pagination={true}
                        size="small"
                        rowKey='kcpdDetailGuid'
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
module.exports = InventoryMgtShowC;