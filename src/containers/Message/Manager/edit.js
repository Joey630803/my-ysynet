import React from 'react';
import { Breadcrumb, Row, Col, Switch, Input, Button } from 'antd';
import FetchTable from 'component/FetchTable';
import { Link } from 'react-router';
import { mail } from 'api';
import { FetchPost, historyGoBack } from 'utils/tools';
import querystring from 'querystring';

const Search = Input.Search;
class ManagerEdit extends React.Component {
  state = {
    query: {
      miLocalGuid: this.props.location.state.miLocalGuid,
      searchParams: ''
    },
    selected: [],
    dirtyClick: false,
    miIsreceiveAuto: this.props.location.state.miIsreceiveAuto
  }
  checkHandle = (data) => {
    let selectedArr = [];
    if ( data.length > 0 ) {
      data.map((item, index) => {
        return item.choosed === 1 ? selectedArr.push(item.userId) : null;
      })
    }
    this.setState({
      selected: selectedArr
    })
  }
  onSearch = (value) => {
    if (value !== this.state.query.searchParams) {
      const query = {
        miLocalGuid: this.state.query.miLocalGuid,
        searchParams: value
      }
      this.setState({
        query
      })
      console.log('消息接收管理修改 -> 查询条件: ' + query)
      this.refs.table.fetch(query);
    }
  }
  onChange = (value) => {
    this.setState({
      miIsreceiveAuto: value ? '01' : '00'
    })
  }
  save = () => {
    const postData = {
      miLocalGuid: this.props.location.state.miLocalGuid,
      miIsreceiveAuto: this.state.miIsreceiveAuto,
      fstate: this.props.location.state.fstate,
      miReceiveUserid: this.state.selected
    }
    console.log('消息接收管理保存数据为 => ', postData)
    this.setState({dirtyClick: true});
    FetchPost(mail.ORG_UPDATE, querystring.stringify(postData))
    .then((res) => {
      this.setState({dirtyClick: false});
      return res.json()
    })
    .then((data) => {
      if(data.status) {
        historyGoBack('/message/manager', '保存成功');
      }
    })
  }
  render() {
    const columns = [{
      title: '账号',
      dataIndex: 'userNo',
      width: '40%'
    }, {
      title: '用户名',
      dataIndex: 'userName',
      width: '40%'
    }]
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/message/manager'>消息接收管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{'修改'}</Breadcrumb.Item>
        </Breadcrumb>
        <Row style={{marginTop: 16 }}>
          <Col span={12} offset={1}>
            自动匹配：<Switch 
              onChange={this.onChange}
              defaultChecked={this.props.location.state.miIsreceiveAuto === '01' ? true : false}
              checkedChildren={'开'} 
              unCheckedChildren={'关'} 
            />
            <Search
              ref='search'
              onSearch={this.onSearch}
              placeholder="请输入用户账号、用户名"
              style={{ width: 250, marginLeft: 30}}
            />
          </Col>
          <Col span={2} offset={5}>
            <Button type='primary' onClick={this.save} loading={false}>
              保存
            </Button>
          </Col>
        </Row>
        <Row style={{marginTop: 16}}>
          <Col span={20} offset={1}>
            <FetchTable 
              ref='table'
              cb={(data) => this.checkHandle(data)}
              isPagination={false}
              query={this.state.query}
              columns={columns}
              url={mail.ORG_USER}
              rowKey='userId'
              rowSelection={{
                selectedRowKeys: this.state.selected,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({
                    selected: selectedRowKeys
                  })
                }
              }}
            />
          </Col>
        </Row>
      </div>
    )
  }
}
module.exports = ManagerEdit;