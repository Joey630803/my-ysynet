import React from 'react';
import {  Form, Input, Select,Button, Row, Col, Icon } from 'antd';
import { CommonData } from 'utils/tools';
const FormItem = Form.Item;
const Option = Select.Option;
class SearchForm extends React.Component{
    state = {
        expand : false,
        brandOptions: []
    }
    componentDidMount = ()=>{
        CommonData('TF_BRAND',(data)=>{
            this.setState({brandOptions:data });
        })
    }
    handleSubmit = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('查询条件: ', values);
            this.props.query(values);   
          });
    }
    //状态切换
    toggle = ()=>{
        const { expand } = this.state;
        this.setState({ expand: !expand})
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
          };
        const getBrandOption = ()=>{
            let options = [];
            let brandOptions = this.state.brandOptions;
            brandOptions.forEach((item)=>{
                 options.push(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
            });
            return options;
        };
          const children = [
            <Col span={6} key={1}>
                <FormItem {...formItemLayout} label={'品牌'}>
                {getFieldDecorator('brandCode', {
                        initialValue:'',
                    })(
                        <Select
                            showSearch 
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                            <Option value='' key={-1}>请选择</Option>
                            {
                                getBrandOption()
                            }
                        </Select>
                    )
                }
                </FormItem>
            </Col>,
            <Col span={6} key={2}>
                <FormItem {...formItemLayout} label={'通用名称'}>
                {getFieldDecorator('geName', {
                        initialValue:'',
                    })(
                        <Input placeholder='请输入'/>
                    )
                }
                </FormItem>
            </Col>,
            <Col span={6} key={3}>
                <FormItem {...formItemLayout} label={'供应商'}>
                {getFieldDecorator('fOrgName', {
                        initialValue:'',
                    })(
                        <Input placeholder='请输入'/>
                    )
                }
                </FormItem>
            </Col>,
            <Col span={6} key={4}>
                <FormItem {...formItemLayout} label={'生产商'}>
                {getFieldDecorator('produceName', {
                        initialValue:'',
                    })(
                        <Input placeholder='请输入'/>
                    )
                }
                </FormItem>
            </Col>,
            <Col span={6} key={5}>
                <FormItem {...formItemLayout} label={'产品名称'}>
                {getFieldDecorator('materialName', {
                        initialValue:'',
                    })(
                        <Input placeholder='请输入'/>
                    )
                }
                </FormItem>
            </Col>,
            <Col span={6} key={6}>
                <FormItem {...formItemLayout} label={'型号'}>
                {getFieldDecorator('fmodel', {
                        initialValue:'',
                    })(
                        <Input placeholder='请输入'/>
                    )
                }
                </FormItem>
            </Col>,
            <Col span={6} key={7}>
            <FormItem {...formItemLayout} label={'规格'}>
                {getFieldDecorator('spec', {
                        initialValue:'',
                    })(
                        <Input placeholder='请输入'/>
                    )
                }
                </FormItem>
            </Col>,
            <Col span={6} key={8}>
                <FormItem {...formItemLayout} label={'REF'}>
                {getFieldDecorator('ref', {
                        initialValue:'',
                    })(
                        <Input placeholder='请输入'/>
                    )
                }
                </FormItem>
            </Col>
          ];
          const expand = this.state.expand;
          const shownCount = expand ? children.length : 0;
        return (
            <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={8} key={1}>
                       <FormItem {...formItemLayout}>
                        {getFieldDecorator('searchName', {
                                initialValue:'',
                            })(
                                <Input placeholder='请输入产品名称/通用名称/规格/型号'/>
                            )
                        }
                       </FormItem>
                    </Col>
                    <Col span={4}>
                        <Button type='primary' htmlType="submit">搜索</Button>
                        <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                            {expand ? '关闭' : '展开'} <Icon type={expand ? 'up' : 'down'} />
                        </a>
                    </Col>
                </Row>
                <Row>{ children.slice(0, shownCount)}</Row>
            </Form>
        )
    }
}
module.exports = SearchForm;