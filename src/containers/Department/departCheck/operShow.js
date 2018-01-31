/**
 * 高值申请审核
 */
import React from 'react';
import { Row, Col, Breadcrumb ,Table,Button,message} from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData,jsonNull } from 'utils/tools';
import { department } from 'api'


class OperApplyCheck extends React.Component{
     state = {
        dataSource:[],
        loading: false,
        visible: false,
        selectd:'',
        dirtyClick: false,//通过
    }
    componentDidMount = () => {
        //根据手术单id查询申请产品列表
      const values = {};
      values.applyId = this.props.location.state.applyId;
      values.applyType = this.props.location.state.applyType;
      fetchData(department.HIGHAPPLYDETAIL_LIST,querystring.stringify(values),(data)=>{
         if(data.status){
                this.setState({dataSource: data.result});
            }else{
                message.error('后台异常！');
            }
       });
    }
   
    getApplyTypes = (value)=>{
      if(value==='APPLY'){
          return '普耗申请单'
      }
      else if(value==='HIGH_APPLY'){
          return '高值备货单'
      }
      else if(value==='OPER_APPLY'){
          return '手术备货单'
      }
    }
    getFstate = (value) => {
      switch (value) {
        case '01':
          return <span>待审核</span>;
        case '02':
          return <span>审核通过</span>;
        case '03':
          return <span>审核未通过</span>;
        default:
          break;
      }
    }
    render(){
          const columns = [{
              title:'品牌',
              dataIndex:'tfBrand'
            },{
			  title:'生产商',
			  dataIndex:'produceName'
            },{
              title:'联系人',
              dataIndex:'lxr'
            },{
              title:'联系电话',
              dataIndex:'lxdh'
            }]
        const { dataSource  } = this.state;
        const baseData = jsonNull(this.props.location.state);
        const exportHref = department.EXPORTPLANDETAIL+"?"+querystring.stringify({applyId:baseData.applyId,applyType:baseData.applyType});
         return (
            <div>
                <Row>
                    <Col className="ant-col-6">
                        <Breadcrumb style={{fontSize: '1.1em'}}>
                            <Breadcrumb.Item><Link to='/department/departCheck'>审核管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>详情</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col className="ant-col-18" style={{textAlign:'right'}}>
                        <a href={exportHref}><Button type="primary" style={{marginRight:8}}>导出</Button></a>
                    </Col>
                </Row>
                <h2 style={{marginBottom:12}}>审核信息</h2>
					<Row>
						<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>申请科室</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.deptName }
									</div>
								</div>
							</div>
						</Col>
						<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>备货库房</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.storageName }
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
									<label>申请单号</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.applyNo }
									</div>
								</div>
							</div>
						</Col>
						<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-7 ant-form-item-label-left">
									<label>申请单类型</label>
								</div>
								<div className="ant-col-17">
									<div className="ant-form-item-control">
										{ this.getApplyTypes(baseData.applyType) }
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
											{ this.getFstate( baseData.applyFstate ) }
									</div>
								</div>
							</div>
						</Col>
						<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>申请人</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
											{ baseData.applyUsername }
									</div>
								</div>
							</div>
						</Col>
						<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>申请时间</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
											{ baseData.applyTime }
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
											{ baseData.applyReject }
									</div>
								</div>
							</div>
						</Col>
					</Row>
				<h2 style={{marginBottom:12}}>患者信息</h2>
					<Row>
						<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>就诊号</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.treatmentNo }
									</div>
								</div>
							</div>
						</Col>
						<Col className="ant-col-16">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>手术申请单</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.operNo }
									</div>
								</div>
							</div>
						</Col>
									<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>患者姓名</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.name }
									</div>
								</div>
							</div>
						</Col>
									<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>性别</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.gender }
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
										{ baseData.age }
									</div>
								</div>
							</div>
						</Col>
							</Row>
							<h2>手术信息</h2>
							<Row>
									<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>手术名称</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.operName }
									</div>
								</div>
							</div>
						</Col>
						<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>手术医生</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.operDoctor }
									</div>
								</div>
							</div>
						</Col>
									<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>手术日期</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.operDate }
									</div>
								</div>
							</div>
						</Col>
									<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>麻醉方式</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.mzff }
									</div>
								</div>
							</div>
						</Col>
						<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>手术间</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.operRoom }
									</div>
								</div>
							</div>
						</Col>
						<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>巡回护士</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.circuitNurse }
									</div>
								</div>
							</div>
						</Col>
						<Col className="ant-col-6">
							<div className="ant-row">
								<div className="ant-col-6 ant-form-item-label-left">
									<label>床位号</label>
								</div>
								<div className="ant-col-18">
									<div className="ant-form-item-control">
										{ baseData.bedNum }
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
										{ baseData.tfRemark }
									</div>
								</div>
							</div>
						</Col>
					</Row>
                <Table
                style={{marginTop:10}} 
                columns={columns} 
                dataSource={dataSource} 
                pagination={false}
                size="small"
                rowKey="applyOperDetailGuid"
                />
            </div>
        )
    }
}

module.exports = OperApplyCheck
