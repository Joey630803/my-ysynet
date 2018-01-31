/**
 * @file 新建订单
 */
import React from 'react';
import { Row, Col, Select, Form, Checkbox, Table, message, InputNumber,
        Input, Button, DatePicker, Icon, Modal } from 'antd';
import { hashHistory } from 'react-router';    
import { purchase } from 'api';    
import uuid from 'uuid';
import { FetchPost, checkJsonAllEmpty } from 'utils/tools';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../actions';
import querystring from 'querystring';
import moment from 'moment';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class OrderAddForm extends React.Component {
  state = {
    visible: false,
    storageGuid: '',
    storageOptions: [],
    addressOptions: [],
    addressId: null,
    orderId: null,
  }
  componentDidMount = () => {
    fetch(purchase.STORAGE_LIST, {
      method: 'post',
      mode:'cors',
      credentials: 'include',
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({storageOptions: data.result})
      if (data.result.length > 0) {
        let guid = null, addressId = null;
        if (!checkJsonAllEmpty(this.props.data)) { //草稿
          guid = this.props.data.storageGuid;
          addressId = this.props.data.addressId;
        } else {
          guid = data.result[0].value;
          this.props.cb({storageGuid: guid})
          this.setState({storageGuid: guid})
        }
        this.address(guid, addressId);
      }
    })
    .catch(e => console.log("Oops, error", e))
  }
  address = (value, addressId) => {
    if (value) {
      FetchPost(purchase.STORAGE_ADDR, 
      querystring.stringify({storageGuid: value}))
      .then(res => res.json())
      .then(data => {
        this.setState({
          addressOptions: data.result
        })
        let id = addressId;
        if (!id) {
          data.result.map((item, index) => {
            if (item.isDefault === 1) {
              id = item.value;
            }
            return id;
          })
        }
        this.setState({storageGuid: value, addressId: id});
        this.props.cb({addressId: id});
      })
      .catch(e => console.log("Oops, error", e))
    }
  }
  storageChange = (value) => {
    const storageGuid = this.props.data.storageGuid;
    const addressId = this.state.addressId;
  if(this.props.data.dataSource.length>0){
    const that = this;
    confirm({
              title: '提示',
              okText:'确认',
              cancelText:'取消' ,
              content: '是否切换库房？',
              onOk() {
                  that.setState({
                      addressOptions: [],
                      addressId: null
                    })
                  that.address(value)
                   that.props.cb({
                    dataSource:[],
                    storageGuid: value,
                    addressId: null
                  })
              },
              onCancel() {
                  that.address(storageGuid, addressId)
                  that.props.cb({
                    storageGuid: storageGuid,
                  })
              },
          });
    }
      else{
          this.setState({
            addressOptions: [],
            addressId: null
          })
          this.address(value)
          this.props.cb({
            storageGuid: value,
            addressId: null
          })
    }
  }
  addAddr = (guid) => {
    this.address(guid, null);
  }
  delete = () => {
    const selectedRows = this.props.data.dataSource;
    const selected = this.props.selectedRows;
    if (selected.length === 0) {
      message.warn('请至少选择一条数据')
    } else {
      let result = [];
      selectedRows.map( (item, index) => {
        const a = selected.find( (value, index, arr) => {
          return value === item.RN;
        })
        if (typeof a === 'undefined') {
          result.push(item)
        }
        return null;
      })
      this.props.cb({dataSource: result});
    }
  }
  save = () => {
      let values = {};
      const dataSource  = this.props.data.dataSource;
      const detailList = [];
      values.storageGuid  = this.props.data.storageGuid;
      values.expectDate  = this.props.data.expectDate;
      values.addrGuid  = this.props.data.addressId;
      values.orderId = this.state.orderId;
      dataSource.forEach((item) => {
        detailList.push({tenderMaterialGuid:item.tenderMaterialGuid,amount:item.amount || 1})
      })
      values.detailList = detailList;
      values.fstate = "00";
       fetch(purchase.SAVEORDER_LIST, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(values)
        })
        .then(res => res.json())
        .then(data => {
          if(data.status){
            message.success("订单添加成功！")
            this.setState({orderId: data.result});
          }
          else{
            message.error(data.msg)
          }
        })
        .catch(e => console.log("Oops, error", e))
  }
  submit = () => {
      let values = {};
      const dataSource  = this.props.data.dataSource;
      const detailList = [];
      values.storageGuid  = this.props.data.storageGuid;
      values.expectDate  = this.props.data.expectDate;
      values.addrGuid  = this.props.data.addressId;
      dataSource.forEach((item) => {
        detailList.push({tenderMaterialGuid:item.tenderMaterialGuid,amount:item.amount || 1})
      })
      values.detailList = detailList;
      values.fstate = "20";
      fetch(purchase.CREATEORDER_LIST, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(values)
        })
        .then(res => res.json())
        .then(data => {
          if(data.status){
            hashHistory.push('/purchase/myOrder');
            message.success("订单添加成功！")
            this.props.cb({
              addressId: '',
              expectDate: '',
              storageGuid: '',
              dataSource: [],
              total: ''
            })
            hashHistory.push({
              pathname: 'purchase/myOrder'
            })
          }
          else{
            message.error(data.msg)
          }
        })
        .catch(e => console.log("Oops, error", e))
  }
  render () {
    const lableWrapper = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    return (
      <Form
      >
          <Modal
            key={uuid()}
            title="新增地址"
            visible={this.state.visible}
            footer={null}
            onCancel={() => this.setState({visible: false})}
            okText="确认"
            cancelText="取消"
          >    
          <WrappedAddressForm 
            storageGuid={this.props.data.storageGuid || this.state.storageGuid}
            cb={() => this.setState({visible: false})}
            addOptions={this.addAddr}
          />
        </Modal>
        <Row>
          <Col span={4} key={1} >
            <FormItem {...lableWrapper} label={`库房`}>
                <Select
                  value={ this.props.data.storageGuid || this.state.storageGuid}
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.storageChange}
                >
                {
                  this.state.storageOptions.map(
                  (item, index) => <Option key={index} value={item.value}>{item.text}</Option>)
                }
                </Select>
            </FormItem>
          </Col>
          <Col span={5} key={2}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label={`到货时间`}>
                <DatePicker
                  value={
                    this.props.data.expectDate ? 
                    moment(this.props.data.expectDate , 'YYYY-MM-DD') :
                    null
                  }
                  onChange={(mValue, value) => this.props.cb({expectDate: value})}
                />
            </FormItem>
          </Col>
          <Col span={6} key={3}>
            <FormItem {...lableWrapper} label={`地址`}>
                <Select
                  value={ this.props.data.addressId ?
                    this.props.data.addressId : this.state.addressId
                  }
                  style={{width: '100%'}}
                  onChange={ value => {
                      this.setState({addressId: value})
                      this.props.cb({addressId: value})
                    }
                  }
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                {
                  this.state.addressOptions.map(
                  (item, index) => 
                     <Option key={index} value={item.value}>{item.text}</Option>
                  )
                }
                </Select>
            </FormItem>
          </Col>
          <Col span={1} style={{textAlign: 'left'}}>
            <Icon 
              onClick={() => this.setState({visible: true})} 
              type="plus-circle" 
              style={{marginTop: 10, marginLeft: 10}}/>
          </Col>
          <Col span={8} key={4} style={{textAlign: 'right'}}>
            <Button 
              type='primary' 
              style={{marginRight: 8}} 
              onClick={() => {
                if (this.props.data.storageGuid) {
                  hashHistory.push({
                    pathname: '/purchase/newOrder/add'
                  })
                } else {
                  message.error('请选择库房!')
                }
              }}
            >
              添加</Button>
            <Button type="danger" onClick={this.delete} ghost style={{marginRight: 8}}>删除</Button>
            <Button onClick={this.save} style={{marginRight: 8}}>保存</Button>
            <Button onClick={this.submit} type="primary" ghost style={{marginRight: 8}}>提交</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedAddForm = Form.create()(OrderAddForm);

class AddressForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        values.isDefault = values.isDefault ? "01" : "00";
        FetchPost(purchase.ADD_ADDR, 
          querystring.stringify({...values, storageGuid: this.props.storageGuid}))
        .then(res => res.json())
        .then(data => {
          if (data.status) {
            this.props.cb();
            this.props.addOptions(this.props.storageGuid);
            message.success('地址新增成功!');
          }
        })
        .catch(e => console.log("Oops, error", e))
      }
    });
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    const addrWrapper = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col span={24} key={4} >
            <FormItem {...addrWrapper} label={`联系人`}>
              {getFieldDecorator(`linkman`, {
                rules: [
                  { required: true, message: '请输入联系人' },
                  { max: 25, message: '长度不能超过25' }
                ]
              })(
                <Input/>
              )}
            </FormItem>
          </Col> 
          <Col span={24} key={5} >
            <FormItem {...addrWrapper} label={`联系电话`}>
              {getFieldDecorator(`linktel`, {
                rules: [
                  { required: true, message: '请输入联系电话' },
                  { max: 25, message: '长度不能超过25' }
                ]
              })(
                <Input/>
              )}
            </FormItem>
          </Col> 
          <Col span={24} key={6} >
            <FormItem {...addrWrapper} label={`地址`}>
              {getFieldDecorator(`tfAddress`, {
                rules: [
                  { required: true, message: '请输入地址' },
                  { max: 50, message: '长度不能超过50' }
                ]
              })(
                <Input/>
              )}
            </FormItem>
          </Col> 
          <Col span={21} key={7} push={3}>
            <FormItem {...addrWrapper}>
              {getFieldDecorator(`isDefault`)(
                <span><Checkbox style={{marginRight: 10}}/>是否设为默认地址</span>
              )}
            </FormItem>
          </Col>
          <Col span={24} key={8} style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button style={{marginLeft: 10}} onClick={this.props.cb}>取消</Button>
          </Col> 
        </Row> 
      </Form>  
    )
  }
}

const WrappedAddressForm = Form.create()(AddressForm);

class NewOrder extends React.Component {
  state = {
    visible: true,
    addressId: '',
    expectDate: '',
    storageGuid: '',
    dataSource: [],
    total: '',
    selected: [],
    selectedRows: []
  }
  reset = () => {
    this.createOrder({
      addressId: null,
      expectDate: null,
      storageGuid: null,
      dataSource: [],
      total: 0
    })
  }
  total = (record) => {
    let total = 0;
    record.map( (item, index) => {
      let amount = typeof item.amount === 'undefined' ? 1 : item.amount
      return total += amount * item.purchasePrice;
    })
    return total;
  }
  onChange = (record, index, value) => {
    let { dataSource } = this.props.actionState.Order;
    let total = 0;
    if (/^\d+$/.test(value)) {
      dataSource[index].amount = value;
      total = this.total(dataSource);
    } else {
      dataSource[index].amount = 0;
      total = 0;
    }
    this.createOrder({
      dataSource: dataSource,
      total: total
    })
  }
  createOrder = (order) => {
    this.props.actions.createOrder(order);
  }
  render () {
    const columns = [{
        title : '通用名称',
        dataIndex : 'geName',
        fixed: 'left',
        width: 150
    },{
        title : '产品名称',
        dataIndex : 'materialName',
        fixed: 'left',
        width: 150
    },{
        title : '规格',
        dataIndex : 'spec'
    },{
        title : '型号',
        dataIndex : 'fmodel'
    },{
        title : '采购单位',
        dataIndex : 'purchaseUnit'
    },{
        title : '采购价格',
        dataIndex : 'purchasePrice'
    },{
        title : '包装规格',
        dataIndex : 'tfPacking'
    },{
        title : '品牌',
        dataIndex : 'tfBrandName'
    },{
        title : '供应商',
        dataIndex : 'fOrgName'
    },{
        title : '采购数量',
        dataIndex : 'amount',
        fixed: 'right',
        width: 80,
        render: (text, record, index) => {
          return <InputNumber 
                  defaultValue={text || 1}
                  min={1} onChange={this.onChange.bind(this, record, index)}/>
        }
    },{
        title : '金额',
        dataIndex : 'total',
        fixed: 'right',
        width: 100,
        className: 'columnsMoney',
        render: (text, record, index) => {
          const amount = this.props.actionState.Order.dataSource[index].amount ? this.props.actionState.Order.dataSource[index].amount : 1;
          return <a>
                  { (amount * record.purchasePrice).toFixed(2) }
                 </a>
        }
    }
  ]
    return (
        this.props.children
         || 
        <div>
        <WrappedAddForm 
          cb={(order) => this.createOrder(order)}
          data={this.props.actionState.Order}
          selectedRows={this.state.selected}
        />
        <Table 
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
            }
          }}
          size={'small'}
          rowKey={'RN'}
          dataSource={ this.props.actionState.Order.dataSource } 
          columns={columns} 
          scroll={{ x: '150%' }}
          pagination={false}
          footer={ this.props.actionState.Order.dataSource.length === 0 ?
                  null : () => <span style={{fontSize: '1.5em'}}>订单总金额:
                                <a style={{color: '#f46e65'}}>
                                  {this.total(this.props.actionState.Order.dataSource).toFixed(2)}
                                </a>
                              </span>}
        />
      </div>
    )
  }
}
export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})
export const mapStateToProps = state => ({
  actionState: state
})
module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewOrder);