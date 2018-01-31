/**
 * @file 产品审核
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Select,DatePicker } from 'antd';
import FetchTable from 'component/FetchTable';
import { tender } from 'api';
import { hashHistory } from 'react-router';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class SearchForm extends React.Component {

  //查询
  search = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
       const registTime = values.registTime === undefined ? "":values.registTime;
      const auditTime = values.auditTime === undefined ? "" : values.auditTime;
      if(registTime.length>0) {
        values.createDateStart = registTime[0].format('YYYY-MM-DD');
        values.createDateEnd = registTime[1].format('YYYY-MM-DD');
      }
      if(auditTime.length>0) {
        values.auditDateStart = auditTime[0].format('YYYY-MM-DD');
        values.auditDateEnd = auditTime[1].format('YYYY-MM-DD');
      }
      console.log('查询条件:',values)
      this.props.query(values);
    })
  }
  //重置
  reset = () => {
    this.props.form.resetFields();
    this.props.query({});
  }
  //状态切换
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand})
  }
  render = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;

    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.search}
      >
        <Row>
          <Col span={8} key={1}>
          <FormItem  {...formItemLayout} label={`申请人`}>
            {getFieldDecorator(`createUserName`)(
              <Input/>
            )}
          </FormItem>
        </Col>
        <Col span={8} key={2}>
          <FormItem {...formItemLayout} label={`审核类型`}>
            {getFieldDecorator(`auditType`)(
              <Select  placeholder={'请选择'}>
                <Option value={''}>全部</Option>
                <Option value={'00'}>新产品</Option>
                <Option value={'01'}>变更产品</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8} key={3}>
          <FormItem {...formItemLayout} label={`机构名称`}>
            {getFieldDecorator(`createOrgName`)(
              <Input />
            )}
          </FormItem>
        </Col>
        </Row>
        <Row>
        <Col span={8} key={4}>
          <FormItem  {...formItemLayout} label={`审核人`}>
            {getFieldDecorator(`auditUserName`)(
              <Input/>
            )}
          </FormItem>
        </Col>
        <Col span={8} key={5}>
          <FormItem {...formItemLayout} label={`状态`}>
            {getFieldDecorator(`auditFstate`)(
              <Select placeholder={'请选择'}>
                <Option value={''}>全部</Option>
                <Option value={'01'}>待审核</Option>
                <Option value={'02'}>审核通过</Option>
                <Option value={'03'}>审核不通过</Option>
              </Select>
            )}
          </FormItem>
        </Col>
       
         <Col span={8} key={7}>
            <FormItem {...formItemLayout} label={'申请日期'}>
                {getFieldDecorator('registTime')(
                        <RangePicker  format="YYYY-MM-DD" />
                )}
            </FormItem>
        </Col>
        
        </Row>
        <Row>
          <Col span={8} key={8} >
            <FormItem {...formItemLayout} label={'审核日期'}>
                {getFieldDecorator('auditTime')(
                        <RangePicker  format="YYYY-MM-DD" />
                )}
            </FormItem>
        </Col>
        <Col span={8} key={6} offset={8} style={{textAlign: 'right'}}>
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
  const url = state.auditType === "00" ? "/checkdata/productMgt/pshow" : "/checkdata/productMgt/pcshow"
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
            <a onClick={redirect.bind(this, 'info', '草稿箱', state)}>详情</a> : 
            <span style={{color: '#00a2ae'}}>草稿</span>;
    case '01':
      return type ? 
            <a onClick={redirect.bind(this, 'warning', '正在审核中, 请耐心等待', state)}>编辑</a> : 
            <span style={{color: '#ffbf00'}}>待审核</span>;
    case '02':
      return type ? 
            <a onClick={redirect.bind(this, 'success', '恭喜你,审核通过!', state)}>详情</a> : 
            <span style={{color: '#108ee9'}}>通过</span>;
    case '03':
      return type ? 
        <a onClick={redirect.bind(this, 'error', '审核不通过,请修改后提交!', state)}>详情</a> : 
        <span style={{color: '#f04134'}}>不通过</span>;
    default:
      break;
  }
}
const columns = [{
      title : '操作',
      dataIndex : 'registGuid',
      render: (text, record) => {
        return <span>{colRender(record.auditFstate, true, {registGuid: record.registGuid,auditType: record.auditType})}</span>
      }
  },{
      title : '类型',
      dataIndex : 'auditType',
      render:(auditType) => {
        if(auditType ==="00"){
          return "新产品"
        }else if(auditType === "01"){
          return "变更产品"
        }
      }
  },{
      title : '状态',
      dataIndex : 'auditFstate',
      render: (text, record) => {
        return colRender(record.auditFstate, false);
      }
  },{
      title : '机构名称',
      dataIndex : 'orgName'
  },{
      title : '审核人',
      dataIndex : 'auditUserName'
  },{
      title : '审核时间',
      dataIndex : 'auditTime'
  },{
      title : '申请时间',
      dataIndex : 'createTime'
  },{
      title : '申请人',
      dataIndex : 'createUserName'
  }
]
class Apply extends React.Component {
  state = {
    query :{}
}
  search = (query) => {
    this.refs.table.fetch(query);
    this.setState({ query })
  }
  render() {
    const query =  this.state.query;
    return (
      this.props.children || 
      <div>
        <WrappedSearchForm  
          query={(query) => this.search(query)}
        />
        <FetchTable 
        query={query}
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