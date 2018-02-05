import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Alert, message,Tabs,Col ,Row} from 'antd';
import { Link } from 'react-router';
import { FetchPost,pathConfig } from 'utils/tools';
import sha1 from 'sha1';
import {_local} from 'api/local';
import md5 from 'md5';

const { TabPane } = Tabs;
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  state = {
    loading: false,
    alert: false,
    code: '',
    count: 0,
    type: 'account',
  }
  componentDidMount = () => {
    this.codeChange();
  }

  onSwitch = (key) => {
    this.setState({
      type: key,
    });
  }
  codeReset = () => {
    this.props.form.setFieldsValue({
      code: '',
    });
  }
  codeChange = () => {
    this.setState({
      code: `${_local}/checkCode.jpg?date` + new Date()
    })
    this.codeReset();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        })
      let arr = [md5(values.password.toString()).substring(2, md5(values.password.toString()).length).toUpperCase(), 'vania']
      let pwd = '';
      arr.sort().map( (item, index) => {
        return pwd += item;
      })
      //'http://192.168.1.109:8080/login/userLogin',
      FetchPost(pathConfig.LOGIN_URL, 
                'userNo='+values.userName+'&pwd=' + sha1(pwd) + '&token=vania')
      .then( (res) => {
        this.setState({
          loading: false,
          alert: false
        })
        this.codeChange();
        return res.json();
      }).then((json) => {
        if (!json.result.userInfo) {
          message.error(json.result.loginResult)
        } else {
          this.props.login.push({
            pathname: 'home',
            state: { tips: json.result.loginResult }
          })
        }
      }).catch( (err) => {
        message.error(err)
        this.setState({
          loading: false,
          alert: false
        })
      })
      }
    });
  }
  onClose = () => {
    this.setState({
      loading: false,
      alert: false
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { count, type } = this.state;
    return (
      <div className="main">
      <Form onSubmit={this.handleSubmit}>
        <Tabs animated={false} className="ant-tabs" activeKey={type} onChange={this.onSwitch}>
            <TabPane tab="账户密码登录" key="account">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{required: true, message: '请输入用户名!'}],
          })(
            <Input addonBefore={<Icon type='user'/>} placeholder='用户名'/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input addonBefore={<Icon type="lock" />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('code', {
            rules: [{validator: (rule, value, cb) => {
              if(typeof value !== 'undefined' && value.length === 5) {
                FetchPost(`${_local}/login/check`, 'code='+value)
                .then(res => res.json())
                .then(json => {
                  if(json.result === 'success') {
                    cb();
                  } else {
                    cb('验证码不正确')
                  }
                })
              } else {
                cb('验证码不正确');
              }
            }}],
          })(
            <Input style={{width: '50%'}}  placeholder="验证码" />
          )}
        <img alt='介里是验证码' className="login-form-forgot" src={this.state.code} onClick={this.codeChange}/> 
        </FormItem>
        </TabPane>
        <TabPane tab="手机号登录" key="mobile">
              <FormItem>
                {getFieldDecorator('mobile', {
                  rules: [{
                    required: type === 'mobile', message: '请输入手机号！',
                  }, {
                    pattern: /^1\d{10}$/, message: '手机号格式错误！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="mobile" className="prefixIcon" />}
                    placeholder="手机号"
                  />
                )}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('captcha', {
                      rules: [{
                        required: type === 'mobile', message: '请输入验证码！',
                      }],
                    })(
                      <Input
                        size="large"
                        prefix={<Icon type="mail" className="prefixIcon" />}
                        placeholder="验证码"
                      />
                    )}
                  </Col>
                  <Col span={8}>
                    <Button
                      disabled={count}
                      className="getCaptcha"
                      size="large"
                      onClick={this.onGetCaptcha}
                    >
                      {count ? `${count} s` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            </TabPane>
          </Tabs>
        {this.state.alert ? <Alert  onClose={this.onClose} message="网络异常" closable type="error" showIcon /> : null}
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住我!</Checkbox>
          )}
         <Link className="login-form-forgot" to='/register'>注册</Link>
   
          <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.loading}>
            登录
          </Button>
        </FormItem>
      </Form>
      </div>
    )
  }
}
const LoginForm = Form.create()(NormalLoginForm);

class Login extends React.Component {
  render() {
    return (
      <div className="container">

         <div className="top">
          <a className="login-logo"></a>
         </div>
        <LoginForm login={this.props.router}/>
      </div>

    );
  }
}

module.exports = Login;