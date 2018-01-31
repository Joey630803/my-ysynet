/**
 * @file 添加字典内容
 */
import React from 'react';
import { Breadcrumb, Form, Input,Button,message} from 'antd';
import { Link ,hashHistory} from 'react-router';
import querystring from 'querystring';
import { itemsDataUrl } from '../../../api';

const FormItem = Form.Item;

class AddForm extends React.Component {
  state = {
    dirtyClick: false
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
         values.staticId = this.props.data;
         this.setState({dirtyClick: true});
         fetch(itemsDataUrl.ADDITEMSDATA, {
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
             hashHistory.push({pathname:'system/customerItemsData',query:{staticId:values.staticId}});
             message.success('添加成功！')
          }
          else{
            message.error(data.msg)
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
          label="编码"
          hasFeedback
        >
          {getFieldDecorator('tfCloCode', {
            rules: [{ required: true, message: '请输入编码!' },
            {max:20,message:'字符长度不能超过20'},
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="名称"
          hasFeedback
        >
          {getFieldDecorator('tfCloName', {
             rules: [{ required: true, message: '请输入编号!', whitespace: true },
             {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
             {max:20,message:'字符长度不能超过20'}],
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
const WrappedItemsDataForm = Form.create()(AddForm);
class itemsAdd extends React.Component {

  render() {
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to={{pathname:'system/customerItemsData',query:{staticId:this.props.location.state.staticId}}}>数据字典</Link></Breadcrumb.Item>
          <Breadcrumb.Item>添加</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedItemsDataForm data={this.props.location.state.staticId}/>
      </div>
    );
  }
}

module.exports = itemsAdd