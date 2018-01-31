/**
 * 高值/科室申请详情
 */
import React from 'react';
import { Breadcrumb, Row, Col, Button, Table,message,Modal,Select } from 'antd';
import { Link ,hashHistory} from 'react-router';
import { purchase } from 'api';
import querystring from 'querystring';
import { fetchData, jsonNull } from 'utils/tools';
const Option = Select.Option;

class OperPlanShow extends React.Component{
	state={
		isloading:false,
        planData:[]
	}
    componentDidMount = () =>{
        //根据申请单id 获取详情列表
        fetchData(purchase.SEARCHPLANDETAIL,querystring.stringify({planId:this.props.location.state.planId}),(data)=>{
            if(data.status){
                this.setState({ planData: data.result })
            }else{
                message.error("后台异常!")
            }
        })
    }
    //处理错误信息
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
        });
    }
    //确认处理
    handPlanSure = ()=>{
        const values = {};
        const planDetails = [];
        const planData = this.state.planData;
        planData.map((item,index) => {
         return  planDetails.push({planDetailGuid:item.planDetailGuid,fOrgId: item.fOrgId,purchasePrice:item.purchasePrice})
        })
        values.planId = this.props.location.state.planId;
        values.planDetails = planDetails;
        values.fstate = "30";
        console.log(values,"确认订单参数");
        fetchData(purchase.MODIFYPLANFSTATE,JSON.stringify(values),(data)=>{
          if(data.status){
                hashHistory.push({pathname:'purchase/purchasePlanMgt',query:{activeKey:"HIGH_PLAN",bStorageGuid:this.props.location.state.bStorageGuid}});
              message.success("操作成功");
          }else{
              this.handleError(data.msg);
          }
        },'application/json')
      }
     //选中供应商
     handleOrgSelect = (record,index,value,option) =>{
        const planData = this.state.planData;
        planData[index].fOrgName = option.props.fOrgName;
        planData[index].fOrgId = value;
        planData[index].purchasePrice = option.props.purchasePrice;
        this.setState({
            planData : planData
        })
    }
    showFsource =(value)=>{
        if(value==='01'){
        return '科室申请'
        }
        else if(value==='02'){
        return '库房申请'
        }
    }
    //总金额
    total = (record) => {
            let total = 0;
            record.map( (item, index) => {
            let AMOUNT = typeof item.amount === 'undefined' ? 1 : item.amount
                return total += AMOUNT * item.purchasePrice;
            })
                return total;
        }
	render(){
        const baseData = jsonNull(this.props.location.state);
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
        title:'包装规格',
        dataIndex:'tfPacking'
        },{
        title:'需求数量',
        dataIndex:'amount'
        },{
        title:'金额',
        dataIndex:'amountMoney',
        render: (text,record,index) => {
            return (record.amount * record.purchasePrice).toFixed(2)
        }
        },{
        title:'品牌',
        dataIndex:'tfBrand'
        },{
        title:'采购价格',
        width: 100,
        fixed:'right',
        dataIndex: 'purchasePrice',
        render: (text,record,index) => {
            return text === 'undefined' || text ===null? '0.00' : text.toFixed(2)
            }
        },{
        title:'供应商',
        fixed:'right',
        width: 200,
        dataIndex:'fOrgName',
        render : ( text,record,index) =>{
                const supplyDetails = record.supplyDetails;
                return record.supplyDetails.length > 0 && baseData.fstate ==="20" ?
                <Select 
                showSearch={true}
                style={{width:180}} 
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                defaultValue={record.fOrgId} 
                onSelect={this.handleOrgSelect.bind(this,record,index)}>
                    {
                        supplyDetails.map((item,index) => (
                            <Option purchasePrice={item.purchasePrice} value={item.fOrgId} key={index}>{item.fOrgName}</Option>
                        ))
                    }
                
                </Select>
                :
                text
            }
        }
    ];
		

    const exportHref = purchase.EXPORTPLANDETAIL_LIST+"?"+querystring.stringify({planId:baseData.planId,planType:baseData.planType,fsource:baseData.fsource});
    const footer = this.state.planData.length === 0 ? null : () => <span style={{fontSize: '1.5em'}}>计划单总金额:
                        <a style={{color: '#f46e65'}}>
                            {this.total(this.state.planData).toFixed(2)}
                        </a>
                    </span> 
		return (<div>
          <Row>
            <Col className="ant-col-6">
              <Breadcrumb style={{fontSize: '1.1em',marginBottom:16}}>
                <Breadcrumb.Item><Link to={{pathname:'purchase/purchasePlanMgt',query:{activeKey:'HIGH_PLAN',bStorageGuid:baseData.bStorageGuid}}}>高值计划管理</Link></Breadcrumb.Item>
                <Breadcrumb.Item>详情</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col className="ant-col-18" style={{textAlign:'right'}}>
                {
                    baseData.approvalFlag !== "01" && baseData.fstate === "20" ?
                    <Button type="primary" style={{marginRight:8}} onClick={this.handPlanSure}>确认</Button>
                    :null
                } 
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
                 dataSource={this.state.planData}
        			columns={columns}
        			size="small"
        			rowKey='certGuid'
                 scroll={{ x: '140%' }}
                 footer={footer}
        	/>
			</div>	)
	}
}
module.exports = OperPlanShow;