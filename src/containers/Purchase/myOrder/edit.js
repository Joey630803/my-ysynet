/**
 * @file 编辑订单
 */
import React from 'react';
import { Row, Col, Select, Form, Checkbox, Table, message, InputNumber,
        Input, Button, DatePicker, Icon, Modal, Breadcrumb } from 'antd';
import { hashHistory,   Link } from 'react-router';   
import { purchase } from 'api';    
import uuid from 'uuid';
import { FetchPost } from 'utils/tools';
import querystring from 'querystring';
import moment from 'moment';
const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = Form.Item;

class OrderAddForm extends React.Component {
  state = {
    visible: false,
    storageGuid: this.props.data.storageGuid,
    storageOptions: [],
    addressOptions: [],
    expectDate: this.props.data.expectDate,
    addressId: this.props.data.addrGuid,
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
      this.address(this.props.data.storageGuid, 
      typeof this.props.data.addrGuid === 'undefined' ? 
      null : this.props.data.addrGuid);
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
        let id = addressId, itHas = false;
        data.result.map( (item, index) => {
          if (!id ) {
            if (item.isDefault === 1) {
              id = item.value;
            }
          } else {
            if (item.value === id) {
              itHas = true;
              return false;
            } 
            if (!itHas && item.isDefault === 1) {
              id = item.value;
            }
          }
          return null;
        })
        // if (!id) {
        //   data.result.map((item, index) => {
        //     if (item.isDefault === 1) {
        //       id = item.value;
        //     }
        //     return id;
        //   })
        // } else {
        //   data.result.map((item, index) => {
        //     if (item.value === id) {
        //       isHas = true;
        //     }
        //     return isHas;
        //   })
        // }
        // if (!isHas) {
        //   id
        // }
        //if (!this.state.addressId) {
          this.setState({addressId: id});
        //}
      })
      .catch(e => console.log("Oops, error", e))
    }
  }
  storageChange = (value) => {
    if(this.props.dataSource.length>0){
      const that = this;
        confirm({
          title: '提示',
          okText:'确认',
          cancelText:'取消' ,
          content: '是否切换库房？',
          onOk() {
            that.setState({
              storageGuid: value,
              addressOptions: [],
              addressId: null
            })
            that.props.cb([])
            that.address(value);
          },
          onCancel() {
            that.address(that.props.data.storageGuid, that.state.addressId)
            that.setState({
              storageGuid: that.props.data.storageGuid,
              addressId: that.props.data.addressId,
              visible: false
            })
          },
      });
    } else {
      this.address(value)
      this.setState({
        storageGuid: value,
        addressId: null
      })
    }     
  }
  addAddr = (guid) => {
    this.address(guid, null);
  }
  delete = () => {
    const selectedRows = this.props.dataSource;
    const selected = this.props.selectedRows;
    if (selected.length === 0) {
      message.warn('请至少选择一条数据')
    } else {
      let result = [];
      selectedRows.map( (item, index) => {
        const a = selected.find( (value, index, arr) => {
          return value === item.orderDetailGuid;
        })
        if (typeof a === 'undefined') {
          result.push(item)
        }
        return null;
      })
      this.props.cb(result)
    }
  }
  put = (url, fstate) => {
    const values = {};
    const dataSource = this.props.dataSource;
    const detailList = [];
    values.orderId = this.props.data.orderId || this.props.data.flag;
    values.storageGuid  = this.state.storageGuid;
    values.expectDate  = this.state.expectDate;
    values.addrGuid  = this.state.addressId;
    dataSource.forEach((item) => {
      detailList.push({tenderMaterialGuid:item.tenderMaterialGuid,amount:item.amount || 1})
    })
    values.detailList = detailList;
    values.fstate = fstate;//"00";
    fetch(url, {
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
        message.success("编辑成功！")
      }
      else{
        message.error(data.msg)
      }
    })
  }
  save = () => {
    this.put(purchase.SAVEORDER_LIST, "00");
  }
  submit = () => {
    this.put(purchase.CREATEORDER_LIST, "20")
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
                  value={ this.state.storageGuid }
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
                    this.state.expectDate ? 
                    moment(this.state.expectDate, 'YYYY-MM-DD') :
                    null
                  }
                  onChange={(mValue, value) => this.setState({expectDate: value})}
                />
            </FormItem>
          </Col>
          <Col span={6} key={3}>
            <FormItem {...lableWrapper} label={`地址`}>
                <Select
                  value={ this.state.addressId }
                  style={{width: '100%'}}
                  onChange={ value => this.setState({addressId: value})}
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
                    pathname: '/purchase/myOrder/add',
                    state: {
                      storageGuid: this.state.storageGuid,
                      expectDate: this.state.expectDate,
                      addressId: this.state.addressId,
                      dataSource: this.props.dataSource,
                      orderId: this.props.data.orderId
                    }
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

class OrderEdit extends React.Component {
  state = {
    visible: true,
    addressId: '',
    expectDate: this.props.location.state.expectDate || '',
    storageGuid: this.props.location.state.storageGuid || '',
    dataSource: [],
    total: '',
    selected: [],
    selectedRows: [],
  }
  componentDidMount = () => {
    if (this.props.location.state.orderId) {
      FetchPost(purchase.DETAILS_BY_ORDERID,querystring.stringify({orderId : this.props.location.state.orderId}))
      .then(res => res.json())
      .then(data => {
        this.setState({dataSource: data.result})
      })
      .catch(e => console.log("Oops, error", e))
    } else {
      this.setState({
        dataSource: this.props.location.state.dataSource
      })
    }
  }
  total = () => {
    let total = 0;
    this.state.dataSource.map( (item, index) => {
      let amount = typeof item.amount === 'undefined' ? 1 : item.amount
      return total += amount * item.purchasePrice;
    })
    return total.toFixed(2);
  }
  onChange = (record, index, value) => {
    let { dataSource } = this.state;
    if (/^\d+$/.test(value)) {
      dataSource[index].amount = value;
    } else {
      dataSource[index].amount = 0;
    }
    this.setState({
      dataSource
    })
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
          const amount = this.state.dataSource[index].amount 
                ? this.state.dataSource[index].amount : 1;
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
         <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
          <Breadcrumb.Item><Link to='/purchase/myOrder'>我的订单</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedAddForm 
          data={this.props.location.state}
          dataSource={this.state.dataSource}
          selectedRows={this.state.selected}
          cb={ (dataSource) => {
            this.setState({
              dataSource: dataSource
            })
            this.total()
          }}
        />
          <Table 
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
            }
          }}
          size={'small'}
          rowKey={'orderDetailGuid'}
          dataSource={this.state.dataSource} 
          columns={columns} 
          scroll={{ x: '150%' }}
          pagination={false}
          footer={ this.state.dataSource.length === 0 ? null : () => <span style={{fontSize: '1.5em'}}>订单总金额:
                            <a style={{color: '#f46e65'}}>
                              {this.total()}
                            </a>
                          </span>}
        />
      </div>
    )
  }
}
module.exports = OrderEdit;
