/**
 * 总务物资 ----添加产品
 */
import React from 'react';
import { Breadcrumb, Input, Row, Col, Button, message } from 'antd';
import FetchTable from 'component/FetchTable';
import { Link, hashHistory } from 'react-router';
import { storage } from 'api';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../actions';
const Search = Input.Search;
const columns = [
    {
      title : '通用名称',
      dataIndex : 'geName',
      fixed: 'left',
      width: 200
    },{
      title : '产品名称',
      dataIndex : 'materialName',
      fixed: 'left',
      width: 200
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
      dataIndex : 'purchasePrice',
      width: 120,
      fixed: 'right',
      render:(text,record)=>{
            return text === 'undefined'|| text===null ? '0':text.toFixed(2);
        }
    }
  ];
class ZwAddProduct extends React.Component{
    state = {
        query: {
            storageGuid: this.props.actionState.AddZwWareHouse.storageGuid,
            generalFlag: '01',
            excludeTenderMaterialGuids:this.props.location.state.excludeGuids
        },
        selected: [],
        selectedRows: []
    }
    add = ()=>{
        if(this.refs.table.state.data.length === 0){
            return message.warn('暂无产品，无法添加！');
        }
        if (this.state.selected.length === 0) {
            message.warn('请至少选择一项!');
          } else {
              let { selectedRows } = this.state;
              selectedRows.forEach((item,index)=> item.amount = 1);
              let dataSource = this.props.actionState.AddZwWareHouse.dataSource;
              const newData = [...dataSource,...selectedRows];
              console.log(newData,'newData')
              this.props.actions.createAddZWWareHouse({
                  dataSource: newData
              });
              hashHistory.push({ pathname:'/storage/wareHouse/zwMaterial'});
          }
    }
    render(){
        return (
            <div>
                {
                    this.props.children ||
                    <div>
                        <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/wareHouse',query:{activeKey:'1'}}}>入库管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/wareHouse/zwMaterial',}}>总务物资入库</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>添加产品</Breadcrumb.Item>
                        </Breadcrumb>
                        <Row>
                            <Col span={16}>
                                <Search
                                    placeholder="产品名称/通用名称/规格/型号"
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
                            ref='table'
                            query={this.state.query}
                            url={storage.QUERYSTORAGEMATERIALLIST}
                            columns={columns} 
                            rowKey='RN'
                            scroll={{x: '110%'}}
                            rowSelection={{
                                selectedRowKeys: this.state.selected,
                                onChange: (selectedRowKeys, selectedRows) => {
                                this.setState({selected: selectedRowKeys,selectedRows : selectedRows})
                                }
                            }}
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
)(ZwAddProduct);