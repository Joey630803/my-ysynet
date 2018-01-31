import React from 'react';
import { Form, Row, Col, Input, Button,DatePicker,Select } from 'antd';
import { record } from '../../../api'
import { FetchPost } from 'utils/tools';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;

class SearchForm extends React.Component{
    state = {
        modules:[]
    }
  handleSearch = (e) => {
     e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const registTime = values.registTime === undefined ? "":values.registTime;
      if(registTime.length>0) {
        values.startTime = registTime[0].format('YYYY-MM-DD');
        values.endTime = registTime[1].format('YYYY-MM-DD');
      }
      
       this.props.query(values);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
  }
  //获取所有模块
  componentDidMount = () => {
    //获取消息类型对应基础数据
    FetchPost(record.ALLMODULE_LIST)
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.setState({modules: data.result})
    })
    .catch(e => console.log("Oops, error", e))
  }
   getModule = () => {
    let modules = [];
    if (this.state.modules.length) {
      this.state.modules.map((item, index) => {
          return modules.push(<Option key={index} value={item.moduleName}>{item.moduleName}</Option>)
      })
    }
    return modules;
  }

  render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
        };
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row >
                <Col span={8} key={1}>
                    <FormItem {...formItemLayout} label={'操作人'}>
                        {getFieldDecorator('userName')(
                            <Input placeholder="请输入" size="small"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={2}>
                    <FormItem {...formItemLayout} label={'机构名称'}>
                        {getFieldDecorator('orgName')(
                            <Input placeholder="请输入" size="small"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={3}>
                    <FormItem {...formItemLayout} label={'操作名称'}>
                        {getFieldDecorator('opName')(
                            <Input placeholder="请输入" size="small"/>
                        )}
                    </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8} key={4}>
                    <FormItem {...formItemLayout} label={'模块'}>
                        {getFieldDecorator('moduleId',{
                            initialValue:'-1',
                        })(
                           <Select >
                            <Option value="-1">全部</Option>
                 
                                {
                                this.getModule()
                                }
                         
                            </Select>
                        )}
                   
                    </FormItem>
                </Col>
                 <Col span={8} key={5}>
                    <FormItem {...formItemLayout} label={'操作时间'}>
                        {getFieldDecorator('registTime')(
                                <RangePicker showTime format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit" size="small">搜索</Button>
                    <Button size="small" style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    清除
                    </Button>
                </Col>
                </Row>
            </Form>
        )
    
    }
}

export default SearchForm;