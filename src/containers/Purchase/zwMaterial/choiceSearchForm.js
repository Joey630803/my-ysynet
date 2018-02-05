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
    this.props.query({ type:'01'});
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
                      <FormItem {...formItemLayout} label={'产品类型'}>
                          {getFieldDecorator('type',{
                             initialValue: '01'
                          })(
                             <Select>
                               <Option key={0} value="">{"全部"}</Option>
                               <Option value={'00'}>医疗器械</Option>
                               <Option value={'01'}>其他耗材</Option>
                             </Select>
                          )}
                      </FormItem>
                  </Col>
                 <Col span={8} key={2}>
                    <FormItem {...formItemLayout} label={'产品名称／规格/型号'}>
                        {getFieldDecorator('searchLike')(
                             <Input placeholder="请输入产品名称／规格/型号"/>
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