/**
 * @file 编辑科室
 */
import React from 'react';
import { Breadcrumb, Form, Input, Select,Button,message} from 'antd';
import { Link ,hashHistory} from 'react-router';
import { fetchData,jsonNull} from 'utils/tools';
import { department } from 'api'

const FormItem = Form.Item;
const Option = Select.Option;
class AddForm extends React.Component {
    state = {
    dirtyClick: false
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.deptGuid = this.props.data.deptGuid;
        values.configInfos = [];
        this.setState({dirtyClick: true});
        fetchData(department.EDITDEPT,JSON.stringify(values),(data) => {
          this.setState({dirtyClick: false});
          if(data.status){
             hashHistory.push('/department/depart');
             message.success('编辑科室成功！')
          }
          else{
            message.error(data.msg)
          }
        },'application/json')
      
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
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
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
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
                  {required: true, message: '请输入科室编码', whitespace: true },
                  {min:4, message: '最少4位!' },
                  {pattern: /^\d+$/,message:'只能是数字'},
                  {max:20, message: '最多20位!' },
                 ]
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
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedForm = Form.create()(AddForm);
class DeptEdit extends React.Component {

  render() {
    const { state } = jsonNull(this.props.location);
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/department/depart'>科室&部门</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedForm data={state}/>
      </div>
    );
  }
}

module.exports = DeptEdit