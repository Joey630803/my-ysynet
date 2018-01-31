import React from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
const FormItem = Form.Item;

class SearchForm extends React.Component{
  handleSearch = (e) => {
     e.preventDefault();
    this.props.form.validateFields((err, values) => {
        values.storageGuid = this.props.defaultValue
        this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query({ storageGuid:this.props.defaultValue });
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
                 <Col span={8} key={1}>
                    <FormItem {...formItemLayout} label={'产品名称／通用名称/证件号/条码'}>
                        {getFieldDecorator('materialParams')(
                             <Input placeholder="请输入产品名称／通用名称/证件号/条码"/>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={2}>
                    <FormItem {...formItemLayout} label={'型号'}>
                        {getFieldDecorator('fmodel')(
                            <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={3}>
                    <FormItem {...formItemLayout} label={'规格'}>
                        {getFieldDecorator('spec')(
                             <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
              </Row>
               <Row>
               
                <Col offset={16} span={8} style={{ textAlign: 'right' }}>
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