/**
 * 详情
 */
import React from 'react';
import {  Row, Col, Breadcrumb,Table,Collapse,message,Button } from 'antd';
import { Link } from 'react-router';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { storage } from 'api';  

const Panel = Collapse.Panel;
class WareHouseShow extends React.Component{
    state = {
        dataSource:[]
    }
    componentDidMount = () => {
        //根据入库单Id查询产品列表
      fetchData(storage.WAREHOUSEDETAILSBYINNO,querystring.stringify({InNo:this.props.location.state.InNo}),(data=>{
          if(data.status){
              this.setState({dataSource: data.result})
          }else{
              message.error('后台异常！')
          }
       }));
    }
    total = () => {
        let total = 0;
        this.state.dataSource.map( (item, index) => {
          //let rksl = typeof item.rksl === 'undefined' ? 1 : item.rksl
          return total += Number(item.money);
        })
        return total.toFixed(2);
    }
    render(){
        const columns = [{
            title: '通用名称',
            dataIndex: 'geName',
            width: 150,
            }, {
            title: '产品名称',
            dataIndex: 'materialName',
            width: 150,
            }, {
            title: '规格',
            dataIndex: 'Spec',
            width: 150,
            }, {
            title: '型号',
            dataIndex: 'fModel',
            width: 150,
            }, {
            title: '采购单位',
            dataIndex: 'purchaseUnit',
            width: 100,
            }, {
            title: '采购价格',
            dataIndex:'purchasePrice',
            width: 120,
            render:(text,record)=>{
                return text === undefined || text=== null ? '0':text.toFixed(2);
            }
            },{
            title: '生产批号',
            dataIndex: 'flot',
            width: 120,
            }, {
            title: '生产日期',
            dataIndex: 'prodDate',
            width: 120,
            }, {
            title: '有效期',
            dataIndex: 'usefulDate',
            width: 120,
            }, {
            title: '数量',
            dataIndex: 'rksl',
            width: 100,
            }, {
            title: '供应商',
            dataIndex: 'fOrgName',
            width: 150,
            }, {
            title: '生产商',
            dataIndex: 'produceName',
            width: 150,
            }
        ];
        const footer = () => {
            return <Row><Col className="ant-col-6">总金额:{this.total()}</Col></Row>
        }; 
        const baseData = this.props.location.state;
        
        return (
            <div>
            { this.props.children || 
                <div>
                     <Row>
                        <Col className="ant-col-6">
                            <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                <Breadcrumb.Item><Link to={{pathname:'/storage/wareHouse',query:{activeKey:'1'}}}>入库管理</Link></Breadcrumb.Item>
                                <Breadcrumb.Item>详情</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col className="ant-col-18" style={{textAlign:'right'}}>
                            <Button type='primary' onClick={()=>window.open(storage.PRINTIMPORTDETAIL+"?"+querystring.stringify({ inId:this.props.location.state.inId }))}>打印</Button>
                            <a href={storage.EXPORTWAREDETAIL+"?"+querystring.stringify({inId:this.props.location.state.inId,inNo:this.props.location.state.InNo})}><Button type="primary" style={{marginRight:8,marginLeft:8}}>导出</Button></a>
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
                                                {baseData.storageName}
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
                                            {baseData.create_Username}
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
                                            {baseData.inMode}
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
                                            {baseData.inDate}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>入库单</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                            {baseData.InNo}
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
                                            {baseData.Send_Id}
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
                                            {baseData.orderNo}
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
                                            {baseData.forgName}
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
                                            {baseData.remark}
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
                        rowKey='ImportDerailGuid'
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
module.exports = WareHouseShow;