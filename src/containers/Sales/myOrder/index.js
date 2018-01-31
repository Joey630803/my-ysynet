/**
 * @file 我的订单
 */
import React from 'react';
import { Row, Col, Select, Form,
        Input, Button, DatePicker, Icon, Popconfirm, message, Modal } from 'antd';
import { hashHistory } from 'react-router';    
import { sales } from 'api';    
import FetchTable from 'component/FetchTable';
import FetchSelect from 'component/FetchSelect';
import { CommonData, fetchData} from 'utils/tools'; 
import querystring from 'querystring';

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class OrderAddForm extends React.Component {
  state = {
    visible: false,
    storageOptions: [],
    fstateKV: [],
    rOrgId:'',
    orderType: []
  }
  componentDidMount = () => {
        //订单状态
        CommonData('F_ORDER_FSTATE', (data) => {
            this.setState({fstateKV:data})
        })
        //订单类型
        CommonData('ORDER_TYPE', (data) => {
            this.setState({orderType:data})
        })
        //库房
       fetch(sales.FINDSTORAGEBYUSER, {
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
   search = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const orderDate = values.orderDate === undefined ? "" : values.orderDate;
            const cancleDate = values.cancleDate === undefined ? "" : values.cancleDate;
            values.rOrgId = this.state.rOrgId;
            values.buyerOrSeller = 'S';
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
        this.props.query({buyerOrSeller:"S"});
    }
    /**/
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
          <Col span={6} key={2}>
            <FormItem {...lableWrapper} label={`医疗机构`}>
                <FetchSelect placeholder="请输入"  allowClear={true} style={{width:180}} ref='fetchs' url={sales.FINDORGLISTFORSELECT} 
                            cb={(value) => this.setState({rOrgId: value})}/>
            </FormItem>
          </Col>
          <Col span={6} key={3}>
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
          <Col span={6} key={4}>
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
          <Col span={6} key={5} >
            <FormItem {...lableWrapper} label={`下单时间`}>
              {getFieldDecorator(`orderDate`)(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col span={6} key={6}>
            <FormItem {...lableWrapper} label={`取消时间`}>
              {getFieldDecorator(`cancleDate`)(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col span={6} key={7}>
            <FormItem {...lableWrapper} label={`订单号`}>
              {getFieldDecorator(`orderNo`)(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={12} key={8} style={{textAlign: 'right'}}>
            <Button style={{marginRight: 3}}  htmlType="submit" type='primary'>搜索</Button>
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
  redo: (action) => <Popconfirm title="是否撤销?" onConfirm={action}>
                      <a>撤销</a>
                    </Popconfirm>,
  cfirm: (action) => <Popconfirm title="是否确认?" onConfirm={action}>
                      <a>确认</a>
                     </Popconfirm>,
  stock: (action) => <a onClick={action}>备货</a>,
  cancelOrder: (action) => <Popconfirm title="是否关闭订单?" onConfirm={action}>
                            <a>关闭订单</a>
                           </Popconfirm>
}
class MyOrder extends React.Component {
  state = {
    query: {
      buyerOrSeller: 'S'
    },
    selectedRowKeys: [],
    selectedRows: [],
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
    if(record.orderType === 'OPER_ORDER'){
      this.redirect('/sales/myOrder/operDetails', record)
    }else{
      this.redirect('/sales/myOrder/details', record)
    }
  }
 
  //取消
  redo = (record) => {
    const that = this;
    this.setState({ info : record });
    that.showModal();
  }
  //备货
  stock = (record) => {
    if(record.orderType === 'ORDER' || record.orderType === 'HIGH_ORDER'){
      this.redirect('/sales/myOrder/phStock',record)
    }
    else if( record.orderType === 'OPER_ORDER' ){
      //进入页面临时清空数据
      fetchData(sales.CLEARBYORDERID,querystring.stringify({orderId:record.orderId}),(data)=>{
        if(data.status){
          this.redirect('/sales/myOrder/opStock',record)
        }else{
          message.error(data.msg);
        }
      });
      
    }
    else if( record.orderType === 'SETTLE_ORDER' ){
      this.redirect('/sales/myOrder/settStock',record)
    }
  }
  showModal = () =>{
    this.setState({visible:true,tfRemark:''});
  }
  handleOk = ()=> {
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
    fetchData(sales.UPDATEORDER_LIST,querystring.stringify({orderId:record.orderId,fstate:"90",cancleReason:failreason}),(data)=>{
       this.setState({visible:false,isloading:false});
        if(data.status){
          this.refs.table.fetch();
          message.success('操作成功')
        }
        else{
          message.error(data.msg)
        }
      })
  }
  handleCancel = () =>{
      this.setState({visible:false})
  }
  //确认
  cfirm = (record) => {
    fetchData(sales.UPDATEORDER_LIST,querystring.stringify({orderId:record.orderId,fstate:"40"}),(data)=>{
      if(data.status){
        this.refs.table.fetch();
        message.success("操作成功")
      }
      else{
        message.error(data.msg)
      }
    })
  }
  //取消订单
  cancelOrder = (record)=> {
    fetchData(sales.UPDATEORDER_LIST,querystring.stringify({orderId:record.orderId,fstate:'70'}),(data)=>{
      if(data.status){
        this.refs.table.fetch();
        message.success("操作成功")
      }
      else{
        message.error(data.msg)
      }
    })
  }
  //多条确认
  handerPass = () => {
    const selectedRows = this.state.selectedRows;
    const values ={};
    const orderId = [];
    selectedRows.map((item,index) => {
      return orderId.push(item.orderId)
    });
    values.orderId = orderId;
    values.fstate = '40';
    console.log(values,'多条确认订单数据')
    fetchData(sales.UPDATEORDER_LIST,querystring.stringify(values),(data)=>{
      if(data.status){
        this.refs.table.fetch();
        message.success("操作成功")
      }
      else{
        message.error(data.msg)
      }
      this.setState({ selectedRowKeys: [] });
    })
  }
  getActions = (text, record) => {  
    switch (text) {
      case '20': 
        return <span>
                {actions.details(this.details.bind(this, record))}
                { record.allowCancleOrder === true ?
                <span>
                  <span className="ant-divider" />
                    { actions.redo(this.cancel.bind(this,record)) }
                </span>
                :
                null
                }
                </span>
      case '40':
        return <span>
            {actions.details(this.details.bind(this, record))}
            { record.allowSettleGoods === true ?
                 <span>
                  <span className="ant-divider" />
                    {actions.stock(this.stock.bind(this, record))}
                </span>
                :
               null
            }
            <span className="ant-divider" />
            {actions.cancelOrder(this.cancelOrder.bind(this,record))}
          </span>
      case '29': 
        return <span>
                {actions.details(this.details.bind(this, record))}
              </span>
      case '26': 
        return <span>
                {actions.details(this.details.bind(this, record))}
              </span>
      case '30': 
        return <span>
                {actions.details(this.details.bind(this, record))}
                <span className="ant-divider" />
                { actions.cfirm(this.cfirm.bind(this,record)) }
              
                {record.allowCancleOrder === true ?
                  <span>
                    <span className="ant-divider" />
                      { actions.redo(this.redo.bind(this,record)) }
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
  changeVal = (e)=>{
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
        dataIndex : 'fstateName',
        width: 80,
        fixed: 'left'
      },{
        title : '订单号',
        dataIndex : 'orderNo',
        width: 150,
        fixed: 'left'
      },{
        title : '订单类型',
        dataIndex : 'orderTypeName',
        width: 150,
        fixed: 'left'
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
        title : '医疗机构',
        dataIndex : 'rOrgName'
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
    ];
    const exportHref = sales.EXPORTORDER_LIST+"?"+querystring.stringify(this.state.query);
    return (
        this.props.children
         || 
        <div>
          <WrappedAddForm
          query={(query) => this.search(query)}
          />
           <div>
              <Button type="primary" style={{marginRight:8}} onClick={this.handerPass}>确认</Button>
              <a  href={exportHref}><Icon type="export" />导出Excel</a>        
          </div>
          <FetchTable
            query={this.state.query}
            ref='table'
            rowKey={'orderId'}
            url={sales.MYORDER_LIST}
            columns={columns}
            size='small' 
            scroll={{ x: '150%' }}
            rowSelection={{
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selectedRowKeys: selectedRowKeys, selectedRows: selectedRows})
            }
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