import React from 'react';
import { Form, Input, Button, Radio, message, Modal } from 'antd';
import MultipleSelect from 'component/FetchSelect/multiple';
import { FetchPost } from 'utils/tools';
import { mail } from 'api';
import { bindActionCreators } from 'redux'
import * as Actions from '../../../actions'
import { connect } from 'react-redux';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class messageForm extends React.Component {
  state = {
    value: "-1",
    selected: [],
    dirtyClick: false
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        let postData = fieldsValue;
        if (this.state.value === 4 && this.state.selected.length === 0) {
          message.error('请选择收件人');
        } else if (this.state.value === 4 && this.state.selected.length > 0) {
          let orgIds = [];
          this.state.selected.map( (item, index) => orgIds.push({value: item}));
          postData.receiveOrgIds = orgIds;
        } else {
          postData.orgType = this.state.value;
        }
        console.log('写消息发送数据为: ', postData)
        this.setState({dirtyClick: true});
        FetchPost(mail.SEND_MESSAGE, postData, 'application/json')
        .then((res) => {
          this.setState({dirtyClick: false});
          return res.json()
        })
        .then((data) => {
          if(data.status) {
            if (data.result) {
              this.props.actions.messageUnreadUpdate(data.result);
            }
            Modal.success({
              title: '消息发送成功',
              okText: '再写一封',
              onOk: () => {
                this.setState({value: '-1'});
                this.props.form.setFieldsValue({
                  messageTitle: '',
                  messageContent: ''
                });
              }
            });
          } else {
            message.error('发送失败,请重新操作!')
          }
        })
      }
    })
  }    
  onChange = (e) => {
    this.setState({
      value: e.target.value,
      selected: []
    });
  }
  onSelect = (value) => {
    this.setState({
      selected: value,
    });
  }
  render() {    
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 2,
      },
    };
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <FormItem
          key={1}
          {...formItemLayout}
          label="收件人"
        >
          <RadioGroup onChange={this.onChange} value={this.state.value}>
            <Radio value={'-1'}>全部</Radio>
            <Radio value={'01'}>医院</Radio>
            <Radio value={'02'}>供应商</Radio>
            <Radio value={'03'}>监管部门</Radio>
            <Radio value={'09'}>运营机构</Radio>
            <Radio value={4}>其他</Radio>
          </RadioGroup>
        </FormItem>
          {this.state.value === 4 ? 
            <FormItem label=" " colon={false} {...formItemLayout}>
              <MultipleSelect url={mail.ORG_TYPE_LIST} 
                query={{orgType: '-1'}}
                style={{minWidth: 200}}
                placeholder={'请输入查询条件'}
                cb={(value) => this.onSelect(value)}/>
            </FormItem>  
            : null}
        <FormItem
          key={2}
          {...formItemLayout}
          label="主题"
          hasFeedback
        >
          {getFieldDecorator('messageTitle', {
              rules: [
                { required: true, message: '请输入主题' },
                { max: 50, message: '主题长度不能大于50!' }
              ],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          key={3}
          {...formItemLayout}
          label="正文"
          hasFeedback
        >
          {getFieldDecorator('messageContent', {
            rules: [
              { required: true, message: '内容不能为空' },
              { max: 1000, message: '内容长度不能大于1000!' }
            ]
          })(
            <Input type="textarea" rows={4}/>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout} key={4}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>发送</Button>
        </FormItem>
      </Form>
    )
  }    
}
const PosetMessageForm = Form.create()(messageForm);
class PostMessage extends React.Component {
  render () {
    return <PosetMessageForm actions={this.props.actions}/>
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
)(PostMessage);