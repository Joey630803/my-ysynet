/**
 * @file 添加字典分类
 */
import React from 'react';
import { Breadcrumb, Form, Select,Button,message} from 'antd';
import { Link ,hashHistory} from 'react-router';
import querystring from 'querystring';
import FetchSelect from 'component/FetchSelect';
import { FetchPost } from 'utils/tools';

import { itemsDataUrl } from '../../../api';

const FormItem = Form.Item;
const Option = Select.Option;
class AddForm extends React.Component {
  state = {
    dirtyClick: false,
    sourceOrgId: '',
    newOrgId:'',
    treeData:[],
    newTreeData:[]
  }
  //字典分类
  onFocusSelectSource = () => {
   FetchPost(itemsDataUrl.ORGSTATICDATA_LIST,querystring.stringify({'orgId':this.state.sourceOrgId}))
   .then(response => {
      return response.json();
    })
    .then(d => {
      if(d.status){
          this.setState({treeData:d.result})
      }
    })
    .catch(e => console.log("Oops, error", e))
  }
  onFocusSelectNew= () => {
   FetchPost(itemsDataUrl.ORGSTATICDATA_LIST,querystring.stringify({'orgId':this.state.newOrgId}))
   .then(response => {
      return response.json();
    })
    .then(d => {
      if(d.status){
          this.setState({newTreeData:d.result})
      }
    })
    .catch(e => console.log("Oops, error", e))
  }
  //数据提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
         values.sourceOrgId = this.state.sourceOrgId;
         values.newOrgId = this.state.newOrgId;
         this.setState({dirtyClick: true});
         fetch(itemsDataUrl.COPYITEMSDATA, {
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
             message.success('克隆成功！')
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
    const parentData = this.state.treeData;
    const newTreeData = this.state.newTreeData;
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
         <FormItem
          {...formItemLayout}
          label="待客隆的机构"
          hasFeedback
        >
          <FetchSelect  ref='fetchs' url={itemsDataUrl.ORG_LIST} 
                  cb={(value) => this.setState({sourceOrgId: value})}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="待客隆的类型"
        >
          {
            getFieldDecorator('sourceStaticId',{
              rules: [{ required: true, message: '请选择!' }],
            })(
               <Select 
               onFocus={this.onFocusSelectSource}
               disabled={this.state.sourceOrgId === "" ? true : false}
               allowClear={true}
               >
                {
                parentData.map((item,index) => {
                  return <Option key={index} value={item.value}>{item.text}</Option>
                })
              }
              </Select>
            )
          }
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="需要克隆机构"
          hasFeedback
        >
          <FetchSelect   ref='fetchs' url={itemsDataUrl.ORG_LIST} 
                  cb={(value) => this.setState({newOrgId: value})}/>
        </FormItem>
          <FormItem
          {...formItemLayout}
          label="新机构的类型"
        >
          {
            getFieldDecorator('newStaticId',{
        
            })(
               <Select 
               onFocus={this.onFocusSelectNew}
               disabled={this.state.newOrgId===""? true : false}
               allowClear={true}
               >
                {
                newTreeData.map((item,index) => {
                  return <Option key={index} value={item.value}>{item.text}</Option>
                })
              }
              </Select>
            )
          }
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedItemsDataForm = Form.create()(AddForm);
class itemsClone extends React.Component {

  render() {
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/system/itemsData'>数据字典</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to='/system/itemsData/categoryMgt'>数据分类</Link></Breadcrumb.Item>
          <Breadcrumb.Item>克隆</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedItemsDataForm/>
      </div>
    );
  }
}

module.exports = itemsClone