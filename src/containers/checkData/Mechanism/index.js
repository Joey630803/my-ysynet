import React from 'react';
import {Form } from 'antd';
import SearchForm from './searchForm';
import FetchTable from 'component/FetchTable';
import { actionHandler,pathConfig } from 'utils/tools';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);


const CHECK_BASE_URL = '/checkdata/mechanism/',
      CHECK_TITLES = {
        show: '详情'
      }
class CheckData extends React.Component {
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
      const url = record.ORG_TYPE === '01' ? `mshow` : `supshow`
      return (
          <a onClick={
            actionHandler.bind(
              null, this.props.router, `${CHECK_BASE_URL}` + url, {...record, title: `审核${CHECK_TITLES.show}`}
            )}>
            {`${CHECK_TITLES.show}`}
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
          title: '申请机构名称',
          dataIndex: 'ORG_NAME',
          width: '10%'
      },
      {
          title: '申请人名称',
          dataIndex: 'USER_NAME',
          width: '10%'
      },
      {
          title: '联系电话',
          dataIndex: 'MOBILE_PHONE',
          width: '10%'
      },
      {
          title: '申请时间',
          dataIndex: 'REGIST_TIME',
          width: '10%',
         // sorter: true
      },
      {
          title: '审核时间',
          dataIndex: 'AUDIT_TIME',
          width: '10%',
          //sorter: true
      },
      {
          title: '申请状态',
          dataIndex: 'AUDIT_FSTATE',
          width: '10%',
          render :AUDIT_FSTATE =>{
            if(AUDIT_FSTATE==="00"){
              return "待审核"
            }
            else if(AUDIT_FSTATE==="01"){
              return "审核通过"
            }
            else if(AUDIT_FSTATE==="02"){
              return "审核不通过"
            }
          }
      }
  ];
  const query = this.state.query;
    return (
      <div>
        { this.props.children 
          || 
          <div>
             <SearchBox query={this.queryHandler}/>
            <FetchTable 
              query={query}
              ref='table'
              columns={columns}
              url={pathConfig.CHECKLIST_URL}
              rowKey='RN'
            />
          </div>   
        }  
      </div>
    )  
  }

}
module.exports = CheckData;

