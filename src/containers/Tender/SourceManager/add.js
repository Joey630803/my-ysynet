/**
 * @file 供应管理添加
 */
import React from 'react';
import { Breadcrumb, Form, Input, Select,Button,message,Radio} from 'antd';
import { Link ,hashHistory} from 'react-router';
import FetchSelect from 'component/FetchSelect';
import querystring from 'querystring';
import {fetchData } from 'utils/tools';
import { tender,storage } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class AddForm extends React.Component {
  state = {
      rStorageGuid: '',
      fOrgId:''
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.rStorageGuid = this.state.rStorageGuid;
        values.fOrgId = this.state.fOrgId;
        console.log(values,"添加供应关系数据")
        fetchData(tender.ADDMYSOURCEINFO,querystring.stringify(values),(data)=>{
          if(data.status){
            hashHistory.push('/tender/sourceManager');
            message.success('保存成功！')
          }else{
            message.error(data.msg)
          }
           
        })
     
      }
    });
  } 

  render() {    
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 9 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    };
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="供应商"
          hasFeedback
        >
           <FetchSelect  refd='fetchs' query={{orgType:"02"}} url={storage.ORG_LIST} 
                  cb={(value) => this.setState({fOrgId: value})}/>
        </FormItem>
        <FormItem 
          {...formItemLayout}
          label='编号'
          >
           {getFieldDecorator('supplierCode',{
             rules:[{pattern:/^[A-Za-z0-9_\-]+$/,message:'只能是英文、数字、下划线(_)、中横线(-)'}]
           })(
                <Input />
               )
           }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="状态"
        >
          {getFieldDecorator('fstate',{
               initialValue:'01',
            })(
              <Select  style={{ width: 120 }}>
                <Option value="01">启用</Option>
                <Option value="00">停用</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="库房"
        >
             <FetchSelect  refd='fetchs'   url={storage.FIRSTSTORAGE_LIST} 
                  cb={(value) => this.setState({rStorageGuid: value})}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="供方取消订单"
        >
          {getFieldDecorator('isSupplierKing',{
          })(
            <RadioGroup>
              <Radio value="1">允许</Radio>
              <Radio value="0">不允许</Radio>
            </RadioGroup>
          )}
        </FormItem>
       
        <FormItem
          {...formItemLayout}
          label="联系人"
        >
          {getFieldDecorator('lxr',{
          })(
            <Input/>
          )}
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="联系电话"
        >
          {getFieldDecorator('lxdh',{
          })(
            <Input/>
          )}
        </FormItem>
         
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedRegistrationForm = Form.create()(AddForm);
class SourceManagerAdd extends React.Component {

  render() {
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/tender/sourceManager'>供应管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>添加</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedRegistrationForm/>
      </div>
    );
  }
}

module.exports = SourceManagerAdd