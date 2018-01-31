/**
 * @file 我的订单
 */
import React from 'react';
import { Row, Col, Select, Form, 
        Input, Button, DatePicker, Icon, Popconfirm, message, Modal } from 'antd';
import { hashHistory } from 'react-router';   
import { CommonData, fetchData} from 'utils/tools'; 
import { purchase } from 'api';    
import FetchTable from 'component/FetchTable';
import FetchSelect from 'component/FetchSelect';
import querystring from 'querystring';

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class OrderAddForm extends React.Component {
  state = {
    visible: false,
    storageOptions: [],
    fstateKV: [],
    fOrgId:'',
    orderType: []
  }
  componentDidMount = () => {
        //订单状态
        CommonData('ORDER_FSTATE', (data) => {
            this.setState({fstateKV:data})
        })
        //订单类型
        CommonData('ORDER_TYPE', (data) => {
            this.setState({orderType:data})
        })
        //库房
       fetch(purchase.FINDSTORAGEBYUSER, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
            'Content-Type':'application/json'
        }
        })
        .then(res => res.json())
        .then(data => {
            if(data.status){
                this.setState({storageOptions: data.result})
            }
            else{
                message.error(data.msg)
            }
            
        })
        .catch(e => console.log("Oops, error", e))
  }
   //查询
  search = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const orderDate = values.orderDate === undefined ? "" : values.orderDate;
            const cancleDate = values.cancleDate === undefined ? "" : values.cancleDate;
            values.fOrgId = this.state.fOrgId;
            values.buyerOrSeller = 'B';
            if(orderDate.length>0) {
                values.orderDateStart = orderDate[0].format('YYYY-MM-DD');
                values.orderDateEnd = orderDate[1].format('YYYY-MM-DD');
            }
            if(cancleDate.length>0) {
                values.cancleDateStart = cancleDate[0].format('YYYY-MM-DD');
                values.cancleDateEnd = cancleDate[1].format('YYYY-MM-DD');
            }
            console.log('查询条件: ', values)
            this.props.query(values);
        })
    }
  //重置
  reset = () => {
      this.props.form.resetFields();
      this.props.query({buyerOrSeller:"B"});
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    const lableWrapper = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    const fstateOptions = () => {
      let options = [];
      let fstateKV = this.state.fstateKV;
      fstateKV.forEach((item) => {
         options.push(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
      })

      return options;
    }
    const storageOptions = () => {
      let options = [];
      let storageOptions =this.state.storageOptions;
      storageOptions.forEach((item) => {
        options.push(<Option key={item.value} value={item.value}>{item.text}</Option>)
      })
      return options;
    }
    const orderTypeeOptions = () => {
      let options = [];
      let orderTypeOptions =this.state.orderType;
      orderTypeOptions.forEach((item) => {
        options.push(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
      })
      return options;
    }
    return (
      <Form
      className="ant-advanced-search-form"
      onSubmit={this.search}
      >
        <Row>
          <Col span={6} key={1} >
            <FormItem {...lableWrapper} label={`库房`}>
              {getFieldDecorator(`storageGuid`,{
                initialValue: ''
              })(
                <Select>
                   <Option value=''>全部</Option>
                   {
                    storageOptions()
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} key={2}>
            <FormItem {...lableWrapper} label={`供应商`}>
                  <FetchSelect placeholder="请输入"  allowClear={true} style={{width:200}} ref='fetchs' url={purchase.FINDORGLISTFORSELECT} 
                            cb={(value) => this.setState({fOrgId: value})}/>
            </FormItem>
          </Col>
          <Col span={6} key={3}>
            <FormItem {...lableWrapper} label={`状态`}>
              {getFieldDecorator(`fstate`,{
                initialValue: ''
              })(
                <Select>
                  <Option value=''>全部</Option>
                  {
                    fstateOptions()
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} key={8}>
            <FormItem {...lableWrapper}  label={`订单类型`}>
              {getFieldDecorator(`orderType`,{
                initialValue: ''
              })(
                <Select>
                  <Option value=''>全部</Option>
                  {
                    orderTypeeOptions()
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} key={4} >
            <FormItem {...lableWrapper} label={`下单时间`}>
              {getFieldDecorator(`orderDate`)(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col span={6} key={5}>
            <FormItem {...lableWrapper} label={`取消时间`}>
              {getFieldDecorator(`cancleDate`)(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col span={6} key={6}>
            <FormItem {...lableWrapper} label={`订单号`}>
              {getFieldDecorator(`orderNo`)(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={6} key={7} style={{textAlign: 'right'}}>
             <Button  htmlType="submit" type='primary'>搜索</Button>
             <Button style={{ marginLeft: 8 }} onClick={this.reset}>
              清空
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedAddForm = Form.create()(OrderAddForm);
const actions = {
  details: (action) => <a onClick={action}>查看</a>,
  edit: (action) => <a onClick={action}>编辑</a>,
  delete: (action) => <Popconfirm title="是否删除?" onConfirm={action}>
                        <a>删除</a>
                      </Popconfirm>,
  submit: (action) => <Popconfirm title="是否提交?" onConfirm={action}>
                        <a>提交</a>
                      </Popconfirm>,
  redo: (action) => <Popconfirm title="是否撤销?" onConfirm={action}>
                      <a>撤销</a>
                    </Popconfirm>,
  resend: (action) => <Popconfirm title="是否重新发送?" onConfirm={action}>
                        <a>重新发送</a>
                      </Popconfirm>,
  cancel: (action) => <Popconfirm title="是否取消?" onConfirm={action}>
                        <a>取消</a>
                      </Popconfirm>,
}
class MyOrder extends React.Component {
  state = {
    query: {
      buyerOrSeller : 'B'
    },
    isloading:false,
    visible: false,
    tfRemark:''
  }
  search = (query) => {
      this.refs.table.fetch(query);
      this.setState({ query: query })
  }
  reload = () => {
    this.refs.table.fetch();
  }
  redirect = (url, record) => {
    hashHistory.push({
      pathname: url,
      state: record
    })
  }
  details = (record) => {
  	//手术订单详情
  	if(record.orderType === 'OPER_ORDER'){
  		this.redirect('/purchase/myOrder/operDetails',record)
  	}else{
    	this.redirect('/purchase/myOrder/details', record)
  	}
  }
  edit = (record) => {
    this.redirect('/purchase/myOrder/edit', record)
  }
  //提交
  submit = (record) => {
  			fetchData(purchase.UPDATEORDER_LIST,querystring.stringify({orderId:record.orderId,fstate:"20"}),(data)=>{
  				if(data.status){
  					this.refs.table.fetch();
  					message.success("操作成功")
  				}
  				else{
  					message.error(data.msg)
  				}
  			})
  }
   //发送
  resend = (record) => {
  		fetchData(purchase.UPDATEORDER_LIST,querystring.stringify({orderId:record.orderId,fstate:"30"}),(data)=>{
  		 if(data.status){
          this.refs.table.fetch();
          message.success("操作成功")
        }
        else{
          message.error(data.msg)
        }
  	})
  }
  //取消
  cancel = (record) => {
    const that = this;
    this.setState({ info : record });
    that.showModal();
  }
  showModal = () => {
    this.setState({ visible: true, tfRemark : ""})
  }
  //确认取消,理由
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
    fetchData(purchase.UPDATEORDER_LIST,querystring.stringify({orderId:record.orderId,fstate:"29",cancleReason:failreason}),(data)=>{
      this.setState({ visible:false,isloading:false });
      if(data.status){
        this.refs.table.fetch();
        message.success("操作成功")
      }
      else{
        message.error(data.msg)
      }
    })
  }
  handleCancel = () =>{
      this.setState({visible:false})
  }
  //撤销
  redo = (record) => {
  		fetchData(purchase.UPDATEORDER_LIST,querystring.stringify({orderId:record.orderId,fstate:"29"}),(data)=>{
  			if(data.status){
            this.refs.table.fetch();
            message.success("操作成功")
          }
          else{
            message.error(data.msg)
          }
  		})
  }
   //删除
  delete = (record) => {
  		fetchData(purchase.UPDATEORDER_LIST,querystring.stringify({orderId:record.orderId,fstate:"-1"}),(data)=>{
  			if(data.status){
            this.refs.table.fetch();
            message.success("操作成功")
          }
          else{
            message.error(data.msg)
          }
  		})
  }
  getActions = (text, record) => {  
    switch (text) {
      case '00':
        return <span>
                {actions.edit(this.edit.bind(this, record))}
                <span className="ant-divider" />
                {actions.submit(this.submit.bind(this,record))}
                <span className="ant-divider" />
                {actions.delete(this.delete.bind(this,record))}
               </span>
      case '20': 
        return <span>
                {actions.details(this.details.bind(this, record))}
                { record.allowCancleOrder === true ?
                <span>
                  <span className="ant-divider" />
                    { actions.cancel(this.cancel.bind(this,record)) }
                </span>
                :
                null
                }
              </span>
      case '29': 
        return <span>
                {actions.details(this.details.bind(this, record))}
              </span>
      case '26': 
        return <span>
                {actions.details(this.details.bind(this, record))}
                <span className="ant-divider" />
                {actions.resend(this.resend.bind(this,record))}
              </span>
      case '30': 
        return <span>
                {actions.details(this.details.bind(this, record))}
                { record.allowCancleOrder === true ?
                <span>
                  <span className="ant-divider" />
                    { actions.cancel(this.cancel.bind(this,record)) }
                </span>
                :
                null
                }
              </span>
                
      default:
        return <span>
                {actions.details(this.details.bind(this, record))}
              </span>
    }
  }
  changeVal = (e) => {
      this.setState({tfRemark:e.target.value});
    }
  render () {
    const columns = [{
        title : '操作',
        dataIndex : 'orderId',
        width: 150,
        fixed: 'left',
        render: (text, record) => {
          return this.getActions(record.fstate, record);
        }
      },{
        title : '状态',
        dataIndex : 'fstate',
        width: 80,
        fixed: 'left',
        render : (text, record) => {
        	return record.fstateName
        }
      },{
        title : '订单号',
        dataIndex : 'orderNo',
        width: 160,
        fixed: 'left'
      },{
      	title : '订单类型',
      	dataIndex : 'orderType',
      	render : (text, record) => {
      		return record.orderTypeName
      	}
      },{
        title : '到货时间',
        dataIndex : 'expectDate'
      },{
        title : '送货单总数量',
        dataIndex : 'deliveryCount'
      },{
        title : '已发货送货单',
        dataIndex : 'sendoutDeliveryCount'
      },{
        title : '收货地址',
        dataIndex : 'tfAddress'
      },{
        title : '供应商',
        dataIndex : 'fOrgName'
      },{
        title : '下单时间',
        dataIndex : 'orderDate'
      },{
        title : '总金额',
        dataIndex : 'totalPrice',
        width: 80,
        fixed: 'right',
        render: (text,record,index) => {
          return (text === 'undefined' || !text) ? Number('0.00') : Number(text).toFixed(2)
      }
      },{
        title : '下单人',
        dataIndex : 'orderUsername',
        width: 120,
        fixed: 'right'
      }
    ]
    const exportHref = purchase.EXPORTORDER_LIST+"?"+querystring.stringify(this.state.query);
    return (
        this.props.children
         || 
        <div>
          <WrappedAddForm
          query={(query) => this.search(query)}
          />
          <div>
              <a  href={exportHref}><Icon type="export" />导出Excel</a>        
          </div>
          <FetchTable
            query={this.state.query}
            ref='table'
            rowKey={'orderId'}
            size='small'
            url={purchase.MYORDER_LIST}
            columns={columns} 
            scroll={{ x: '150%' }}
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
            <h2>是否取消?</h2>
            <Input style={{marginTop:'16px'}} 
              onChange={this.changeVal} 
              value={this.state.tfRemark}
              placeholder='请输入撤销说明' 
              ref='failReason' 
              type="textarea" 
              rows={4}/>
            </Modal>
        </div>
    )
  }
}

module.exports = MyOrder;