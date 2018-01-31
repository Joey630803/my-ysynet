import React from 'react';
import {  Form,Breadcrumb, Row, Col, Button, message } from 'antd';
import { Link, hashHistory } from 'react-router';
import FetchTable from 'component/FetchTable';
import { fetchData } from 'utils/tools';
import { sales } from 'api';
import querystring from 'querystring';
import SearchForm from './SearchForm';
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
const columns = [{
    title: '通用名称',
    dataIndex: 'geName',
    fixed: 'left',
    width: 150
  }, {
    title: '产品名称',
    dataIndex: 'materialName',
  }, {
    title: '规格',
    dataIndex: 'spec',
  }, {
    title: '型号',
    dataIndex: 'fmodel',
  }, {
    title: '品牌',
    dataIndex: 'tfBrandName',
    width: 50
  }, {
    title: '采购单位',
    dataIndex: 'purchaseUnit',
    width: 75
  }, {
    title: '包装规格',
    dataIndex: 'tfPacking',
    width: 75
  }, {
    title: '供应商',
    dataIndex: 'fOrgName',
  }, {
    title: '采购价格',
    dataIndex: 'purchasePrice',
    width: 75,
    fixed: 'right'
  }
];
class TemplateAdd extends React.Component {
  state = {
    selected: [],
    selectedRows: [],
    query: {}
  }
  queryHandler = (query) => {
    query.storageGuid = this.props.location.state.storage.value;
    this.refs.table.fetch(query);
    this.setState({ query })
  }
  choseHandler = () => {
    const { selected } = this.state;
    const { template } = this.props.location.state;
    if (!selected.length) {
      return message.warn('请至少选择一条记录!')
    }
    
    fetchData(sales.INSERTGKTEMPLATEDETAILS,
      querystring.stringify({tenderDetailGuids: selected, gkTemplateGuId: template.id}),(data)=>{
        if (data.status) {
          const { template, rOrgId, storage } = this.props.location.state;
          hashHistory.push({
            pathname: '/sales/stockTemplate',
            state: {
              template, rOrgId, storage
            }
          })
        }
      })
   
  }
  render () {
    const {storage } = this.props.location.state;
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
          <Breadcrumb.Item><Link to='/sales/stockTemplate'>手术备货模板</Link></Breadcrumb.Item>
          <Breadcrumb.Item>添加产品</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col span={20}>
          <SearchBox query={this.queryHandler} rOrgId={this.props.location.state.rOrgId}/>
          </Col>
          <Col span={4} style={{ textAlign: 'right'}}>
            <Button type="primary" onClick={this.choseHandler}>选入</Button>
          </Col>
        </Row>
        <FetchTable 
          query={{storageGuid: storage.value}}
          url={sales.QUERYSTORAGEMATERIALLIST}  
          rowKey={'tenderMaterialGuid'}
          ref='table'
          cb={(rows) => {
            let defaultSelected = this.state.selected;
            rows.map((item, index) => {
              if (item.chooseFlag && !defaultSelected.find((n) => n === item.tenderMaterialGuid)) {
                defaultSelected.push(item.tenderMaterialGuid);
              }
              return null;
            })
            this.setState({selected: defaultSelected});
          }}
          columns={columns} 
          scroll={{ x: '150%' }}
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys})
            }
          }}
        />
      </div>  
    )
  }
}
module.exports = TemplateAdd;