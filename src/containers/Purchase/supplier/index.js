import React from 'react';
import { Row, Col, Form } from 'antd';
import SearchForm from './searchForm';
import FetchTable from 'component/FetchTable';
import columns from './columns'
import { actionHandler } from 'utils/tools';
import { purchase } from 'api';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

const SUPPLIER_BASE_URL = '/purchase/supplier/',
      SUPPLIER_TITLES = {
        show: '详情',
        setting: '配置用户',
        product: '产品',
        edit: '编辑'
      }

class Supplier extends React.Component {
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
    /**供应商操作列表 */
    const actions = (text, record) => {
      return (
        <span>
          <a onClick={
            actionHandler.bind(
              null, this.props.router, `${SUPPLIER_BASE_URL}show`, {...record, from: '/purchase/supplier',title: `供应商${SUPPLIER_TITLES.show}`}
            )}>
            {`${SUPPLIER_TITLES.show}`}
          </a>
          <span className="ant-divider" />
          <a onClick={
            actionHandler.bind(
              null, this.props.router, `${SUPPLIER_BASE_URL}edit`, {...record, title: `${SUPPLIER_TITLES.edit}供应商`}
            )}>
            {`${SUPPLIER_TITLES.edit}`}
          </a>
          <span className="ant-divider" />
          <a onClick={
            actionHandler.bind(
              null, this.props.router, `${SUPPLIER_BASE_URL}product`, {...record, title: `供应商${SUPPLIER_TITLES.product}`}
            )}>
            {`${SUPPLIER_TITLES.product}`}
          </a>
          </span>

      )
    };
    const query = this.state.query;
    return (
      <div>
        { this.props.children 
          || 
          <div>
            <Row>
              <Col>
                <SearchBox query={this.queryHandler} defaultQuery={(query) => this.defaultQuery(query)}/>
              </Col>
            </Row>
            {
              query?
              <FetchTable 
              query={query}
              ref='table'
              columns={columns(this, actions)}
              url={purchase.MYSUPPLIERLIST_URL}
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
module.exports = Supplier;