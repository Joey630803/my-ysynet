/**
 * @file 编辑字典分类
 */
import React from 'react';
import { Breadcrumb, Form, Input,Button,message,Select} from 'antd';
import { Link ,hashHistory} from 'react-router';
import querystring from 'querystring';
import { itemsDataUrl } from '../../../api';
import { jsonNull } from 'utils/tools';
import FetchSelect from 'component/FetchSelect';

const FormItem = Form.Item;
const Option = Select.Option
class EditForm extends React.Component {
  state = {
    dirtyClick: false,
    orgId:this.props.data.orgId,
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
      if (!err) {
         values.orgId = this.state.orgId;
         values.staticId = this.props.data.staticId;
         this.setState({dirtyClick: true});
         console.log(values,'values....')
         fetch(itemsDataUrl.EDITITEMSDATA_CLASS, {
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
             message.success('编辑成功！')
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
    const data = this.props.data;
    console.log(data,'data');
    return (
       <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="所属机构"
          hasFeedback
        >
          <FetchSelect defaultValue={data.orgName}  ref='fetchs' url={itemsDataUrl.ORG_LIST} 
                  cb={(value) => this.setState({orgId: value})}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="上级"
        >
          {
            getFieldDecorator('parentStaticId',{
              initialValue: data.parentStaticId
            })(
               <Select 
               onFocus={this.onFocusSelect}
               allowClear={true}
               >
                {
                  selectDatas.length === 0 ?
                  <Option key={0} value={data.parentStaticId}>{data.pTfComment}</Option>
                  :
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
            initialValue:data.tfClo
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
             initialValue:data.tfComment
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
            initialValue:data.fsort
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
const WrappedItemsDataForm = Form.create()(EditForm);
class itemsEdit extends React.Component {

  render() {
    const { state } = jsonNull(this.props.location);
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/system/itemsData'>数据字典</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/system/itemsData/categoryMgt'>数据分类</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedItemsDataForm data={state}/>
      </div>
    );
  }
}

module.exports = itemsEdit