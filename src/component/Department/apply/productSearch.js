/**
 * @file 科室申请查询
 * @summary 科室高值以及手术申请查询条件
 */
import React, { PropTypes, Component } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
// import FetchSelect from 'component/FetchSelect';
// import { department } from 'api';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};


class SearchForm extends Component {
  state = {
    supplierId: ''
  }
  submit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.search({...values, supplierId: this.state.supplierId})
    });
  }
  render () {
    const { form, add } = this.props;
    return (
      <Form
        onSubmit={this.submit}
      >
        <Row gutter={20}>
          {/* <Col span={8} key={1}>
            <FormItem {...formItemLayout} label={`供应商`}>
            <FetchSelect 
              allowClear={true}
              url={department.QUERY_SUPPLIER} 
              cb={ value => (this.setState({supplierId: value}))}
            />
            </FormItem>
          </Col> */}
          <Col span={10} key={2}>
            <FormItem {...formItemLayout} label={`查询条件`}>
              {form.getFieldDecorator(`searchName`)(
                <Input placeholder='产品名称/通用名称/规格/型号/品牌'/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <Button type='primary' htmlType='submit' style={{marginLeft: 10}}>搜索</Button>
            <Button style={{marginLeft: 5}} onClick={add}>添加</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
const ProductSearch = Form.create()(SearchForm);

ProductSearch.propTypes = {
  search: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired
}

export default ProductSearch;
