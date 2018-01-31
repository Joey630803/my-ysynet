import React from 'react';
import { Form, Row, Col, Input,Icon, Button } from 'antd';
const FormItem = Form.Item;

class SearchForm extends React.Component{
  state = {
    expand: false
  }
  //查询
  search = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('查询条件: ', values)
      this.props.query(values);
      this.props.cb({query: values})
    })
  }
  //重置
  reset = () => {
    this.props.form.resetFields();
    this.props.query({});
    this.props.cb({})
  }
  //状态切换
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand})
  }
  render = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };
    const { getFieldDecorator } = this.props.form;
    const children = [
      <Col span={8} key={1}>
        <FormItem {...formItemLayout} label={`搜索条件`}>
          {getFieldDecorator(`searchName`)(
            <Input placeholder="请输入证件号／产品名/通用名/简码／条码"/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={2}>
        <FormItem {...formItemLayout} label={`证件号`}>
          {getFieldDecorator(`registerNo`)(
            <Input placeholder="请输入"/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={3}>
        <FormItem {...formItemLayout} label={`型号`}>
          {getFieldDecorator(`fmodel`)(
            <Input placeholder="请输入"/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={4}>
        <FormItem {...formItemLayout} label={`规格`}>
          {getFieldDecorator(`spec`)(
            <Input placeholder="请输入"/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={5}>
        <FormItem {...formItemLayout} label={`品牌`}>
          {getFieldDecorator(`tfBrand`)(
            <Input placeholder="请输入"/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={6}>
        <FormItem {...formItemLayout} label={`生产商`}>
          {getFieldDecorator(`produceName`)(
            <Input placeholder="请输入"/>
          )}
        </FormItem>
      </Col>
    ];
    const expand = this.state.expand;
    const shownCount = expand ? children.length : 3;
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.search}
      >
        <Row>
          {children.slice(0, shownCount)}
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.reset}>
              清空
            </Button>
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              {expand ? '关闭' : '展开'} <Icon type={expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default SearchForm;