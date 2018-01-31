/**
 * @file 招标管理-供应管理
 */
import React from 'react';
import { Form, Row, Col, Input, Button, message ,Select} from 'antd';
import FetchTable from 'component/FetchTable';
import { Link, hashHistory } from 'react-router';
import { tender } from 'api';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
const Option = Select.Option;
const FormItem = Form.Item;

class SearchForm extends React.Component {
  state={
    storageData:[],
  }
  //查询
  search = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('查询条件: ', values)
      this.props.query(values);
    })
  }
  componentDidMount = () => {
    fetchData(tender.SEARCHSTORAGELISTSOURCE, {}, data => this.setState({storageData:data}));
   
  }
  render = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.search}
      >
        <Row>
          <Col span={8} key={2}>
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
          </Col>
           <Col span={10} key={9}>
            <FormItem labelCol={{span: 4}} wrapperCol={{span: 14}}  label={"搜索条件"}>
              {getFieldDecorator(`searchName`)(
                <Input  placeholder="请输入供应商名称／编号／联系人"/>
              )}
            </FormItem>
          </Col>
          <Col span={2}>
            <Button type="primary" htmlType="submit">搜索</Button>
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
class SourceManager extends React.Component {
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
      dataIndex : 'sourceGuid',
      width: 80,
      render: (text, record) => {
        return (
          <span>
            <a onClick={redirect.bind(this, '/tender/sourceManager/edit',{...record})}>编辑</a>
            <span className="ant-divider" />
            <a onClick={redirect.bind(this, '/tender/sourceManager/sourceMaterial/material', {...record})}>产品</a>
          </span>
        )
      }  
    },{
        title : '状态',
        dataIndex : 'fstate',
        width: 50,
        render: (text, record) => {
          if (text === '00') {
            return <span style={{color: '#f04134'}}>停用</span>
          } else {
            return <span style={{color: '#00a854'}}>启用</span>
          }
        }
    },{
        title : '供应商',
        dataIndex : 'forgName',
        width: 150,
    },{
        title : '编号',
        dataIndex : 'supplierCode',
        width: 150,
    },{
        title : '库房',
        dataIndex : 'storageName'
    },{
        title : '联系人',
         width: 120,
        dataIndex : 'lxr'
    },{
        title : '联系电话',
        dataIndex : 'lxdh'
    },{
        title : '发布日期',
        dataIndex : 'createTime'
    },{
        title : '发布人',
        dataIndex : 'createUsername'
    }
  ]

    return (
      this.props.children || 
      <div>
        <WrappedSearchForm 
          query={(query) => this.search(query)}
        />
        <div style={{textAlign:'right'}}>
            <Button type="primary">
              <Link to='/tender/sourceManager/add'>添加</Link>
            </Button>
        </div>
        <FetchTable 
          query={this.state.query}
          ref='table'
          rowKey={'sourceGuid'}
          url={tender.MYSOURCEINFO_LIST}
          columns={columns} 
          scroll={{ x: '120%' }}
        />
      </div>  
    )
  }
}
module.exports = SourceManager;

