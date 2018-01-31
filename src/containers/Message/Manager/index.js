import React from 'react';
import { Alert, Switch } from 'antd';
import FetchTable from 'component/FetchTable';
import querystring from 'querystring';
import { FetchPost, CommonData, actionHandler } from 'utils/tools';
import { mail } from 'api';
/**
 * @file 消息接收管理
 */
const messageInfo = '提醒：您可以为每类消息设置接收人，医商云不会将接收'
    + '人信息对外披露或向第三方提供。账户、产品、订单等重要消息，建议您务必设置接收，防止消息遗漏造成损失。';
class Manager extends React.Component {
  state = {
    loading: false,
    query: {},
    columns: [{
      title: '消息类型',
      dataIndex: 'miSysType',
      width: '20%'
    }, {
      title: '消息接收人',
      dataIndex: 'selectedReceivers',
      width: '20%'
    }, {
      title: '操作',
      dataIndex: 'miLocalGuid',
      width: '10%',
      render: (text, record) => {
        return <a onClick={
                    actionHandler.bind(null, this.props.router, mail.ORG_EDIT, {
                      ...record, title: '配置'
                    })}>
                修改
               </a>
      }
    }]
  }
  onChange = (record, type, checked) => {
    this.setState({loading: true})
    //ORG_CHANGE_TYPE
    let postData = {
      miLocalGuid: record.miLocalGuid,
    }
    checked ? postData.enabled = type : postData.disabled = type; 
    console.log('修改数据', postData);
    FetchPost(mail.ORG_CHANGE_TYPE, querystring.stringify(postData))
    .then((res) => {
      this.setState({loading: false});
      return res.json()
    })
    .then((data) => {
      console.log(data);
    })
  }
  componentDidMount = () => {
    //获取消息类型对应基础数据
    CommonData('MI_SEND_TYPE', (data) => {
      const tools = data.map( (item, index) => {
        return {
          title: item.TF_CLO_NAME, 
          dataIndex: item.TF_CLO_CODE, 
          render: (text, record) => {
            return <Switch 
                    onChange={this.onChange.bind(this, record, item.TF_CLO_CODE)}
                    checkedChildren={'开'} 
                    unCheckedChildren={'关'} 
                    defaultChecked={
                      record.omiSendType.split(',').indexOf(item.TF_CLO_CODE) >= 0
                    }
                    disabled={
                      record.gmiSendType.split(',').indexOf(item.TF_CLO_CODE) < 0
                    }
                   />
          }}
      })
      this.setState({columns: this.state.columns.concat(tools)})
    })
  }
  render () {
    return (
      this.props.children ||
      <div>    
        <Alert message={messageInfo} banner />
        <FetchTable 
          loading={this.state.loading}
          refs='table'
          pageSize='10'
          size='default'
          query={this.state.query}
          columns={this.state.columns}
          url={mail.ORG_M_LIST}
          rowKey='miLocalGuid'
        />
      </div>
    )
  }
}
module.exports = Manager;