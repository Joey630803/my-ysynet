import React from 'react';
import { Breadcrumb, Input, Row, Col, Button, message } from 'antd';
import FetchTable from 'component/FetchTable';
import { purchase } from 'api';
import { hashHistory,Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../../actions';
const Search = Input.Search;
const columns = [
  {
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

class AddGzMaterial extends React.Component {
  componentDidMount = () => {
    if (!this.props.actionState.AddGzPlan.storageGuid) {
      return this.redirect();
    }
    const selected = this.props.actionState.AddGzPlan.dataSource;
    let selectedArr = [];
    selected.map( (item, index) => selectedArr.push(item.storageMaterialGuid));
    this.setState({
      selected: selectedArr, 
      selectedRows: this.props.actionState.AddGzPlan.dataSource,
      allRows: this.props.actionState.AddGzPlan.dataSource
    });
  }
  state = {
    query: {
      searchLike: '',
      storageGuid: this.props.actionState.AddGzPlan.storageGuid
    },
    allRows: [],
    selectedRows: [], 
    selected: []//this.props.location.state.data
  }
  add = () => {
    if (this.state.selected.length === 0) {
      message.warn('请至少选择一项!')
    } else {
      let rows = this.state.allRows;
      const data = this.props.actionState.AddGzPlan.dataSource;
      rows.map( (item, index) => {
        if (data.length > 0) {
          data.map( (list, i) => {
            if (item.storageMaterialGuid === list.storageMaterialGuid) {
              list.amount = 1;
              rows[index] = list;
            } 
            return null;
          })
        } 
        return null;
      })
      this.props.actions.createAddGzPlan({
        dataSource: rows
      })
      this.redirect(true);
    }
  }
  redirect = (status) => {
    hashHistory.push({
      pathname: '/storage/customerStoragePlanMgt/gzPlan/addGzPlan'
    })
  }
  render () {
    return (
      <div>
         <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
         <Breadcrumb.Item><Link to={{pathname:'/storage/customerStoragePlanMgt'}}>计划管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={{pathname:'/storage/customerStoragePlanMgt',query:{activeKey:'2'}}}>高值计划</Link></Breadcrumb.Item>
          <Breadcrumb.Item><a onClick={this.redirect.bind(this, false)}>新建高值计划</a></Breadcrumb.Item>
          <Breadcrumb.Item>选择产品</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col span={16}>
            <Search
              placeholder="产品名称/通用名称/规格/型号/品牌"
              style={{ width: 300, marginTop: 5 }}
              onSearch={value => {
                let data = this.state.query;
                data.searchLike = value;
                this.setState({query: data});
                this.refs.table.fetch(data);
              }}
            />
          </Col>
          <Col push={6} span={2}>
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
          rowKey={'storageMaterialGuid'}
          url={purchase.MATERIAL_LIST}
          columns={columns} 
          scroll={{ x: '150%' }}
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
                  if (value.storageMaterialGuid === record.storageMaterialGuid) {
                    arr.splice(index, 1);
                  }
                  return null;
                }) 
              }
              console.log(arr, selected, 'onSelect');
              this.setState({
                allRows: arr
              })
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
              //console.log(selected, selectedRows, changeRows);
              let arr = this.state.allRows;
              if (selected) {
                arr = [...arr, ...changeRows]
              } else {
                changeRows.map( (item, index) => {
                  arr.find((value, index, arr) => {
                    if (typeof value !== 'undefined'
                      && typeof item !== 'undefined'){
                      if (value.storageMaterialGuid === item.storageMaterialGuid) {
                        arr.splice(index, 1);
                      }
                    }
                    return null;
                  }) 
                  return null;
                })
              }
              console.log(arr, 'onSelectAll');
              this.setState({
                allRows: arr
              })
            }
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
)(AddGzMaterial);