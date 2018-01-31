import React from 'react';
import { Form, Row, Col, Input,Button,Select,message,Icon } from 'antd';
// import { CommonData} from 'utils/tools';
import {  hashHistory } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;
class SearchForm extends React.Component {
    state = {
      expand: false,
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

    change = () => {
      if (this.props.selected.length === 0) {
        return message.warning('至少选择一项!');
      }
      hashHistory.push({
        pathname: '/tender/product/change',
        state: this.props.selected
      })
    }


    //重置
    reset = () => {
      this.props.form.resetFields();
      this.props.query({});
      this.props.cb({query: ""})
  
    }
    //状态切换
    toggle = () => {
      const { expand } = this.state;
      this.setState({ expand: !expand})
    }
    render = () => {
      const { getFieldDecorator } = this.props.form;
      const children = [
        <Col span={8} key={1}>
          <FormItem labelCol={{span: 0}} wrapperCol={{span: 24}} label=''>
            {getFieldDecorator(`searchName`)(
              <Input placeholder="请输入产品名称/通用名称/供应商"/>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={2}>
          <FormItem  labelCol={{span: 4}} wrapperCol={{span: 20}}label={'品牌'}>
              {getFieldDecorator('aa',{
                    initialValue: ""
              })(
                  <Select>
                    <Option key={-1} value="">全部</Option>
                  
                  </Select>
              )}
          </FormItem>
        </Col>,
        <Col span={8} key={3}>
          <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={`通用名称`}>
            {getFieldDecorator(`bb`)(
              <Input/>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={4}>
          <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}}  label={`供应商`}>
            {getFieldDecorator(`fmodel`)(
              <Input/>
            )}
          </FormItem>
        </Col>,
     
        <Col span={8} key={5}>
          <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={`生产商`}>
            {getFieldDecorator(`produceName`)(
              <Input/>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={6}>
          <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}}  label={`产品名称`}>
            {getFieldDecorator(`tfBrand`)(
              <Input/>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={7}>
          <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}}  label={`型号`}>
            {getFieldDecorator(`produceName`)(
              <Input />
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={8}>
          <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={`规格`}>
            {getFieldDecorator(`orgName`)(
              <Input/>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={9}>
          <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={`REF`}>
            {getFieldDecorator(`orgName`)(
              <Input/>
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