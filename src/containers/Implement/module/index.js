import React from 'react';
import { Input } from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler,pathConfig } from 'utils/tools';

//搜索
const Search = Input.Search;


const IMPLEMENT_BASE_URL = '/implement/module/',
      IMPLEMENT_TITLES = {
        setting: '配置模块'
      }



class Implement extends React.Component {
state = {
    query: ''
  }
  /**table根据条件查询 */
  queryHandler = (query) => {
    this.refs.table.fetch(query);
    this.setState({query})
  }
  render() {
    
    /**模块管理操作列表 */
    const actions = (text, record) => {
      return (
          <a onClick={
            actionHandler.bind(
              null, this.props.router, `${IMPLEMENT_BASE_URL}setting`, {...record, title: `实施${IMPLEMENT_TITLES.setting}`}
            )}>
            {`${IMPLEMENT_TITLES.setting}`}
          </a>
  
      )
    };
      //列
  const columns = [
      {
          title: '操作',
          dataIndex: 'actions',
          render: actions,
          width: '10%'
      },
      {
          title: '机构名称',
          dataIndex: 'ORG_NAME',
          width: '20%'
      },
      {
          title: '状态',
          dataIndex: 'FSTATE',
          width: '10%',
          render: (text, record, index) => {
            if (text === '01') {
              return '启用';
            } else {
              return '禁用';
            }
          }
      },
      {
          title: 'VIP',
          dataIndex: 'VIP_LEVEL',
          width: '10%'
      },
      {
          title: '简称',
          dataIndex: 'ORG_ALIAS',
          width: '10%'
      },
      {
          title: '联系人',
          dataIndex: 'LXR',
          width: '10%'
      },
      {
          title: '联系方式',
          dataIndex: 'LXDH',
          width: '10%'
      }
  ];
  const query = this.state.query;
    return (
      <div>
        { this.props.children 
          || 
          <div>
            <Search
              placeholder="请输入机构名称/简称/简码"
              style={{ width: 200 }}
               onSearch={value =>  {this.queryHandler({'searchName':value})}}
            />
            <FetchTable 
              query={query}
              ref='table'
              columns={columns}
              url={pathConfig.MYHOSIPITALDETAILS_URL}
              rowKey='ORG_ID'
            />
          </div>   
        }  
      </div>
    )  
  }

}
module.exports = Implement;

