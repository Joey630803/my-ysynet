import React from 'react';
import { Breadcrumb, Row, Col, Button, Table,message,Select ,Modal} from 'antd';
import { Link,hashHistory } from 'react-router';
import { purchase } from 'api';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
const Option = Select.Option;

class NorPlanDetail extends React.Component{
	state = {
		isloading:false,
        planData: []
	}
    componentDidMount = ()=>{
        //根据普耗计划单id 获取产品
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
    showFsource =(value)=>{
        if(value==='01'){
        return '科室申请'
        }else if(value==='02')
        {
        return '库房申请'
        }
    }

   //确认处理
    handPlanSure = ()=>{
      const data = this.props.location.state;
      const type = data.planType;
      const values = {};
      const planDetails = [];
      const planData = this.state.planData;
      planData.map((item,index) => {
       return  planDetails.push({planDetailGuid:item.planDetailGuid,fOrgId: item.fOrgId,purchasePrice:item.purchasePrice})
      })
      values.planId = data.planId;
      values.planDetails = planDetails;
      values.fstate = "30";
      console.log(values,"确认订单参数");
      fetchData(purchase.MODIFYPLANFSTATE,JSON.stringify(values),(data)=>{
        if(data.status){
            hashHistory.push({pathname:'purchase/purchasePlanMgt',query:{activeKey:type ==='PLAN'? 'APPLY' :"HIGH_PLAN",bStorageGuid:this.props.location.state.bStorageGuid}});
            message.success("操作成功");
        }else{
            this.handleError(data.msg);
        }
      },'application/json')
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

	render(){
        const baseData = this.props.location.state;
        console.log(baseData,'baseData')
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
			dataIndex:'price',
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
                return text === 'undefined' ? '0.00' : text.toFixed(2)
            }
		},{
			title:'供应商',
            dataIndex:'fOrgName',
            fixed:'right',
            width: 200,
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
		}]
		

    const activeKey = baseData.planType==='PLAN'? 'APPLY' :"HIGH_PLAN"
    const title = baseData.planType==='PLAN'? "普耗计划管理":'高值计划管理'
    const exportData = {planId:baseData.planId,planType:baseData.planType,fsource:baseData.fsource}
    const exportHref = purchase.EXPORTPLANDETAIL_LIST+"?"+querystring.stringify(exportData);
    const footer = this.state.planData.length === 0 ? null : () => <span style={{fontSize: '1.5em'}}>计划单总金额:
                        <a style={{color: '#f46e65'}}>
                        {this.total()}
                        </a>
                    </span>  
		return (
			<div>
            <Row>
              <Col className='ant-col-6'>
                <Breadcrumb style={{fontSize: '1.1em'}}>
                  <Breadcrumb.Item><Link to={{pathname:'purchase/purchasePlanMgt',query:{activeKey:activeKey,bStorageGuid:baseData.bStorageGuid}}}>{title}</Link></Breadcrumb.Item>
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
            <Row style={{marginTop:16}}>
        		<Col className="ant-col-6">
        			<div className="ant-row">
                        <div className="ant-col-9 ant-form-item-label-left">
                            <label>科室</label>
                        </div>
                        <div className="ant-col-15">
                            <div className="ant-form-item-control">
                                { baseData.deptName }
                            </div>
                        </div>
                    </div>
        		</Col>
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
            </Row>
        	<Row>
        		<Col className="ant-col-6">
        			<div className="ant-row">
                  <div className="ant-col-9 ant-form-item-label-left">
                      <label>计划单来源</label>
                  </div>
                  <div className="ant-col-15">
                      <div className="ant-form-item-control">
                          { this.showFsource(baseData.fsource) }
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
        		<Col className="ant-col-6">
        			<div className="ant-row">
                  <div className="ant-col-9 ant-form-item-label-left">
                      <label>申请人</label>
                  </div>
                  <div className="ant-col-15">
                      <div className="ant-form-item-control">
                          { baseData.applyUsername }
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
        	</Row>
        	<Row>
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
        		<Col className="ant-col-10">
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
            scroll={{ x: '140%' }}
            footer={footer}
        	/>
		</div>)
	}
}
module.exports =  NorPlanDetail;