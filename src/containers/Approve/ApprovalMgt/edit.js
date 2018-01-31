/**
 * @file 配置管理/科室／详情
 */
import React from 'react';
import { Breadcrumb, Row, Col, Form, Input, Select,Button,message} from 'antd';
import { Link ,hashHistory} from 'react-router';
import { jsonNull ,fetchData } from 'utils/tools';
import { approve } from 'api'

const FormItem = Form.Item;
const Option = Select.Option;

class EditForm extends React.Component{
	state = {
		dirtyClick: false,
	};
	handleSubmit = (e) => {
	    e.preventDefault();
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	      	values.approvalGuid = this.props.data.approvalGuid;
	         this.setState({dirtyClick: true});
	         fetchData(approve.EDIT_APPROVELIST,JSON.stringify(values),(data)=>{
	         	this.setState({dirtyClick: false});
	         	if(data.status)
	         	{
		            hashHistory.push('/approve/ApprovalMgt');
	         		message.success('保存成功!');
	         	}
	         	else{
	         		message.error(data.msg);
	         	}
	         },"application/json")
	      }
    	});
  	};
  	render(){
  		const { getFieldDecorator } = this.props.form;
  		const formItemLayout = {
		      labelCol: { span: 6 },
		      wrapperCol: { span: 9 },
		    };
		  const tailFormItemLayout = {
		      wrapperCol: {
		        span: 14,
		        offset: 8,
		      }
    		};
    	//接受上一个页面的record参数
		const data = this.props.data;
		return (
			 <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
			  <Row>
          		<Col span={6} push={6} style={{textAlign:'left',marginBottom:'16px'}}><h2>审批基本信息</h2></Col>
       		  </Row>
			 		<FormItem
	          			{...formItemLayout}
		         		label="审批名称"
		          	    hasFeedback
		        	>
		         {getFieldDecorator('approvalName', {
	            initialValue:data.approvalName,
	            rules: [{ required: true, message: '请输入审批名称!' },
	            {pattern:/[A-Za-z0-9\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字'},
	            {max: 50, message: '长度不能超过50'}],
	          })(
	            <Input/>
	          )}
		     
        	</FormItem>
        	<FormItem
	          {...formItemLayout}
	          label="编号"
	          hasFeedback
	        >
	          {getFieldDecorator('approvalNo',{
	          	initialValue:data.approvalNo,
	          	rules:[{max: 25, message: '长度不能超过25'}]
	          })(
	            <Input placeholder="请输入编号"/>
	          )}
        </FormItem>
        <FormItem
	          {...formItemLayout}
	          label="状态"
	        >
	          {getFieldDecorator('fstate',{
	          	initialValue:data.fstate,
	          	rules:[{required: true,message:'请选择审批状态'}]
	          })(
              <Select>
                <Option value="01">启用</Option>
                <Option value="00">停用</Option>
              </Select>
           )}
        </FormItem>
        <FormItem
	          {...formItemLayout}
	          label="备注"
	        >
	          {getFieldDecorator('tfRemark',{
	          	initialValue:'',
	          	rules:[{max: 200, message: '长度不能超过200'}]
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

const WrappedApprovalForm = Form.create()(EditForm);

class ApprovEditForm extends React.Component{
	render(){
		 const { state } = jsonNull(this.props.location);
		return(
			<div>
				<Breadcrumb style={{fontSize: '1.1em'}}>
		          <Breadcrumb.Item><Link to='/approve/ApprovalMgt'>审批管理</Link></Breadcrumb.Item>
		          <Breadcrumb.Item>编辑</Breadcrumb.Item>
		    </Breadcrumb>
	      <WrappedApprovalForm data={state}/>
			</div>
		)
	}
}
module.exports = ApprovEditForm;