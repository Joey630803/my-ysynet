/**
 * @file 中标产品
 */
import React from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import FetchTable from 'component/FetchTable';
import { tender } from 'api';
const FormItem = Form.Item;

class SearchForm extends React.Component {
  state = {
    storageOptions: []
  }
  componentDidMount = () => {

  }
  //查询
  search = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('查询条件: ', values)
      this.props.query(values);
    })
  }
  //重置
  reset = () => {
    this.props.form.resetFields();
  }
  render = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
    const children = [
      <Col span={6} key={1}>
        <FormItem  {...formItemLayout} label={`招标机构`}>
          {getFieldDecorator(`rOrgName`, {
          })(
            <Input/>
          )}
        </FormItem>
      </Col>,
      <Col span={6} key={2}>
        <FormItem {...formItemLayout} label={`产品名称/简码/证件号`}>
          {getFieldDecorator(`searchName`)(
            <Input placeholder='产品名称/简码/证件号'/>
          )}
        </FormItem>
      </Col>,
      <Col span={6} key={5}>
        <FormItem {...formItemLayout} label={`品牌`}>
          {getFieldDecorator(`tfBrand`)(
            <Input/>
          )}
        </FormItem>
      </Col>,
      <Col span={6} key={6}>
        <FormItem {...formItemLayout} label={`型号`}>
          {getFieldDecorator(`fmodel`)(
            <Input/>
          )}
        </FormItem>
      </Col>,
      <Col span={6} key={7}>
        <FormItem {...formItemLayout} label={`规格`}>
          {getFieldDecorator(`spec`)(
            <Input/>
          )}
        </FormItem>
      </Col>,
      <Col span={12} key={8} style={{textAlign: 'right'}}>
        <Button type="primary" htmlType="submit">搜索</Button>
        <Button style={{ marginLeft: 8 }} onClick={this.reset}>
          清空
        </Button>
      </Col>
    ];
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.search}
      >
        <Row>
          {children}
        </Row>
      </Form>
    )
  }
}

const WrappedSearchForm = Form.create()(SearchForm);
const columns = [{
      title : '招标机构',
      dataIndex : 'rOrgName',
      fixed: 'left',
      width: 150
  },{
      title : '产品名称',
      dataIndex : 'materialName',
      fixed: 'left',
      width: 150
  },{
      title : '通用名称',
      dataIndex : 'geName',
      fixed: 'left',
      width: 150
  },{
      title : '通用简码',
      dataIndex : 'geFqun'
  },{
      title : '证件号',
      dataIndex : 'registerNo'
  },{
      title : '型号',
      dataIndex : 'fmodel'
  },{
      title : '规格',
      dataIndex : 'spec'
  },{
      title : '品牌',
      dataIndex : 'tfBrand'
  },{
      title : '采购单位',
      dataIndex : 'purchaseUnit'
  },{
      title : '生产商',
      dataIndex : 'produceName'
  },{
      title : '采购价格',
      dataIndex : 'purchasePrice',
      fixed: 'right',
      width: 100
  }
]
class VendorMaterial extends React.Component {
  state = {
    query: ''
  }
  search = (query) => {
    this.refs.table.fetch(query);
  }
  defaultQuery = (query) => {
    this.setState({
      query: query
    })
  }
  render() {
    return (
      <div>
        <WrappedSearchForm  
          defaultQuery={(query) => this.defaultQuery(query)}
          query={(query) => this.search(query)}
        />

          <FetchTable 
            query={this.state.query}
            ref='table'
            rowKey={'tenderDetailGuid'}
            url={tender.TENDER_LIST_SALES}
            columns={columns} 
            scroll={{ x: '150%' }}
          />
      </div>  
    )
  }
}

module.exports = VendorMaterial;