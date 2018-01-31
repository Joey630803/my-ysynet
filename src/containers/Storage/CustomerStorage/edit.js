/**
 * @file 客户中心编辑库房
 */
import React from 'react';
import { Breadcrumb, Form, Input, Select,Button,message,Row,Col} from 'antd';
import { Link ,hashHistory} from 'react-router';
import FetchSelect from 'component/FetchSelect';
import { jsonNull ,fetchData} from 'utils/tools';
import { storage } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
class EditForm extends React.Component {
  state = {
      ssApplyHandlePerson:this.props.data.ssApplyHandlePerson,
      gzssHandlePerson:this.props.data.gzssHandlePerson,
      applyHandlePerson: this.props.data.applyHandlePerson
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values,'提交数据')
        if(values.isAutoApply==="01" && this.state.applyHandlePerson===""){
          return message.warning("普耗申请单自动处理人不能为空!")
        }
        if(values.isAutoGzss==="01" && this.state.gzssHandlePerson===""){
          return message.warning("高值备货申请单自动处理人不能为空!")
        }
        if(values.isAutoSsApply==="01" && this.state.ssApplyHandlePerson===""){
          return message.warning("手术备货申请单自动处理人不能为空!")
        }
      
         let postData = {};
        //拼configinfo数据
        let configInfoData = {};
        const configInfos =[];
        configInfoData.applyHandlePerson = this.state.applyHandlePerson;
        configInfoData.gzssHandlePerson = this.state.gzssHandlePerson;
        configInfoData.ssApplyHandlePerson = this.state.ssApplyHandlePerson;
        configInfoData.isAutoApply = values.isAutoApply;
        configInfoData.isAutoGzss = values.isAutoGzss;
        configInfoData.isAutoSsApply = values.isAutoSsApply;
        for (let key in configInfoData) {
          if(configInfoData.hasOwnProperty(key)){
               configInfos.push({"configCode":key,"configValue":configInfoData[key]})
          }
        }
        //拼postData数据
        postData.storageGuid = this.props.data.storageGuid;
        postData.storageCode = values.storageCode;
        postData.storageName = values.storageName;
        postData.tfRemark = values.tfRemark;
        postData.fstate = values.fstate;
        postData.configInfos = configInfos;

        console.log(postData,'编辑库房配置提交的数据');
       fetchData(storage.CUSTOMERUPDATESTORAGE_LIST,JSON.stringify(postData),(data)=>{
            if(data.status){
             hashHistory.push('/storage/customerStorage');
             message.success('保存成功')
          }
          else{
            message.error(data.msg)
          }
       },"application/json")
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
    const data = this.props.data;
    return (
    <div>
      <Row>
        <Col offset={4}>
          <h2>基本信息</h2>
        </Col>
       </Row>
        <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="库房名称"
            hasFeedback
          >
            {getFieldDecorator('storageName', {
              rules: [{ required: true, message: '请输入库房名称!', whitespace: true },
              {max:50,message:'字符长度不能超过50'}],
              initialValue:data.storageName,
            })(
              <Input />
            )}
          </FormItem>
          <FormItem 
            {...formItemLayout}
            label='库房编号'
            >
            {getFieldDecorator('storageCode',{
              rules:[
                {required: true, message: '请输入库房编码', whitespace: true },
                {pattern:/^[A-Za-z0-9_\-]+$/,message:'只能是英文、数字、下划线(_)、中横线(-)'}
              ],
              initialValue:data.storageCode
            })(
                  <Input />
                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="状态"
          >
            {getFieldDecorator('fstate',{
                initialValue:data.fstate,
              })(
                <Select  style={{ width: 120 }}>
                  <Option value="01">启用</Option>
                  <Option value="00">停用</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注"
            hasFeedback
          >
            {getFieldDecorator('tfRemark', {
              initialValue:data.tfRemark
            })(
              <Input type="textarea" rows={4}/>
            )}
          </FormItem>
          <Row>
            <Col offset={4}>
              <h2>配置信息</h2>
            </Col>
          </Row>
          <FormItem
            {...formItemLayout}
            label="普耗申请单"
          >
            {getFieldDecorator('isAutoApply',{
              initialValue:data.isAutoApply
              })(
                <Select  style={{ width: 120 }} placeholder="请选择">
                  <Option value="00">手动处理</Option>
                  <Option value="01">自动处理</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="自动处理人"
          >
            <FetchSelect  ref='fetchs' defaultValue={data.applyHandlePersonName} query={{storageGuid:data.storageGuid}} url={storage.QUERYUSERBYSTORAGE} 
                cb={(value) => this.setState({applyHandlePerson: value})}/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="高值备货申请单"
          >
            {getFieldDecorator('isAutoGzss',{
              initialValue:data.isAutoGzss
              })(
                <Select  style={{ width: 120 }} placeholder="请选择">
                  <Option value="00">手动处理</Option>
                  <Option value="01">自动处理</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="自动处理人"
          >

              <FetchSelect defaultValue={data.gzssHandlePersonName}  ref='fetchs' query={{storageGuid:data.storageGuid}} url={storage.QUERYUSERBYSTORAGE} 
                cb={(value) => this.setState({gzssHandlePerson: value})}/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手术备货申请单"
          >
            {getFieldDecorator('isAutoSsApply',{
              initialValue:data.isAutoSsApply
              })(
                <Select  style={{ width: 120 }} placeholder="请选择">
                  <Option value="00">手动处理</Option>
                  <Option value="01">自动处理</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="自动处理人"
          >
           <FetchSelect  ref='fetchs' defaultValue={data.ssApplyHandlePersonName} query={{storageGuid:data.storageGuid}} url={storage.QUERYUSERBYSTORAGE} 
                    cb={(value) => this.setState({ssApplyHandlePerson: value})}/>
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" size="large">保存</Button>
          </FormItem>
      </Form>
    </div>
    )
  }
}
const WrappedForm = Form.create()(EditForm);
class CustomerStorageEdit extends React.Component {

  render() {
     const { state } = jsonNull(this.props.location);
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/storage/customerStorage'>库房管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
       
       
        <WrappedForm data={state}/>
      </div>
    );
  }
}

module.exports = CustomerStorageEdit