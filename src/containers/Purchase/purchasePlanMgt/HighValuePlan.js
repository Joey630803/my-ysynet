/**
 * @file高值申请单
 */

import React from 'react';
import { Form, Button, Input, Row, Col, Popconfirm, Modal,message,Select} from 'antd';
import FetchTable from 'component/FetchTable';
import { hashHistory } from 'react-router';
import { purchase } from 'api';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import SearchForm from './searchForm';
const confirm = Modal.confirm;
const Option = Select.Option
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
const actions = {
	details: (action) => <a onClick={action}>查看</a>,
	reject: (action) => <a onClick={action}>驳回</a> ,
	gather: (action) => <Popconfirm title="是否汇总?" onConfirm={action}>
                        <a>汇总</a>
                      </Popconfirm>,
	sendOrder: (action) => <Popconfirm title="是否发送订单?" onConfirm={action}>
                        <a>发送订单</a>
                      </Popconfirm>
}


class HighValuePlan extends React.Component{
		state = {
				query:{},
        selectedRowKeys:[],
        selectedRows:[],
        isloading:false,
        visible: false,
    		info:'',
        tfRemark:'',
        storageData:[],
        storageOptions:[]
    };
    componentDidMount = () => {
      //采购库房
		  fetchData(purchase.FINDTOPSTORAGEBYUSER_LIST,{},data => { 
        if(data.result.length > 0){
          this.setState({
              query:{'bStorageGuid':this.props.router.location.search === "" ? data.result[0].value : this.props.router.location.query.bStorageGuid },
              storageData: data.result
          })
        }
		  });
    }

      //处理错误信息
      handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
      }

    //库房变化
    handleSelectChange = (value) => {
        fetchData(purchase.FINDMYSTORAGELIST,querystring.stringify({storageGuid:value}),(data)=>{
          this.setState({storageOptions:data.result});
          this.setState({
              query:{'bStorageGuid':value }
          })
          this.refs.table.fetch({'bStorageGuid':value });
      });
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    };
    redirect = (url, record) => {
	    hashHistory.push({
	      pathname: url,
	      state: record
	    })
  	}
    getActions = ( text , record )=>{
      switch(text){
        case '20' : 
          return <span>
                    {actions.details(this.details.bind(this,record))}
                    {
                      record.approvalFlag === '01'? null
                      :
                      <span>
                        <span className="ant-divider" />
                        {actions.reject(this.reject.bind(this,record))}
                      </span>
                    }
                  </span>
        case '30':
          return  <span>
                    {actions.details(this.details.bind(this,record))}
                    {
                      record.approvalFlag === '01'? null
                      :
                      <span>
                        <span className="ant-divider" />
                        {actions.gather(this.gather.bind(this,record))}
                        <span className="ant-divider" />
                        {actions.sendOrder(this.sendOrder.bind(this,record))}
                      </span>
                    }
                  </span>
        default:
          return <span>
                    {actions.details(this.details.bind(this,record))}
                 </span>
      }
    }
  	//详情
  	details = (record) => {
			if(record.fsource==='01'){
				//科室申请
				this.redirect('/purchase/purchasePlanMgt/deptDetail', record)
			}
			else if(record.fsource==='02'){
    		this.redirect('/purchase/purchasePlanMgt/norDetails', record)
			}
  	}
  	//驳回
  	reject = (record) => {
  		this.setState({info:record});
    	const that = this;
    	that.showModal();
  	}
  	//单条汇总
  	gather = (record) => {
      let handData = [];
      handData.push(record);
    	this.handlePlanGather(handData);
  	}
    //批量汇总
    batchGather = () =>{
      const selectedRows = this.state.selectedRows;
      console.log(selectedRows)
      if(selectedRows.length===0){
        return message.warn('请至少选择一条已确认有效数据');
      }
      let handData = [];
      selectedRows.forEach((item,index)=>{
        if(item.fstate==='30' && item.approvalFlag !== '01'){
         handData.push(item)
        }
      });
      console.log('汇总有效数据',handData);
      this.handlePlanGather(handData);
    }
  	//发送单条订单
    sendOrder = (record) => {
      let handData = [ record ];
      this.handleOrder(handData,'HIGH_PLAN');
    }
    //发送所有已确认订单
    sendSureOrder = () =>{
      const selectedRows = this.state.selectedRows;
      if(selectedRows.length===0){
        return message.warn('请至少选择一条已确认有效数据');
      }
      let handData = [];
       selectedRows.forEach((item,index)=>{
        if(item.fstate==='30' && item.approvalFlag !== '01'){
          handData.push(item);
        }
      });
      console.log('发送订单有效数据',handData);
      this.handleOrder(handData,"HIGH_PLAN")
    }
    showModal=()=>{
    	this.setState({visible:true,tfRemark:''});
    }
    //取消
  	handleCancel=()=>{
  		this.setState({visible:false})
  	}
  	//驳回,反馈理由
  	handleOk = () => {
  			const record = this.state.info;
  			const failreason = this.state.tfRemark;
  			console.log(failreason)
        if(failreason.length > 200){
            return message.error('长度不能超过200')
        }
        else if(failreason.length <= 0){
            return message.error('请输入反馈理由')
        }
        this.setState({isloading:true});
        fetchData(purchase.UPDATEPLANFSTATE,querystring.stringify({planIds:[record.planId],fstate:"34",planReject:failreason}),(data)=>{
           this.setState({visible:false,isloading:false});
           if(data.status){
            this.refs.table.fetch();
            message.success("操作成功")
          }
          else{
            this.handleError(data.msg);
          }
        })
    }

    //汇总处理
    handlePlanGather = (record)=>{
      console.log(this.state.query)
      const values ={};
      const planList = [];
      record.map((item,index)=>{
        values.storageGuid = this.state.query.bStorageGuid;
        values.planType = item.planType;
        planList.push({planId:item.planId,planFstate:item.fstate});
        return null;
      })
      values.planList = planList;
      console.log(values,'汇总有效数据');
      fetchData(purchase.INSERTPLANGATHER,JSON.stringify(values),(data)=>{
        if(data.status){
          this.refs.table.fetch();
          message.success("操作成功");
        }else{
          this.handleError(data.msg);
        }
        this.setState({selectedRowKeys: []})
      },'application/json')

    }
    //订单处理
    handleOrder = (record,planType)=>{
      const values = {};
      const planIds = [];
      record.map((item,index)=>{
        return planIds.push(item.planId);
      })
      values.planIds = planIds;
      values.planType = planType;
      console.log(values,"发送订单参数")
      fetchData(purchase.SEND_ORDERPLAN,querystring.stringify(values),(data)=>{
          if(data.status){
              this.refs.table.fetch();
              message.success("操作成功!")
          }else{
            this.handleError(data.msg);
          }
        this.setState({selectedRowKeys: []})
      })
    }

    //汇总全部
    batchAll = () => {
      const that = this;
      confirm({
        title: '提示',
        okText:'确认',
        cancelText:'取消' ,
        content: '是否确认全部汇总？',
        onOk(){
          that.setState({dirtyClick: true});
          const values = {
            planType : 'HIGH_PLAN',
            storageGuid : that.state.query.storageGuid,
            bStorageGuid : that.state.query.bStorageGuid
          }
          fetchData(purchase.INSERTALLPLANGATHER,querystring.stringify(values),(data)=>{
            that.setState({dirtyClick: false});
            if(data.status){
              that.refs.table.fetch();
              message.success("操作成功");
            }else{
              that.handleError(data.msg);
            }
          })
        },
        onCancel() {
        }
      })
    }

  	changeVal = (e)=>{
  		this.setState({tfRemark:e.target.value});
  	}
  	
	render(){
		const columns = [{
			title:'操作',
			dataIndex:'actions',
			fixed:'left',
      width:150,
			render : (text,record) => {
				return this.getActions(record.fstate, record);
			}
		},{
			title:'状态',
			dataIndex:'fstateName',
			render: ( text, record )=>{
				if(record.approvalFlag === '01'){
                    return <span style={{color:"#e9002c"}}>{text + "(正在审批)"}</span> 
                }else{
                    return text
                } 
			}
		},{
			title:'计划单号',
			dataIndex:'planNo',
		},{
			title:'计划单来源',
			dataIndex:'fsource',
			render:fsource => {
				if(fsource==='01'){
					return '科室申请'
				}else if(fsource==='02'){
					return '库房申请'
				}
			}
		},{
			title:'科室',
			dataIndex:'deptName',
		},{
			title:'库房',
			dataIndex:'storageName',
		},{
			title:'收货地址',
			dataIndex:'tfAddress',
		},{
			title:'申请人',
			dataIndex:'applyUsername',
		},{
			title:'申请时间',
			dataIndex:'planTime',
		},{
			title:'申请单号',
      width:150,
      fixed:'right',
			dataIndex:'applyNo',
		}];
    const query = this.state.query;
    const exportHref = purchase.EXPORTHIGHPLANLIST+"&"+querystring.stringify(query)
		return (
    <div>
        {
        this.props.children || 
         <div>
				<SearchBox query={(query)=>this.queryHandler(query)} defaultValue={query.bStorageGuid} storageOption={this.state.storageOptions}/>
        {
        query.bStorageGuid === undefined ? null :
        <div>
				<Row>
          <Col span={8}>
                <div className="ant-form-item-label">
                    <label>采购库房</label>
                </div>
                <Select
                style={{width:200}}
                value={this.state.query.bStorageGuid}
                onChange={this.handleSelectChange}
                >
                {
                  this.state.storageData.map((item,index) => { 
                  return <Option key={index} value={item.value}>{item.text}</Option>
                  })
                }
                </Select>
          </Col>
					<Col span={16} style={{textAlign:'right'}}>
	          <Button type="primary" ghost style={{marginRight:8}} onClick={this.batchGather}>批量汇总</Button>
	          <Button type="primary" ghost style={{marginRight:8}} onClick={this.batchAll}>汇总全部</Button>
	          <Button type="primary" ghost style={{marginRight:8}} onClick={this.sendSureOrder}>发送订单</Button>
	           <a href={exportHref}><Button type="primary" ghost style={{marginRight:8}} >导出</Button></a>
		      </Col>
				</Row>
        <FetchTable 
          style={{marginTop:10}}
          columns={columns}
          query={query}
          ref='table'
          url={purchase.SEARCHHIGHVALUEPLANLIST}
          rowKey={'planId'}
          scroll={{ x: '150%' }}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({ selectedRows: selectedRows,selectedRowKeys:selectedRowKeys});
            },
            selectedRowKeys:this.state.selectedRowKeys
          }}
        />
				<Modal
          visible={this.state.visible}
          title='确认'
          record={this.state.info}
          onOk={(record) => this.handleOk(record)}
          onCancel={this.handleCancel}
          footer={[
          <Button key="cancel" size="large"  onClick={this.handleCancel}>取消</Button>,
          <Button key="sure" type="primary" size="large" loading={this.state.isloading} onClick={this.handleOk}>
              确定
          </Button>
          ]}
        >
        <h2>是否驳回?</h2>
        <Input style={{marginTop:'16px'}} placeholder='请输入驳回说明' ref='failReason' onChange={this.changeVal} value={this.state.tfRemark} type="textarea" rows={4}/>
        </Modal>
				</div>
        }
      </div>
      }
      </div>
      )
	}
}
module.exports = HighValuePlan;