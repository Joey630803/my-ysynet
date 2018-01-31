/**
 * @file 新建订单
 */
import React from 'react';
import { Row, Col, Select, Form, Table, message, InputNumber,
        Input, Button, Modal,Breadcrumb } from 'antd';
import { hashHistory ,Link} from 'react-router';    
import { purchase,storage } from 'api';    
import { fetchData } from 'utils/tools';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../../actions';
import querystring from 'querystring';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class AddForm extends React.Component {
  state = {
    storageGuid: '',
    storageOptions: [],
    addressOptions: [],
    addressId: null
  }
  handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
      });
  }
  componentDidMount = () => {
    let addressFlag = false;
    if(this.props.data.addressId){
      fetchData(storage.FINDSTORAGEADDREXIST,querystring.stringify({addrGuid:this.props.data.addressId}),(data)=>{
        if(!data.status){
          addressFlag = true;
        }
      })
    }
    fetchData(purchase.STORAGE_LIST,{},(data)=>{
      this.setState({storageOptions: data.result})
      if (data.result.length > 0) {
        let guid = null, addressId = null;
          if(this.props.data.storageGuid && this.props.data.addressId ){
          guid = this.props.data.storageGuid;
          addressId = this.props.data.addressId;
        } else {
          guid = data.result[0].value;
          this.props.cb({storageGuid: guid})
          this.setState({storageGuid: guid})
        }
        addressId = addressFlag?null : addressId;
        this.address(guid, addressId);
      }
    },'application/json')
  }
  address = (value, addressId) => {
    if (value) {
      fetchData(purchase.STORAGE_ADDR,querystring.stringify({storageGuid: value}),(data)=>{
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
      const planDetails = [];
      values.storageGuid  = this.props.data.storageGuid;
      values.addrGuid  = this.props.data.addressId;
      values.tfRemark  = this.props.data.remark;
      console.log(dataSource,'dataSource')
      dataSource.forEach((item) => {
        planDetails.push({fitemid:item.fitemid,purchaseUnit:item.purchaseUnit,amount:item.amount || 1,tenderMaterialGuid:item.tenderMaterialGuid,purchasePrice:item.purchasePrice,storageConversion:item.storageConversion,materialName:item.materialName,fmodel:item.fmodel,spec:item.spec,ref:item.ref,certGuid:item.certGuid,tfBrand:item.tfBrand,tfTexture:item.tfTexture,packingTexture:item.packingTexture,tfPacking:item.tfPacking,geName:item.geName})
      })
      values.planDetails = planDetails;
      values.fstate = "00";
      values.planType = "PLAN";
      console.log(values,"保存数据");
      fetchData(storage.INSERTEDITPLAN,JSON.stringify(values),(data)=>{
        if(data.status){
          message.success("保存成功！")
          this.props.cb({
            addressId: '',
            remark: '',
            storageGuid: '',
            dataSource: [],
            total: ''
          })
          hashHistory.push('/storage/customerStoragePlanMgt');
        }
        else{
          this.handleError(data.msg);
        }
      },'application/json')
       
      
  }
  submit = () => {
      let values = {};
      const dataSource  = this.props.data.dataSource;
      const planDetails = [];
      values.storageGuid  = this.props.data.storageGuid;
      values.tfRemark  = this.props.data.remark;
      values.addrGuid  = this.props.data.addressId;
      dataSource.forEach((item) => {
        planDetails.push({
          fitemid:item.fitemid,
          purchaseUnit:item.purchaseUnit,
          amount:item.amount || 1,
          tenderMaterialGuid:item.tenderMaterialGuid,
          purchasePrice:item.purchasePrice,
          storageConversion:item.storageConversion,
          materialName:item.materialName,
          fmodel:item.fmodel,
          spec:item.spec,
          ref:item.ref,
          certGuid:item.certGuid,
          tfBrand:item.tfBrand,
          tfTexture:item.tfTexture,
          packingTexture:item.packingTexture,
          tfPacking:item.tfPacking,
          geName:item.geName
        });
      })
      values.planDetails = planDetails;
      values.fstate = "20";
      values.planType = "PLAN";
      console.log(values,"保存数据");
      fetchData(storage.INSERTEDITPLAN,JSON.stringify(values),(data)=>{
        if(data.status){
            message.success("保存成功！")
            this.props.cb({
              addressId: '',
              remark: '',
              storageGuid: '',
              dataSource: [],
              total: ''
            })
            hashHistory.push('/storage/customerStoragePlanMgt');
          }
          else{
            this.handleError(data.msg);
          }
      },'application/json')
  }
  render () {
    const lableWrapper = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }

    return (
      <Form
      >

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
          <Col span={5} key={2}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label={`备注`}>
                <Input 
                defaultValue={
                    this.props.data.remark || null
                }
                onBlur={(e)=>{
                  this.props.cb({remark: e.target.value})
                }}
                /> 
            </FormItem>
          </Col>

          <Col span={8} key={4} style={{textAlign: 'right'}}>
            <Button 
              type='primary' 
              style={{marginRight: 8}} 
              onClick={() => {
                if (this.props.data.storageGuid) {
                  hashHistory.push({
                    pathname: '/storage/customerStoragePlanMgt/phPlan/addPhMaterial'
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

const WrappedAddForm = Form.create()(AddForm);

class NewAddPh extends React.Component {
  state = {
    visible: true,
    addressId: '',
    remark: '',
    storageGuid: '',
    dataSource: [],
    total: '',
    selected: [],
    selectedRows: []
  }
  reset = () => {
    this.createAddPh({
      addressId: null,
      remark: null,
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
    let { dataSource } = this.props.actionState.AddPh;
    let total = 0;
    if (/^\d+$/.test(value)) {
      if(value > 9999){
        return message.warn('数量超出限制！')
      }else{
        dataSource[index].amount = value;
        total = this.total(dataSource);
      }
    } else {
      dataSource[index].amount = 0;
      total = 0;
    }
    this.createAddPh({
      dataSource: dataSource,
      total: total
    })
  }
  createAddPh = (phList) => {
    this.props.actions.createAddPh(phList);
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
        title : '补货数量',
        dataIndex : 'amount',
        render: (text, record, index) => {
          return <InputNumber 
                  defaultValue={text || 1}
                  min={1} max={9999} onChange={this.onChange.bind(this, record, index)}/>
        }
    },{
      title : '库存上限',
      dataIndex : 'uLimit',
    },{
      title : '库存下限',
      dataIndex : 'lLimit',
    },{
      title : '采购价格',
      dataIndex : 'purchasePrice'
    },{
      title : '生产商',
      dataIndex : 'produceName'
    }
  ];
    return (
        this.props.children
         || 
        <div>
        <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
          <Breadcrumb.Item><Link to={{pathname:'/storage/customerStoragePlanMgt'}}>计划管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={{pathname:'/storage/customerStoragePlanMgt',query:{activeKey:'1'}}}>普耗计划</Link></Breadcrumb.Item>
          <Breadcrumb.Item>新建普耗计划</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedAddForm 
          cb={(phList) => this.createAddPh(phList)}
          data={this.props.actionState.AddPh}
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
          dataSource={ this.props.actionState.AddPh.dataSource } 
          columns={columns} 
          scroll={{ x: '150%' }}
          pagination={false}
          footer={ this.props.actionState.AddPh.dataSource.length === 0 ?
                  null : () => <span style={{fontSize: '1.5em'}}>总金额:
                                <a style={{color: '#f46e65'}}>
                                  {this.total(this.props.actionState.AddPh.dataSource).toFixed(2)}
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
)(NewAddPh);