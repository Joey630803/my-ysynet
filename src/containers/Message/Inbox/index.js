/**
 * @file 收件箱
 */
import React from 'react';
import { Row, Col, Input, Button, DatePicker, Modal, message, Popconfirm } from 'antd';
import FetchTable from 'component/FetchTable';
import { mail } from 'api';
import { FetchPost } from 'utils/tools';
import { bindActionCreators } from 'redux'
import * as Actions from '../../../actions'
import { connect } from 'react-redux';
import querystring from 'querystring';
const { RangePicker } = DatePicker
class Inbox extends React.Component {
  state = {
    query: {
      messageTag: 'inbox',
      startTime: '',
      endTime: '',
      searchName: '',
      messageReadFstate: '-1',
      messageReType: '-1'
    },
    visible: false,
    modal: {
      title: '标题'
    },
    selected: [],
    dirtyClick: false,
    messageType: [
      { text: '个人信息', value: '00' }
    ]
  }
  componentDidMount = () => {
    FetchPost(mail.ORG_CODE)
    .then(res => res.json())
    .then(data => {
      let options = [];
      data.map((item, index) => {
        return options.push(item);
      })
      this.setState({
        messageType: options
      })
    })
    .catch(e => message.error(e));
  }
  /**table根据条件查询 */
  queryHandler = () => {
    const query = Object.assign({}, this.state.query, {
      searchName: this.refs.search.refs.input.value
    })
    this.setState({query})
    this.refs.table.fetch(query);
  }
  onChange = (value, dateString) => {
    const query = Object.assign({}, this.state.query, {
      startTime: dateString[0],
      endTime: dateString[1]
    })
    this.setState({query})
  }
  delAll = () => {
    const postData = this.state.selected;
    if(postData.length > 0) {
      Modal.confirm({
        title: '批量删除',
        content: '此操作为批量删除,是否继续',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          let guids = [];
          postData.map((item, index) => {
            return guids.push({messageGuid: item})
          })
          this.setState({dirtyClick: true});
          this.onDelete({messageGuids: guids});
        }
      });
    }else {
      message.warning('至少选择一条记录!');
    }
  }
  delSingle = (record) => {
    const postData = {messageGuids: [ {messageGuid: record.MESSAGE_GUID}]};
    this.onDelete(postData);
  }
  onDelete = (postData) => {
    postData.messageTag = 'inbox';
    FetchPost(mail.MESSAGE_DEL, postData, 'application/json')
    .then((res) => {
      this.setState({dirtyClick: false});
      return res.json()
    })
    .then((data) => {
      if(data.status) {
        message.success('删除成功!');
        this.setState({
          selected: []
        })
        this.queryHandler();
      } else {
        message.error(data.msg);
      }
    })
  }
  showInfo = (record) => {
    this.setState({
      visible: true,
      modal: {
        title: record.MESSAGE_TITLE,
        post: record.MI_SEND_USERNAME,
        time: record.MI_LAST_SEND_DATE,
        content: record.MESSAGE_CONTENT
      }
    })
    if (record.MESSAGE_READFSTATE === '00') {
      const postData = {
        messageTag: 'inbox',
        messageGuid: record.MESSAGE_GUID
      }
      FetchPost(mail.MESSAGE_READ, querystring.stringify(postData))
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        this.refs.table.fetch(this.state.query)
        this.props.actions.messageReadUpdate();
      })
    }
  }
  handleCancel = () => {
    this.setState({visible: false})
  }
  render() {
    const columns = [{
      title: '操作',
      dataIndex: 'messageReadFstate',
      width: '10%',
      filterMultiple: false,
      filters: [
        { text: '已读', value: '01' },
        { text: '未读', value: '00' },
      ],
      render: (text, record , index) => {
        return <span>
                <a onClick={this.showInfo.bind(this, record)}>详情</a>
                <span className="ant-divider" />
                <Popconfirm title="是否删除此条记录?" onConfirm={this.delSingle.bind(this, record)} okText="是" cancelText="否">
                  <a>删除</a>
                </Popconfirm>
              </span>
      }
    }, {
      title: '发件人',
      dataIndex: 'MI_SEND_USERNAME',
      width: '20%',
    }, {
      title: '消息类型',
      dataIndex: 'MI_SYS_TYPE',
      width: '15%',
      filterMultiple: false,
      filters: this.state.messageType
    }, {
      title: '标题',
      dataIndex: 'MESSAGE_TITLE',
      width: '30%',
    }, {
      title: '时间',
      dataIndex: 'MI_LAST_SEND_DATE',
    }];
    return (
      <div>
        { this.props.children 
          || 
          <div>
            <Modal
              visible={this.state.visible}
              title={this.state.modal.title}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" size="large" onClick={this.handleCancel}>关闭</Button>,
              ]}
            >
              <Row>
                <Col span={3} style={{textAlign: 'right'}}>
                  发信人：
                </Col>
                <Col span={9}>
                  {this.state.modal.post}
                </Col>
                <Col span={3} style={{textAlign: 'right'}}>
                  时间：
                </Col>
                <Col span={9}>
                  {this.state.modal.time}
                </Col>
              </Row>
              <Row style={{marginTop: 10}}>
                <Col span={3} style={{textAlign: 'right'}}>
                  内容：
                </Col>
                <Col span={21}>
                {this.state.modal.content}
                </Col>
              </Row>
            </Modal>
            <Row>
              <Col span={16}>
                <RangePicker 
                  format="YYYY-MM-DD" 
                  onChange={this.onChange} 
                  style={{marginRight: 30}}
                />
                <Input
                  ref='search'
                  placeholder="请输入关键字"
                  style={{ width: 200 }}
                />
              </Col>
              <Col span={5} push={3}>
                <Button 
                  type="primary"  
                  icon="search" 
                  onClick={this.queryHandler}
                  style={{marginRight: '10px'}}>
                  搜索
                </Button>
                <Button 
                  onClick={this.delAll}
                  type="danger" 
                  ghost
                  style={{marginRight: '10px'}}>
                  批量删除
                </Button>
              </Col> 
            </Row>
           <FetchTable 
              ref='table'
              query={this.state.query}
              columns={columns}
              url={mail.MESSAGE_LIST}
              rowKey='MESSAGE_GUID'
              rowSelection={{
                selectedRowKeys: this.state.selected,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({
                    selected: selectedRowKeys
                  })
                }
              }}
              rowClassName={(record, index) => {
                if (record.MESSAGE_READFSTATE === '01') {
                  return `message-read`;
                } else {
                  return `message-unread`;
                }
              }}
            />
          </div>   
        }  
      </div>
    )  
  }
}
export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})
export const mapStateToProps = state => ({
  actionState: state
})
module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Inbox);