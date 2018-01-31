/**
 * @file 编辑申请
 */
import React from 'react';
import { Row, Col, Select, Form, Table, message, Input,Button, Breadcrumb ,Modal} from 'antd';
import { Link,hashHistory } from 'react-router';    
import { department } from 'api';    
import { fetchData,checkJsonAllEmpty} from 'utils/tools';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../actions';
import querystring from 'querystring';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class ApplyAddForm extends React.Component {
  state = {
    visible: false,
    storageGuid: null,
    deptGuid:'',
    departOptions: [],
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
  //用户所属科室
  componentDidMount = () => {
    fetchData(department.FINDDEPTSTORAGEBYUSER,{},(data)=>{
      this.setState({departOptions: data})
        if(data.length>0){
          let deptGuid = null, addressId = null,storageGuid = null;
          if (!checkJsonAllEmpty(this.props.data)) { //草稿
            deptGuid = this.props.data.deptGuid;
            addressId = this.props.data.addressId;
            storageGuid = this.props.data.storageGuid;
          } else {
            deptGuid = data[0].value;
            this.props.cb({deptGuid: deptGuid})
            this.setState({deptGuid: deptGuid})
          }
          this.getStorage(deptGuid,data,storageGuid)
          this.address(deptGuid, addressId);
        }
    });
  }
   //科室联动库房
  handleDeptChange = (value) => {
      //加库房接口 科室id
      const departOptions = this.state.departOptions;
      //切换库房
      if(this.props.data.dataSource.length === 0){
        this.setState({ 
          deptGuid:value,
        })
        this.props.cb({ deptGuid: value})
        this.address(value)
        this.getStorage(value,departOptions)
      }else{
          const that = this;
          confirm({
              title: '提示',
              okText:'确认',
              cancelText:'取消' ,
              content: '是否切换科室？',
              onOk() {
                that.getStorage(value,departOptions)
                that.address(value)
                that.setState({deptGuid:value})
                  that.props.cb({
                    dataSource:[],
                    deptGuid: value
                  })
              },
              onCancel() {
                that.props.cb({
                    deptGuid: value
                  })
              },
          });
      }
  }

  //库房
  getStorage = (val, data,storageGuid) => {
  if(val){
      let storageOptions = [];
      data.map(item => {
        if (item.value === val) {
          return storageOptions = item.children;
        }
        return null;
      })

      let id = storageGuid;
      if (!id) {
        storageOptions.map((item, index) => {
          id = item.value;
          return id;
        })
      }
      this.setState({
        storageOptions : storageOptions,
        storageGuid : id
      })
       this.props.cb({storageGuid: id});
    }
  }
  //地址
  address = (value, addressId) => {
    if (value) {
      fetchData(department.FINDDEPTADDRESS,querystring.stringify({deptGuid: value}),(data)=>{
          this.setState({ addressOptions: data.result });
          let id = addressId;
          if (!id) {
            data.result.map((item, index) => {
              id = item.value;
              return id;
            })
          }
          this.setState({deptGuid: value, addressId: id});
          this.props.cb({addressId: id});
        });
    }
  }
  storageChange = (value) => {
    const storageGuid = this.props.data.storageGuid;
    if(this.props.data.dataSource.length>0){
    const that = this;
    confirm({
              title: '提示',
              okText:'确认',
              cancelText:'取消' ,
              content: '是否切换库房？',
              onOk() {
                that.setState({storageGuid:value})
                   that.props.cb({
                    dataSource:[],
                    storageGuid: value
                  })
              },
              onCancel() {
                 that.props.cb({
                    storageGuid: storageGuid,
                  })
              },
          });
    }else{
      this.setState({ storageGuid: value })
      this.props.cb({ storageGuid: value })
    }
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
          return value === item.applyDetailGuid;
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
      values.applyId = this.props.data.applyId;
      values.storageGuid  = this.props.data.storageGuid;
      values.deptGuid  = this.props.data.deptGuid;
      values.addrGuid  = this.props.data.addressId;
      values.fstate  = "00";
      dataSource.forEach((item) => {
        detailList.push({tenderMaterialGuid:item.tenderMaterialGuid,amount:item.amount || 1});
      });
      values.detailList = detailList;
      console.log(values,'编辑保存数据');
      fetchData(department.INSERTUPDATEAPPLY,JSON.stringify(values),(data)=>{
        if(data.status){
          hashHistory.push('/department/departApply');
          message.success("编辑成功！")
          this.props.cb({
            applyId:'',
            addressId: '',
            deptGuid: '',
            storageGuid: '',
            dataSource: [],
          });
        }
        else{
          this.handleError(data.msg);
        }
      },'application/json');
  }
  submit = () => {
      let values = {};
      const dataSource  = this.props.data.dataSource;
      const detailList = [];
      values.applyId = this.props.data.applyId;
      values.storageGuid  = this.props.data.storageGuid;
      values.deptGuid  = this.props.data.deptGuid;
      values.addrGuid  = this.props.data.addressId;
      dataSource.forEach((item) => {
        detailList.push({tenderMaterialGuid:item.tenderMaterialGuid,amount:item.amount || 1})
      })
      values.detailList = detailList;
      values.fstate = "10";
      fetchData(department.INSERTUPDATEAPPLY,JSON.stringify(values),(data)=>{
        if(data.status){
          hashHistory.push('/department/departApply');
          message.success("编辑成功！")
          this.props.cb({
            applyId:'',
            addressId: '',
            deptGuid: '',
            storageGuid: '',
            dataSource: [],
          });
        }
        else{
          this.handleError(data.msg);
        }
      },'application/json');
  }
  //添加产品
  handleAdd = () => {
    hashHistory.push({pathname: '/department/departApply/AddMaterial',state:{addMatrialUrL:'/department/departApply/edit',title:'编辑申请'}})
  }

  //添加模板
  handleAddTemplate = () => {
    if(this.state.deptGuid === ""){
      return message.warn("请选择科室")
    }
    if(this.state.storageGuid === ""){
      return message.warn("请选择库房")
    }
    let values = {};
    const tenderMaterialGuids = [];
    const productData = this.props.data.dataSource;
    productData.map((item,index) => {
      return tenderMaterialGuids.push(item.tenderMaterialGuid)
    })
    values.storageGuid = this.state.storageGuid;
    values.deptGuid = this.state.deptGuid;
    values.tenderMaterialGuids = tenderMaterialGuids;
    console.log(values,'添加模板参数');
     hashHistory.push({pathname: '/department/departApply/addTemplate',state : {...values,addTemplatelUrL:'/department/departApply/edit',title:"编辑申请"}})
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
          <Col span={6} key={1} >
            <FormItem {...lableWrapper} label={`科室`}>
                <Select
                  value={this.state.deptGuid || this.props.data.deptGuid}
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.handleDeptChange}
                  placeholder="请选择"
                >
                {
                  this.state.departOptions.map(
                  (item, index) => <Option key={index} value={item.value}>{item.label}</Option>)
                }
                </Select>
            </FormItem>
          </Col>
          <Col span={6} key={2} >
            <FormItem {...lableWrapper} label={`备货库房`}>
                <Select
                  value={this.state.storageGuid || this.props.data.storageGuid}
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.storageChange}
                  placeholder="请选择"
                >
                {
                  this.state.storageOptions.map(
                  (item, index) => <Option key={index} value={item.value}>{item.label}</Option>)
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
                  placeholder="请选择"
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
        </Row>
        <Row style={{marginBottom:16}}>
          <Col span={12}>
                <Button type='default' 
                onClick={this.handleAddTemplate}
                >选择模板</Button>
                <Button 
                  type='default' 
                  style={{marginRight: 8,marginLeft: 8}} 
                  onClick={this.handleAdd}
                >
                  添加产品</Button>
                <Button type="danger" onClick={this.delete} ghost style={{marginRight: 8}}>删除产品</Button>
   
          </Col>
          <Col span={12} style={{textAlign:'right'}}>
              <Button onClick={this.save} type="primary" style={{marginRight: 8}}>保存</Button>
              <Button onClick={this.submit} type="primary" style={{marginRight: 8}}>提交</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
const WrappedAddForm = Form.create()(ApplyAddForm);

class DeptApplyEdit extends React.Component {
  state = {
    visible: true,
    addressId: '',
    deptGuid: '',
    storageGuid: '',
    dataSource: [],
    selected: [],
    selectedRows: []
  }
  componentWillMount = () => {
   //存在从列表传过来的id和从添加产品页面传过来的id
    const addData = this.props.actionState.Apply.dataSource;
    const applyId =  this.props.location.state === undefined ? this.props.actionState.Apply.applyId : this.props.location.state.applyId;
    const deptGuid =  this.props.location.state === undefined ? this.props.actionState.Apply.deptGuid : this.props.location.state.deptGuid ;
    const storageGuid =  this.props.location.state === undefined ? this.props.actionState.Apply.storageGuid : this.props.location.state.storageGuid;
    const addrGuid = this.props.location.state === undefined ? this.props.actionState.Apply.addressId : this.props.location.state.addrGuid  ;
    //根据申请id查询产品
    if(addData.length>0){
         this.createApply({ dataSource: addData});
      } else{
        fetchData(department.SEARCHAPPLYDETAILS,querystring.stringify({applyId:applyId}),(data)=>{
          this.createApply({
            applyId: applyId,
            addressId: addrGuid,
            deptGuid: deptGuid,
            storageGuid: storageGuid,
            dataSource: data.result,
          })
        });
      }
  }
  reset = () => {
    this.createApply({
      applyId: null,
      addressId: null,
      deptGuid: null,
      storageGuid: null,
      dataSource: [],
    })
  }
  onChange = (record, index, e) => {
    let value = e.target.value;
    let { dataSource } = this.props.actionState.Apply;
    if (/^\d+$/.test(value)) {
      if (value > 9999) {
        e.target.value  = 9999;
        dataSource[index].amount = 9999;
        return message.warn('输入数值过大, 不能超过10000')
      }
      else{
        dataSource[index].amount = value;
      }
    } else {
        return message.warn('请输入非0正整数')
      //  e.target.value  = 1;
      //  dataSource[index].amount = 1;
    }
    this.createApply({
      dataSource: dataSource,
    })
  }
  createApply = (apply) => {
    this.props.actions.createApply(apply);
  }
   //申请单总金额
  total = (record) => {
      let total = 0;
      record.map( (item, index) => {
      let amount = typeof item.amount === 'undefined' ? 1 : item.amount
      return total += amount * item.purchasePrice;
      })
      return total;
  }
  render () {
    const columns = [{
        title : '通用名称',
        dataIndex : 'geName',
        width: 150
    },{
        title : '产品名称',
        dataIndex : 'materialName',
        width: 150
    },{
        title : '规格',
        dataIndex : 'spec',
        width: 120,
    },{
        title : '型号',
        dataIndex : 'fmodel',
        width: 120,
    },{
        title : '采购单位',
        dataIndex : 'purchaseUnit',
         width: 80,
    },{
        title : '采购价格',
        dataIndex : 'purchasePrice',
        width: 100,
    },{
        title : '包装规格',
        dataIndex : 'tfPacking',
        width: 120,
    },{
        title : '需求数量',
        dataIndex : 'amount',
        width: 80,
        render: (text, record, index) => {
          return <Input 
                  defaultValue={text || 1}
                  max={1000}
                  min={1}  onInput={this.onChange.bind(this, record, index)}/>
        }
    },{
        title : '金额',
        dataIndex : 'total',
        width: 100,
        className: 'columnsMoney',
        render: (text, record, index) => {
          const amount = this.props.actionState.Apply.dataSource[index].amount ? this.props.actionState.Apply.dataSource[index].amount : 1;
          return <a>
                  {record.purchasePrice === undefined ? "0.00" :  (amount * record.purchasePrice).toFixed(2) }
                 </a>
        }
    },{
        title : '品牌',
        dataIndex : 'tfBrand',
        width: 120
    },{
        title : '生产商',
        dataIndex : 'produceName'
    }
  ]
    return (
        this.props.children
         || 
        <div>
        <Breadcrumb style={{fontSize: '1.1em',marginBottom: 16}}>
          <Breadcrumb.Item><Link to='/department/departApply'>申请管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑申请</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedAddForm 
          cb={(apply) => this.createApply(apply)}
          data={this.props.actionState.Apply}
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
          rowKey={'applyDetailGuid'}
          dataSource={ this.props.actionState.Apply.dataSource } 
          columns={columns} 
          scroll={{ x: '120%' }}
          pagination={false}
          footer={ () => <span style={{fontSize: '1.5em'}}>申请单总金额:
                      <a style={{color: '#f46e65'}}>
                      {this.props.actionState.Apply.dataSource.length === 0 ?
                      "0.00":  this.total(this.props.actionState.Apply.dataSource).toFixed(2)}
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
)(DeptApplyEdit);
