import React from 'react';
import { Form, Row, Col, Input, Button,Select } from 'antd';
import { FetchPost, fetchData } from 'utils/tools';
import { approve ,implement } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component{
    state = {
        billTypes:[],
        departData:[],//科室
        storageData:[],//库房
      }
	handleSearch = (e) => {
    e.preventDefault();
     	this.props.form.validateFields((err, values) => {
           this.props.query(values);
        });
  }
  componentDidMount = () => {
      //单据类型
      fetchData(implement.SELECTBILLTYPES, {}, data => this.setState({billTypes:data.result}));
      //科室
      FetchPost(approve.SELECTLOGINORG_DEPT)
      .then(response => {
        return response.json();
      })
      .then(data => {
          this.setState({ departData: data})
      })
      .catch(e => console.log("Oops, error", e))
      //库房
      FetchPost(approve.SELECTLOGINORG__STORAGE)
      .then(response => {
        return response.json();
      })
      .then(data => {
         this.setState({ storageData: data})
      })
      .catch(e => console.log("Oops, error", e))
    }
	 render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
	        labelCol: { span: 5 },
	        wrapperCol: { span: 19 },
        };
        const tailformItemLayout = {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        }
        const billTypes = this.state.billTypes;
        const departData = this.state.departData;
        const storageData = this.state.storageData;
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row >
                <Col span={5} key={1}>
                    <FormItem {...formItemLayout} label={'科室'}>
                        {getFieldDecorator('deptGuid')(
                           <Select placeholder="请选择">
                           <Option key={-1} value="">全部</Option>
                            {
                              departData.map((item,index) => 
                                 <Option key={index} value={item.value}>{item.text}</Option>
                              )
                            }
                          </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={5} key={2}>
                    <FormItem {...formItemLayout} label={'库房'}>
                        {getFieldDecorator('storageGuid',{

                        })(
                            <Select placeholder="请选择">
                                <Option key={-1} value="">全部</Option>
                                   {
                                    storageData.map((item,index) => 
                                       <Option key={index} value={item.value}>{item.text}</Option>
                                        )
                                   } 
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={5} key={3}>
                    <FormItem {...tailformItemLayout} label={'单据类型'}>
                        {getFieldDecorator('code',{
                          initialValue:''
                        })(
                           <Select>
                              <Option key={-1} value="">全部</Option>
                              {
                                billTypes.map((item,index) => 
                                  <Option key={index} value={item.value+"_FSTATE"}>{item.text}</Option>
                                )
                              } 
                            </Select>
                        )}
                    </FormItem>
                </Col>
          	    <Col span={6} key={4}>
              		{getFieldDecorator('approvalName')(
    	              <Input placeholder='输入审批名称/编号/审批人'style={{marginLeft:'30px'}} />
    	            )}
          	    </Col>
                <Col span={3} key={5} style={{textAlign:'right'}}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                </Col>
              </Row>
            </Form>)
    }
}
export default SearchForm;