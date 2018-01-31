/**
 * 结算计划单详情
 */
import React from 'react';
import { Breadcrumb, Row, Col, Table,Button } from 'antd';
import { Link } from 'react-router';
import { purchase } from 'api';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';

class JsPlanShow extends React.Component{
	state = {
		isloading:false,
        planData: []
	}
  componentDidMount = ()=>{
    //根据普耗计划单id 获取产品
    fetchData(purchase.SEARCHPLANDETAIL,querystring.stringify({planId:this.props.location.state.planId}),(data)=>{
        this.setState({ planData: data.result })
    })
  }
  //总金额
    total = () => {
        let total = 0;
        this.state.planData.map( (item, index) => {
        let amount = typeof item.amount === 'undefined' ? 1 : item.amount
        return total += amount * item.purchasePrice;
        })
        return total.toFixed(2);
    }
	render(){
		const columns = [{
			title:'产品名称',
			dataIndex:'materialName',
		},{
			title:'通用名称',
			dataIndex:'geName',
		},{
			title:'规格',
			dataIndex:'spec',
		},{
			title:'型号',
			dataIndex:'fmodel',
		},{
			title:'采购单位',
			dataIndex:'purchaseUnit'
		},{
			title:'采购价格',
			dataIndex: 'purchasePrice',
            render: (text,record,index) => {
                return text === 'undefined'  || text === null ? '0.00' : text.toFixed(2)
            }
		},{
			title:'包装规格',
			dataIndex:'tfPacking'
		},{
			title:'结算数量',
			dataIndex:'amount'
		},{
			title:'金额',
			dataIndex:'price',
			render: (text,record,index) => {
             return (record.amount * record.purchasePrice).toFixed(2)
			}
		},{
			title:'品牌',
			dataIndex:'tfBrand'
		},{
			title:'供应商',
			dataIndex:'fOrgName'
		}]
		
		const baseData = this.props.location.state;
        const footer = this.state.planData.length === 0 ? null : () => <span style={{fontSize: '1.5em'}}>计划单总金额:
                        <a style={{color: '#f46e65'}}>
                        {this.total()}
                        </a>
                    </span>  ;
        const exportData = {planId:baseData.planId,planType:baseData.planType}
         const exportHref = purchase.EXPORTPLANDETAIL_LIST+"?"+querystring.stringify(exportData);
		return (
			<div>
            <Row>
              <Col className='ant-col-6'>
                <Breadcrumb style={{fontSize: '1.1em'}}>
                  <Breadcrumb.Item><Link to={{pathname:'purchase/purchasePlanMgt',query:{activeKey:"JS_PLAN",bStorageGuid:baseData.bStorageGuid}}}>结算计划详情</Link></Breadcrumb.Item>
                  <Breadcrumb.Item>详情</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col className="ant-col-18" style={{textAlign:'right'}}>
                  <a href={exportHref}><Button type="primary" style={{marginRight:8}}>导出</Button></a>
              </Col>
            </Row> 
            <Row style={{marginTop:16}}>
        		<Col className="ant-col-6">
            		<div className="ant-row">
                        <div className="ant-col-9 ant-form-item-label-left">
                          <label>库房</label>
                        </div>
                        <div className="ant-col-15">
                          <div className="ant-form-item-control">
                              { baseData.storageName }
                          </div>
                        </div>
                    </div>
        		</Col>
        		<Col className="ant-col-6">
        			<div className="ant-row">
                        <div className="ant-col-9 ant-form-item-label-left">
                            <label>收货地址</label>
                        </div>
                        <div className="ant-col-15">
                            <div className="ant-form-item-control">
                                { baseData.shippingAddress }
                            </div>
                        </div>
                    </div>
        	    </Col>
            	<Col className="ant-col-6">
            		<div className="ant-row">
                      <div className="ant-col-9 ant-form-item-label-left">
                          <label>计划单号</label>
                      </div>
                      <div className="ant-col-15">
                          <div className="ant-form-item-control">
                              { baseData.planNo }
                          </div>
                      </div>
                    </div>
            	</Col>
                <Col className="ant-col-6">
        			<div className="ant-row">
                        <div className="ant-col-9 ant-form-item-label-left">
                            <label>状态</label>
                        </div>
                        <div className="ant-col-15">
                            <div className="ant-form-item-control">
                                { baseData.fstateName }
                            </div>
                        </div>
                    </div>
        		</Col>
            </Row>
        	<Row>
   
        		<Col className="ant-col-6">
        			<div className="ant-row">
                  <div className="ant-col-9 ant-form-item-label-left">
                      <label>申请人</label>
                  </div>
                  <div className="ant-col-15">
                      <div className="ant-form-item-control">
                          { baseData.planUsername }
                      </div>
                  </div>
              </div>
        		</Col>
        		<Col className="ant-col-6">
        			<div className="ant-row">
                        <div className="ant-col-9 ant-form-item-label-left">
                            <label>申请时间</label>
                        </div>
                        <div className="ant-col-15">
                            <div className="ant-form-item-control">
                                { baseData.planTime }
                            </div>
                        </div>
                    </div>
                </Col>
                <Col className="ant-col-6">
        			<div className="ant-row">
                        <div className="ant-col-9 ant-form-item-label-left">
                            <label>申请单号</label>
                        </div>
                        <div className="ant-col-15">
                            <div className="ant-form-item-control">
                                { baseData.applyNo }
                            </div>
                        </div>
                    </div>
        		</Col>
                <Col className="ant-col-6">
        			<div className="ant-row">
                        <div className="ant-col-9 ant-form-item-label-left">
                            <label>驳回说明</label>
                        </div>
                        <div className="ant-col-15">
                            <div className="ant-form-item-control">
                                { baseData.planReject }
                            </div>
                        </div>
                    </div>
        		</Col>
        	</Row>
        	<Table 
            style={{marginTop:16}}
            columns={columns}
            dataSource={this.state.planData}
            size="small"
            rowKey={'planDetailGuid'}
            scroll={{ x: '120%' }}
            footer={footer}
        	/>
		</div>)
	}
}
module.exports =  JsPlanShow;