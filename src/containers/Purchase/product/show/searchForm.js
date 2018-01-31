import React from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker} from 'antd';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { purchase } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SearchForm extends React.Component{
    state = {
        createUserOptions:[]
    }
    componentDidMount = ()=>{
        fetchData(purchase.FINDCREATEUSER,
            querystring.stringify({tenderMaterialGuid:this.props.data.tenderMaterialGuid}),(data)=>{
                this.setState({ createUserOptions: data.result })
        })
    }
    handleSearch = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const changeTime = values.changeTime === undefined ? "" : values.changeTime;
           if(changeTime.length>0){
               values.changeTimeStart = changeTime[0].format('YYYY-MM-DD');
               values.changeTimeEnd = changeTime[1].format('YYYY-MM-DD');
           }
          values.tenderMaterialGuid = this.props.data.tenderMaterialGuid;
          console.log('查询条件: ', values)
          this.props.query(values);
       });
    }
    render(){
        const baseData = this.props.data;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 }
			}
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row>
                    <Col span={7} key={1}>
                        <FormItem {...formItemLayout} label={`产品名称`}>
                            <Input defaultValue={baseData.materialName} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7} key={2}>
                        <FormItem {...formItemLayout} label={`证件号`}>
                            <Input defaultValue={baseData.registerNo} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7} key={3}>
                        <FormItem {...formItemLayout} label={`生产商`}>
                            <Input defaultValue={baseData.produceName} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7} key={4}>
                        <FormItem {...formItemLayout} label={`组件名称`}>
                            <Input defaultValue={baseData.suitName} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7} key={5}>
                        <FormItem {...formItemLayout} label={`型号`}>
                            <Input defaultValue={baseData.fmodel} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7} key={6}>
                        <FormItem {...formItemLayout} label={`规格`}>
                            <Input defaultValue={baseData.spec} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7} key={7}>
                        <FormItem {...formItemLayout} label={`最小单位`}>
                            <Input defaultValue={baseData.leastUnit} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7} key={8}>
                        <FormItem {...formItemLayout} label={`操作时间`}>
                            {
                                getFieldDecorator(`changeTime`)(
                                    <RangePicker />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={7} key={9}>
                        <FormItem {...formItemLayout} label={`操作员`}>
                            {
                                getFieldDecorator(`createUser`,{
                                    initialValue:''
                                }
                            )(
                                    <Select>
                                        <Option key={-1} value=''>请选择</Option>
                                        {
                                            this.state.createUserOptions.map((item,index)=>{
                                                return <Option key={index} value={item.createUser}>{item.createUserName}</Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={3} key={10} style={{textAlign:'right'}}>
                        <Button type="primary" htmlType="submit">搜索</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default SearchForm;