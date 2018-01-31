import React from 'react';
import { Form, Row, Col, Input, Button,Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component{
  handleSearch = (e) => {
     e.preventDefault();
    this.props.form.validateFields((err, values) => {
       this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
  }
  render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        };

    
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row >
                <Col span={8} key={1}>
                    <FormItem {...formItemLayout} label={'名称'}>
                        {getFieldDecorator('searchName')(
                            <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={6}>
                    <FormItem {...formItemLayout} label={'状态'}>
                        {getFieldDecorator('fstate')(
                            <Select placeholder="请选择" style={{ width: 120 }}>
                                <Option value="-1">全部</Option>
                                <Option value="00">停用</Option>
                                <Option value="01">启用</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                </Col>
              </Row>
            </Form>
        )
    
    }
}

export default SearchForm;