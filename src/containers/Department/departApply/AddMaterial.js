import React from 'react';
import { Breadcrumb, Input, Row, Col, Button, message } from 'antd';
import { Link } from 'react-router';
import FetchTable from 'component/FetchTable';
import { department } from 'api';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../actions';
const columns = [
  {
    title : '通用名称',
    dataIndex : 'geName',
    fixed: 'left',
    width: 250
  },{
    title : '产品名称',
    dataIndex : 'materialName',
    fixed: 'left',
    width: 250
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
    title : '包装规格',
    dataIndex : 'tfPacking'
  },{
    title : '生产商',
    dataIndex : 'produceName'
  },{
    title : '品牌',
    dataIndex : 'tfBrandName'
  },{
    title : '采购价格',
    dataIndex : 'purchasePrice',
    width: 80,
    fixed: 'right'
  }
]

class AddMaterial extends React.Component {
  state = {
    query: {
      storageGuid: this.props.actionState.Apply.storageGuid,
      searchName: '',
      supplierId:'',
      tenderMaterialGuids:[]
    },
    supplierId:'',
    searchName:'',
    allRows: [],
    selectedRows: [], 
    selected: []//this.props.location.state.data
  }
  componentWillMount = () => {
    //打标记产品
    const tenderMaterialGuids = [];
    const productData = this.props.actionState.Apply.dataSource;
    productData.map((item,index) => {
      return tenderMaterialGuids.push(item.tenderMaterialGuid)
    })
    console.log(tenderMaterialGuids,'添加产品需要传导后台打标记的产品');
    //选中处理
    const selected = this.props.actionState.Apply.dataSource;
    let selectedArr = [];
    selected.map( (item, index) => selectedArr.push(item.tenderMaterialGuid));
    this.setState({ 
      query: { 
        tenderMaterialGuids: tenderMaterialGuids,
        storageGuid: this.props.actionState.Apply.storageGuid,
        searchName: '',
      },
      selected: selectedArr, 
      selectedRows: this.props.actionState.Apply.dataSource,
      allRows: this.props.actionState.Apply.dataSource
    })
   }
 
  add = () => {
    if (this.state.selected.length === 0) {
      message.warn('请至少选择一项!')
    } else {
      let rows = this.state.allRows;
      const data = this.props.actionState.Apply.dataSource;
      console.log(data,'添加产品旧数据dataSource');
      console.log(rows,'添加产品新添加rows')
      rows.map( (item, index) => {
        if (data.length > 0) {
          data.map( (list, i) => {
            if (item.tenderMaterialGuid === list.tenderMaterialGuid) {
              list.amount = list.amount || 1;
              return rows[index] = list;
            } 
            return null;
          })
        } 
        return null;
      })
      this.props.actions.createApply({
        dataSource: rows
      })
      this.redirect(true);
    }
  }
  redirect = (status) => {
   const url = this.props.location.state.addMatrialUrL;
    hashHistory.push({
      pathname: url
    })
  }
  render () {
    return (
      <div>
         <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
         <Breadcrumb.Item><Link to='/department/departApply'>申请管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item><a onClick={this.redirect.bind(this, false)}>{this.props.location.state.title}</a></Breadcrumb.Item>
          <Breadcrumb.Item>选择产品</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col span={8}>
          <Input
          placeholder="产品名称/通用名称/规格/型号/品牌"
              style={{ width: 300 }}
              onBlur={(e)=>{
                console.log(e.target.value,'111')
                this.setState({searchName:e.target.value})
              }}
          />
 
          </Col>
          <Col span={4}>
          <Button type="primary" style={{marginRight:16}} onClick={()=>{
            let data = this.state.query;
                data.searchName = this.state.searchName;
                data.supplierId = this.state.supplierId;
                this.setState({query: data});
                this.refs.table.fetch(data);
            
            }}>搜索</Button>
            <Button 
              type='primary' 
              style={{marginTop: 5}} 
              onClick={this.add}
            >
              添加</Button>
          </Col>
        </Row>
        <FetchTable 
          query={this.state.query}
          ref='table'
          rowKey={'tenderMaterialGuid'}
          url={department.STORAGEMATERIALLIST}
          columns={columns} 
          scroll={{ x: '200%' }}
          rowClassName={
            (record,index) => {
              if(record.chooseFlag === 1){
                return 'disabledColor'
              }
            }
          }
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
            },
            onSelect: (record, selected, selectedRows) => {
              const arr = this.state.allRows;
              if (selected) {
                arr.push(record);
              } else {
                arr.find(function(value, index, arr) {
                  if (value.tenderMaterialGuid === record.tenderMaterialGuid) {
                    arr.splice(index, 1);
                  }
                  return null;
                }) 
              }
              this.setState({
                allRows: arr
              })
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
              let arr = this.state.allRows;
              if (selected) {
                arr = [...arr, ...changeRows]
              } else {
                changeRows.map( (item, index) => {
                  arr.find((value, index, arr) => {
                    if (typeof value !== 'undefined'
                      && typeof item !== 'undefined'){
                      if (value.tenderMaterialGuid === item.tenderMaterialGuid) {
                        arr.splice(index, 1);
                      }
                    }
                    return null;
                  })
                  return null; 
                })
              }
              this.setState({
                allRows: arr
              })
            },
            getCheckboxProps: record=>({
                disabled: record.chooseFlag === 1,

            })
          }}
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
)(AddMaterial);