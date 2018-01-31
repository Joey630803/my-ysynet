/**
 * @file 科室申请查询
 * @summary 科室高值以及手术申请查询条件
 */
import React, { PropTypes, Component } from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd';
import { department } from 'api';
import { fetchData } from 'utils/tools';
import moment from 'moment'; 
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const submit = (form, search, e) => {
  e.preventDefault();
  form.validateFieldsAndScroll((err, values) => {
    values.applyStartDate = moment(values.applyDate[0]).format('YYYY-MM-DD')
    values.applyEndDate = moment(values.applyDate[1]).format('YYYY-MM-DD')
    search(values)
  });
}

class SearchForm extends Component {
  state = {
    dept: {
      options: [],
      defaultValue: '',
    },
    storage: {
      options: [],
      defaultValue: ''
    }
  }
  componentDidMount = () => {
    fetchData(department.FINDDEPTSTORAGEBYUSER, {}, data => this.setState({dept: {
      options: data,
      defaultValue: ''
    }}))
  }
  deptChangeHandler = (value) => {
    const { options } = this.state.dept;
    const { form } = this.props;
    const opts = options.filter(item => value === item.value);
    const storageOptions = (opts.length && opts[0].children) ? opts[0].children : [];
    form.setFieldsValue({storageGuid: ''})
    this.setState({
      storage: {
        options: storageOptions,
        defaultValue: ''
      }
    })
  }
  render () {
    const { search, form, create, url } = this.props;
    const { dept, storage } = this.state;
    return (
      <Form
      onSubmit={submit.bind(this, form, search)}
      >
        <Row>
          <Col span={6} key={1}>
            <FormItem {...formItemLayout} label={`申请科室`}>
              {form.getFieldDecorator(`deptGuid`, {
                initialValue: dept.defaultValue
              })(
                <Select
                  onChange={this.deptChangeHandler}
                >
                  <Option value={''}>全部</Option>
                  {
                    dept.options.map((item, index) => (
                      <Option value={item.value} key={index}>{item.label}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} key={2}>
            <FormItem {...formItemLayout} label={`备货库房`}>
              {form.getFieldDecorator(`storageGuid`, {
                initialValue: storage.defaultValue
              })(
                <Select>
                  <Option value={''}>全部</Option>
                  {
                    storage.options.map((item, index) => (
                      <Option value={item.value} key={index}>{item.label}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} key={3}>
            <FormItem {...formItemLayout} label={`申请状态`}>
              {form.getFieldDecorator(`applyFstate`, {
                initialValue: ''
              })(
                <Select>
                  <Option value={''}>全部</Option>
                  <Option value={'00'}>草稿</Option>
                  <Option value={'20'}>待确认</Option>
                  <Option value={'40'}>采购中</Option>
                  <Option value={'34'}>已驳回</Option>
                  <Option value={'60'}>完结</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} key={4}>
            <FormItem {...formItemLayout} label={`申请时间`}>
              {form.getFieldDecorator(`applyDate`, {
                initialValue: [moment().subtract(30, 'days'), moment(new Date())]
              })(
                <RangePicker/>
              )}
            </FormItem>
          </Col>
          <Col span={8} key={5}>
            <FormItem {...formItemLayout}>
              {form.getFieldDecorator(`treatmentNo`)(
                <Input placeholder='申请单号/就诊号/患者姓名'/>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <Button type='primary' htmlType='submit'>搜索</Button>
          </Col>
          <Col span={12} style={{textAlign: 'right'}}>
            <Button style={{marginRight: 5}} onClick={create} type="primary" ghost>创建申请</Button>
            <a href={url}><Button icon='export'>导出</Button></a>
          </Col>
        </Row>
      </Form>
    )
  }
}

const SearchCondition = Form.create()(SearchForm);

SearchCondition.propTypes = {
  create: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  url: PropTypes.string
}

export default SearchCondition;
