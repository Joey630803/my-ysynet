/**
 * @file 招标记录--招标详情--添加产品表单
 */
import React from 'react';
import { Form, Row, Col, Input, Button} from 'antd';

const FormItem = Form.Item;
class SearchForm extends React.Component{
    searchHandle = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            console.log('查询条件',values);
            this.props.query(values);
        })
    }
    //重置
    reset = () => {
        this.props.form.resetFields();
        this.props.query({qk:'qk'});
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          };
        
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.searchHandle}>
                <Row>
                    <Col span={7} key={1}>
                        <FormItem {...formItemLayout} label={`产品名称/证件号`}>
                            {
                                getFieldDecorator(`searchName`)(
                                    <Input placeholder='请输入'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={7} key={2}>
                        <FormItem {...formItemLayout} label={`品牌`}>
                            {
                                getFieldDecorator(`tfBrand`)(
                                    <Input placeholder='请输入'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={7} key={3}>
                        <FormItem {...formItemLayout} label={`生产商`}>
                            {
                                getFieldDecorator(`produceName`)(
                                    <Input placeholder='请输入'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={7} key={4}>
                        <FormItem {...formItemLayout} label={`组件名称`}>
                            {
                                getFieldDecorator(`suitName`)(
                                    <Input placeholder='请输入'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={7} key={5}>
                        <FormItem {...formItemLayout} label={`型号`}>
                            {
                                getFieldDecorator(`fModel`)(
                                    <Input placeholder='请输入'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={7} key={6}>
                        <FormItem {...formItemLayout} label={`规格`}>
                            {
                                getFieldDecorator(`spec`)(
                                    <Input placeholder='请输入'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={3} style={{textAlign:'right'}}>
                        <Button type='primary' htmlType='submit'>搜索</Button>
                        <Button type='primary' style={{marginLeft:8}} onClick={this.reset}>清空</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
module.exports = SearchForm;