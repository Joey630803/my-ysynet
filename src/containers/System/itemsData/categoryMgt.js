/**
 * @file 数据字典分类类别
 */
import React from 'react';
import { Row, Col, Input, Button,Icon,Breadcrumb } from 'antd';
import { Link } from 'react-router';
import { itemsDataUrl } from '../../../api';
import FetchTable from 'component/FetchTable';
import { actionHandler } from 'utils/tools';

const Search = Input.Search;
const ITEMSDATA_BASE_URL = '/system/itemsData/categoryMgt/',
      ITEMSDATA_TITLES = {
        add:'新建分类',
        edit:'编辑',
        clone:'克隆'
      }

class itemsDataCategory extends React.Component {
  state = {
    query: ''
  }
  /**table根据条件查询 */
  queryHandler = (query) => {
    this.refs.table.fetch(query);
  }
  render() {
      const columns = [{
      title: '操作',
      dataIndex: 'actions',
      render: (text, record) => {
        return (
          <span>
            <a onClick={
              actionHandler.bind(
                null, this.props.router, `${ITEMSDATA_BASE_URL}edit`, {...record, title: `${ITEMSDATA_TITLES.edit}`}
              )}>
              {`${ITEMSDATA_TITLES.edit}`}
            </a>
          </span>
        )
      }
    },{
      title: '编码',
      dataIndex: 'tfClo',
    }, {
      title: '名称',
      dataIndex: 'tfComment',
    }, {
      title: '机构名称',
      dataIndex: 'orgName',
    }, {
      title: '排序',
      dataIndex: 'fsort',
    }];

    const query = this.state.query;
    return (
          <div>
            <Breadcrumb style={{fontSize: '1.1em',marginBottom:'10px'}}>
                <Breadcrumb.Item><Link to='/system/itemsData'>数据字典</Link></Breadcrumb.Item>
                <Breadcrumb.Item>数据字典分类</Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                <Col span={10}>
                    <Search
                        ref='search'
                        placeholder="名称编号"
                        style={{ width: 260 }}
                        onSearch={value =>  {this.queryHandler({'searchParams':value})}}
                    />
                </Col>
                <Col span={10} offset={4} style={{textAlign: 'right'}}>
                    <Button 
                        type="primary"
                        style={{marginRight:'10px'}}
                        onClick={  actionHandler.bind(
                        null, this.props.router, `${ITEMSDATA_BASE_URL}add`, { title: `${ITEMSDATA_TITLES.add}`}
                    )}
                    >
                       <Icon type="plus" />
                        {`${ITEMSDATA_TITLES.add}`}
                    </Button>
                    <Button 
                        type="primary"
                        style={{marginRight:'10px'}}
                        onClick={actionHandler.bind(
                        null, this.props.router, `${ITEMSDATA_BASE_URL}clone`, { title: `${ITEMSDATA_TITLES.clone}`}
                    )}
                    >
                        {`${ITEMSDATA_TITLES.clone}`}
                    </Button>
                </Col> 
            </Row>
                {<FetchTable 
                    query={query}
                    ref='table'
                    columns={columns}
                    url={itemsDataUrl.ITEMSDATA_LIST}
                    rowKey='staticId'
                    />}
          </div>   
    )  
  }
}
module.exports = itemsDataCategory;