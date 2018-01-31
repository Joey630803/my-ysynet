/**
 * @file 编辑普耗计划
 */
import React from 'react';
import { Row, Col, Select, Form, Table, message, InputNumber,
        Input, Button, Breadcrumb,Modal } from 'antd';
import { hashHistory,   Link } from 'react-router';   
import { purchase,storage } from 'api';    
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
const Option = Select.Option;
const FormItem = Form.Item;

class EditForm extends React.Component {
  state = {
    visible: false,
    storageGuid: this.props.data.storageGuid,
    storageOptions: [],
    addressOptions: [],
    tfRemark: this.props.data.tfRemark,
    addressId: this.props.data.addrGuid,
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
    if(this.props.data.addrGuid){
      fetchData(storage.FINDSTORAGEADDREXIST,querystring.stringify({addrGuid:this.props.data.addrGuid}),(data)=>{
        console.log(data)
        if(!data.status){
          addressFlag = true;
        }
      })
    }

    fetchData(purchase.STORAGE_LIST,{},(data)=>{
      this.setState({storageOptions: data.result})
      this.address(this.props.data.storageGuid, addressFlag?null:this.props.data.addrGuid);

    },'application/json')
  }
  address = (value, addressId) => {
    if (value) {
      fetchData(purchase.STORAGE_ADDR,querystring.stringify({storageGuid: value}),(data)=>{
        this.setState({
          addressOptions: data.result
        })
        let id = addressId;
        data.result.map( (item, index) => {
          if (!id ) {
            if (item.isDefault === 1) {
              id = item.value;
            }
          } else {
            return id;
          }
          return null;
        })
        this.setState({addressId: id});
      })
    }
  }

  delete = () => {
    const selectedRows = this.props.dataSource;
    console.log(selectedRows,'111')
    const selected = this.props.selectedRows;
    if (selected.length === 0) {
      message.warn('请至少选择一条数据')
    } else {
      let result = [];
      selectedRows.map( (item, index) => {
        const a = selected.find( (value, index, arr) => {
          return value === item.tenderMaterialGuid;
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
     const planDetails = [];
    values.planId = this.props.data.planId || this.props.data.flag;;
    values.storageGuid  = this.state.storageGuid;
    values.tfRemark  = this.state.tfRemark;
    values.addrGuid  = this.state.addressId;
    values.planType = "PLAN";
    dataSource.forEach((item) => {
      planDetails.push({fitemid:item.fitemid,purchaseUnit:item.purchaseUnit,amount:item.amount || 1,tenderMaterialGuid:item.tenderMaterialGuid,purchasePrice:item.purchasePrice,storageConversion:item.storageConversion,materialName:item.materialName,fmodel:item.fmodel,spec:item.spec,ref:item.ref,certGuid:item.certGuid,tfBrand:item.tfBrand,tfTexture:item.tfTexture,packingTexture:item.packingTexture,tfPacking:item.tfPacking,geName:item.geName})
    })
    values.planDetails = planDetails;
    values.fstate = fstate;
    console.log(values,'编辑的数据')
    fetchData(url,JSON.stringify(values),(data)=>{
      if(data.status){
        hashHistory.push('/storage/customerStoragePlanMgt');
        message.success("编辑成功！")
      }
      else{
        this.handleError(data.msg);
      }
    },'application/json')
  
  }
  save = () => {
    this.put(storage.INSERTEDITPLAN, this.props.data.fstate);
  }
  submit = () => {
    this.put(storage.INSERTEDITPLAN, "20");
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
                  value={ this.state.storageGuid }
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  disabled={true}
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
          <Col span={5} key={2}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label={`备注`}>
              <Input 
              defaultValue={
                  this.props.data.tfRemark || this.props.data.tfRemark
              }
              onBlur={(e)=>{
                this.setState({tfRemark:e.target.value})
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
                    pathname: '/storage/customerStoragePlanMgt/phPlan/editPhMaterial',
                    state: {
                      storageGuid: this.state.storageGuid,
                      tfRemark: this.state.tfRemark,
                      addressId: this.state.addressId,
                      dataSource: this.props.dataSource,
                      planId: this.props.data.planId,
                      fstate: this.props.data.fstate,
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
            {this.props.data.fstate === "00" ? <Button onClick={this.submit} style={{marginRight: 8}}>提交</Button> :null}
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedAddForm = Form.create()(EditForm);


class PhEdit extends React.Component {
  state = {
    visible: true,
    addressId: '',
    tfRemark: this.props.location.state.tfRemark || '',
    storageGuid: this.props.location.state.storageGuid || '',
    dataSource: [],
    total: '',
    selected: [],
    selectedRows: [],
  }
  componentDidMount = () => {
    if (this.props.location.state.planId) {
      fetchData(storage.SERACHPLANDETAIL,querystring.stringify({planId: this.props.location.state.planId}),(data)=>{
        this.setState({dataSource: data.result})
      })
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
        title : '品牌',
        dataIndex : 'tfBrandName'
    },{
        title : '补货数量',
        dataIndex : 'amount',
        render: (text, record, index) => {
          return <InputNumber 
                  defaultValue={text || 1}
                  min={1} onChange={this.onChange.bind(this, record, index)}/>
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
      dataIndex : 'productName'
    }
  ];
    return (
        this.props.children
         || 
        <div>
         <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
         <Breadcrumb.Item><Link to={{pathname:'/storage/customerStoragePlanMgt',query:{activeKey:'1'}}}>普耗计划</Link></Breadcrumb.Item>
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
          rowKey={'tenderMaterialGuid'}
          dataSource={this.state.dataSource} 
          columns={columns} 
          scroll={{ x: '150%' }}
          pagination={false}
          footer={ this.state.dataSource.length === 0 ? null : () => <span style={{fontSize: '1.5em'}}>总金额:
                            <a style={{color: '#f46e65'}}>
                              {this.total()}
                            </a>
                          </span>}
        />
      </div>
    )
  }
}
module.exports = PhEdit;