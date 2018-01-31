import React, { PropTypes } from 'react';
import FetchTable from 'component/FetchTable';

class ApplyProduct extends React.Component {
  state = {
    selected: [],
    dataSource: this.props.dataSource || []
  }
  getDataSource = () => {
    return this.refs.table.getData();
  }
  fetch = (value) => {
    this.refs.table.fetch(value);
  }
  render () {
    const { url, query, rowKey,
        getRowSelection, isPagination } = this.props;
    let columns = [
      {
        title : '产品名称',
        dataIndex : 'materialName',
        width: 200,
        fixed: 'left'
      }, {
        title : '通用名称',
        dataIndex : 'geName',
      }, {
        title : '规格',
        dataIndex : 'spec'
      }, {
        title : '型号',
        dataIndex : 'fmodel'
      }, {
        title : '采购单位',
        dataIndex : 'purchaseUnit'
      },   {
        title : '包装规格',
        dataIndex : 'tfPacking'
      }, {
        title : '品牌',
        dataIndex : 'tfBrandName'
      }, {
        title : '生产商',
        dataIndex : 'produceName'
      }, {
          title: '需求数量',
          dataIndex: 'amount'
      }, {
        title : '采购价格',
        dataIndex : 'purchasePrice',
        width: 100,
        fixed: 'right'
      }
    ]
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
        query={query} 
        ref='table' 
        columns={columns} 
        url={url} 
        rowKey={rowKey} 
        size={'small'}
        isPagination={isPagination}
      />
    )
  }
}

ApplyProduct.propTypes = {
  rowKey: PropTypes.string.isRequired,
  query: PropTypes.object,
  url: PropTypes.string,
  readonly: PropTypes.bool.isRequired,
  getRowSelection: PropTypes.func.isRequired
}

export default ApplyProduct;