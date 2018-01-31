/**
 * @file 单据审批 详情页面(手术除外)
 */
import React from 'react';
import { Breadcrumb, Button, Row, Col, Steps,message, Table, Modal} from 'antd';
import { Link, hashHistory } from 'react-router'; 
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { approve } from 'api';
const Step = Steps.Step;
const confirm = Modal.confirm;

class ApproveDetail extends React.Component{
  	state = {
        stepData : [],
        billDetail: [],
  	}
	componentDidMount = () => {
        fetchData(approve.APPROVE_RECORD_DETAIL,querystring.stringify({
            page:1,
            pagesize:15,
            approvalRecordGuid: this.props.location.state.approvalRecordGuid,
            code: this.props.location.state.type,
            guid: this.props.location.state.guid}),(data)=>{
            this.setState({
            billDetail:data.result.pager.rows,//表格数据
            stepData:data.result.approvalState,//步骤条数据
            })
        })
    }
    handleState = (value) => {
      if( value === "00"){
        return "待审批"
      }else if( value === "01"){
        return "已通过"
      }else if( value === '02'){
        return "未通过"
      }
    }
    //处理错误信息
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    showResult = (values) => {
       fetchData(approve.UPDATE_APPROVALFSTATE,querystring.stringify(values),(data)=>{
          if(data.status){
              message.success('操作成功');
              hashHistory.push('approve/ReciptCheck');
            }else{
              this.handleError(data.msg);
          }
       })
    }

    //通过审批
    agree = () => {
      const that = this;
      confirm({
        title: '提示',
        okText:'确认',
        cancelText:'取消' ,
        content: '是否确认通过审批？',
        onOk() {
          let values = {};
          values.nextFstate = 0; 
          values.approvalRecordGuid = that.props.location.state.approvalRecordGuid;
          values.approvalFstate = that.props.location.state.approvalFstate;
          values.code = that.props.location.state.type;
          that.showResult(values);
        }
      })
    }
    // 不通过审批
    disAgree = () => {
      const that = this;
      confirm({
        title: '提示',
        okText:'确认',
        cancelText:'取消' ,
        content: '是否确认不通过审批？',
        onOk() {
          let values = {};
          values.nextFstate = 1; 
          values.approvalRecordGuid = that.props.location.state.approvalRecordGuid;
          values.approvalFstate = that.props.location.state.approvalFstate;
          values.code = that.props.location.state.type;
          that.showResult(values);
        }
      })
     }
    render(){
  	    const columns = [{
	  				title:'通用名',
		    		dataIndex:'geName',
		    		width:240,
  				},{
	  				title:'产品名',
		    		dataIndex:'materialName',
		    		width:240,
  				},{
  					title:'型号',
		    		dataIndex:'fmodel',
		    		width:100
  				},{
  					title:'规格',
		    		dataIndex:'spec',
		    		width:120
  				},{
  					title:'采购单位',
		    		dataIndex:'purchaseUnit',
		    		width:80
  				},{
  					title:'数量',
		    		dataIndex:'amount',
		    		width:120
  				},{
  					title:'采购价格',
		    		dataIndex:'purchasePrice',
		    		width:120,
		    		render: (text,record,index) => {
                    return text === 'undefined'|| text===null ? '0.0000' : text.toFixed(4)
                  }
  				},{
  					title:'供应商',
  					dataIndex:'fOrgName',
  					width:200,
  				}];
        //获取从上一个页面传过来的参数
        const baseData = this.props.location.state;
        const stepData = this.state.stepData;
        const RowStyle = { marginBottom:'10px' }
        const footer = () => {
            return <Row style={{fontSize: '1.2rem'}}><Col className="ant-col-6">总金额:{baseData.totalPrice.toFixed(2)}</Col></Row>
        }
        return (
        	<div>
        		<Row style={ RowStyle }>
        			 <Col className="ant-col-6">
                        <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to='/approve/ReciptCheck'>单据审批</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>详情</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
        		</Row>
        		<Row style={ RowStyle }>
        			<Col>
                        <Steps>
                            {
                                stepData.map((item,index)=>{
                                    if( item.approvalFstate === '00'){
                                        return <Step key={index} title="待审批" status="process" description={item.createUsername}/>
                                    }else if( item.approvalFstate === '01'){
                                        return <Step key={index} title="通过" status="finish"  description={item.createUsername}/>
                                    }else if( item.approvalFstate === '02'){
                                        return <Step key={index} title="未通过" status="error" description={item.createUsername}/>
                                    }
                                    return null;
                                })
                            }
                        </Steps>
        			</Col>
        		</Row>
        		<Row style={ RowStyle }>
        			<Col className='ant-col-5'>
        				<div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>单据号</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    {baseData.approvalRecordNo}
                                </div>
                            </div>
                        </div>
        			</Col>
        			<Col className='ant-col-5'>
        				<div className="ant-row">
                            <div className="ant-col-8 ant-form-item-label-left">
                                <label>单据类型</label>
                            </div>
                            <div className="ant-col-16">
                                <div className="ant-form-item-control">
                                    {baseData.tfCloName}
                                </div>
                            </div>
                        </div>
        			</Col>
        			<Col className='ant-col-4'>
        				<div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>状态</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    {this.handleState(baseData.approvalFstate)}
                                </div>
                            </div>
                        </div>
        			</Col>
        			<Col className='ant-col-5'>
        				<div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>科室</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    {baseData.deptName}
                                </div>
                            </div>
                        </div>
        			</Col>
        			<Col className='ant-col-5'>
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
        		</Row>
        		<Row style={ RowStyle }>
					<Col className='ant-col-5'>
                        <div className="ant-row">
                            <div className="ant-col-8 ant-form-item-label-left">
                                <label>发送时间</label>
                            </div>
                            <div className="ant-col-16">
                                <div className="ant-form-item-control">
                                    {baseData.createTime}
                                </div>
                            </div>
                        </div>
					</Col>
					<Col className='ant-col-5' push={5}>
						<div className="ant-row">
                            <div className="ant-col-8 ant-form-item-label-left">
                                <label>审批时间</label>
                            </div>
                            <div className="ant-col-16">
                                <div className="ant-form-item-control">
                                    {baseData.approvalTime}
                                </div>
                            </div>
                        </div>
					</Col>
        		</Row>
        		<Row style={ RowStyle }>
        			<Col>
        				<Button type="primary" onClick={this.agree}>同意</Button>
        				<Button type="primary" ghost onClick={this.disAgree} style={{marginLeft:'8px'}}>不同意</Button>
        			</Col>
        		</Row>
        		<Table
                    style={{marginTop:'10px'}} 
                    columns={columns} 
                    rowKey={'RN'}
                    dataSource={this.state.billDetail}
                    size='small'
                    pagination={{ pageSize: 15 }} 
                    scroll={{ x: '110%' }}
                    footer={footer}
        		/>
        	</div>
        	)
	    }
}
module.exports = ApproveDetail;