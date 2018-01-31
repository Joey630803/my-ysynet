/**
 * @file 新增品牌
 */
import React, { Component } from 'react';
import { Row, Col, Input, Breadcrumb, Button } from 'antd';
import { apply } from 'component/Department';
import { department } from 'api';
import { Link, hashHistory } from 'react-router';

const { OperGrid } = apply;
const Search = Input.Search;

const styles = {
  breadcrumb: {
    fontSize: '1.1em',
    marginBottom: 10
  }
}

class AddBrand extends Component {
  state = {
    rows: [],
    selectedRows: []
  }
  search = (value) => {
    const { comboGuids, values } = this.props.location.state;
    const { deptGuid, storageGuid } = values;
    this.refs.operGrid.fetch({
      searchName: value,
      deptGuid, storageGuid, comboGuids
    });
  }
  add = () => {
    const { selectedRows } = this.state;
    const { fromTo, values, otherInfo } = this.props.location.state;
    const { detailList } = this.props.location.state;
    const postData = [ ...detailList, ...selectedRows ];
    hashHistory.push({
      pathname: '/department/operApply/details',
      state: {...fromTo, ...values, rows: postData, otherInfo, isEdit: true}
    })
  }
  render () {
    const { fromTo, values, comboGuids, detailList } = this.props.location.state;
    const { deptGuid, storageGuid } = values;
    return (
      <Row>
        <Col span={24}>
          <Breadcrumb style={styles.breadcrumb}>
            <Breadcrumb.Item><Link to='/department/operApply'>手术申请</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={{pathname: '/department/operApply/details', state: {...fromTo, ...values, rows: detailList, isEdit: true} }}>创建申请</Link></Breadcrumb.Item>
            <Breadcrumb.Item>选择品牌</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={16}>
          <Search
            placeholder="品牌/供应商"
            style={{ width: 200 }}
            onSearch={this.search}
          />
        </Col>
        <Col span={8} style={{textAlign: 'right'}}>
          <Button onClick={this.add} type='primary'>添加</Button>
        </Col>
        <Col span={24}>
          <OperGrid 
            rowKey={'comboGuid'}
            getRowSelection={rows => this.setState({selectedRows: rows})}
            url={department.QUERY_BRAND} 
            ref='operGrid' 
            query={{deptGuid, storageGuid, comboGuids }}
          />  
        </Col>  
      </Row>
    )
  }
}

module.exports = AddBrand;