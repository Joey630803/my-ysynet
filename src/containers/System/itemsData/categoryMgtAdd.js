/**
 * @file 添加字典分类
 */
import React from 'react';
import { Breadcrumb, Form, Input,Button,message,Select} from 'antd';
import { Link ,hashHistory} from 'react-router';
import querystring from 'querystring';
import FetchSelect from 'component/FetchSelect';

import { itemsDataUrl } from '../../../api';

const FormItem = Form.Item;
const Option = Select.Option
class AddForm extends React.Component {
  state = {
    dirtyClick: false,
    orgId: '',
    selectDatas:[]
  }
  onFocusSelect= () => {
   fetch(itemsDataUrl.ORGSTATICDATA_LIST, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:querystring.stringify({'orgId':this.state.orgId})
    })
   .then(response => {
      return response.json();
    })
    .then(d => {
      if(d.status){
          this.setState({selectDatas:d.result})
      }
    })
    .catch(e => console.log("Oops, error", e))
  }
  //数据提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
       values.orgId = this.state.orgId;
      if (!err) {
         this.setState({dirtyClick: true});
         fetch(itemsDataUrl.ADDITEMSDATA_CLASS, {
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
             hashHistory.push('/system/itemsData/categoryMgt');
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
    const selectDatas = this.state.selectDatas;
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
         <FormItem
          {...formItemLayout}
          label="所属机构"
          hasFeedback
        >
          <FetchSelect   ref='fetchs' url={itemsDataUrl.ORG_LIST} 
                  cb={(value) => this.setState({orgId: value})}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="上级"
        >
          {
            getFieldDecorator('parentStaticId')(
               <Select 
               onFocus={this.onFocusSelect}
               disabled={this.state.orgId === "" ? true : false}
               allowClear={true}
               >
                {
                selectDatas.map((item,index) => {
                  return <Option key={index} value={item.value}>{item.text}</Option>
                })
              }
              </Select>
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="编码"
          hasFeedback
        >
          {getFieldDecorator('tfClo', {
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
          {getFieldDecorator('tfComment', {
             rules: [{ required: true, message: '请输入名称!', whitespace: true },
             {max:20,message:'字符长度不能超过20'}],
          })(
            <Input />
          )}
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="排序"
          hasFeedback
        >
          {getFieldDecorator('fsort', {
            rules: [{ required: true, message: '请输入排序!' },
            {pattern: /^\d+$/,message:'只能是数字'},
            {max:20,message:'字符长度不能超过20'},
            ],
          })(
            <Input />
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
          <Breadcrumb.Item><Link to='/system/itemsData'>数据字典</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/system/itemsData/categoryMgt'>数据分类</Link></Breadcrumb.Item>
          <Breadcrumb.Item>添加</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedItemsDataForm/>
      </div>
    );
  }
}

module.exports = itemsAdd