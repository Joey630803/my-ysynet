import React from 'react';
import { Table, DatePicker, InputNumber, Popconfirm, Icon } from 'antd';
import uuid from 'uuid';
class Test extends React.Component {
  state = {
    dataSource: [],
    split: [],
    count: 0
  }
  componentDidMount = () => {
    this.setState({
      dataSource: [{
        key: '1',
        id: 1,
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
        number: 10
      }, {
        key: '2',
        id: 2,
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
        number: 20
      }],
      split: new Array(2),
    })
  }
  add = (record, index) => {
    //alert(this.state.split[index])
    const times = this.state.split[index];
    let source = this.state.dataSource;
    for (let i=0;i<times;i++) {
      const data = {
        key: uuid(),
        name: record.name,
        age: record.age,
        address: record.address
      }
      source.splice(index+i+1, 0, data);
    }
    this.setState({dataSource: source})
  }
  render() {
    const columns = [
    {
      title: '操作',
      dataIndex: 'id',
      render: (text, record, index) => {
        return text ? <Popconfirm 
                okText='拆分'
                onConfirm={this.add.bind(this, record, index)}
                title={
                  <InputNumber 
                    onChange={value => {
                      let arr = this.state.split;
                      arr[index] = value;
                      this.setState({split: arr});
                    }}
                    style={{width: 100}}
                    placeholder='请输入批次' 
                />}>
                <a><Icon type="tool" />拆分</a>
              </Popconfirm> : <a><Icon type='delete'/>删除</a>;
      }
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: '生产日期',
      dataIndex: 'startDate',
      render: (text, record) => {
        return <DatePicker />
      }
    },  {
      title: '有效期',
      dataIndex: 'endDate',
      render: (text, record) => {
        return <DatePicker />
      }
    },  
      {
        title: '数量',
        dataIndex: 'number',
        render: (text, record) => {
          return <InputNumber/>
        }
      }
    ];
    return (
      <Table 
        size={'small'}
        rowClassName={(record, index) => {
          return 'columnBg';
        }}
        pagination={false}	
        dataSource={this.state.dataSource} 
        columns={columns} 
        rowKey={'key'}/>
    )
  }
}
module.exports = Test;