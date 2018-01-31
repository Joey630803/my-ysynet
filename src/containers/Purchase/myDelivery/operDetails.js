/**
 * @file 送货单 手术订单明细
 */
import React from 'react';
import { Breadcrumb, Row, Col, Button, Tabs } from 'antd';
import { Link } from 'react-router';
import Product from './operShow/product';
import ToolsBag from './operShow/toolsBag'
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { purchase } from 'api';

const TabPane = Tabs.TabPane;

class OperDetails extends React.Component{
	state = {
		activeKey: 'product',
        patientInfo : '',
        productData: [],
        operBagData: [],
        applyId:this.props.location.state.applyId,
        sendId:this.props.location.state.orderId 
	}
    componentDidMount = () =>{
         //根据申请单id查询患者信息
         fetchData(purchase.FINDPATIENTOPER_INFO,querystring.stringify({applyId:this.state.applyId}),(data)=>{
            if(data.result){
                this.setState({ patientInfo:data.result })
            }
          });
    }
    getDeliveryType = (value) =>{
        if(value === 'DELIVERY'){
            return '普耗送货单'
        }else if(value === 'HIGH_DELIVERY'){
            return '高值送货单'
        }else if(value === 'OPER_DELIVERY'){
            return '手术送货单'
        }else if(value === 'SETTLE_DELIVERY'){
            return '结算送货单'
        }
    }
	render () {
		const query = typeof this.props.location.query === 'undefined' ? {} : this.props.location.query
        const selectTab = typeof query.activeKey === 'undefined' ? 'product' : query.activeKey;
        const baseData = this.props.location.state;
        const exportHref = purchase.EXPORTDELIVERYDETAILS+"?"+querystring.stringify({sendId:baseData.sendId});
        const patientInfo = this.state.patientInfo;
		return (
			<div>
		<Row>
            <Col span={6}>
                <Breadcrumb style={{fontSize: '1.1em',marginBottom:16}}>
                <Breadcrumb.Item><Link to='/purchase/myOrder'>我的订单</Link></Breadcrumb.Item>
                <Breadcrumb.Item>详情</Breadcrumb.Item>
                </Breadcrumb>
            </Col>
            <Col className='ant-col-18' style={{textAlign:'right'}}>
            <a href={exportHref}>
                <Button type="primary" style={{marginRight:8}}>导出</Button>
            </a>
            </Col>
        </Row>
        <h2 style={{marginBottom:10}}>基本信息</h2>
        <Row>
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
                      <label>订单号</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                            { baseData.orderNo }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-6 ant-form-item-label-left">
                      <label>收货地址</label>
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
                      <label>送货单类型</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                          { this.getDeliveryType(baseData.orderType) }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-6 ant-form-item-label-left">
                      <label>制单人</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                          { baseData.sendUsername }
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
                          { baseData.sendDate }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-6 ant-form-item-label-left">
                      <label>验收人</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                          { baseData.checkUserName }
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
                          { baseData.checkTime }
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
                          { baseData.fstateName }
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
                            { baseData.fOrgName }
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
                          { baseData.rejectReson }
                      </div>
                  </div>
              </div>
          </Col>
        </Row>
        <h2 style={{marginBottom:10}}>手术信息</h2>
        <Row>
          <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-6 ant-form-item-label-left">
                      <label>就诊号</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                          { patientInfo.treatmentNo }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className="ant-col-5">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>患者姓名</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                            { patientInfo.name }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className="ant-col-7">
              <div className="ant-row">
                  <div className="ant-col-6 ant-form-item-label-left">
                      <label>性别</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                          { patientInfo.gender }
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
                            { patientInfo.age }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className='ant-col-6'>
              <div className="ant-row">
                  <div className="ant-col-6 ant-form-item-label-left">
                      <label>手术名称</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                            { patientInfo.operName }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className="ant-col-5">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>手术日期</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { patientInfo.operDate }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className="ant-col-7">
              <div className="ant-row">
                  <div className="ant-col-6 ant-form-item-label-left">
                      <label>品牌</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                          { baseData.tfBrand }
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
                          { patientInfo.tfRemark }
                      </div>
                  </div>
              </div>
          </Col>
        </Row>
        <Tabs defaultActiveKey={selectTab} >
            <TabPane tab="产品" key="product">
                <Product  router={this.props.router} 
                data={baseData}/>
            </TabPane>
            <TabPane tab="工具包" key="tools" >
                <ToolsBag router={this.props.router} 
                data={baseData}
                />
            </TabPane> 
        </Tabs>
			</div>)
	}
}
module.exports = OperDetails;