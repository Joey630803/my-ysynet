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
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        };

    
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row >
                <Col span={8} key={2}>         
                    <FormItem {...formItemLayout} label={'所属机构'}>
                        {getFieldDecorator('orgName')(
                            <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={1}>
                    <FormItem {...formItemLayout} label={'库房名称'}>
                        {getFieldDecorator('storageName')(
                            <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={3}>
                    <Button type="primary" style={{marginLeft:'8px'}} htmlType="submit">搜索</Button>
                </Col>
              </Row>
        
            </Form>
        )
    
    }
}

export default SearchForm;