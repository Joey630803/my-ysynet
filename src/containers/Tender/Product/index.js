/**
 * @file 招标管理-招标产品
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, message } from 'antd';
import FetchTable from 'component/FetchTable';
import {  hashHistory } from 'react-router';
import { tender } from 'api';
import querystring from 'querystring';
import { actionHandler,fetchData } from 'utils/tools';
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component {
  state = {
    expand: false,
    storageData:[],
  }
  //查询
  search = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('查询条件: ', values)
      this.props.query(values);
      this.props.cb({query: values})
    })
  }
  componentDidMount = () => {
    fetchData(tender.SEARCHSTORAGELISTSOURCE, {}, data => this.setState({storageData:data}));
   
  }
  change = () => {
    if (this.props.selected.length === 0) {
      return message.warning('至少选择一项!');
    }
    hashHistory.push({
      pathname: '/tender/product/change',
      state: this.props.selected
    })
  }
  //批量编辑
  handleBatchEdit = () => {
    if (this.props.selected.length === 0) {
      return message.warning('至少选择一项!');
    }
    hashHistory.push({
      pathname: '/tender/product/batchEdit',
      state: this.props.selected
    })
  }
   //调价
  handleChangePrice = () => {
    if (this.props.selected.length === 0) {
      return message.warning('至少选择一项!');
    }
    hashHistory.push({
      pathname: '/tender/product/changePrice',
      state: this.props.selected
    })
  }
  //重置
  reset = () => {
    this.props.form.resetFields();
    this.props.query({});
    this.props.cb({query: ""})

  }
  //状态切换
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand})
  }
  render = () => {
    const { getFieldDecorator } = this.props.form;
    const children = [
      <Col span={7} key={1}>
        <FormItem labelCol={{span: 0}} wrapperCol={{span: 24}} label=''>
          {getFieldDecorator(`searchName`)(
            <Input placeholder="请输入证件号／产品名／通用名/简称／条码"/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={8}>
        <FormItem  labelCol={{span: 4}} wrapperCol={{span: 20}}label={'库房'}>
            {getFieldDecorator('storageGuid',{
                  initialValue: ""
            })(
                <Select>
                  {
                    this.state.storageData.map((item,index) => 
                      <Option key={index} value={item.value}>{item.text}</Option>
                    )
                  } 
                </Select>
            )}
        </FormItem>
      </Col>,
      <Col span={8} key={2}>
        <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={`证件号`}>
          {getFieldDecorator(`registerNo`)(
            <Input/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={3}>
        <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}}  label={`型号`}>
          {getFieldDecorator(`fmodel`)(
            <Input/>
          )}
        </FormItem>
      </Col>,
   
      <Col span={8} key={4}>
        <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={`规格`}>
          {getFieldDecorator(`spec`)(
            <Input/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={5}>
        <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}}  label={`品牌`}>
          {getFieldDecorator(`tfBrand`)(
            <Input/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={6}>
        <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}}  label={`生产商`}>
          {getFieldDecorator(`produceName`)(
            <Input />
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={7}>
        <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={`供应商`}>
          {getFieldDecorator(`orgName`)(
            <Input/>
          )}
        </FormItem>
      </Col>
    ];
    const expand = this.state.expand;
    const shownCount = expand ? children.length : 3;
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.search}
      >
        <Row>
          {children.slice(0, shownCount)}
        </Row>
        <Row>
          <Col span={10}>
            {/* <Button 
              type="primary" ghost style={{ marginLeft: 8 }} 
              onClick={() => hashHistory.push('/tender/product/chose')}>
              选入
            </Button>
            <Button type="danger" ghost 
              style={{ marginLeft: 8 }}
              onClick={this.change}
            >
              变更
            </Button> */}
            <Button type="primary" ghost 
              style={{ marginLeft: 8 }}
              onClick={this.handleBatchEdit}
            >
              批量编辑
            </Button>
            <Button type="primary" ghost 
              style={{ marginLeft: 8 }}
              onClick={this.handleChangePrice}
            >
              调价
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.reset}>
              清空
            </Button>
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              {expand ? '关闭' : '展开'} <Icon type={expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedSearchForm = Form.create()(SearchForm);

const redirect = (url, state) => {
  hashHistory.push({
    pathname: url,
    state: state
  })
}
class Product extends React.Component {
  state = {
    selected: [],
    selectedRows: [],
    query: {}
  }
  search = (query) => {
    this.refs.table.fetch(query);
  }
  delete = (record) => {
    fetch(tender.DELETE_TENDER, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
          'Content-Type':'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({tenderGuid: record.tenderGuid})
    })
    .then(res => res.json())
    .then(data => {
      if (data.status) {
        message.success('删除成功!')
        this.refs.table.fetch();
      } else {
        message.error(data.msg);
      }
    })
    .catch(e => console.log("Oops, error", e))
  }
  render() {
    const columns = [{
      title : '操作',
      dataIndex : 'tenderGuid',
      width: 180,
      fixed: 'left',
      render: (text, record) => {
        return (
          <span>
            <a onClick={redirect.bind(this, '/tender/product/details',{...record, isEdit: true})}>编辑</a>
             <span className="ant-divider" />
            <a onClick={
            actionHandler.bind(
                null, this.props.router, `/tender/priceRecord`, {...record}
            )}>
            {`调价记录`}
            </a>
            <span className="ant-divider" />
            <a onClick={
            actionHandler.bind(
                null, this.props.router, `/tender/changeRecord`, {...record}
            )}>
            {`变更记录`}
            </a>
          </span>
        )
      }  
    },{
        title : '状态',
        dataIndex : 'fstate',
        width: 50,
        fixed: 'left',
        render: (text, record) => {
          if (text === '00') {
            return <span style={{color: '#f04134'}}>停用</span>
          } else {
            return <span style={{color: '#00a854'}}>启用</span>
          }
        }
    },{
        title : '产品名称',
        dataIndex : 'materialName',
        width: 150,
        fixed: 'left' 
    },{
        title : '证件号',
        dataIndex : 'registerNo'
    },{
        title : '品牌',
         width: 120,
        dataIndex : 'tfBrand'
    },{
        title : '生产商',
        dataIndex : 'produceName'
    },{
        title : '型号',
        dataIndex : 'fmodel'
    },{
        title : '规格',
        dataIndex : 'spec'
    },{
        title : '招标价',
        dataIndex : 'tenderPrice'
    },{
        title : '招标单位',
        dataIndex : 'tenderUnit'
    },{
        title : '通用名称',
        dataIndex : 'geName',
        width: 150,
        fixed: 'right' 
    },{
        title : '供应商',
        dataIndex : 'fOrgName',
        width: 150,
        fixed: 'right' 
    }
  ]

    return (
      this.props.children || 
      <div>
        <WrappedSearchForm 
          selected={this.state.selectedRows} 
          query={(query) => this.search(query)}
          cb={query => this.setState(query)}
        />
        <FetchTable 
          query={this.state.query}
          ref='table'
          rowKey={'tenderDetailGuid'}
          url={tender.TENDER_LIST}
          columns={columns} 
          scroll={{ x: '200%' }}
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => 
            this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
          }}
        />
      </div>  
    )
  }
}

module.exports = Product;

