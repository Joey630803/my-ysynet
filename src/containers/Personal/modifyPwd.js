/**
 * @file 修改账号密码
 */
import React from 'react';
import { Form, Input,Button,message} from 'antd';
import querystring from 'querystring';
import { pathConfig, FetchPost } from 'utils/tools';
import md5 from 'md5';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions'
const FormItem = Form.Item;

class ModifyForm extends React.Component {
  state = {
    confirmDirty: false,
    dirtyClick: false
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fileValues) => {
      if (!err) {
        let values={userId : this.props.data.userId};
         values.oldPwd = md5(fileValues.oldPwd.toString()).substring(2, md5(fileValues.oldPwd.toString()).length).toUpperCase();
         values.newPwd = md5(fileValues.newPwd.toString()).substring(2, md5(fileValues.newPwd.toString()).length).toUpperCase();
         this.setState({dirtyClick: true});
         FetchPost(pathConfig.MODIFYPWD_URL,querystring.stringify(values))
          .then(res =>{
            return res.json()
          })
          .then(data=>{
            this.setState({dirtyClick: false});
             if(data.status){
                message.success("保存成功!");
            }
            else{
              message.error(data.msg);
            }
          })
          .catch(e => console.log("Oops, error", e))
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPwd')) {
      callback('密码不一致!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  //微信解绑
  unbingWeChat = (wechatOpenid)=>{
    FetchPost(pathConfig.WECHATUNBING_URL,querystring.stringify({openid:wechatOpenid,}))
    .then(res =>{
      return res.json()
    })
    .then(data=>{
        if(data.status){
          message.success("解绑成功!");
          this.props.actions({wechatNo:""});
      }
      else{
        message.error(data.msg);
      }
    })
    .catch(e => console.log("Oops, error", e))
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
       console.log(data);
    return (
      <Form  onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="微信账号"
          hasFeedback
        >
        {
          data.wechatNo===""|| data.wechatNo===null?'未绑定微信':
           <a onClick={this.unbingWeChat.bind(this,this.props.data.wechatOpenid)}>{data.wechatNo+'解绑'}</a>
        }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="旧密码"
          hasFeedback
        >
          {getFieldDecorator('oldPwd', {
            rules: [{
              required: true, message: '请输入旧密码!'
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="新密码"
          hasFeedback
        >
          {getFieldDecorator('newPwd', {
            rules: [{
              required: true, message: '请输入新密码!'},
             {min: 6, message: '密码不能少于6位'
            }, {
              validator: this.checkConfirm,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="确认新密码"
          hasFeedback
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: '请确认新密码!'},
             {min: 6, message: '密码不能少于6位'
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedUserModifyForm = Form.create()(ModifyForm);
class ModifyPwd extends React.Component {
  render() {
    return (
      <div>
        <WrappedUserModifyForm actions={this.props.actions.receiveUserInfo} data={this.props.actionState.User}/>
      </div>
    );
  }
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})
export const mapStateToProps = state => ({
  actionState: state
})
module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModifyPwd);