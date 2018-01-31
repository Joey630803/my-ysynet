/**
 * @file 备货
 */
import React from 'react';
import { Breadcrumb, InputNumber, Input, DatePicker, Row, Col, Button, message,
         Table, Icon } from 'antd';
import { Link } from 'react-router';
import { sales } from 'api';
import { FetchPost } from 'utils/tools';
import { hashHistory } from 'react-router';
import querystring from 'querystring';
import uuid from 'uuid';
import moment from 'moment';
class Stock extends React.Component {
  state = {
    dataSource: [],
    total: {},
    selected: [], 
    selectedRows: []
  }
  componentDidMount = () => {
    FetchPost(sales.DETAILS_BY_ORDERID, 
      querystring.stringify({orderId: this.props.location.state.orderId}))
    .then(res => res.json())
    .then(data => {
      const total = {};
      data.result.map( (item, index) => {
        total[item.orderDetailGuid] = item.allowAmount;
        item.key = item.orderDetailGuid;
        return item._amount = 0;
      });
      this.setState({dataSource: data.result, total: total, initData: data.result})
    })
  }
  delete = () => {
    let { selected, dataSource } = this.state;
    if ( !selected.length ) {
      message.warn('至少选择一个选项!')
    }
    let flag = false;
    for (let i=0;i<selected.length;i++) {
      for (let j=0; j<dataSource.length; j++) {
        if (dataSource[j].orderDetailGuid === selected[i]) {
          if (dataSource[j].allowAmount === null) {
            dataSource.splice(j, 1)
          } else {
            flag = true;
          }
        } 
      }
    }
    if (flag) {
      message.error('初始数据不允许删除!');
    }
    this.setState({dataSource})
  }
  split = (record, index) => {
    let dataSource = this.state.dataSource;
    const data = Object.assign({}, record, {
      orderDetailGuid: uuid(),
      allowAmount: null 
      //dataSource[index].sentoutAmount - dataSource[index]._amount
    });
    dataSource.splice(index+1, 0, data);
    this.setState({dataSource: dataSource});
  }
  onChange = (key, index, value) => {
    let dataSource = this.state.dataSource;
    if (typeof value === 'undefined') {
      dataSource[index][key] = '';
    } else if (typeof value.target === 'undefined' ) {
      dataSource[index][key] = value;
    } else {
      dataSource[index][key] = value.target.value;
    }
    this.setState({
      dataSource: dataSource
    })
  }
  save = () => {
    const { dataSource, total } = this.state;
    for (let key in total) {
      if (total[key]) {
        let t = 0;
        for (let i=0;i<dataSource.length;i++) {
          if ( isNaN(dataSource[i]._amount) || dataSource[i]._amount === '') {
            return message.error('第 ' + (i+1) + '行请输入数字')
          } else {
            if (dataSource[i].key === key) {
              t = dataSource[i]._amount + t;
            }
          }
        }
        if (t > total[key]) {
          return message.error('发货数量不得大于待发货总量')
        }
      }
    }
    let postData = {};
    if (dataSource.length > 0) {
      postData.orderId = dataSource[0].orderId;
      let detailList = [];
      dataSource.map( (item, index) => {
        if(item._amount!==0){
          return detailList.push({
            orderDetailGuid: item.key,
            amount: item._amount,
            flot: item.flot,
            prodDate: item.prodDate ? moment(item.prodDate ,'YYYY-MM-DD') : '',
            usefulDate: item.usefulDate ? moment(item.usefulDate ,'YYYY-MM-DD') : '',
          })
        }
        return null;
      })
      postData.detailList = detailList;
    }

    fetch(sales.SETTLE_GOODS, {
      method: 'post',
      mode:'cors',
      credentials: 'include',
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify(postData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status) {
        hashHistory.push('/sales/myOrder');
        message.success('生成送货单成功!')
      } else {
        message.error(data.msg)
      }
    })
    .catch(e => console.log("Oops, error", e))
  }
  render () {
    const materialColumns = [
      {
        title : '操作',
        dataIndex : 'orderDetailGuid',
        width: 80,
        fixed: 'left',
        render: (text, record, index) => {
          return <a onClick={this.split.bind(this, record, index)}>
                  <Icon type="plus-circle-o" />拆分批次
                 </a>;
        }
      },
      {
        title : '产品名称',
        dataIndex : 'materialName',
        width: 180,
        fixed: 'left'
      },  {
        title : '通用名称',
        dataIndex : 'geName'
      },  {
        title : '规格',
        dataIndex : 'spec'
      },  {
        title : '型号',
        dataIndex : 'fmodel'
      },  {
        title : '采购单位',
        dataIndex : 'purchaseUnit'
      },  {
        title : '采购价格',
        dataIndex : 'purchasePrice'
      },  {
        title : '包装规格',
        dataIndex : 'tfPacking'
      },  {
        title : '待发货数量',
        dataIndex : 'allowAmount',
        width: 80,
        fixed: 'right'
      },  {
        title : '发货数量',
        dataIndex : '_amount',
        width: 50,
        fixed: 'right',
        render: (text, record, index) => {
          return <InputNumber 
            min={0}
            defaultValue={text}
            onChange={this.onChange.bind(this, '_amount', index)}
            />
        }
      },  {
        title : '生产批号',
        dataIndex : 'flot',
        width: 120,
        fixed: 'right',
        render: (text, record, index) => {
          return <Input defaultValue={text} onChange={this.onChange.bind(this, 'flot', index)}/>
        }
      },  {
        title : '生产日期',
        dataIndex : 'prodDate',
        width: 110,
        fixed: 'right',
        render: (text, record, index) => {
          return <DatePicker value={text} onChange={this.onChange.bind(this, 'prodDate', index)}/>
        }
      },{
        title : '有效期至',
        dataIndex : 'usefulDate',
        width: 110,
        fixed: 'right',
        render: (text, record, index) => {
          return <DatePicker value={text} onChange={this.onChange.bind(this, 'usefulDate', index)}/>
        }
      }
    ]
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/sales/myOrder'>我的订单</Link></Breadcrumb.Item>
          <Breadcrumb.Item>备货</Breadcrumb.Item>
        </Breadcrumb>
        <Row style={{marginTop: 10, marginBottom: 6}}>
          <Col span={12}>
            <Button onClick={this.delete}>删除批次</Button>
          </Col>
          <Col span={12} style={{textAlign: 'right'}}>
            <Button onClick={this.save}>生成送货单</Button>
          </Col>
        </Row>
        <Table 
          size={'small'}
          pagination={false}	
          dataSource={this.state.dataSource} 
          columns={materialColumns} 
          scroll={{ x: '150%' }}
            rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
            }
          }}
          rowKey={'orderDetailGuid'}/>
      </div>
    )
  }
}
module.exports = Stock;