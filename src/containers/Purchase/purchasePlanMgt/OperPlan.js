/**
 * @file手术申请单
 */
import React from 'react';
import {Form, Row, Col, Input, Select, DatePicker, Button, Modal, Popconfirm, message} from 'antd';
import { fetchData, CommonData } from 'utils/tools';
import FetchTable from 'component/FetchTable';
import { hashHistory } from 'react-router';
import { purchase } from 'api';
import querystring from 'querystring';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SearchForm extends React.Component{
    state = {
        departData:[],//科室
        storageData:[],// 库房
        planState:[],//计划单状态
        storageGuid:'',
        beforeStorage:[]
    }
    componentDidMount = () =>{
        //科室
        fetchData(purchase.SEARCHDEPT_LIST,{},data => {this.setState({departData:data})});
        //库房
        fetchData(purchase.FINDMYSTORAGELIST,{},data => {this.setState({storageData:data.result})});
        CommonData('OPER_PLAN_FSTATE', (data) => {this.setState({planState:data})})
    }
    componentWillReceiveProps = nextProps=>{
		const beforeStorage = this.state.beforeStorage;
		if(nextProps.storageOption.length>0 && beforeStorage!==nextProps.storageOption){
			this.setState({storageGuid:'' , beforeStorage:nextProps.storageOption})
		}
	}
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                const applyTime = values.applyTime === undefined ? "" : values.applyTime;
                if( applyTime.length > 0 )
                {
                    values.startDate = applyTime[0].format('YYYY-MM-DD');
                    values.endDate = applyTime[1].format('YYYY-MM-DD');
                }
                values.storageGuid = this.state.storageGuid;
                values.bStorageGuid = this.props.defaultValue;
                console.log('查询条件: ', values);
                this.props.query(values);
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const departData = this.state.departData;
        const storageData = this.props.storageOption.length > 0 ? this.props.storageOption:this.state.storageData;
        const fstateOptions = () => {
          let options = [];
          let planState = this.state.planState;
          planState.forEach((item) => {
             options.push(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
          })
          return options;
      }
        const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 }
    }
    return (<div>
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row>
                <Col span={6} key={1}>
                  <FormItem {...formItemLayout} label={'申请科室'}>
                    {
                        getFieldDecorator(`deptGuid`,{
                            initialValue:''
                        })(
                            <Select>
                                <Option key={-1} value=''>全部</Option>
                                {
                                  departData.map((item,index)=>{
                                      return <Option key={index} value={item.value}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )
                    }
                  </FormItem>
                </Col>
                <Col span={6} key={2}>
                  <FormItem {...formItemLayout} label={'备货库房'}>
                    <Select value={this.state.storageGuid} onChange={(value)=>this.setState({storageGuid:value})}>
                        <Option key={-1} value=''>全部</Option>
                        {
                            storageData.map((item,index)=>
                                <Option key={index} value={item.value}>{item.text}</Option>
                            ) 
                        }
                    </Select>
                  </FormItem>
                </Col>
                <Col span={6} key={3}>
                  <FormItem {...formItemLayout} label={'计划单状态'}>
                    {
                        getFieldDecorator(`fstate`,{
                            initialValue:''
                        })(
                            <Select>
                              <Option key={-1} value=''>全部</Option>
                              {
                                fstateOptions()
                              }
                            </Select>
                        )
                    }
                  </FormItem>
                </Col>
                <Col span={6} key={4}>
                    <FormItem {...formItemLayout} label={'申请时间'}>
                      {
                          getFieldDecorator(`applyTime`)(
                                  <RangePicker showTime format="YYYY-MM-DD" style={{width:"100%"}}/>
                              )
                      }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={7} key={5} offset={1}>
                  <FormItem>
                      {
                          getFieldDecorator(`searchName`)(
                                  <Input placeholder='计划单号/申请单号/就诊号/患者姓名' />
                          )
                      }
                  </FormItem>
                </Col>
                <Col span={2} key={6} style={{textAlign:'right'}}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                </Col>
            </Row>
        </Form>
      </div>)
    }
}
const WrappedSearchForm = Form.create()(SearchForm);
    
    const actions = {
        details: (action) => <a onClick={action}>查看</a>,
        isSure: (action) => <Popconfirm title="是否确认?" onConfirm={action}>
                            <a>确认</a>
                          </Popconfirm>,
        reject: (action) => <a onClick={action}>驳回</a>,
        sendOrder: (action) => <Popconfirm title="是否发送订单?" onConfirm={action}>
                            <a>发送订单</a>
                          </Popconfirm>
        }


class OperPlan extends React.Component{
    state = {
            query:'',
            selectedRowKeys:[],
            selectedRows: [],
            isloading:false,
            visible: false,
            info:'',
            tfRemark:'',
            storageData:[],
            storageOptions:[]
      }
    search = (query) => {
      this.refs.table.fetch(query);
      this.setState({ query: query })
    }
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
                          record.approvalFlag === '01' ? null
                          :
                          <span>
                            <span className="ant-divider" />
                            {actions.isSure(this.isSure.bind(this,record))}
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
    //查看
    details = (record) => {
        this.redirect('/purchase/purchasePlanMgt/OperPlanShow', record)
    }
    //确认
    isSure = (record) => {
      let handData = [ record ];
      this.handPlanSure(handData,'30');
    }
    //多条确认
    handerPass = (record)=> {
      const selectedRows = this.state.selectedRows;
      if(selectedRows.length===0){
        return message.warn('请至少选择一条待确认有效数据');
      }
      let handData = [];
      selectedRows.forEach((item,index)=>{
        if(item.fstate==='20' && item.approvalFlag !== '01'){
         handData.push(item)
        }
      });
      console.log(handData)
      this.handPlanSure(handData,'30');
      
    }
    //驳回
    reject = (record) => {
        this.setState({info:record});
        const that = this;
        that.showModal();
    }
   
    //发送订单
    sendOrder = (record) => {
      let handData = [record];
      this.handleOrder(handData)
    }
    //发送多条订单
    sendSureOrder = ()=>{
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
      console.log(handData)
      this.handleOrder(handData);
    }
    
    showModal=()=>{
        this.setState({visible:true})
    }
    //取消
    handleCancel=()=>{
        this.setState({visible:false})
    }
    //驳回,反馈理由
    handleOk = () => {
        const record = this.state.info;
        const failreason = this.state.tfRemark;
        if(failreason.length>200){
            return message.error('长度不能超过200')
        }
        else if(failreason.length<=0){
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
            message.error(data.msg)
          }
        })
    }
    //确认处理
    handPlanSure = (record,fstate)=>{
      const values = {};
      const planIds = [];
      record.map((item,index)=>{
        return planIds.push(item.planId);
      });
      values.planIds = planIds;
      values.fstate = fstate;
      console.log(values,"确认订单参数");
      fetchData(purchase.UPDATEPLANFSTATE,querystring.stringify(values),(data)=>{
        if(data.status){
            this.refs.table.fetch();
            message.success("操作成功");
        }else{
          message.error(data.msg)
        }
        this.setState({selectedRowKeys: []})
      })
    }
     //订单处理
    handleOrder = (record)=>{
      const values = {};
      const planIds = [];
      record.map((item,index)=>{
        return planIds.push(item.planId);
      })
      values.planIds = planIds;
      console.log(values,"发送订单参数")
      fetchData(purchase.SEND_OPERATIONPLAN,querystring.stringify(values),(data)=>{
          if(data.status){
              this.refs.table.fetch();
              message.success("操作成功!")
          }else{
              message.error(data.msg)
          }
          this.setState({selectedRowKeys: []})
      })
    }
    onSelectChange = (selectedRowKeys,selectedRows) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      console.log('selectedRows changed: ', selectedRows);
      this.setState({ selectedRowKeys,selectedRows });
    }
    changeVal = (e)=>{
      this.setState({tfRemark:e.target.value});
    }
    
    render(){
        const columns = [{
            title:'操作',
            dataIndex:'actions',
            width:130,
            fixed:'left',
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
            title:'就诊号',
            dataIndex:'treatmentNo',
        },{
            title:'手术名称',
            dataIndex:'operName',
        },{
            title:'患者姓名',
            dataIndex:'name',
        },{
            title:'申请科室',
            dataIndex:'deptName',
        },{
            title:'收货地址',
            dataIndex:'shippingAddress',
        },{
            title:'备货库房',
            dataIndex:'storageName',
        },{
            title:'申请人',
            dataIndex:'planUsername',
        },{
            title:'申请时间',
            dataIndex:'planTime',
        },{
            title:'申请单号',
            dataIndex:'applyNo',
            width:150,
            fixed:'right'
        }]
   

        const query = this.state.query;
        return (
            <div>
                 {
                this.props.children || 
                <div>
                    <WrappedSearchForm query={(query) => this.search(query)} defaultValue={query.bStorageGuid} storageOption={this.state.storageOptions}/>
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
                        <Button type="primary" style={{marginRight:8}} onClick={this.handerPass}>确认</Button>
                        <Button type="primary" ghost style={{marginRight:8}} onClick={this.sendSureOrder}>发送订单</Button>
                        <a href={purchase.EXPORTOPERPLANLIST+"&"+querystring.stringify(query)}><Button type="primary" style={{marginRight:8}}>导出</Button></a>
                        </Col>
                    </Row>
                    <FetchTable 
                    style={{marginTop:10}}
                    columns={columns}
                    query={query}
                    ref='table'
                    url={purchase.FINDSURGERY_LIST}
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
                    onOk={this.handleOk}
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
            </div>)
    }
}
module.exports = OperPlan;