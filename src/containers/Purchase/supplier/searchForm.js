import React from 'react';
import { Form,Row,Col, Button, Input,Select } from 'antd';
import { fetchData } from 'utils/tools';
import { tender } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component{
  state = {
    storageOptions: [],
    storageGuid: ''
  }
  componentDidMount = () => {
    fetchData(tender.FINDTOPSTORAGEBYUSER,{},(data)=>{
        if(data.result.length > 0){
          this.setState({storageOptions: data.result,storageGuid:data.result[0].value});
          this.props.defaultQuery({storageGuid: data.result[0].value})
        }
    })
  }
  searchHandler = (e) => {
    e.preventDefault();
    let query = this.props.form.getFieldsValue();
    this.props.query(query);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form  className="ant-advanced-search-form" onSubmit={this.searchHandler}>
         <Row>
         <Col span={6} key={1}>
           <FormItem  labelCol={{span:6}} wrapperCol={{span:18}} label={`库房`}>
             {getFieldDecorator(`storageGuid`, {
               initialValue: this.state.storageOptions.length > 0 
                             ? this.state.storageOptions[0].value : null
             })(
               <Select
               >
                 {
                   this.state.storageOptions.map(
                     (item, index) => <Option key={index} value={item.value}>{item.text}</Option>)
                 }
               </Select>
             )}
           </FormItem>
         </Col>
         <Col span={1}>
         </Col>
         <Col span={6} key={2}>
           <FormItem>
             {
               getFieldDecorator(`searchName`,{
                 rules:[{max:25,message:'长度不能超过25'}]
               })(
                 <Input placeholder='请输入供应商名称/编码/联系人'/>
               )
             }
           </FormItem>
         </Col>
         <Col span={2}  key={3} style={{textAlign: 'right'}}>
             <Button type='primary' htmlType="submit">搜索</Button>
         </Col>
       </Row>
      </Form>
    )
  }
}

export default SearchForm;