import React from 'react';
import { Input, Table, message } from 'antd';
import { throttle } from 'utils/tools';

class ApplyDetailForm extends React.Component {
  state = {
    selected: [],
    dataSource: this.props.dataSource || []
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.dataSource) {
      this.setState({dataSource: nextProps.dataSource});
    }
  }
  onInputHandler = (index, e) => {
    const { dataSource } = this.state;
    const target = e.target;
    throttle( () => {
      let value = target.value;
      if (value > 10000) {
        value = 10000;
        target.value = 10000;
        message.warn('最大不能超过10000');
      }
      dataSource[index].amount = value;
      dataSource[index].money = Number(value) * dataSource[index].purchasePrice;
      this.countHandler();
      this.setState({dataSource})
    })
  }
  countHandler = () => {
    const { dataSource } = this.state;
    let total = 0;
    dataSource.map(item => {
      let amount = typeof item.amount === 'undefined' ? 1 : item.amount
      return total += amount * item.purchasePrice;
      }
    )
    document.querySelector('#total').innerHTML = total.toFixed(2);
  }
  render () {
    const { readonly, rowKey, totalPrice } = this.props;
    let columns = [
      {
        title : '产品名称',
        dataIndex : 'materialName',
        width: 200,
        fixed: 'left'
      }, {
        title : '通用名称',
        dataIndex : 'geName',
        width: 200
      }, {
        title : '规格',
        dataIndex : 'spec',
        width: 200
      }, {
        title : '型号',
        dataIndex : 'fmodel',
        width: 100
      }, {
        title : '采购单位',
        dataIndex : 'purchaseUnit'
      },   {
        title : '包装规格',
        dataIndex : 'tfPacking',
        width: 100
      }, {
        title : '品牌',
        dataIndex : readonly ? 'tfBrand' : 'tfBrandName',
        width: 100
      }, {
        title : '供应商',
        dataIndex : 'fOrgName',
        width: 150
      },  {
        title : '采购价格',
        dataIndex : 'purchasePrice',
        width: 100,
        fixed: 'right'
      }, {
        title : '需求数量',
        dataIndex : 'amount',
        width: 100,
        fixed: 'right',
        render: (value, item, index) => (
          readonly ? value : <Input defaultValue={value} onInput={this.onInputHandler.bind(this, index)}/>
        )
      },  {
        title : '金额',
        dataIndex : 'money',
        width: 100,
        fixed: 'right',
        render: (value, item) => {
          // return Number(value).toFixed(2);
          return (item.purchasePrice === undefined ? (item.amount*1).toFixed(2):(item.amount*item.purchasePrice).toFixed(2))
        }
      }
    ]
    let footer = null;
    footer = currentPageData => (
      <h3>总金额: 
          <span style={{color: '#f46e65', fontSize: '1.2rem'}} id='total'>
            {  isNaN(totalPrice) ? 0 :  Number(totalPrice).toFixed(2) }
          </span>
      </h3>
    )
    return (
        <Table 
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys})
              this.props.getSelection(selectedRowKeys);
            }
          }}
          footer={footer}
          scroll={{x: '150%'}}
          ref='table' 
          columns={columns} 
          rowKey={rowKey} 
          dataSource={this.state.dataSource} 
          pagination={false}
        />)
  }
}
export default ApplyDetailForm;