import React from 'react';
import { Form, Row, Col, Input, Button,Select,DatePicker } from 'antd';
import { CommonData, fetchData } from 'utils/tools';
import { department } from 'api'

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class SearchForm extends React.Component{
    state = {
        departData: [],
        storageData: [],
        storageGuid: '',
        applyFstate: []
    }
    //用户所属科室
    componentDidMount = () => {
         //申请单状态
        CommonData('APPLY_FSTATE', (data) => {
            this.setState({applyFstate:data})
        });
        fetchData(department.FINDDEPTSTORAGEBYUSER,{},(data)=>{
            if(data.length > 0 ){
                this.setState({ departData: data });
            }
        });
    } 
    //科室联动库房
    handleChange = (value) => {
        if(value===""){
          return this.setState({storageGuid: ""})
        }
        //加库房接口 科室id
        const departData = this.state.departData;
        departData.map((item, index) => {
            if(item.value === value){
                this.setState({ 
                    storageData: item.children,
                    storageGuid: item.children.length === 0 ? "" : item.children[0].value
                });
            }
            return null;
        })
       
    }
  //搜索
  handleSearch = (e) => {
     e.preventDefault();
    this.props.form.validateFields((err, values) => {
        values.storageGuid = this.state.storageGuid;
        const applyTime = values.applyTime === undefined ? "" : values.applyTime;
        if(applyTime.length>0) {
            values.applyStartDate = applyTime[0].format('YYYY-MM-DD');
            values.applyEndDate = applyTime[1].format('YYYY-MM-DD');
        }
        values.applyType = "APPLY";
        this.props.query(values);
    });
  }
  render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        };
        const fstateOptions = () => {
            let options = [];
            let fstateKV = this.state.applyFstate;
            fstateKV.forEach((item) => {
                options.push(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
            })

            return options;
        }
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row >
                <Col span={6} key={1}>
                    <FormItem {...formItemLayout} label={'申请科室'}>
                        {getFieldDecorator('deptGuid',{
                             initialValue:""
                        })(
                            <Select 
                            onChange={this.handleChange}
                            >
                             <Option value="">全部</Option>
                                {
                                    this.state.departData.map((item,index) => {
                                        return <Option key={index} value={item.value}>{item.label}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                 <Col span={6} key={2}>
                    <FormItem {...formItemLayout} label={'备货库房'}>
                        <Select 
                            value={this.state.storageGuid}
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            onChange={
                                (value)=>{
                                    this.setState({storageGuid: value})
                                 }
                            }
                            >
                                <Option value="">全部</Option>
                                {
                                    this.state.storageData.map((item,index) => {
                                        return <Option key={index} value={item.value}>{item.label}</Option>
                                    })
                                }
                        </Select>
                    </FormItem>
                </Col>
                <Col span={6} key={3}>
                    <FormItem {...formItemLayout} label={'申请单状态'}>
                        {getFieldDecorator('applyFstate',{
                            initialValue:""
                        })(
                            <Select>
                                <Option value="">全部</Option>
                                {
                                   fstateOptions()
                                }
                            </Select>

                        )}
                    </FormItem>
                </Col>
                <Col span={6} key={4}>
                    <FormItem {...formItemLayout} label={'申请单号'}>
                        {getFieldDecorator('applyNo')(
                            <Input placeholder="请输入"/>
                        )}
                    </FormItem>
                    
                </Col>
                <Col span={6} key={5}>
                   <FormItem {...formItemLayout} label={'申请时间'}>
                        {getFieldDecorator('applyTime')(
                            <RangePicker showTime format="YYYY-MM-DD" style={{width:'100%'}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6} key={6} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                </Col>
              </Row>
              <Row>
                
              </Row>
            </Form>
        )
    
    }
}

export default SearchForm;