/**
 * 初始化
 */
import React from 'react';
import { hashHistory,Link } from 'react-router';
import {  Form,Modal,Row, Col,DatePicker, Breadcrumb,Table,Input ,Button,Select,message  } from 'antd';
import moment from 'moment';
import { fetchData ,checkJsonAllEmpty} from 'utils/tools';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../actions';
import { storage } from 'api';  

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class AddForm extends React.Component {
    state = {
        storageGuid: '',
        storageOptions: []
    }
    componentDidMount = () => {
        //库房列表
        fetchData(storage.FINDSTORAGEBYMYUSER,{},(data)=>{
            this.setState({storageOptions: data.result})
            if (data.result.length > 0) {
                let guid = null;
                if (!checkJsonAllEmpty(this.props.data)) { 
                    guid = this.props.data.storageGuid;
                } else {
                    guid = data.result[0].value;
                    this.props.cb({storageGuid: guid})
                    this.setState({storageGuid: guid})
                }
            }
        },'application/json')
    }
    handleError = (data) =>{
        Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
      });
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
                   that.props.cb({
                    dataSource:[],
                    storageGuid: value,
                  })
                },
                onCancel() {
                  that.props.cb({
                    storageGuid: storageGuid,
                })
              },
            });
        }
        else{
            this.props.cb({
                storageGuid: value,
            })
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
                return value === item.storageMaterialGuid;
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
      values.remark  = this.props.data.remark;
      dataSource.forEach((item) => {
        detailList.push({
            storageMaterialGuid:item.storageMaterialGuid,
            amount:item.amount || 1,
            flot:item.flot,
            prodDate: item.prodDate ? moment(item.prodDate).format('YYYY-MM-DD') : '',
            usefulDate: item.usefulDate ? moment(item.usefulDate).format('YYYY-MM-DD') : '',
        })
      })
      values.detailList = detailList;
      console.log(values,"保存数据");
      fetchData(storage.NEWINITALIZEINSTOCK,JSON.stringify(values),(data)=>{
        if(data.status){
          message.success("保存成功！")
          this.props.cb({
            remark: '',
            storageGuid: '',
            dataSource: [],
          })
          hashHistory.push({pathname:'/storage/wareHouse',query:{activeKey:'1'}});
        }
        else{
            this.handleError(data.msg)
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
          <Col span={6} key={1} >
            <FormItem {...lableWrapper} label={`库房`}>
                <Select
                  value={ this.props.data.storageGuid || this.state.storageGuid}
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.storageChange}
                  placeholder="请选择"
                >
                {
                  this.state.storageOptions.map(
                  (item, index) => <Option key={index} value={item.value}>{item.text}</Option>)
                }
                </Select>
            </FormItem>
          </Col>
          <Col span={6} key={2}>
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

          <Col span={12} key={4} style={{textAlign: 'right'}}>
            <Button 
              type='primary' 
              style={{marginRight: 8}} 
              onClick={() => {
                if (this.props.data.storageGuid) {
                  hashHistory.push({
                    pathname: '/storage/wareHouse/addProduct'
                  })
                } else {
                  message.error('请选择库房!')
                }
              }}
            >
              添加</Button>
            <Button type="danger" onClick={this.delete} ghost style={{marginRight: 8}}>删除</Button>
            <Button onClick={this.save} style={{marginRight: 8}}>确认</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedAddForm = Form.create()(AddForm);



class WareHouseInitial extends React.Component{
    state = {
        dataSource:[],
        storageOptions: [],
        storageGuid: ""
    }
    total = (record) => {
        let total = 0;
        record.map( (item, index) => {
            let amount = typeof item.amount === 'undefined' ? 1 : item.amount
            return total += amount * item.purchasePrice;
        })
        return total;
    }
    onChange = (key, index, value) => {
        if(  key ==="amount"){
          if (/^\d+$/.test(value.target.value)) {
            if (value.target.value > 9999) {
              return message.warn('输入数值过大, 不能超过10000')
            }
          }else {
            return message.warn('请输入非0正整数')
          }
        }
        let { dataSource } = this.props.actionState.initialization;
        console.log(dataSource,"111")
        if (typeof value === 'undefined') {
          dataSource[index][key] = '';
        } else if (typeof value.target === 'undefined' ) {
          dataSource[index][key] = value;
        } else {
          dataSource[index][key] = value.target.value;
        }
    
        this.createInitialization({
            dataSource: dataSource,
        })
    }
    createInitialization = (List) => {
        this.props.actions.createInitialization(List);
    }
    render(){
        const materialColumns = [
            {
              title : '产品名称',
              dataIndex : 'materialName',
              width: 180,
              fixed: 'left'
            },  {
              title : '通用名称',
              dataIndex : 'geName'
            },  {
              title : '规格',
              dataIndex : 'spec'
            },  {
              title : '型号',
              dataIndex : 'fmodel'
            },  {
              title : '采购单位',
              dataIndex : 'purchaseUnit'
            },  {
              title : '采购价格',
              dataIndex : 'purchasePrice'
            }, {
            title: '金额',
            dataIndex: 'price',
            render: (text,record,index)=>{
              return record.purchasePrice * record.amount;
            }
            }, {
            title: '供应商',
            dataIndex: 'fOrgName',
            }, {
            title: '生产商',
            dataIndex: 'produceName',
            } ,{
            title : '数量',
            dataIndex : 'amount',
            width: 80,
            fixed: 'right',
            render: (text, record, index) => {
            return <Input 
                min={0}
                defaultValue={text}
                onChange={this.onChange.bind(this, 'amount', index)}
                />
            }
            },  {
              title : '生产批号',
              dataIndex : 'flot',
              width: 120,
              fixed: 'right',
              render: (text, record, index) => {
                return <Input defaultValue={text} onChange={this.onChange.bind(this, 'flot', index)}/>
              }
            },  {
              title : '生产日期',
              dataIndex : 'prodDate',
              width: 110,
              fixed: 'right',
              render: (text, record, index) => {
                return <DatePicker  value={text!==null?moment(text):null} onChange={this.onChange.bind(this, 'prodDate', index)}/>
              }
            },{
              title : '有效期至',
              dataIndex : 'usefulDate',
              width: 110,
              fixed: 'right',
              render: (text, record, index) => {
                return <DatePicker value={ text!==null?moment(text):null } onChange={this.onChange.bind(this, 'usefulDate', index)}/>
              }
            }
          ];
        return(
            <div>
            { this.props.children || 
            <div>
                <Row>
                    <Col className="ant-col-6">
                        <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/wareHouse',query:{activeKey:'1'}}}>入库管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>初始化</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row>
                <WrappedAddForm 
                cb={(list) => this.createInitialization(list)}
                data={this.props.actionState.initialization}
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
                rowKey={'storageMaterialGuid'}
                dataSource={ this.props.actionState.initialization.dataSource } 
                columns={materialColumns} 
                scroll={{ x: '150%' }}
                pagination={false}
                footer={ this.props.actionState.initialization.dataSource.length === 0 ?
                        null : () => <span style={{fontSize: '1.5em'}}>总金额:
                                      <a style={{color: '#f46e65'}}>
                                        {this.total(this.props.actionState.initialization.dataSource).toFixed(2)}
                                      </a>
                                    </span>}
              />
       
            </div>
            }
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
  )(WareHouseInitial);