import React from 'react';
import { Form, Row, Col, Input, Button,DatePicker,Select } from 'antd';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class SearchForm extends React.Component{
  handleSearch = (e) => {
     e.preventDefault();
    this.props.form.validateFields((err, values) => {
     
      const registTime = values.registTime === undefined ? "":values.registTime;
      const auditTime = values.auditTime === undefined ? "" : values.auditTime;
      if(registTime.length>0) {
        values.registStartTime = registTime[0].format('YYYY-MM-DD');
        values.registEndFstate = registTime[1].format('YYYY-MM-DD');
      }
      if(auditTime.length>0) {
        values.auditStartTime = auditTime[0].format('YYYY-MM-DD');
        values.auditEndFstate = auditTime[1].format('YYYY-MM-DD');
      }
      
       this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.query();
  }
  render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
        };

    
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row >
                <Col span={8} key={1}>
                    <FormItem {...formItemLayout} label={'机构名称'}>
                        {getFieldDecorator('orgName')(
                            <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={2}>
                    <FormItem {...formItemLayout} label={'申请人'}>
                        {getFieldDecorator('userName')(
                            <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={3}>
                    <FormItem {...formItemLayout} label={'审核人'}>
                        {getFieldDecorator('auditUserName')(
                            <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
              </Row>
              <Row>
                 <Col span={8} key={4}>
                    <FormItem {...formItemLayout} label={'申请状态'}>
                        {getFieldDecorator('auditFstate')(
                            <Select placeholder="请选择">
                                <Option value="-1">全部</Option>
                                <Option value="00">待审核</Option>
                                <Option value="01">审核通过</Option>
                                <Option value="02">审核不通过</Option>
                             
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={5}>
                    <FormItem {...formItemLayout} label={'申请日期'}>
                        {getFieldDecorator('registTime')(
                                <RangePicker showTime format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={6} >
                    <FormItem {...formItemLayout} label={'审核日期'}>
                        {getFieldDecorator('auditTime')(
                                <RangePicker showTime format="YYYY-MM-DD" />
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