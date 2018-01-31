import React from 'react';
import { Input } from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler,pathConfig } from 'utils/tools';

//搜索
const Search = Input.Search;
const SALES_BASE_URL = '/sales/customer/',
      SALES_TITLES = {
        show: '详情'
      }
class Customer extends React.Component {
  state = {
    query: ''
  }
  /**table根据条件查询 */
  queryHandler = (query) => {
    this.refs.table.fetch(query);
    this.setState({query})
  }
  render() {
 
    /**销售管理操作列表 */
    const actions = (text, record) => {
      return (
          <a onClick={
            actionHandler.bind(
              null, this.props.router, `${SALES_BASE_URL}show`, {...record, title: `${SALES_TITLES.show}`}
            )}>
            {`${SALES_TITLES.show}`}
          </a>
  
      )
    };
      //列
  const columns = [
      {
          title: '操作',
          dataIndex: 'actions',
          render: actions,
      },
      {
          title: '医疗机构名称',
          dataIndex: 'orgName',
      },
      {
          title: '简称',
          dataIndex: 'orgAlias',
      },
      {
          title: '省',
          dataIndex: 'tfProvince',
      },
      {
          title: '市',
          dataIndex: 'tfCity',
      },
      {
          title: '区',
          dataIndex: 'tfDistrict',
      }
  ];
  const query = this.state.query;
    return (
      <div>
        { this.props.children 
          || 
          <div>
            <Search
              placeholder="请输入医院名称/简称/简码"
              style={{ width: 200 }}
             onSearch={value =>  {this.queryHandler({'searchParams':value})}}
            />
            <FetchTable 
              query={query}
              ref='table'
              columns={columns}
              url={pathConfig.FINDMYHOSIPITAL_URL}
              rowKey='RN'
              scroll={{ x: '100%' }}
            />
          </div>   
        }  
      </div>
    )  
  }

}
module.exports = Customer;

