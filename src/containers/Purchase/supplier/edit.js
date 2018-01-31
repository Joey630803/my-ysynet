import React from 'react';
import { Form, Button, Input, Col, Row, Breadcrumb,message } from 'antd';
import { Link ,hashHistory} from 'react-router';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { purchase } from 'api';

const FormItem = Form.Item;
class EditForm extends React.Component{
  state = {
    storageGuid: '',
    dirtyClick: false
  }
  submitHandler = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const postData = {
          ...values,
          sourceGuid: this.props.state.sourceGuid
        };
         this.setState({dirtyClick: true});
         fetchData(purchase.EDITMYSUPPLIERLIST_URL,querystring.stringify(postData),(data)=>{
          this.setState({dirtyClick: false});
          if(data.status){
            hashHistory.push('/purchase/supplier');
            message.success("编辑成功!");
          }else{
            message.error(data.msg);
          }
         });
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
    };
    console.log(this.props.state)
    return (
      <Form style={{marginTop: 32}} className='show-form' onSubmit={this.submitHandler}>
        <Row>
          <Col span={20} key={1}>
            <FormItem {...formItemLayout} label={`供应商名称`}>
              <Input disabled={true} value={this.props.state.orgName}/>
            </FormItem>
          </Col>
          <Col span={20} key={2}>
            <FormItem {...formItemLayout} label={`编号`}>
              {getFieldDecorator('supplierCode', {
                initialValue:this.props.state.supplierCode
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={20} key={3}>
            <FormItem {...formItemLayout} label={`联系人`}>
              {getFieldDecorator('lxr', {
                initialValue:this.props.state.lxr
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={20} key={4}>
            <FormItem {...formItemLayout} label={`联系电话`}>
              {getFieldDecorator('lxdh', {
                initialValue:this.props.state.lxdh
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={20} key={6}>
            <FormItem {...formItemLayout} label={`备注`}>
              {getFieldDecorator('remarks', {
                  initialValue:this.props.state.tfRemark,
                rules: [
                  {max: 200, message: '长度不能超过200'}
                ],
              })(
                <Input type="textarea" rows={4}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} key={7} push={4}>
              <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
          </Col>
        </Row>
      </Form>
      )
    }
}

const EditBox = Form.create()(EditForm);

class SuplierEdit extends React.Component {
  render() {
    const title = typeof this.props.location.state === 'undefined' 
    ? '编辑' : this.props.location.state.title;
    return (
      <div>
         <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
          <Breadcrumb.Item><Link to='/purchase/supplier'>我的供应商</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{title || ''}</Breadcrumb.Item>
        </Breadcrumb>
        <EditBox state={this.props.location.state}/>
      </div>
    )  
  }
}
module.exports = SuplierEdit;