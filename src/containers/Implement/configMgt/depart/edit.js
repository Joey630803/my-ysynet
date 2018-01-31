/**
 * @file 编辑科室
 */
import React from 'react';
import { Breadcrumb, Form, Input, Select,Button,message,Row,Col} from 'antd';
import { Link ,hashHistory} from 'react-router';
import { fetchData,jsonNull} from 'utils/tools';
import { implement} from 'api'

const FormItem = Form.Item;
const Option = Select.Option;
class EditForm extends React.Component {
    state = {
    dirtyClick: false
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
         let postData = {};
        //拼configinfo数据
        let configInfoData = {};
        const configInfos =[];
        configInfoData.sourceDept = values.sourceDept;
        configInfoData.auditApply = values.auditApply;
        configInfoData.auditGzApply = values.auditGzApply;
        configInfoData.auditSsApply = values.auditSsApply;
        for (let key in configInfoData) {
          if(configInfoData.hasOwnProperty(key)){
               configInfos.push({"configCode":key,"configValue":configInfoData[key]})
          }
        }
         //拼postData数据
        postData.deptGuid = this.props.data.deptGuid;
        postData.tfRemark = values.tfRemark;
        postData.fstate = values.fstate;
        postData.deptCode = values.deptCode;
        postData.deptName = values.deptName;
        postData.configInfos = configInfos;
        postData.orgId = this.props.data.orgId;
        console.log(postData,'添加科室配置提交的数据');
        fetchData(implement.SAVE_CONFIG_DEPART,JSON.stringify(postData), data => {
          this.setState({dirtyClick: false});
          if(data.status){
             hashHistory.push({
              pathname:'/implement/configMgt/depart',
              state : this.props.data
             });
             message.success('编辑科室成功！')
          }
          else{
            message.error(data.msg)
          }
        }, "application/json")
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
    console.log(this.props.data,'11111')
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <Row>
          <Col offset={4}>
            <h2>基本信息</h2>
          </Col>
        </Row>
        <FormItem
          {...formItemLayout}
          label="名称"
          hasFeedback
        >
          {getFieldDecorator('deptName', {
            validateTrigger: ['onChange', 'onBlur'],
            initialValue: data.deptName,
             rules: [{ required: true, message: '请输入名称!', whitespace: true },
             {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
             {max:50,message:'字符长度不能超过50'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="状态"
        >
          {
            getFieldDecorator('fstate',{
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
          label="科室编码"
        >
          {getFieldDecorator('deptCode',{
            initialValue: data.deptCode,
          })(
            <Input/>
          )
          }

        </FormItem>
        <FormItem
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('tfRemark',{
            initialValue:data.tfRemark,
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
          label="科室来源"
        >
          {
            getFieldDecorator('sourceDept',{
               initialValue:data.sourceDept,
            })(
              <Select  style={{ width: 120 }}>
                <Option value="01">本地</Option>
                <Option value="00">接口</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="普耗申请"
        >
          {
            getFieldDecorator('auditApply',{
               initialValue:data.auditApply,
            })(
               <Select placeholder="请选择">
                <Option value="00">不审核</Option>
                <Option value="01">审核</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="高值备货"
        >
          {
            getFieldDecorator('auditGzApply',{
               initialValue:data.auditGzApply,
            })(
               <Select placeholder="请选择">
                <Option value="00">不审核</Option>
                <Option value="01">审核</Option>
              </Select>
            )
          }
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="手术备货"
        >
          {
            getFieldDecorator('auditSsApply',{
               initialValue:data.auditSsApply,
            })(
               <Select placeholder="请选择">
                <Option value="00">不审核</Option>
                <Option value="01">审核</Option>
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
const WrappedForm = Form.create()(EditForm);
class DeptEdit extends React.Component {

  render() {
    const { state } = jsonNull(this.props.location);
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/implement/configMgt'>配置管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link  to={{pathname:'/implement/configMgt/depart',state:{orgId:this.props.location.state.orgId}}}>科室列表</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedForm data={state}/>
      </div>
    );
  }
}

module.exports = DeptEdit