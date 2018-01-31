import React from 'react';
import { Form, Row, Col, Input, Button, Select} from 'antd';
import {  fetchData  } from 'utils/tools';
import { purchase } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component{
	state = {
		storageData:[],// 库房
	}
	componentDidMount = () =>{
		//库房
		fetchData(purchase.FINDTOPSTORAGEBYUSER_LIST,{},data => {this.setState({storageData:data.result})});
	}
	handleSearch = (e) => {
    	e.preventDefault();
     	this.props.form.validateFields((err, values) => {
     		console.log('查询条件: ', values)
           this.props.query(values);
        });
	}
	handleReset = () => {
	this.props.form.resetFields();
	this.props.query({});
	}

	render(){
		const { getFieldDecorator } = this.props.form;
		const storageData = this.state.storageData;
		const formItemLayout = {
		labelCol: { span: 7 },
		wrapperCol: { span: 17 }
		}
		return (
			<Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
				<Row>
					<Col span={8} key={1}>
						<FormItem {...formItemLayout} label={'库房'}>
							{
								getFieldDecorator(`rStorageGuid`,{
									initialValue:this.state.storageData.length > 0? 
												this.state.storageData[0].value : null
								})(
									<Select>
										{
											storageData.map((item,index)=>
													<Option key={index} value={item.value}>{item.text}</Option>
											)
										}
									</Select>
								)
							}
						</FormItem>
					</Col>
					<Col span={8} key={2}>
						<FormItem {...formItemLayout} label={'产品名称/证件号'}>
							{
								getFieldDecorator(`searchName`)(
									<Input placeholder='请输入' />
								)
							}
						</FormItem>
					</Col>
					<Col span={8} key={3}>
						<FormItem {...formItemLayout} label={'物资分类'}>
							{
								getFieldDecorator(`typeInfoFlag `,{
									initialValue:'-1'
								})(
									<Select>
										<Option  key={-1} value='-1'>全部</Option>
										<Option  key={1} value='1'>有分类</Option>
										<Option  key={0} value='0'>无分类</Option>
									</Select>
								)
							}
						</FormItem>
					</Col>
					<Col span={24} key={4} style={{textAlign:'right'}}>
						<Button type="primary" htmlType="submit">搜索</Button>
						<Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                        清除
                    </Button>
					</Col>
				</Row>
			
			</Form>
			)
	}
}
export default SearchForm;