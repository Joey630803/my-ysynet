import React from 'react';
import { Form, Row, Col, Input,Button,Select } from 'antd';
import { CommonData,PrivateData} from 'utils/tools';
const FormItem = Form.Item;
const Option = Select.Option;
class SearchForm extends React.Component{
    state={
        gkattributeDatas:[],//类型
        tfbrandDatas: [],//品牌
    }

    componentWillReceiveProps = nextProps => {
        const rOrgId = nextProps.rOrgId || "";
        //产品类型
        PrivateData('GKATTRIBUTE&&orgId='+rOrgId, (data) => {
            this.setState({gkattributeDatas:data})
        })
    }

    componentDidMount = () => {
       //产品品牌静态数据
        CommonData('TF_BRAND', (data) => {
         this.setState({tfbrandDatas:data})
        })
       
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            values.brandCode = values.tfBrand;
            this.props.query(values);
        });
    }
  render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
        };
        const { gkattributeDatas , tfbrandDatas } = this.state;
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row>
                 <Col span={8} key={1}>
                    <FormItem {...formItemLayout} label={'产品类型'}>
                        {getFieldDecorator('attributeId',{
                            initialValue:""
                        })(
                            <Select 
                            placeholder="请选择" 
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                            <Option value="" key={-1}>全部</Option>
                            {
                                
                                gkattributeDatas.map((item,index) => {
                                return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                                })
                            }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                 <Col span={7} key={3}>
                    <FormItem {...formItemLayout} label={'产品品牌'}>
                        {getFieldDecorator('tfBrand',{
                            initialValue:""
                        })(
                            <Select 
                            placeholder="请选择" 
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                              <Option value="" key={-1}>全部</Option>
                              {
                                
                                tfbrandDatas.map((item,index) => {
                                 return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                                })
                              }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={7} key={5}>
                    <FormItem {...formItemLayout} label={''}>
                        {getFieldDecorator('searchName')(
                             <Input placeholder="产品名称/通用名称/规格/型号"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={2} key={6} style={{textAlign:'right'}}>
                    <Button type="primary" htmlType="submit">搜索</Button>
                </Col>
              </Row>
            </Form>
        )
    
    }
}

export default SearchForm;