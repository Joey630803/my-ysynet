/**
 * 汇总单详情
 */
import React from 'react';
import { Breadcrumb, Row, Col, Button, Table } from 'antd';
import { Link } from 'react-router';
import { fetchData } from 'utils/tools'; 
import { purchase } from 'api'; 
import querystring from 'querystring';

class SummaryDetail extends React.Component{
  state={
    dataSource:[]
  }
  componentDidMount = ()=>{
     //根据汇总计划单id 获取产品
    fetchData(purchase.SELECTONEGATHER_LIST,querystring.stringify({gatherId:this.props.location.state.gatherId}),(data)=>{
      this.setState({ dataSource: data.result })
    })
  }
 getFstate = (text) =>{
      switch(text){
        case '10':
          return <span>新建</span>;
        case '60':
          return <span>完结</span>;
        case '64':
          return <span>不通过</span>;
        default:
          break;
      }
    }
    //总金额
    total = () => {
        let total = 0;
        this.state.dataSource.map( (item, index) => {
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
        return text === 'undefined' || text === null ? '0.00' : text.toFixed(2)
      }
    },{
      title:'包装规格',
      dataIndex:'tfPacking'
    },{
      title:'汇总数量',
      dataIndex:'amount'
    },{
      title:'金额',
      dataIndex:'tenderMoney',
      render: (text,record,index) => {
        return text === 'undefined' ? '0.00' : text.toFixed(2)
      }
    },{
      title:'品牌',
      dataIndex:'tfBrand'
    },{
      title:'供应商',
      dataIndex:'fOrgName'
    }]
      const baseData = this.props.location.state;
      const exportHref = purchase.EXPORTGATHERDETAIL+"?"+querystring.stringify({gatherId:baseData.gatherId});
      const footer = () => {
          return <Row><Col className="ant-col-6">汇总单总金额:{this.total()}</Col></Row>
      }; 
    return (<div>
      <Row>
        <Col className="ant-col-6">
          <Breadcrumb style={{fontSize: '1.1em'}}>
            <Breadcrumb.Item><Link to='/purchase/summaryMgt'>我的汇总单</Link></Breadcrumb.Item>
            <Breadcrumb.Item>详情</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col className='ant-col-18' style={{textAlign:'right'}}>
           <a href={exportHref}><Button type="primary" style={{marginRight:8}}>导出</Button></a>
        </Col>
      </Row>
          <Row style={{marginTop:10}}>
            <Col className="ant-col-5">
                <div className="ant-row">
                    <div className="ant-col-8 ant-form-item-label-left">
                        <label>汇总单号</label>
                    </div>
                    <div className="ant-col-16">
                        <div className="ant-form-item-control">
                            {baseData.gatherNo}
                        </div>
                    </div>
                </div>
            </Col>
            <Col className="ant-col-5">
                <div className="ant-row">
                    <div className="ant-col-8 ant-form-item-label-left">
                        <label>汇总单类型</label>
                    </div>
                    <div className="ant-col-16">
                        <div className="ant-form-item-control">
                            {baseData.gatherTypeName}
                        </div>
                    </div>
                </div>
            </Col>
            <Col className="ant-col-4">
                <div className="ant-row">
                    <div className="ant-col-8 ant-form-item-label-left">
                        <label>状态</label>
                    </div>
                    <div className="ant-col-16">
                        <div className="ant-form-item-control">
                            { this.getFstate(baseData.gatherFstate)}
                        </div>
                    </div>
                </div>
            </Col>
            <Col className="ant-col-9">
                <div className="ant-row">
                    <div className="ant-col-8 ant-form-item-label-left">
                        <label>驳回说明</label>
                    </div>
                    <div className="ant-col-16">
                        <div className="ant-form-item-control">
                            {baseData.applyReject}
                        </div>
                    </div>
                </div>
            </Col>
          </Row>
          <Table 
            style={{marginTop:10}}
            columns={columns}
            dataSource={this.state.dataSource}
            size='small'
            rowKey='gatherDetailGuid'
            scroll={{ x: '130%' }}
            pagination={false}
            footer={footer}
          />
      </div>
      ) 
  }
}
module.exports = SummaryDetail;