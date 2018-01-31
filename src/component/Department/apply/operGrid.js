/**
 * @file 手术申请Grid表格
 */
import React, { PropTypes } from 'react';
import FetchTable from 'component/FetchTable';

const columns = [
  {
    title : '品牌',
    dataIndex : 'tfBrandName',
    width: 150
  }, {
    title : '供应商',
    dataIndex : 'fOrgName',
    width: 150
  }, {
    title : '联系人',
    dataIndex : 'lxr',
    width: 150
  }, {
    title : '联系电话',
    dataIndex : 'lxdh',
    width: 150
  }
]

class OperGrid extends React.Component {
  state = {
    selected: []
  }
  fetch = (values) => {
    this.refs.table.fetch(values);
  }
  render () {
    const { query, url, getRowSelection, rowKey } = this.props;
    return (
      <FetchTable 
        rowSelection={{
          selectedRowKeys: this.state.selected,
          onChange: (selectedRowKeys, selectedRows) => {
            this.setState({selected: selectedRowKeys})
            getRowSelection(selectedRows);
          },
          getCheckboxProps: record => ({
            disabled: record.chooseFlag === 1
          })
        }}
        ref='table'
        columns={columns}
        query={query}
        url={url}
        rowKey={rowKey}
        scroll={{x: 800}}
      />
    )
  }
}

OperGrid.propTypes = {
  query: PropTypes.object,
  url: PropTypes.string.isRequired
}

export default OperGrid;