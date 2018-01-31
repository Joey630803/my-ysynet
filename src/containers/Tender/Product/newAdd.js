import React from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, message, PopConfirm} from 'antd';
import FetchTable from 'component/FetchTable';
import { Link, hasHistory } from 'react-router';
import { tender } from 'api';
import querystring from 'querystring';
const FormItem = Form.Ttem;
const Option = Select.Option;

class SearchForm extends React.Component{
	state = {
		expand: false
	}
	// 查询
	handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('查询条件:', values);
    });
    this.props.form.resetFields();
  }
  // 重置
  handleReset = () => {
  }
  // 切换状态
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }
  render = () =>{
  	const formItemLayout = {
  		labelCol: { span:12 },
  		wrapperCol: { span:12 },
  	};
  	const { getFieldDecorator } = this.props.form;
  	const children = [
	  <Col span={7} key={1}>
	  	 	<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={`条码`}>
	  	 	{getFieldDecorator(`fbarCode`)(
	              <Input />
	            )}
	  	 	</FormItem>
	  </Col>,
  	  <Col span={8} key={2}>
		 	<FormItem labelCol={{span: 4}} wrapperCol={{span: 14}} label={`状态`}>
			 {getFieldDecorator(`fstate`)(
		 	<Select>
				 <Option value={'null'}>请选择</Option>
				 <Option value={'00'}>停用</Option>
				 <Option value={'01'}>启用</Option>
		 	</Select>
		 )}
		 	</FormItem>
  	  </Col>,
  	  <Col span={9} key={3} pull={2}>
	  	 	<FormItem {...formItemLayout} label={`产品名称/通用名称/简码`}>
	 		 {getFieldDecorator(`searchName`)(
	      		<Input />
	   	 	)}
	  	 	</FormItem>
  	  </Col>,
  	  <Col span={7} key={4}>
	  	 	<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={`证件号`}>
	  	 		 {getFieldDecorator(`registerNo`)(
	              <Input />
	            )}
	  	 	</FormItem>
  	  </Col>,
  	  <Col span={8} key={5}>
	  	 	<FormItem labelCol={{span: 4}} wrapperCol={{span: 14}} label={`型号`}>
		 	 {getFieldDecorator(`fmodel`)(
	         	<Input />
	         )}
	  	 	</FormItem>
  	  </Col>,
  	  <Col span={9} key={6} pull={2}>
	  	 	<FormItem {...formItemLayout} label={`规格`}>
	  	 		 {getFieldDecorator(`spec`)(
	              <Input />
	            )}
	  	 	</FormItem>
  	  </Col>,
  	  <Col span={7} key={7}>
	  	 	<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={`品牌`}>
	  	 		 {getFieldDecorator(`tfBrand`)(
	              <Input />
	            )}
	  	 	</FormItem>
  	  </Col>,
  	  <Col span={8} key={8}>
	  	 	<FormItem labelCol={{span: 4}} wrapperCol={{span: 14}} label={`生厂商`}>
	  	 		 {getFieldDecorator(`produceName`)(
	             	<Input />
	            )}
	  	 	</FormItem>
  	  </Col>,
  	  <Col span={9} key={9} pull={2}>
	  	 	<FormItem {...formItemLayout} label={`供应商`}>
	  	 		 {getFieldDecorator(`orgName`)(
	              <Input />
	            )}
	  	 	</FormItem>
  	  </Col>
  	 ];
  	 //切换显示状态 全部显示/ 显示3个
  	 const expand = this.state.expand;
  	 const ShowCount = this.state.expand ? children.length : 3;
  	 return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row>{children.splice(0,ShowCount)}</Row>
        <Row>
		  <Col span={10} style={{ marginLeft: '2%' }}>
			  <Button type='primary'>
				<Link to='/tender/product/add'>添加新产品</Link>
			  </Button>
			  <Button type='primary' ghost style={{marginLeft:8}} onClick={()=>hashHistory.push('/tender/product/chose')}>
				选入
			  </Button>
			  <Button type='danger' ghost style={{marginLeft:8}} onClick={this.change}>
				变更
			  </Button>
		  </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            	<Button type="primary" htmlType="submit">搜索</Button>
            	<Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
             	 	清空
            	</Button>
            	<a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              		{expand ? '关闭':'展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
            	</a>
          </Col>
        </Row>
      </Form>
    );
  }
}