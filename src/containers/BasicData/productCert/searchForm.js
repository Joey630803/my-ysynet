import React from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
const FormItem = Form.Item;

class SearchForm extends React.Component{
  handleSearch = (e) => {
     e.preventDefault();
    this.props.form.validateFields((err, values) => {
       this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({});
  }
  render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
        };

    
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row>
                <Col span={6} key={1}>
                    <FormItem {...formItemLayout} label={'组件名称'}>
                       {getFieldDecorator('suitNameLike')(
                             <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6} key={2}>
                    <FormItem {...formItemLayout} label={'型号'}>
                        {getFieldDecorator('modelLike')(
                             <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6} key={3}>
                    <FormItem {...formItemLayout} label={'规格'}>
                        {getFieldDecorator('specLike')(
                            <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                        清除
                    </Button>
                </Col>
              </Row>
            </Form>
        )
    
    }
}

export default SearchForm;