/**
 * @file 收件箱
 */
import React from 'react';
import { Row, Col, Input, Button, DatePicker, Modal, message, Tag, Popconfirm} from 'antd';
import FetchTable from 'component/FetchTable';
import { mail } from 'api';
import querystring from 'querystring';
import { FetchPost } from 'utils/tools';
const { RangePicker } = DatePicker
class Outbox extends React.Component {
  state = {
    query: {
      messageTag: 'outbox',
      startTime: '',
      endTime: '',
      searchName: '',
      messageReadFstate: '-1',
      messageReType: '-1'
    },
    visible: false,
    modal: {
      title: '标题',
      receiver: []
    },
    selected: [],
    dirtyClick: false
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
            return guids.push({messageCode: item})
          })
          this.setState({dirtyClick: true});
          this.onDelete({messageCodes: guids});
        }
      });
    }else {
      message.warning('至少选择一条记录!');
    }
  }
  delSingle = (record) => {
    const postData = {messageCodes: [ {messageCode: record.MESSAGE_CODE }]};
    this.onDelete(postData);
  }
  onDelete = (postData) => {
    postData.messageTag = 'outbox';
    FetchPost(mail.MESSAGE_DEL, postData, 'application/json')
    .then((res) => {
      this.setState({dirtyClick: false});
      return res.json()
    })
    .then((data) => {
      if(data.status) {
        this.setState({
          selected: []
        })
        this.refs.table.fetch(this.state.query)
      } else {
        message.error(data.msg);
      }
    })
  }
  showInfo = (record) => {
    let tags = [];
    record.MI_RECEIVE_ORG_NAME.split(',').map((item, index) => {
      return tags.push(
                <Tag key={item} color="#2db7f5" style={{marginBottom: 2}}>{item}</Tag>
              )
    })
    this.setState({
      visible: true,
      modal: {
        title: record.MESSAGE_TITLE,
        post: tags,
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
        console.log(data);
      })
    }
  }
  handleCancel = () => {
    this.setState({visible: false})
  }
  render() {
    const columns = [{
      title: '操作',
      dataIndex: 'MESSAGE_CODE',
      width: '10%',
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
      title: '机构名称',
      dataIndex: 'MI_RECEIVE_ORG_NAME',
      width: '30%',
      render: (text, record) => {
        const result = text.split(',');
        return result.length > 2 
               ? result[0] + ',' + result[1] + '...'
               : text
      }
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
                  收信机构：
                </Col>
                <Col span={20}>
                  {this.state.modal.post}
                </Col>
              </Row>
              <Row style={{marginTop: 10}}>
                <Col span={3} style={{textAlign: 'right'}}>
                  时间：
                </Col>
                <Col span={20}>
                  {this.state.modal.time}
                </Col>
              </Row>
              <Row style={{marginTop: 10}}>
                <Col span={3} style={{textAlign: 'right'}}>
                  内容：
                </Col>
                <Col span={20}>
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
              rowKey='MESSAGE_CODE'
              rowSelection={{
                selectedRowKeys: this.state.selected,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({
                    selected: selectedRowKeys
                  })
                }
              }}
            />
          </div>   
        }  
      </div>
    )  
  }
}
module.exports = Outbox;