/**
 * @file 编辑
 */
import React from 'react';
import { Breadcrumb, Form, Select,Button,message,Input,Row,Col} from 'antd';
import { Link ,hashHistory} from 'react-router';
import { CommonData,jsonNull ,fetchData} from 'utils/tools';
import { tender } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
class EditForm extends React.Component {
  state = {
      dirtyClick: false,
      attributeOptions: [],
  }
   componentDidMount = () => {
      //特殊属性
     CommonData('GKATTRIBUTE', (data) => {
       this.setState({attributeOptions:data})
     })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      this.setState({dirtyClick: true});
      //编辑提交
      const tenderUpdate  = [];
        this.props.data.map((item,idnex) => {
            return tenderUpdate.push({tenderDetailGuid:item.tenderDetailGuid})
        })
        values.tenderUpdate = tenderUpdate;
       fetchData(tender.BITCHMODIFYTENDERMATERIAL,JSON.stringify(values),(data) => {
           if (data.status) {
             message.success('保存成功!');
            hashHistory.push('/tender/product')
          } else {
            message.error(data.msg);
          }
       },'application/json')
      
      }
    });
  } 

  render() {    
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 9 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 12,
      },
    };
    return (
      <Form  onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
                  label="通用名称"
            >
                 {getFieldDecorator('geName', {
                    })(
                      <Input/>
                 )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="状态"
                >
                {getFieldDecorator('fstate',{
                  initialValue: "",
                    })(
                    <Select  style={{ width: 200 }}>
                      <Option value=" ">请选择</Option>
                        <Option value="01">启用</Option>
                        <Option value="00">停用</Option>
                    </Select>
                    )
                }
            </FormItem>
            <FormItem
              {...formItemLayout}
                  label="产品材质"
              >
                 {getFieldDecorator('tfTexture', {
                    })(
                        <Input/>
                 )}
            </FormItem>
            <FormItem
            {...formItemLayout}
                label="包装材质"
            >
            {getFieldDecorator('packingTexture', {
            })(
                <Input/>
             )}
            </FormItem>
            <FormItem
            {...formItemLayout}
                label="包装规格"
            >
            {getFieldDecorator('tfPacking',{
            })(
                <Input/>
            )}
            </FormItem>
            <FormItem {...formItemLayout} label={`特殊属性`}>
            {
                getFieldDecorator(`attributeId`, {
            })(
                <Select placeholder="请选择">
                { 
                    this.state.attributeOptions.map((item, index) => 
                    <Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
                }
                </Select>
            )
            }
            </FormItem>
        
            <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
            </FormItem>
      </Form>
    )
  }
}
const WrappedForm = Form.create()(EditForm);
class BatchEdit extends React.Component {

  render() {
     const  { state } = jsonNull(this.props.location);
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
           <Breadcrumb.Item>
            <Link to={'/tender/product'}>招标产品</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>批量编辑</Breadcrumb.Item>
        </Breadcrumb>
         <Row>
          <Col span={14} >
              <WrappedForm data={ state }/>
         </Col>
           </Row>
       
      </div>
    );
  }
}

module.exports = BatchEdit