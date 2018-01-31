/**
 * @file 用户组添加
 */
import React from 'react';
import { Breadcrumb, Form, Input,Button,message} from 'antd';
import { Link,hashHistory } from 'react-router';
import querystring from 'querystring';
import { pathConfig } from 'utils/tools';

const FormItem = Form.Item;

class AddForm extends React.Component {
   state = {
    dirtyClick: false
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({dirtyClick: true});
        fetch(pathConfig.ADDGROUP_URL, {
            method: 'post',
            mode:'cors',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:querystring.stringify(values)
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.setState({dirtyClick: false});
          if(data.status){
            hashHistory.push('/system/customerUserGroup');
            message.success("用户组添加成功!");
          }
          else{
            message.error(data.msg);
          }
        })
        .catch(e => console.log("Oops, error", e))
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
          label="组名"
          hasFeedback
        >
          {getFieldDecorator('groupName', {
            rules: [{ required: true, message: '请输入账号!' },
             {max: 20, message: '长度不能超过20'}],
          })(
            <Input />
          )}
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('tfRemark')(
            <Input type="textarea" rows={4}/>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedRegistrationForm = Form.create()(AddForm);
class UserAdd extends React.Component {

  render() {
    const title = typeof this.props.location.state === 'undefined' 
                  ? '新增组' : this.props.location.state.title;
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/system/customerUserGroup'>用户组管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{title || ''}</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedRegistrationForm/>
      </div>
    );
  }
}

module.exports = UserAdd;