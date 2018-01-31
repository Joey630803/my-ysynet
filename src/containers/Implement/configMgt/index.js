import React from 'react';
import { Input } from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler } from 'utils/tools';
import { implement } from 'api';

//搜索
const Search = Input.Search;


const IMPLEMENT_BASE_URL = '/implement/configMgt/',
      IMPLEMENT_TITLES = {
        stroage: '库房',
        approve:'审批',
        depart: "科室"
      }
class ConfigMgt extends React.Component {
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
        <span>
          <a onClick={
          actionHandler.bind(
            null, this.props.router, `${IMPLEMENT_BASE_URL}storage`, {...record}
          )}>
          {`${IMPLEMENT_TITLES.stroage}`}
          </a> 
          <span className="ant-divider" />
          <a onClick={
          actionHandler.bind(
            null, this.props.router, `${IMPLEMENT_BASE_URL}depart`, {...record}
          )}>
          {`${IMPLEMENT_TITLES.depart}`}
          </a> 
          <span className="ant-divider" />
          <a onClick={
          actionHandler.bind(
            null, this.props.router, `${IMPLEMENT_BASE_URL}approve`, {...record}
          )}>
          {`${IMPLEMENT_TITLES.approve}`}
          </a> 
        </span>
  
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
          title: '简称',
          dataIndex: 'ORG_ALIAS',
          width: '10%'
      },
      {
          title: '省市区',
          dataIndex: 'TF_PROVINCE',
          width: '10%',
          render: (text,record,index) => {
              return  text+record.TF_CITY+ record.TF_DISTRICT;
          }
      },
      {
          title: '备注',
          dataIndex: 'TF_REMARK',
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
              placeholder="请输入机构名称"
              style={{ width: 200 }}
               onSearch={value =>  {this.queryHandler({'searchName':value})}}
            />
            <FetchTable 
              query={query}
              ref='table'
              columns={columns}
              url={implement.ORG_LIST}
              rowKey='ORG_ID'
            />
          </div>   
        }  
      </div>
    )  
  }

}
module.exports = ConfigMgt;

