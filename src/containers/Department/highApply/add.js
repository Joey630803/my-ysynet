/**
 * @file 高值申请新增产品
 */
import React from 'react';
import { apply } from 'component/Department';
import { department } from 'api';
import { Breadcrumb } from 'antd';
import { Link, hashHistory } from 'react-router';

const { ApplyProduct, ProductSearch } = apply;

const styles = {
  breadcrumb: {
    fontSize: '1.1em',
    marginBottom: 20
  },
  content: {
    marginLeft: 8
  }
}
class HighApplyAdd extends React.Component {
  state = {
    rows: this.props.location.state.detailList || [],
    selectedRows: []
  }
  render () {
    const { fromTo, values, tenderMaterialGuids, otherInfo, detailList } = this.props.location.state;
    const { deptGuid, storageGuid } = values;
    return (
      <div style={styles.content}>
        <Breadcrumb style={styles.breadcrumb}>
          <Breadcrumb.Item><Link to='/department/highApply'>高值申请</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={{pathname: fromTo.back, state: {...fromTo, ...values, otherInfo, rows: detailList, isEdit: true} }} >{ fromTo.title }</Link></Breadcrumb.Item>
          <Breadcrumb.Item> 添加产品 </Breadcrumb.Item>
        </Breadcrumb>
        <ProductSearch 
          search={postData => this.refs.applyGrid.fetch({...postData, deptGuid, storageGuid, tenderMaterialGuids})}
          add={() => {
            const { rows, selectedRows } = this.state;
            let totalPrice = 0;
            const postData = [ ...selectedRows, ...rows ];
            for (let i=0;i< postData.length;i++) {
              postData[i].amount = postData[i].amount ? postData[i].amount : 1;
              postData[i].money = postData[i].money ? postData[i].money : Number(postData[i].purchasePrice);
              totalPrice += postData[i].money;
            }
            hashHistory.push({
              pathname: fromTo.back,
              state: {...fromTo, ...values, rows: postData, totalPrice, otherInfo, isEdit: true}
            })
          }}
        />
        <ApplyProduct
          rowKey={'tenderMaterialGuid'}
          url={department.QUERY_MATERIAL}
          query={{deptGuid, storageGuid, tenderMaterialGuids }}
          ref='applyGrid'
          readonly={true}
          getRowSelection={rows => this.setState({selectedRows: rows})}
        />
      </div>
    )
  }
}

module.exports = HighApplyAdd;