/**
 * @file 全局配置
 */
import React from 'react';
import { Row, Col, Input } from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler } from 'utils/tools';
import { mail } from 'api';
const Search = Input.Search;
class Global extends React.Component {
  state = {
    query: {
      searchParams: ''
    }
  }

  onSearch = (value) => {
    const query = Object.assign({}, this.state.query, {
      searchParams: value
    })
    this.setState({query})
    console.log('全局设置列表查询条件 => ', query);
    this.refs.table.fetch(query);
  }
  onChange = (value, dateString) => {
    const query = Object.assign({}, this.state.query, {
      startTime: dateString[0],
      endTime: dateString[1]
    })
    this.setState({query})
  }
  render() {
    const columns = [{
      title: '操作',
      dataIndex: 'miGlobalGuid',
      width: '10%',
      render: (text, record) => {
        return (
            <a onClick={
                actionHandler.bind(null, this.props.router, mail.GLOBAL_SETTING, {
                  ...record, title: '配置'
                })}>
            配置</a>
        )
      }
    }, {
      title: '消息项标题',
      dataIndex: 'miTitle',
      width: '50%',
    }, {
      title: '状态',
      dataIndex: 'fstate',
      render: (text) => {
        if (text === '00') {
          return <a style={{color: '#f46e65'}}>停用</a>
        } else {
          return <a style={{color: '#3dbd7d'}}>启用</a>
        }
      }
    }];
    return (
      <div>
        { this.props.children 
          || 
          <div>
            <Row>
              <Col span={16}>
                <Search
                  ref='search'
                  placeholder="请输入标题或内容"
                  style={{ width: 200 }}
                  onSearch={this.onSearch}
                />
              </Col>
            </Row>
           <FetchTable 
              ref='table'
              query={this.state.query}
              columns={columns}
              url={mail.GLOBAL_LIST}
              rowKey='miGlobalGuid'
            />
          </div>   
        }  
      </div>
    )  
  }
}
module.exports = Global;