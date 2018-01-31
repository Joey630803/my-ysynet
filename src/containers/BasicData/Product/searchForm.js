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
                    <FormItem {...formItemLayout} label={'产品名称/产品简码/证件号'}>
                       {getFieldDecorator('nameOrNoLike')(
                             <Input placeholder="请输入产品名称/产品简码/证件号"/>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={2}>
                    <FormItem {...formItemLayout} label={'条形码'}>
                        {getFieldDecorator('fbarcodeLike')(
                             <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={3}>
                    <FormItem {...formItemLayout} label={'型号'}>
                        {getFieldDecorator('modelLike')(
                             <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
              </Row>
               <Row>
                <Col span={8} key={4}>
                    <FormItem {...formItemLayout} label={'规格'}>
                        {getFieldDecorator('specLike')(
                            <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={5}>
                    <FormItem {...formItemLayout} label={'品牌'}>
                        {getFieldDecorator('tfBrandLike')(
                            <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
 
                
              </Row>
              <Row>
                   <Col span={24} style={{ textAlign: 'right' }}>
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