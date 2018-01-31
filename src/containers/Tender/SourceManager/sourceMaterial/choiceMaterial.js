/**
 * @file 选入产品
 */
import React from 'react';
import { Breadcrumb, Row, Col, Form, Input, Button, message, Modal } from 'antd';
import { Link, hashHistory } from 'react-router';
import FetchTable from 'component/FetchTable';
import { tender } from 'api';
const FormItem = Form.Item;

class SearchForm extends React.Component {
  state = {
    dirtyClick: false
  }
  search = () => {
    this.props.form.validateFields((err, values) => {
      this.props.search(values);
      this.props.cb({query: values})
    })
  }
  reset = () => {
    this.props.form.resetFields();
  }
  save = () => {
    this.setState({dirtyClick: true})
    if (this.props.selected.length === 0) {
      this.setState({dirtyClick: false})
      return message.warning('至少选择一项')
    }
    console.log('postData => ', this.props.selected)
    
    fetch(tender.CHOSEN_PRODUCT_INSERT, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({ material: this.props.selected,sourceGuid:this.props.data.sourceGuid})
    })
    .then(res => {
      this.setState({dirtyClick: false})
      return res.json();
    })
    .then(data => {
      if (data.status) {
        Modal.confirm({
          title: '继续添加',
          content: '恭喜你,添加成功!',
          okText: '返回招标产品列表',
          cancelText: '继续添加',
          onOk: () => hashHistory.push({pathname:'/tender/sourceManager/sourceMaterial/material',state:this.props.data}),
          onCancel: () => this.search()
        });
      } else {
        message.error(data.msg);
      }
    })
    .catch(e => console.log("Oops, error", e))
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.search}
      >
        <Row style={{marginTop: 10}}>
          <Col span={8} key={2}>
            <FormItem {...formItemLayout} label={`品牌`}>
              {getFieldDecorator(`tfBrand`)(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col span={8} key={3}>
            <FormItem {...formItemLayout} label={`型号`}>
              {getFieldDecorator(`fmodel`)(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col span={8} key={4}>
            <FormItem {...formItemLayout} label={`规格`}>
              {getFieldDecorator(`spec`)(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col span={16} key={1}>
            <FormItem labelCol={{span: 6}} wrapperCol={{span: 16}} label={`产品名称/简码/证件号/条码`}>
              {getFieldDecorator(`searchName`)(
                <Input  />
              )}
            </FormItem>
          </Col>
          <Col span={7} key={5} style={{textAlign: 'right'}}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button  
                style={{marginLeft: 8}}
                onClick={this.reset}
              >
              清空</Button>
              <Button type="primary" ghost 
                style={{marginLeft: 8}}
                onClick={this.save}
                loading={this.state.dirtyClick}
              >
              选入</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
const WrappedSearchForm = Form.create()(SearchForm);

const columns = [
  {
    title : '产品名称',
    dataIndex : 'materialName',
    width: 170,
    fixed: 'left' 
  } , {
    title : '证件号',
    dataIndex : 'registerNo',
    width: 150,
    fixed: 'left' 
  } , {
    title : '状态',
    dataIndex : 'fstate',
    width: 60,
    fixed: 'left' ,
    render: (text, record) => {
      if (text === '00') {
        return <span style={{color: '#ffbf00'}}>到期</span>
      } else if(text === '01'){
        return <span style={{color: '#00a854'}}>正常</span>
      } else if(text === '02') {
        return <span style={{color: '#f04134'}}>异常</span>
      }
    }
  } , {
    title : '简码',
    dataIndex : 'fqun',
    width: 120,
    fixed: 'left' 
  } , {
    title : '型号',
    dataIndex : 'fmodel',
  } , {
    title : '规格',
    dataIndex : 'spec',
  } , {
    title : '条码',
    dataIndex : 'fbarCode',
  }  , {
    title : '最小单位',
    dataIndex : 'leastUnit',
    width: 100,
    fixed: 'right' 
  } , {
    title : 'REF',
    dataIndex : 'ref',
    width: 100,
    fixed: 'right' 
  } , {
    title : '品牌',
    dataIndex : 'tfBrand',
    width: 120,
    fixed: 'right' 
  }
]

class ProductChosen extends React.Component {
  state = {
    selected: [],
    selectedRows: [],
    query: {}
  }
  query = (query) => {
    this.refs.table.fetch(query);
  }
  render() {
    console.log(this.props.location.state,"从选入的产品列表带入的数据")
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/tender/sourceManager'>供应管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={{pathname:'/tender/sourceManager/sourceMaterial/material',state:this.props.location.state}}>产品</Link></Breadcrumb.Item>
          <Breadcrumb.Item>
            选入
          </Breadcrumb.Item>
        </Breadcrumb>
        <WrappedSearchForm style={{marginTop: 20}} 
          selected={this.state.selectedRows}
          search={this.query}
          cb={query => this.setState(query)}
          data={this.props.location.state}
        />
        <FetchTable 
          query={this.state.query}
          ref='table'
          url={tender.CHOSEN_PRODUCT_LIST}
          columns={columns}
          rowKey={'fitemid'}
          scroll={{ x: '140%' }}
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

module.exports = ProductChosen;