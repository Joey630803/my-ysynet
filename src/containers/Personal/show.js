/**
 * @file 个人信息设置编辑／详情
 */
import React from 'react';
import { Form, Input, Select,Button,message} from 'antd';
import querystring from 'querystring';
import { emailAutoCompeleteCheck } from 'utils/form';
import { pathConfig, FetchPost } from 'utils/tools';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions'

const FormItem = Form.Item;
class AddForm extends React.Component {
  state = {
    emailOptions: [],
    dirtyClick: false
  }
  handUserlevel = (value)=>{
        if(value==="01"){
          return "系统管理员"
        }
        else if(value==="02"){
          return "机构管理员"
        }
        else if(value==="03"){
          return "机构操作员"
        }
    }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.userId = this.props.data.userId;
        this.setState({dirtyClick: true});
         FetchPost(pathConfig.UPDATEUSER_URL,querystring.stringify(values))
          .then(res =>{
            return res.json()
          })
          .then(data=>{
            this.setState({dirtyClick: false});
             if(data.status){
                message.success("保存成功!");
                this.props.actions(values)
            }
            else{
              message.error(data.msg);
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
  
    const data = this.props.data;
    const hContent = (
    <div>
        <FormItem
          {...formItemLayout}
          label="所属机构"
        >
          {data.orgName}
        </FormItem>
       <FormItem
          {...formItemLayout}
          label="用户类型"
        >
          {this.handUserlevel(data.userLevel)}
        </FormItem>
          <FormItem
          {...formItemLayout}
          label="QQ"
          hasFeedback
        >
          {getFieldDecorator('qq', {
            initialValue:data.qq,
            rules: [
              {pattern: /^\d+$/,message:'只能是数字'},
              {max: 20, message: '长度不能超过20'}
            ],
          })(
            <Input/>
          )}
        </FormItem>
    </div>
       
    );
    const sContent = (
       <div>
         <FormItem
          {...formItemLayout}
          label="工号"
        >
          {getFieldDecorator('jobNum', {
            initialValue:data.jobNum
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="状态:"
        >
          {getFieldDecorator('fstate',{
            initialValue:data.fstate
          })(
            <Select  style={{ width: 120 }}>
              <Option value="01">启用</Option>
              <Option value="00">停用</Option>
            </Select>
          )}
        </FormItem>
       </div>
        
    );
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="账号"
          hasFeedback
        >
           {data.userNo}
        </FormItem>
     
          <FormItem
          {...formItemLayout}
          label="用户名"
          hasFeedback
        >
          {getFieldDecorator('userName', {
            initialValue:data.userName,
            rules: [{ required: true, message: '请输入用户名!' },
            {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'}],
          })(
            <Input />
          )}
        </FormItem>
             {data.orgType==="09"?hContent:sContent}
        <FormItem
          {...formItemLayout}
          label="手机"
          hasFeedback
        >
          {getFieldDecorator('mobilePhone', {
            initialValue:data.mobilePhone,
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
          label="邮箱"
          hasFeedback
        >
          {getFieldDecorator('eMail', {
            initialValue:data.eMail,
            rules: [
              {type: 'email', message: '邮箱格式不正确(例如:phxl@163.com)'},
              {max: 50, message: '长度不能超过50'}
            ],
          })(
            <Select combobox
              onChange={this.emailHandleChange}
              filterOption={false}
              placeholder="请输入邮箱"
            >
              {this.state.emailOptions}
            </Select>
          )}
        </FormItem>
      
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedUserShowForm = Form.create()(AddForm);
class UserShow extends React.Component {

  render() {
    return (
      <div>
        <WrappedUserShowForm actions={this.props.actions.receiveUserInfo} data={this.props.actionState.User}/>
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
)(UserShow);