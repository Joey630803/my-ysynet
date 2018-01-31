/**
 * @file 产品添加
 */
import React from 'react';
import { Breadcrumb, Form, Input,Button,message,Modal,Select} from 'antd';
import { Link,hashHistory } from 'react-router';
import querystring from 'querystring';
import { fetchData,CommonData } from 'utils/tools';
import { productUrl } from 'api';
const Option = Select.Option;
const FormItem = Form.Item;

class AddForm extends React.Component {
   state = {
    dirtyClick: false,
    unitData:[],
    gkData: []
  }
  componentDidMount = () => {
    //单位
    CommonData('UNIT', (data) => {
      this.setState({unitData:data})
    })
     //骨科产品属性
     CommonData('GKATTRIBUTE', (data) => {
      this.setState({gkData:data})
    })
  }
   //处理错误信息
   handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
      });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
           // this.setState({dirtyClick: true});
            values.certGuid = this.props.data.certGuid;
            console.log(values,"提交的数据")
            fetchData(productUrl.MODELACTIONS_BYCERTID,querystring.stringify(values),(data)=>{
                //this.setState({dirtyClick: false});
                if(data.status){
                  hashHistory.push({pathname:'/basicData/productCert/product',state:this.props.data});
                  message.success("操作成功!");
                }
                else{
                  this.handleError(data.msg);
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
          label="组件名称"
          hasFeedback
        >
          {getFieldDecorator('suitName', {
            rules: [{ required: true, message: '请输入组件名称!' },
             {max: 50, message: '长度不能超过50'}],
             initialValue: "无"
          })(
            <Input />
          )}
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="型号"
        >
          {getFieldDecorator('fmodel',{
               rules: [{ required: true, message: '请输入型号!' },
               {max: 50, message: '长度不能超过50'}]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="规格"
        >
          {getFieldDecorator('spec',{
               rules: [{ required: true, message: '请输入规格!' },
               {max: 250, message: '长度不能超过250'}]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="最小单位"
        >
          {getFieldDecorator('leastUnit',{
               rules: [{ required: true, message: '请输入最小单位!' }]
          })(
            <Select 
            placeholder={'请选择'}  
            style={{width:200}}
            showSearch
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {
                this.state.unitData.map((item,index) => {
                  return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                  })
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="骨科产品属性"
        >
          {getFieldDecorator('attributeId')(
            <Select 
            placeholder={'请选择'}  
            style={{width:200}}
            showSearch
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {
                this.state.gkData.map((item,index) => {
                  return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                  })
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="产品材质"
        >
          {getFieldDecorator('tfTexture',{
             rules: [
             {max: 50, message: '长度不能超过50'}]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="包装材质"
        >
          {getFieldDecorator('packTexture',{
             rules: [
             {max: 50, message: '长度不能超过50'}]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="包装规格"
        >
          {getFieldDecorator('packSpec',{
             rules: [
             {max: 50, message: '长度不能超过50'}]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="条形码"
        >
          {getFieldDecorator('fbarcode',{
             rules: [
             {max: 50, message: '长度不能超过50'}]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="REF"
        >
          {getFieldDecorator('ref',{
             rules: [
             {max: 50, message: '长度不能超过50'}]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const ProductAddForm = Form.create()(AddForm);
class ProductAdd extends React.Component {

  render() {
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/basicData/productCert'>产品证件</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={{pathname:'/basicData/productCert/product',state:this.props.location.state}}>产品</Link></Breadcrumb.Item>
          <Breadcrumb.Item>添加</Breadcrumb.Item>
        </Breadcrumb>
        <ProductAddForm data={this.props.location.state}/>
      </div>
    );
  }
}

module.exports = ProductAdd;