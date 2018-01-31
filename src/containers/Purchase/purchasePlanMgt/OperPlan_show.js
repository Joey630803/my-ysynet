/**
 * @手术计划单详情
 */

import React from 'react';
import { Breadcrumb, Row, Col, Button, Table } from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { purchase } from 'api';

class OperPlanShow extends React.Component{
	state={
		isloading:false,
    operData:[]
	}
  //根据手术单id查询明细列表
  componentDidMount = () =>{
    fetchData(purchase.FINDSURGERYBRANDDETAIL,querystring.stringify({planId:this.props.location.state.planId}),(data)=>{
      this.setState({ operData:data.result })
    })
  }
  showFsource =(value)=>{
    if(value==='01')
    {
      return '科室申请'
    }
    else if(value==='02')
    {
      return '库房申请'
    }
  }
	render(){
		const columns = [{
			title:'品牌',
			dataIndex:'tfBrandName'
		},{
			title:'供应商',
			dataIndex:'fOrgName'
		},{
			title:'联系人',
			dataIndex:'lxr'
		},{
			title:'联系电话',
			dataIndex:'lxdh'
		}]
		const baseData = this.props.location.state;
    const exportData = {planId:baseData.planId,planType:baseData.planType,fsource:baseData.fsource}
    const exportHref = purchase.EXPORTPLANDETAIL_LIST+"?"+querystring.stringify(exportData);
		return (<div> 
          <Row>
            <Col className='ant-col-6'>
      				<Breadcrumb style={{fontSize: '1.1em'}}>
                	<Breadcrumb.Item><Link to={{pathname:'purchase/purchasePlanMgt',query:{activeKey:'OPER_PLAN',bStorageGuid:baseData.bStorageGuid}}}>手术计划单管理</Link></Breadcrumb.Item>
                	<Breadcrumb.Item>详情</Breadcrumb.Item>
              	</Breadcrumb>
            </Col>
            <Col className='ant-col-18' style={{textAlign:'right'}}>
                <a href={exportHref}><Button type="primary" style={{marginRight:8}}>导出</Button></a>
            </Col>
          </Row>
        	<h2 style={{marginBottom:5}}>申请单信息</h2>
          <Row style={{borderBottom:'solid 1px #ccc'}}>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>科室</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.deptName }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>库房</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.storageName }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-12">
              <div className="ant-row">
                  <div className="ant-col-5 ant-form-item-label-left">
                      <label>收货地址</label>
                  </div>
                  <div className="ant-col-19">
                      <div className="ant-form-item-control">
                          { baseData.shippingAddress }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>到货时间</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.expectDate }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>计划单号</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.planNo }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>计划单来源</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { this.showFsource(baseData.fsource) }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>状态</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.fstateName }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>申请人</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.applyUsername }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>申请时间</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.planTime }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>申请单号</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.applyNo }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>驳回说明</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.planReject }
                      </div>
                  </div>
              </div>
            </Col>
          </Row>
          <h2 style={{marginBottom:5,marginTop:5}}>患者信息</h2>
          <Row style={{borderBottom:'solid 1px #ccc'}}>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>就诊号</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.treatmentNo }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-18">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>手术申请单</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.operNo }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>患者姓名</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.name }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>性别</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.gender }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>年龄</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.age }
                      </div>
                  </div>
              </div>
            </Col>
          </Row>
          <h2 style={{marginBottom:5,marginTop:5}}>手术信息</h2>
          <Row style={{borderBottom:'solid 1px #ccc'}}>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>手术名称</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.operName }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>手术医生</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.operDoctor }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>手术日期</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.operTime }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>麻醉方式</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.mzff }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>手术间</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.operRoom }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>巡回护士</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.circuitNurse }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>床位号</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.bedNum }
                      </div>
                  </div>
              </div>
            </Col>
            <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-8 ant-form-item-label-left">
                      <label>备注</label>
                  </div>
                  <div className="ant-col-16">
                      <div className="ant-form-item-control">
                          { baseData.operRemark }
                      </div>
                  </div>
              </div>
            </Col>
          </Row>
					<Table 
						style={{marginTop:16}}
						columns={columns}
						dataSource={this.state.operData}
						size="small"
						rowKey='planOperDetailGuid'
        	/>
			</div>)
	}
}
module.exports = OperPlanShow;