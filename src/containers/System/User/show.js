/**
 * @file 用户编辑／详情
 */
import React from 'react';
import { Breadcrumb, Form, Input, Select,Button,message} from 'antd';
import { Link ,hashHistory} from 'react-router';
import { emailAutoCompeleteCheck } from 'utils/form';
import { jsonNull, pathConfig } from 'utils/tools';

import querystring from 'querystring';
const FormItem = Form.Item;
const Option = Select.Option;

class AddForm extends React.Component {
  state = {
    emailOptions: [],
    dirtyClick: false
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
    values.userId = this.props.data.userId;
      if (!err) {
         this.setState({dirtyClick: true});
         fetch(pathConfig.UPDATEUSER_URL, {
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
            message.success("修改成功！");
            hashHistory.push('/system/user');
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
    function handUserlevel(value){
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
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="账号"
          hasFeedback
        >
            {<Input  disabled value={`${data.userNo}`}/>}
     
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
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="用户级别"
        >
          <Input disabled value={handUserlevel(data.userLevel)}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="手机号"
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
          label="状态"
        >
         {getFieldDecorator('fstate', {
            initialValue:data.fstate,
          })(
            <Select style={{ width: 120 }}>
            <Option value="01">启用</Option>
            <Option value="00">停用</Option>
          </Select>
          )}
          
        </FormItem>
      
        <FormItem
          {...formItemLayout}
          label="所属机构"
        >
          {getFieldDecorator('orgName',{
            initialValue:data.orgName
          })(
            <Input disabled/>
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
              {required: true, message: '请输入邮箱!' },
              {type: 'email', message: '邮箱格式不正确(例如:phxl@163.com)'},
              {max: 50, message: '长度不能超过50'}
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
        <FormItem
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('tfRemark', {
            initialValue:data.tfRemark
          })(
            <Input type="textarea" rows={4}/>
          )}
        </FormItem>
          <FormItem
          {...formItemLayout}
          label="最后编辑时间"
        >
          <Input disabled value={`${data.modifyTime}`}/>
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedUserShowForm = Form.create()(AddForm);
class UserAdd extends React.Component {
 
  render() {
    const { state } = jsonNull(this.props.location);
    const title = typeof this.props.location.state === 'undefined' 
                  ? '新增用户' : this.props.location.state.title;
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/system/user'>用户管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{title || ''}</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedUserShowForm data={state}/>
      </div>
    );
  }
}

module.exports = UserAdd;