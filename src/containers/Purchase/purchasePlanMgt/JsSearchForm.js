import React from 'react';
import { Form, Row, Col, Input, Button, Select,DatePicker} from 'antd';
import {  fetchData ,CommonData } from 'utils/tools';
import { purchase } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class JsSearchForm extends React.Component{
	state = {
		storageData:[],// 库房
		planState:[],//计划单状态
	}
	componentDidMount = () =>{
		//库房
		fetchData(purchase.STORAGE_LIST,{},data => {this.setState({storageData:data.result})});
		CommonData('CHECKOUT_PLAN_FSTATE', (data) => {
            this.setState({planState:data})
        })
	}
	handleSearch = (e) => {
    	e.preventDefault();
     	this.props.form.validateFields((err, values) => {
     		const applyTime = values.applyTime === undefined ? "" : values.applyTime;
			if(applyTime.length>0)
			{
				values.startDate = applyTime[0].format('YYYY-MM-DD');
				values.endDate = applyTime[1].format('YYYY-MM-DD');
			}
			values.bStorageGuid = this.props.defaultValue;
     		console.log('查询条件: ', values)
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
    const fstateOptions = () => {
      let options = [];
      let planState = this.state.planState;
      planState.forEach((item) => {
         options.push(<Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
      })
      return options;
    }
		return (
			<Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
				<Row>
					<Col span={8} key={1}>
						<FormItem {...formItemLayout} label={'申请库房'}>
							{
								getFieldDecorator(`storageGuid`,{
									initialValue:''
								})(
									<Select>
										<Option  key={-1} value=''>全部</Option>
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
						<FormItem {...formItemLayout} label={'计划单状态'}>
							{
								getFieldDecorator(`fstate`,{
									initialValue:''
								})(
									<Select>
										<Option key={-1} value=''>全部</Option>
										{
											fstateOptions()
										}
									</Select>
								)
							}
						</FormItem>
					</Col>
                    <Col span={8} key={3}>
						<FormItem {...formItemLayout} label={'申请时间'}>
							{getFieldDecorator('applyTime')(
                       			<RangePicker/>
                			)}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={8} key={4}>
						<FormItem {...formItemLayout} label={'单号'}>
							{
								getFieldDecorator(`planNo`,{rules: [{ max: 25, message: '长度不能超过25' }]})(
									<Input placeholder='计划单号/申请单号' />
								)
							}
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
export default JsSearchForm;