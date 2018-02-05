/**
 * 总务物资
 */
import React from 'react';
import { Row, Col, Form,Button } from 'antd';
import SearchForm from './searchForm';
import FetchTable from 'component/FetchTable';
import { actionHandler } from 'utils/tools';
import { purchase } from 'api';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);


class zwMaterial extends React.Component {
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
      width: 60,
      render: (text,record) => {
        return  <span>
                  <a onClick={
                    actionHandler.bind(
                      null, this.props.router, `/purchase/zwMaterial/edit`, {...record}
                    )}>
                    编辑
                  </a>
                </span>
      }
    }, {
      title: '产品编码',
      dataIndex: 'cpbm',
    }, {
      title: '产品名称',
      dataIndex: 'materialName',
    }, {
      title: '规格',
      dataIndex: 'spec'
    }, {
      title: '型号',
      dataIndex: 'fmodel'
    },{
      title: '采购单位',
      dataIndex: 'purchaseUnit',
    }, {
      title: '采购价格',
      dataIndex: 'purchasePrice',
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
                    actionHandler.bind(null, this.props.router, `/purchase/zwMaterial/addProduct`,{...query})}
                  >
                  添加产品
                </Button>
              </Col> 
            </Row>
            {
              query?
              <FetchTable 
              query={query}
              ref='table'
              columns={columns}
              url={purchase.FINGDERTENDERSTORAGEMATERLIST}
              rowKey='RN'
              scroll={{ x: '120%' }}
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
module.exports = zwMaterial;