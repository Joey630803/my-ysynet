/**
 * @file 我的订单明细
 */
import React from 'react';
import { Breadcrumb, Row, Col, Table ,Button} from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData,jsonNull } from 'utils/tools';
import { sales,purchase } from 'api';

class OrderDetails extends React.Component {
  state = {
        productDataSource:[],
         deliveryDataSource:[]
    }
    componentDidMount = () => {
        //根据订单id查询产品列表
        fetchData(sales.DETAILS_BY_ORDERID,querystring.stringify({orderId:this.props.location.state.orderId}),(data)=>{
          this.setState({ productDataSource: data.result })
        })
        //根据订单id查询送货单信息
        fetchData(sales.DELIVERYLIST,querystring.stringify({orderId:this.props.location.state.orderId}),(data)=>{
          this.setState({ deliveryDataSource: data.result.rows })
        })
    }
  render () {
    const productColumns = [{
                title: '产品名称',
                dataIndex: 'materialName',
                }, {
                title: '通用名称',
                dataIndex: 'geName',
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
                }, {
                title: '包装规格',
                dataIndex: 'tfPacking',
                }, {
                title: '采购数量',
                dataIndex: 'amount',
                }, {
                title: '金额',
                dataIndex: 'amountMoney',
                render: (text,record,index) => {
                   return (record.amount * record.purchasePrice).toFixed(2)
                }
                }, {
                title: '发货数量',
                dataIndex: 'sentoutAmount',
                }, {
                title: '品牌',
                dataIndex: 'tfBrand',
                }, {
                title: '供应商',
                dataIndex: 'fOrgName',
                }
            ];
    const deliveryColumns = [{
                title: '送货单状态',
                dataIndex: 'fstateName',
                }, {
                title: '送货单号',
                dataIndex: 'sendNo',
                }, {
                title: '订单号',
                dataIndex: 'orderNo',
                }, {
                title: '收货地址',
                dataIndex: 'tfAddress',
                }, {
                title: '医疗机构',
                dataIndex: 'rOrgName',
                }, {
                title: '制单人',
                dataIndex: 'sendUsername',
                }, {
                title: '制单时间',
                dataIndex: 'sendDate',
                }, {
                title: '验收人',
                dataIndex: 'checkUserName',
                }, {
                title: '验收时间',
                dataIndex: 'checkTime',
                }
            ];
    const { productDataSource ,deliveryDataSource } = this.state;
    const baseData = jsonNull(this.props.location.state);
    return (
      <div>
      <Row>
        <Col className="ant-col-6">
          <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
            <Breadcrumb.Item><Link to='/sales/myOrder'>我的订单</Link></Breadcrumb.Item>
            <Breadcrumb.Item>详情</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col className="ant-col-18" style={{textAlign:'right'}}>
            <a href={purchase.EXPORTORDERDETAILS+"?"+querystring.stringify({orderId:this.props.location.state.orderId})}>
              <Button type="primary" style={{marginRight:8}}>导出</Button>
            </a>
        </Col>
      </Row>
       
      <h2 style={{marginBottom:16}}>基本信息</h2>
      <Row>
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
                  <div className="ant-col-7 ant-form-item-label-left">
                      <label>订单总金额</label>
                  </div>
                  <div className="ant-col-17">
                      <div className="ant-form-item-control">
                            {baseData.totalPrice === ""? "": (baseData.totalPrice).toFixed(2) }
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
                      <label>到货时间</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                            { baseData.expectDate }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-6 ant-form-item-label-left">
                      <label>订单类型</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                            { baseData.orderTypeName }
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
                      <label>下单人</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                          { baseData.orderUsername }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-6 ant-form-item-label-left">
                      <label>下单时间</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                          { baseData.orderDate }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-6 ant-form-item-label-left">
                      <label>取消人</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                          { baseData.cancleUserName }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-6 ant-form-item-label-left">
                      <label>取消时间</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                          { baseData.cancleTime }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-6 ant-form-item-label-left">
                      <label>医疗机构</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                          { baseData.rOrgName }
                      </div>
                  </div>
              </div>
          </Col>
          <Col className="ant-col-6">
              <div className="ant-row">
                  <div className="ant-col-6 ant-form-item-label-left">
                      <label>取消说明</label>
                  </div>
                  <div className="ant-col-18">
                      <div className="ant-form-item-control">
                          { baseData.cancleReason }
                      </div>
                  </div>
              </div>
          </Col>
        </Row>
         <h2 style={{marginTop:16,marginBottom:16}}>产品信息</h2>
          <Table 
          columns={productColumns} 
          dataSource={productDataSource} 
          pagination={false}
          size="small"
          rowKey='orderDetailGuid'
          scroll={{ x: '120%' }}
          />
          <h2 style={{marginTop:16,marginBottom:16}}>送货单信息</h2>
         <Table 
          columns={deliveryColumns} 
          dataSource={deliveryDataSource} 
          pagination={false}
          size="small"
          rowKey='RN'
          scroll={{ x: '120%' }}
          />
      </div>
    )
  }
}
module.exports = OrderDetails;