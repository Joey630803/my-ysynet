/**
 * @file 添加用户
 */
import React from 'react';
import { Breadcrumb, Form, Input, Select,Button, BackTop,message} from 'antd';
import { Link,hashHistory } from 'react-router';
import querystring from 'querystring';
import { pathConfig } from 'utils/tools';
import { emailAutoCompeleteCheck } from 'utils/form';
import { connect } from 'react-redux'

const FormItem = Form.Item;
const Option = Select.Option;
class AddForm extends React.Component {
  state = {
    emailOptions: [],
    dirtyClick: false,
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.orgId = this.props.orgId;
         this.setState({dirtyClick: true});
         fetch(pathConfig.ADDUSER_URL, {
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
             hashHistory.push('/system/customerUser');
             message.success('添加用户成功！')
          }
          else{
            message.error(data.msg)
          }
        })
        .catch(e => console.log("Oops, error", e))
      }
    });
  }  
  emailHandleChange = (value) => {
    this.setState({ emailOptions: emailAutoCompeleteCheck(value) });
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
        <BackTop>
          <div className="ant-back-top-inner">TOP</div>
        </BackTop>
        <FormItem
          {...formItemLayout}
          label="账号"
          hasFeedback
        >
          {getFieldDecorator('userNo', {
            rules: [{ required: true, message: '请输入账号!' },
             {pattern:/^[A-Za-z0-9_\-]+$/,message:'只能是英文、数字、下划线(_)、中横线(-)'},
             {max:20,message:'字符长度不能超过20'},
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="用户名"
          hasFeedback
        >
          {getFieldDecorator('userName', {
             rules: [{ required: true, message: '请输入用户名!', whitespace: true },
             {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
             {max:20,message:'字符长度不能超过20'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="工号"
        >
          {getFieldDecorator('jobNum', {
            rules: [
              { required: true, message: '请输入工号!' }
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="手机号"
          hasFeedback
        >
          {getFieldDecorator('mobilePhone', {
            rules: [{ required: true, message: '请输入手机号!' },
             {pattern: /^\d+$/,message:'只能是数字'},
             {len:11,message:'手机号必须是11位'}
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="状态"
        >
          {
            getFieldDecorator('fstate',{
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
          label="邮箱"
          hasFeedback
        >
          {getFieldDecorator('eMail', {
            rules: [
              {required: true, message: '请输入邮箱!' },
              {type: 'email', message: '邮箱格式不正确(例如:phxl@163.com)'},
              {max: 50, message: '长度不能超过50'},
            ],
          })(
            <Select combobox
              style={{ width: 200 }}
              onChange={this.emailHandleChange}
              filterOption={false}
              placeholder="请输入邮箱"
            >
              {this.state.emailOptions}
            </Select>
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
                  ? '新增用户' : this.props.location.state.title;
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/system/customerUser'>用户管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{title || ''}</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedRegistrationForm orgId={this.props.actionState.User.orgId}/>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  actionState: state
})
module.exports = connect(
  mapStateToProps
)(UserAdd);