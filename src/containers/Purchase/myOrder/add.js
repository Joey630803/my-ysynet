import React from 'react';
import { Breadcrumb, Input, Row, Col, Button, message } from 'antd';
import { Link } from 'react-router';
import FetchTable from 'component/FetchTable';
import { purchase } from 'api';
import { hashHistory } from 'react-router';
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
    title : '供应商',
    dataIndex : 'fOrgName'
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
  componentDidMount = () => {
    if (typeof this.props.location.state === 'undefined') {
      return this.redirect();
    }
    let selectedArr = [];
    this.props.location.state.dataSource.map( (item, index) => selectedArr.push(item.tenderMaterialGuid));
    this.setState({
      selected: selectedArr, 
      allRows: this.props.location.state.dataSource,
      selectedRows: this.props.location.state.dataSource
    });
  }
  state = {
    query: {
      searchName: '',
      storageGuid: this.props.location.state.storageGuid
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
      const data = this.props.location.state.dataSource;
      rows.map( (item, index) => {
        if (data.length > 0) {
          data.map( (list, i) => {
            if (item.tenderMaterialGuid === list.tenderMaterialGuid) {
              rows[index] = list;
            } 
            return null;
          })
        } 
        return null;
      })
      this.redirect(true, rows);
    }
  }
  redirect = (status, state = {}) => {
    hashHistory.push({
      pathname: '/purchase/myOrder/edit',
      state: {
        dataSource: state,
        storageGuid: this.props.location.state.storageGuid,
        expectDate: this.props.location.state.expectDate,
        addrGuid: this.props.location.state.addressId,
        flag: this.props.location.state.orderId
      }
    })
  }
  render () {
    return (
      <div>
         <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
          <Breadcrumb.Item><Link to='/purchase/myOrder'>我的订单</Link></Breadcrumb.Item>
          <Breadcrumb.Item>选择产品</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col span={16}>
            <Search
              placeholder="产品名称/通用名称/规格/型号/品牌／供应商"
              style={{ width: 300, marginTop: 5 }}
              onSearch={value => {
                let data = this.state.query;
                data.searchName = value;
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
          rowKey={'tenderMaterialGuid'}
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
              //console.log(selected, selectedRows, changeRows);
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

module.exports = AddMaterial;