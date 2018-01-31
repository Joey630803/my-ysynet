import React from 'react';
import { Breadcrumb, Form, Input, Select, Button, Checkbox, Row, Col, Alert } from 'antd';
import { Link } from 'react-router';
import { CommonData, FetchPost, historyGoBack} from 'utils/tools';
import { mail } from 'api';
import querystring from 'querystring';
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const CheckboxGroup = Checkbox.Group;

/**
 * 消息类型
 */
class TypeTools extends React.Component {
  state = {
    sendData: {}
  }
  componentDidMount = () => {
    //获取消息类型对应基础数据
    CommonData('MI_SEND_TYPE', (data) => this.setState({sendData: data}))
  }
  onChange = (checkedValues) => {
    this.props.cb(checkedValues.toString())
  }
  tools = () => {
    let tools = [];
    if(this.state.sendData.length > 0) {
      this.state.sendData.map((item, index) => {
        return tools = [...tools, {label: item.TF_CLO_NAME, value: item.TF_CLO_CODE}]
      })
    }
    return tools;

  }
  render() {
    //生成消息类型列表
    return (
      <CheckboxGroup 
        options={this.tools()} 
        defaultValue={this.props.sendType.split(',')} 
        onChange={this.onChange} />
    )
  }
}
/**
 * 设置表单
 */
class SettingForm extends React.Component {
  state = {
    miSendType: this.props.initValue.miSendType,
    modules: [],
    dirtyClick: false
  }
  componentDidMount = () => {
    //获取消息类型对应基础数据
    FetchPost(mail.ORG_MODULES)
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.setState({modules: data.result})
    })
    .catch(e => console.log("Oops, error", e))
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({dirtyClick: true});
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        fieldsValue.miSendType = this.state.miSendType;
        console.log('全局配置 -> 配置 -> 保存数据 :', fieldsValue);
        FetchPost(mail.GLOBAL_SAVE, querystring.stringify(fieldsValue))
        .then(response => {
          this.setState({dirtyClick: false});
          return response.json();
        })
        .then(d => {
          if(d.status) {
            historyGoBack('/message/global', '保存成功');
          }
          console.log('保存返回结果.... ', d)
        })
        .catch(e => console.log("Oops, error", e))
      } else {
        this.setState({dirtyClick: false});
      }
    })
  }
  getModule = (type) => {
    let modules = [];
    if (this.state.modules.length) {
      this.state.modules.map((item, index) => {
        if(item.PARENT_MODULEID === type) {
          return modules.push(<Option key={index} value={item.MODULE_ID.toString()}>{item.MODULE_NAME}</Option>)
        }
        return null;
      })
    }
    return modules;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { initValue } = this.props;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 13 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 3,
      },
    };
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <FormItem
          key={0}
          {...formItemLayout}
          label="发送方式"
          hasFeedback
        >
          {getFieldDecorator('miGlobalGuid', {
            initialValue: initValue.miGlobalGuid,
            rules: [
              {
                validator: (rule, value, callback) => {
                  if(this.state.miSendType.length <= 0) {
                    callback('至少选择一项消息类型')
                  }  
                  callback();
              }}
            ]
          })(
            <TypeTools sendType={initValue.miSendType} cb={(data) => this.setState({miSendType: data})}/>
          )}
        </FormItem>
        <FormItem
          key={1}
          {...formItemLayout}
          label="消息项主题"
          hasFeedback
        >
          {getFieldDecorator('miTitle', {
              initialValue: initValue.miTitle,
              rules: [
                { required: true, message: '请输入主题' },
                { max: 50, message: '主题长度不能大于50!' }
              ],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          key={2}
          {...formItemLayout}
          label="消息项code"
          hasFeedback
        >
          {getFieldDecorator('miCode', {
              initialValue: initValue.miCode,
              rules: [
                { required: true, message: '请输入Code' },
                { max: 50, message: 'Code长度不能大于50!' }
              ],
          })(
            <Input disabled={true}/>
          )}
        </FormItem>
        <FormItem
          key={3}
          {...formItemLayout}
          label="消息项类型"
          hasFeedback
        >
          {getFieldDecorator('miSysType', {
              initialValue: initValue.miSysType,
              rules: [
                { required: true, message: '请输入类型' },
                { max: 50, message: '类型长度不能大于50!' }
              ],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          key={4}
          {...formItemLayout}
          label="状态"
        >
          {getFieldDecorator('fstate', {
              initialValue: initValue.fstate,
              rules: [
                { required: true, message: '请输入类型' },
                { max: 50, message: '类型长度不能大于50!' }
              ],
          })(
            <Select style={{ width: 200 }}>
              <Option value="01">启用</Option>
              <Option value="00">停用</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          key={5}
          {...formItemLayout}
          label="所属模块"
        >
          {getFieldDecorator('moduleId', {
              initialValue: initValue.moduleId,
              rules: [
                { required: true, message: '请输入类型' },
                { max: 50, message: '类型长度不能大于50!' }
              ],
          })(
            <Select style={{ width: 200 }}>
              <OptGroup label="运营中心">
                {
                  this.getModule('m1')
                }
              </OptGroup>
              <OptGroup label="客户中心">
                {
                  this.getModule('m2')
                }
              </OptGroup>
            </Select>
          )}
        </FormItem>
        <FormItem
          key={6}
          {...formItemLayout}
          label="保存天数"
        >
          {getFieldDecorator('miSaveDate', {
              initialValue: initValue.miSaveDate,
              rules: [
                { required: true, message: '请选择类型' }
              ],
          })(
            <Select style={{ width: 200 }}>
              <Option value={"1"}>最近一天</Option>
              <Option value={"3"}>最近三天</Option>
              <Option value={"5"}>最近五天</Option>
              <Option value={"10"}>最近十天</Option>
              <Option value={"30"}>最近一个月</Option>
            </Select>
          )}
        </FormItem>
          {
            (this.state.miSendType.split(',').indexOf('message') < 0 &&
            this.state.miSendType.split(',').indexOf('shortmessage') < 0 &&
            this.state.miSendType.split(',').indexOf('email') < 0 )
            ? null
            : <FormItem
                key={7}
                {...formItemLayout}
                label="消息项内容"
              >
                {getFieldDecorator('miContent', {
                  initialValue: initValue.miContent,
                  rules: [
                    { required: true, message: '内容不能为空' },
                    { max: 1000, message: '内容长度不能大于1000!' }
                  ]
                })(
                  <Input type="textarea" rows={4}/>
                )}
              </FormItem> 
          }
          { 
            this.state.miSendType.split(',').indexOf('wechat') >= 0 ?
            <div>
              <FormItem
                  key={8}
                  {...formItemLayout}
                  label="微信模板ID"
                  hasFeedback
                >
                  {getFieldDecorator('wechatTemplateid', {
                      initialValue: initValue.wechatTemplateid,
                      rules: [
                        { required: true, message: '请输入类型' },
                        { max: 50, message: '类型长度不能大于50!' }
                      ],
                  })(
                    <Input/>
                  )}
                </FormItem>
                <FormItem
                  key={9}
                  {...formItemLayout}
                  label="微信内容"
                >
                  {getFieldDecorator('wechatTemplatecontent', {
                    initialValue: initValue.wechatTemplatecontent,
                    rules: [
                      { required: true, message: '内容不能为空' },
                      { max: 1000, message: '内容长度不能大于1000!' }
                    ]
                  })(
                    <Input type="textarea" rows={4}/>
                  )}
              </FormItem>
            </div>
            : null
          }
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
          </FormItem>
      </Form>
    )
  }
}

const GlobalForm = Form.create()(SettingForm);

class GlobalSetting extends React.Component {
  render() {
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/message/global'>全局配置</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{'配置'}</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col span={17} push={1}>
            <GlobalForm initValue={this.props.location.state}/>
          </Col>
          <Col span={7}>
            <Alert
              message="注意事项"
              description={
                <ol>
                  <li>1、消息项标题和内容可任意指定内容，微信模板需要至少填写微信的参数。</li>
                  <li>2、消息项标题和内容可设置参数，供接口调用时使用，参数需从{'“{{”'}开头,以{'“.DATA}}”'}结尾。</li>
                  <li>3、没有特殊情况，参数不要改动。</li>
                </ol>
              }
              type="info"
              showIcon
            />
          </Col>
        </Row>
      </div>
    )
  }
}

module.exports = GlobalSetting;