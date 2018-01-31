import React from 'react';
import { Form, Row, Col, Input, Button,Select,message } from 'antd';
import { FetchPost} from 'utils/tools';
import { department } from 'api'
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component{
    state = {
        storageData:[]
    }
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
  componentDidMount = () => {
        FetchPost(department.DEPTSTORAGE_LIST)
        .then(response => {
          return response.json();
        })
        .then(data => {
          if(data.status){
              this.setState({storageData:data.result})
          }
          else{
            message.error(data.msg)
          }
        })
        .catch(e => console.log("Oops, error", e))

  }
  render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
        };
        const storageData = this.state.storageData;
    
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row>
                <Col span={8} key={1}>
                    <FormItem {...formItemLayout} label={'库房'}>
                        
                        {getFieldDecorator('storageGuid',{
                              initialValue: "-1"
                        })(
                             <Select>
                                 <Option key={-1} value="-1">全部</Option>
                                {
                                    storageData.map((item,index) => {
                                    return <Option key={index} value={item.value}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={2}>
                    <FormItem {...formItemLayout} label={'产品名称／通用名称／简码'}>
                        {getFieldDecorator('materialParams')(
                             <Input placeholder="请输入产品名称/通用名称/简码"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={3}>
                    <FormItem {...formItemLayout} label={'证件号'}>
                        {getFieldDecorator('certNo')(
                             <Input placeholder="请输入证件号"/>
                        )}
                    </FormItem>
                </Col>
              </Row>
               <Row>
                <Col span={8} key={4}>
                    <FormItem {...formItemLayout} label={'型号'}>
                        {getFieldDecorator('fmodel')(
                            <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={5}>
                    <FormItem {...formItemLayout} label={'规格'}>
                        {getFieldDecorator('spec')(
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