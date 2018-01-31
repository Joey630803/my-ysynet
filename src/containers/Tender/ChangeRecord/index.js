/**
 * @file 变更记录
 */
import React from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import FetchTable from 'component/FetchTable';
import { tender } from 'api';
const FormItem = Form.Item;
class SearchForm extends React.Component {
  state = {
  }
  //查询
  search = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('查询条件: ' + values)
      this.props.query(values);
      this.props.cb({query: values})
    })
  }
  //重置
  reset = () => {
    this.props.form.resetFields();
    this.props.query({});
  }
  render = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
    const children = [
      <Col span={8} key={1}>
        <FormItem  {...formItemLayout} label={`名称`}>
          {getFieldDecorator(`materialName`)(
            <Input/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={2}>
        <FormItem {...formItemLayout} label={`型号`}>
          {getFieldDecorator(`fmodel`)(
              <Input/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={3}>
        <FormItem {...formItemLayout} label={`规格`}>
          {getFieldDecorator(`spec`)(
            <Input />
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={4}>
        <FormItem  {...formItemLayout} label={`证件`}>
          {getFieldDecorator(`registerNo`)(
            <Input/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={5}>
        <FormItem {...formItemLayout} label={`供应商`}>
          {getFieldDecorator(`fOrgName`)(
             <Input/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={6} style={{textAlign: 'right'}}>
        <Button type="primary" htmlType="submit">搜索</Button>
        <Button style={{ marginLeft: 8 }} onClick={this.reset}>
          清空
        </Button>
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
      </Form>
    )
  }
}

const WrappedSearchForm = Form.create()(SearchForm);

const columns = [{
      title : '名称',
      dataIndex : 'materialName'
  },{
      title : '型号',
      dataIndex : 'fmodel',
  },{
      title : '规格',
      dataIndex : 'spec'
  },{
      title : '供应商',
      dataIndex : 'fOrgName'
  },{
      title : '变更前',
      dataIndex : 'oldValue'
  },{
      title : '变更后',
      dataIndex : 'newValue'
  }
]
class ChangeRecord extends React.Component {
  state = {
    query: {
      tenderDetailGuid: this.props.location.state === undefined ? "" : this.props.location.state.tenderDetailGuid
    }
  }
  search = (query) => {
    this.refs.table.fetch(query);
  }
  render() {
    console.log(this.props.location.state,'111 ')
    return (
      this.props.children || 
      <div>
        <WrappedSearchForm  
          cb={query =>  this.setState(query)}
          query={(query) => this.search(query)}
        />
        <FetchTable 
          query={this.state.query}
          ref='table'
          rowKey={'guid'}
          url={tender.TENDCHANGE_LIST}
          columns={columns} 
        />
      </div>  
    )
  }
}
module.exports = ChangeRecord