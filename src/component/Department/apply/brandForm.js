import React from 'react';
import { Table } from 'antd';
const columns = [
  {
    title : '品牌',
    dataIndex : 'tfBrandName'
  }, {
    title : '供应商',
    dataIndex : 'fOrgName',
  }, {
    title : '联系人',
    dataIndex : 'lxr'
  }, {
    title : '联系电话',
    dataIndex : 'lxdh'
  }
]
class BrandForm extends React.Component {
  state = {
    selected: [],
    dataSource: this.props.dataSource
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.dataSource) {
      this.setState({dataSource: nextProps.dataSource});
    }
  }
  render () {
    const { rowKey } = this.props;
    return (
        <Table 
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys})
              this.props.getSelection(selectedRowKeys);
            }
          }}
          ref='table' 
          columns={columns} 
          rowKey={rowKey} 
          dataSource={this.state.dataSource} 
          pagination={false}
        />)
  }
}
export default BrandForm;