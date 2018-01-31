/**
 * 高值申请审核
 */
import React from 'react';
import { Row, Col, Breadcrumb ,Table,Button,Modal ,message,Input} from 'antd';
import { Link ,hashHistory} from 'react-router';
import querystring from 'querystring';
import { fetchData,jsonNull } from 'utils/tools';
import { department } from 'api'
const confirm = Modal.confirm;

class OperApplyCheck extends React.Component{
     state = {
        dataSource:[],
        loading: false,
        visible: false,
        selectd:[],
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
			  message.error('后台异常!');
		  }
       });
	}
	handleError = (data) =>{
		Modal.error({
			title: '错误提示',
			content: data,
			okText: '确定'
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
    //通过
    handerPass = ()=>{
        if(this.state.dataSource.length === 0) {
            return message.warn("产品为空，不能审核通过!")
        }
        const that = this;
        confirm({
        title: '提示',
        okText:'确认',
        cancelText:'取消' ,
        content: '是否确认审核通过？',
        onOk() {
            that.setState({dirtyClick: true});
            let values ={};
			const applyDetail = [];
            that.state.dataSource.map((item,index) => {
                return applyDetail.push({applyDetailGuid: item.applyOperDetailGuid})
            })
            values.applyId = that.props.location.state.applyId;
            values.applyNextFstate = "0";
            values.applyDetail = applyDetail;
            console.log('审核通过数据',values)
            //审核交互
            fetchData(department.CHECKAPPLYDETAILS,JSON.stringify(values),(data)=>{
            	that.setState({dirtyClick: false});
            		if(data.status){
						message.success("审核通过");
						hashHistory.push('/department/departCheck');
            		}else{
                		this.handleError(data.msg);
            		}
            	},'application/json')
        },
        onCancel() {
        }
        })
        
    };
    showModal = ()=>{
        this.setState({visible:true})
    }
    handerNotPass = ()=>{
        const that = this;
        that.showModal();
    }
    //不通过
    handleOk = () => {
        const selectReason = this.refs.failReason.refs.input.value;
        if(selectReason.length>200){
            return message.error('长度不能超过200')
        }

        const values = {applyId:this.props.location.state.applyId,applyNextFstate:'1',tfRemark:selectReason}
        this.setState({ loading: true });
        console.log('审核不通过数据',values)
        //审核交互
         fetchData(department.CHECKAPPLYDETAILS,JSON.stringify(values),(data)=>{
              this.setState({dirtyClick: false});
              if(data.status){
                message.success("审核通过");
                hashHistory.push('/department/departCheck');
              }else{
                this.handleError(data.msg);
              }
            },'application/json')
    
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    //删除产品
    delete = () => {
        const dataSource = this.state.dataSource;
        const selected = this.state.selectd;
        if (selected.length === 0) {
        message.warn('请至少选择一条数据')
        } else {
        let result = [];
        dataSource.map( (item, index) => {
            const a = selected.find( (value, index, arr) => {
            return value === item.applyOperDetailGuid;
            })
            if (typeof a === 'undefined') {
               return result.push(item)
            }
            return null;
        })
        this.setState({dataSource: result});
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
                        <Button type="primary" style={{marginRight:8}} onClick={this.handerPass}>通过</Button>
                        <Button type="primary" ghost onClick={this.handerNotPass}>不通过</Button>
                    </Col>
                </Row>
                <h2 style={{marginBottom:10}}>审核信息</h2>
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
										{ baseData.applyNo }
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
				<h2 style={{marginBottom:10}}>患者信息</h2>
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
						<h2 style={{marginBottom:10}}>手术信息</h2>
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
                <div style={{marginBottom:16}}>
                    <Button type="danger" onClick={this.delete} ghost style={{marginRight: 8}}>删除品牌</Button>
                </div>
                <Table
                columns={columns} 
                dataSource={dataSource} 
                pagination={false}
                size="small"
                rowKey="applyOperDetailGuid"
                rowSelection={{
                    onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({ selectd: selectedRowKeys});
                    }
                }}
                />
                <Modal
                visible={this.state.visible}
                title={'是否确认审核不通过？'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                <Button key="back" size="large"  onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                    确认
                </Button>
                ]}
            >
            <Input style={{marginTop:'16px'}} placeholder="请填写原因" ref='failReason' type="textarea" rows={4}/>
            </Modal>
            </div>
        )
    }
}

module.exports = OperApplyCheck
