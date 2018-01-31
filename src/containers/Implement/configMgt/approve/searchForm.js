import React from 'react';
import { Form, Row, Col, Input, Button,Select } from 'antd';
import { fetchData} from 'utils/tools';
import { implement } from 'api';
import querystring from 'querystring';
import { hashHistory } from 'react-router';
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component{
    state = {
        storageData:[],
        deptData: [],
        billTypes:[]
    }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      values.orgId = this.props.data.ORG_ID ||  this.props.data.orgId; 
      this.props.query(values);
    });
  }
  componentDidMount = () => {
    let orgId = this.props.data.ORG_ID || this.props.data.orgId;
    fetchData(implement.SELECTLOGINSTORAGE, querystring.stringify({orgId:orgId}), data => this.setState({storageData:data}));
    fetchData(implement.SELECTLOGINDEPART, querystring.stringify({orgId:orgId}), data => this.setState({deptData:data}));
    fetchData(implement.SELECTBILLTYPES, {}, data => this.setState({billTypes:data.result}));
  }
  addHandler = () => {
    const { data } =  this.props;
    hashHistory.push({
      pathname: '/implement/configMgt/approve/add',
      state: { orgId: data.ORG_ID ||data.orgId }
    })
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
                    <FormItem {...formItemLayout} label={'库房'}>
                        
                        {getFieldDecorator('storageGuid',{
                              initialValue: ""
                        })(
                             <Select>
                              <Option key={-1} value="">全部</Option>
                              {
                                this.state.storageData.map((item,index) => 
                                  <Option key={index} value={item.value}>{item.text}</Option>
                                )
                              } 
                            </Select>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={2}>
                      <FormItem {...formItemLayout} label={'科室'}>
                        
                        {getFieldDecorator('deptGuid',{
                              initialValue: ""
                        })(
                             <Select>
                                <Option key={-1} value="">全部</Option>
                                {
                                  this.state.deptData.map((item,index) => 
                                   <Option key={index} value={item.value}>{item.text}</Option>
                                  )
                                } 
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={3}>
                    <FormItem {...formItemLayout} label={'单据类型'}>
                        {getFieldDecorator('code',{
                          initialValue:""
                        })(
                             <Select>
                              <Option key={-1} value="">全部</Option>
                              {
                                this.state.billTypes.map((item,index) => 
                                  <Option key={index} value={item.value+"_FSTATE"}>{item.text}</Option>
                                )
                              } 
                            </Select>
                        )}
                    </FormItem>
                </Col>
              </Row>
               <Row>
                <Col span={8} key={4}>
                  <FormItem {...formItemLayout} label={'审批名称'}>
                    {getFieldDecorator('approvalName')(
                      <Input placeholder="请输入"/>
                    )}
                  </FormItem>
                </Col>
                 <Col span={16} key={5} style={{textAlign: 'right'}}>
                  <Button type="primary" htmlType="submit">搜索</Button>
                  <Button 
                    style={{marginLeft: '10px'}} 
                    onClick={this.addHandler}>
                    添加
                  </Button>
                </Col>
              </Row>
            </Form>
        )
    
    }
}

export default SearchForm;