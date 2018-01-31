import React from 'react';
import { Form, Row, Col, Input, Button,DatePicker,Select } from 'antd';
import { FetchPost,  fetchData} from 'utils/tools';
import { approve } from 'api';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;

class SearchForm extends React.Component{
  	state={
      departData:[],//科室
      storageData:[],//库房
      billTypes:[],//单据类型
      approvalFstate:[],
    }
   
    // 获取单据审批相关的基础数据 
    componentDidMount = () => {
      //单据类型
      fetchData(approve.SELECTALLBILLS, {}, data => this.setState({billTypes:data.result}));
      //科室
      FetchPost(approve.SELECTLOGINORG_DEPT)
      .then(response => {
        return response.json();
      })
      .then(data => {
         this.setState({departData: data})
      })
      .catch(e => console.log("Oops, error", e))
      //库房
      FetchPost(approve.SELECTLOGINORG__STORAGE)
      .then(response => {
        return response.json();
      })
      .then(data => {
          this.setState({ storageData: data })
      })
      .catch(e => console.log("Oops, error", e))
      
    } 
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {  
        const sendTime = values.sendTime === undefined ? "" : values.sendTime;
        if(sendTime.length>0) {
            values.createStartDate = sendTime[0].format('YYYY-MM-DD');
            values.createEndDate = sendTime[1].format('YYYY-MM-DD');
        }
        console.log("查询条件",values);
       this.props.query(values);
      });
    }
    handleReset = ()=>{
        this.props.form.resetFields();
        this.props.query({});
    }
  render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol:  {span: 6 },
            wrapperCol: { span: 18 },
        }
        const { billTypes, departData, storageData } = this.state;
  	    return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row>
                    <Col span={6} key={1}>
                        <FormItem {...formItemLayout} label={'科室'}>
                            {getFieldDecorator('deptGuid',{
                                initialValue:'',
                            })(
                            <Select>
                                <Option value=''>全部</Option>
                                    {
                                    departData.map((item,index) => {
                                        return <Option key={index} value={item.value}>{item.text}</Option>
                                    })
                                    }
                            
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6} key={2}>
                        <FormItem {...formItemLayout} label={'库房'}>
                            {getFieldDecorator('storageGuid',{
                                initialValue:'',
                            })(
                            <Select>
                                <Option value=''>全部</Option>
                                    {
                                        storageData.map((item,index) => {
                                            return <Option key={index} value={item.value}>{item.text}</Option>
                                        })
                                    }
                            
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6} key={3}>
                        <FormItem {...formItemLayout} label={'单据类型'}>
                            {getFieldDecorator('code',{
                                initialValue:'',
                            })(
                                <Select>
                                    <Option key={-1} value="">全部</Option>
                                    {
                                    billTypes.map((item,index) => 
                                        <Option key={index} value={item.value}>{item.text}</Option>
                                    )
                                    } 
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6} key={4}>
                        <FormItem {...formItemLayout} label={'状态'}>
                            {getFieldDecorator('approvalFstate',{
                                initialValue:'',
                            })(
                                <Select>
                                    <Option value=''>全部</Option>
                                    <Option value="00">待审批</Option>
                                    <Option value="01">已通过</Option>
                                    <Option value="02">未通过</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6} key={6}>
                        <FormItem {...formItemLayout} label={'发送时间'}>
                            {getFieldDecorator('sendTime')(
                                    <RangePicker  showTime format="YYYY-MM-DD" style={{width:'100%'}}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6} key={8}>
                        <FormItem {...formItemLayout} label={'其它'}>
                            {getFieldDecorator('createApprovalNo')(
                                <Input placeholder='请输入单号/发起人' />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">搜索</Button>
                        <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleReset}>清空</Button>
                    </Col>
                </Row>	
            </Form>
          )
  }
}
export default SearchForm;