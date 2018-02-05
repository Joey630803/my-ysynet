/**
 * 总务供应商
 */
import React from 'react';
import { Row, Col, Form,Button } from 'antd';
import SearchForm from './searchForm';
import FetchTable from 'component/FetchTable';
import { actionHandler } from 'utils/tools';
import { purchase } from 'api';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);


class zwSupplier extends React.Component {
  state = {
    query: ''
  }
  /**table根据条件查询 */
  queryHandler = (query) => {
    this.refs.table.fetch(query);
    this.setState({query})
  }
  defaultQuery = (query)=>{
    this.setState({query : query});
  }
  render() {
    const columns = [{
      title: '操作',
      dataIndex: 'actions',
      width: 130,
      fixed: 'left',
      render: (text,record) => {
        return  <span>
                  <a onClick={
                    actionHandler.bind(
                      null, this.props.router, `/purchase/zwSupplier/edit`, {...record}
                    )}>
                    编辑
                  </a>
                </span>
      }
    }, {
      title: '编号',
      dataIndex: 'supplierCode',
    }, {
      title: '供应商名称',
      dataIndex: 'orgName',
    }, {
      title: '状态',
      dataIndex: 'fstate',
      render:(text,record) =>{
        if(text === "01"){
          return "启用"
        }else if(text === "00"){
          return "停用"
        }
      }
    }, {
      title: '省市区',
      dataIndex: 'area'
    },{
      title: '联系人',
      dataIndex: 'lxr',
    }, {
      title: '联系电话',
      dataIndex: 'lxdh',
    }];
    const query = this.state.query;
    return (
      <div>
        { this.props.children 
          || 
          <div>
            <Row>
              <Col span={24} >
                <SearchBox query={this.queryHandler} defaultQuery={(query) => this.defaultQuery(query)}/>
              </Col>
              <Col span={24}  style={{textAlign: 'right'}}>
                <Button 
                  type="primary" 
                  style={{marginRight: '10px'}} 
                  onClick={
                    actionHandler.bind(null, this.props.router, `/purchase/zwSupplier/add`,{})}
                  >
                  添加供应商
                </Button>
              </Col> 
            </Row>
            {
              query?
              <FetchTable 
              query={query}
              ref='table'
              columns={columns}
              url={purchase.FINDGGENERALSUPPLIERLIST}
              rowKey='RN'
              scroll={{ x: '110%' }}
            />
            :
            null
            }
            
          </div>   
        }  
      </div>
    )  
  }
}
module.exports = zwSupplier;