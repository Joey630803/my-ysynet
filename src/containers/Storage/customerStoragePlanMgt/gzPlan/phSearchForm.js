import React from 'react';
import { Form, Row, Col, Input, DatePicker,Button,Select } from 'antd';
import { CommonData ,fetchData} from 'utils/tools';
import { purchase } from 'api';  
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class phSearchForm extends React.Component{
    state={
        highApplyFstates:[],
        storageOptions: []
    }
    componentDidMount = () => {
        //高值单据状态
         CommonData('HIGH_APPLY_FSTATE', (data) => {
           this.setState({highApplyFstates:data})
         })
        //库房列表
        fetchData(purchase.STORAGE_LIST,{},(data)=>{
            this.setState({ storageOptions : data.result})

        },'application/json')
    }
  handleSearch = (e) => {
     e.preventDefault();
    this.props.form.validateFields((err, values) => {
        const createTime = values.createTime === undefined ? "":values.createTime;
        if(createTime.length>0) {
            values.startDate = createTime[0].format('YYYY-MM-DD');
            values.endDate = createTime[1].format('YYYY-MM-DD');
        }
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
        wrapperCol: { span: 17 },
        };
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row>
                 <Col span={8} key={1}>
                    <FormItem {...formItemLayout} label={'制单时间'}>
                        {getFieldDecorator('createTime')(
                            <RangePicker showTime format="YYYY-MM-DD" style={{width:"100%"}}/>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={2}>
                    <FormItem {...formItemLayout} label={'单据来源'}>
                        {getFieldDecorator('fsource',{
                            initialValue:""
                        })(
                            <Select>
                                <Option value="" key={-1}>全部</Option>
                                <Option value="01">申购</Option>
                                <Option value="02">补货</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                 <Col span={8} key={3}>
                    <FormItem {...formItemLayout} label={'单据状态'}>
                        {getFieldDecorator('fstate',{
                            initialValue:""
                        })(
                            <Select placeholder={'请选择'}>
                                <Option value="" key={-1}>全部</Option>
                                {
                                    this.state.highApplyFstates.map((item,index) => {
                                    return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={4}>
                    <FormItem {...formItemLayout} label={'库房'}>
                        {getFieldDecorator('storageGuid',{
                            initialValue: ""
                        })(
                            <Select placeholder={'请选择'}>
                                <Option value="" key={-1}>全部</Option>
                                {
                                    this.state.storageOptions.map((item,index) => {
                                    return <Option key={index} value={item.value}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={5}>
                    <FormItem {...formItemLayout} label={'计划单号'}>
                        {getFieldDecorator('planNo')(
                             <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} key={6} style={{textAlign:'right'}}>
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

export default phSearchForm;