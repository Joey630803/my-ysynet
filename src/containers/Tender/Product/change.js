/**
 * @file 变更
 */
import React from 'react';
import { Breadcrumb, Row, Col, Input, message, Popconfirm } from 'antd';
import { Link, hashHistory } from 'react-router';
import FetchTable from 'component/FetchTable';
import { tender } from 'api';
const Search = Input.Search;

class ProductChange extends React.Component {
  state = {
    query: {}
  }
  save = (record) => {
    const postData = {
      tenderChange: this.props.location.state,
      newCertGuid: record.certGuid
    }
    console.log('postData: =>', postData);
    fetch(tender.TENDER_CHANGE, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
          'Content-Type':'application/json'
        },
        body:JSON.stringify(postData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status) {
        message.success('变更成功!');
        hashHistory.push('/tender/product')
      } else {
        message.error(data.msg);
      }
    })
    .catch(e => console.log("Oops, error", e))
  }
  render() {
    const columns = [
      {
        title: '操作',
        dataIndex: 'fitemid',
        width: 80,
        render: (text, record) => {
          return <Popconfirm 
                    title="是否确认变更" 
                    onConfirm={this.save.bind(this, record)} 
                    okText="是" cancelText="否">
                    <a href="#">保存</a>
                  </Popconfirm>
        }
      }, {
        title : '证件号',
        dataIndex : 'registerNo',
      } , {
        title : '状态',
        width: 80,
        dataIndex : 'fstate',
        render: (text, record) => {
          let status;
          switch (text) {
            case '00':
                status = <span style={{color: '#f04134'}}>到期</span>
              break;
            case '01':
                status = <span style={{color: '#00a854'}}>正常</span>
              break;
            case '02':
                status = <span style={{color: '##f04134'}}>异常</span>
              break;
            default:
                status = '什么鬼';
              break;
          }
          return status;
        }
      } , {
        title : '产品名称',
        dataIndex : 'materialName',
      } , {
        title : '品牌',
        dataIndex : 'tfBrand',
      }  , {
        title : '生产商',
        dataIndex : 'produceName',
      } , {
        title : '有效期',
        dataIndex : 'lastTime',
      } 
    ]
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={'/tender/product'}>招标产品</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            变更
          </Breadcrumb.Item>
        </Breadcrumb>
        <Row style={{marginTop: 20}}>
          <Col span={8}>
            <Search
              placeholder="请输入证件号/产品名称/品牌/生产商"
              style={{ width: 280 }}
              onSearch={value => {
                this.refs.table.fetch({
                  searchName: value
                })
                this.setState({query: {searchName: value}})
              }}
            />
          </Col>
        </Row>
        <FetchTable 
          query={this.state.query}
          ref='table'
          url={tender.REGISTER_NOLIST}
          columns={columns}
          rowKey={'fitemid'}
        />
      </div>
    )
  }
}

module.exports = ProductChange;