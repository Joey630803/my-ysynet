import React from 'react';
import { Form, Row, Col, Button, Select,DatePicker} from 'antd';
import {  fetchData  } from 'utils/tools';
import { purchase } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;

class SearchForm extends React.Component{
	state = {
		storageData:[],// 库房
		
	}
	componentDidMount = () =>{
		//库房
		fetchData(purchase.STORAGE_LIST,{},data => {
			if (data.result.length > 0) {
				this.setState({storageData:data.result})
				this.props.defaultQuery({storageGuid: data.result[0].value})
			}
		});
	}
	handleSearch = (e) => {
    	e.preventDefault();
     	this.props.form.validateFields((err, values) => {
			values.acctYhStart = values.acctYhStart === undefined ? "" : values['acctYhStart'].format('YYYY-MM');
			values.acctYhEnd = values.acctYhEnd === undefined ? "" :  values['acctYhEnd'].format('YYYY-MM');
     		console.log('查询条件: ', values);
           this.props.query(values);
        });
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
								getFieldDecorator(`storageGuid`,{
									initialValue: storageData.length > 0 
                                    ? storageData[0].value : null
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
			
                    <Col span={5} key={2}>
						<FormItem {...formItemLayout} label={'会计月'}>
							{getFieldDecorator('acctYhStart')(
                       			<MonthPicker  placeholder="选择月" />
                			)}
						</FormItem>
					
					</Col>
					<Col span={1} key={3} style={{textAlign:'center'}}>
						~
					
					</Col>
					<Col span={4} key={4}>
						<FormItem {...formItemLayout} label={''}>
							{getFieldDecorator('acctYhEnd')(
                       			<MonthPicker  placeholder="选择月"/>
                			)}
						</FormItem>
					</Col>

                    <Col span={2} key={5} style={{textAlign:'right'}}>
						<Button type="primary" htmlType="submit">搜索</Button>
					</Col>
                 
				</Row>
			</Form>
			)
	}
}
export default SearchForm;