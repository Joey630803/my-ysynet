/**
 * @file 我的申请
 */
import React from 'react';
import { Form, Row, Col, Button, Select,DatePicker } from 'antd';
import FetchTable from 'component/FetchTable';
import { Link, hashHistory } from 'react-router';
import { tender } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class SearchForm extends React.Component {
  state = {
  }
  //查询
  search = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('查询条件: ' + values)
      const createTime = values.createTime === undefined ? "" : values.createTime;
        if(createTime.length>0) {
            values.createDateStart = createTime[0].format('YYYY-MM-DD');
            values.createDateEnd = createTime[1].format('YYYY-MM-DD');
        }
      this.props.query(values);
      this.props.cb({query: values})
    })
  }
  //重置
  reset = () => {
    this.props.form.resetFields();
  }
  //状态切换
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand})
  }
  render = () => {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
    const children = [
      <Col span={8} key={1}>
        <FormItem {...formItemLayout} label={`类型`}>
          {getFieldDecorator(`auditType`)(
            <Select>
              <Option value={'null'}>请选择</Option>
              <Option value={'00'}>新品审核</Option>
              <Option value={'01'}>变更审核</Option>
            </Select>
          )}
        </FormItem>
      </Col>,
      <Col span={6} key={2}>
        <FormItem {...formItemLayout} label={`状态`}>
          {getFieldDecorator(`auditFstate`)(
            <Select>
              <Option value={''}>请选择</Option>
              <Option value={'00'}>草稿</Option>
              <Option value={'01'}>待审核</Option>
              <Option value={'02'}>审核通过</Option>
              <Option value={'03'}>审核不通过</Option>
            </Select>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={3}>
        <FormItem  {...formItemLayout} label={`申请时间`}>
          {getFieldDecorator(`createTime`)(
            <RangePicker showTime format="YYYY-MM-DD" />
          )}
        </FormItem>
      </Col>
    ];
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.search}
      >
        <Row>
          {children}
        </Row>
        <Row>
        <Col  style={{textAlign: 'right'}}>
          <Button type="primary" htmlType="submit">搜索</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.reset}>
            清空
          </Button>
        </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedSearchForm = Form.create()(SearchForm);
const redirect = (type, message, state) => {
  const url = state.auditType === '00' ? '/tender/apply/details' : '/tender/apply/pcshow'
  hashHistory.push({
    pathname: url,
    state: {
      ...state,
      auditFstate: type,
      message: message
    }
  })
}
const colRender = (text, type, state) => {
  switch (text) {
    case '00':
      return type ? 
            <a onClick={redirect.bind(this, 'info', '草稿箱', state)}>编辑</a> : 
            <span style={{color: '#00a2ae'}}>草稿</span>;
    case '01':
      return type ? 
            <a onClick={redirect.bind(this, 'warning', '正在审核中, 请耐心等待', state)}>详情</a> : 
            <span style={{color: '#ffbf00'}}>待审核</span>;
    case '02':
      return type ? 
            <a onClick={redirect.bind(this, 'success', '恭喜你,审核通过!', state)}>详情</a> : 
            <span style={{color: '#3dbd7d'}}>通过</span>;
    case '03':
      return type ? 
        <a onClick={redirect.bind(this, 'error', '审核不通过,请修改后提交!    失败原因:' + state.failReason, state)}>
          {state.auditType === '01' ? '详情' : '编辑'}
        </a> : 
        <span style={{color: '#f04134'}}>不通过</span>;
    default:
      break;
  }
}
const columns = [{
      title : '操作',
      dataIndex : 'registGuid',
      render: (text, record) => {
        return colRender(record.auditFstate, true, record)
      }
  },{
      title : '状态',
      dataIndex : 'auditFstate',
      render: (text, record) => {
        return colRender(record.auditFstate, false);
      }
  },{
      title : '类型',
      dataIndex : 'auditType',
      render: (text,record) =>{
        return text === "00" ? "新产品" : "变更产品"
      }
  },{
      title : '审核时间',
      dataIndex : 'auditTime'
  },{
      title : '申请时间',
      dataIndex : 'createTime'
  },{
      title : '反馈信息',
      dataIndex : 'failReason'
  }
]
class Apply extends React.Component {
  state = {
    query: {}
  }
  search = (query) => {
    this.refs.table.fetch(query);
  }
  render() {
    return (
      this.props.children || 
      <div>
        <WrappedSearchForm  
          cb={query =>  this.setState(query)}
          query={(query) => this.search(query)}
        />
        <div>
          <Button type="primary">
              <Link to='/tender/apply/add'>添加新产品</Link>
            </Button> 
        </div>
        <FetchTable 
          query={this.state.query}
          ref='table'
          rowKey={'registGuid'}
          url={tender.FIND_AUDIT}
          columns={columns} 
        />
      </div>  
    )
  }
}
module.exports = Apply