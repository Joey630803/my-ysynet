/**
 * @file 供应管理编辑
 */
import React from 'react';
import { Breadcrumb, Form, Input, Select,Button,message,Radio} from 'antd';
import { Link ,hashHistory} from 'react-router';
import querystring from 'querystring';
import { fetchData,jsonNull } from 'utils/tools';
import { tender } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class EditForm extends React.Component {
  state = {
      rStorageGuid: this.props.data.rStorageGuid,
      fOrgId: this.props.data.fOrgId
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.sourceGuid = this.props.data.sourceGuid;
        values.rStorageGuid = this.state.rStorageGuid;
        values.fOrgId = this.state.fOrgId;
        fetchData(tender.EDITMYSOURCEINFO,querystring.stringify(values),(data)=>{
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
    const data = this.props.data;
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="供应商"
        >
         {getFieldDecorator('forgName',{
            initialValue: data.forgName
          })(
            <Input disabled={true}/>
          )}
  
        </FormItem>
        <FormItem 
          {...formItemLayout}
          label='编号'
          >
           {getFieldDecorator('supplierCode',{
             initialValue: data.supplierCode,
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
               initialValue: data.fstate,
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
         {getFieldDecorator('storageName',{
            initialValue: data.storageName
          })(
            <Input disabled={true}/>
          )}
 
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="供方取消订单"
        >
          {getFieldDecorator('isSupplierKing',{
            initialValue: data.isSupplierKing
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
            initialValue: data.lxr
          })(
            <Input/>
          )}
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="联系电话"
        >
        {getFieldDecorator('lxdh',{
            initialValue: data.lxdh
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
const WrappedEditForm = Form.create()(EditForm);
class SourceManagerEdit extends React.Component {
  render() {
    const { state } = jsonNull(this.props.location);
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/tender/sourceManager'>供应管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedEditForm data={state}/>
      </div>
    );
  }
}

module.exports = SourceManagerEdit