/**
 * @file 操作记录
 */
import React from 'react';
import { Form } from 'antd';
import { actionHandler } from 'utils/tools';
import FetchTable from 'component/FetchTable';
import SearchForm from './searchForm';
import { record } from '../../../api'

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

const RECORD_BASE_URL = '/system/record/',
      RECORD_TITLES = {
        show: '详情'
      }

class RecordList extends React.Component{
    state = {
        query : ''
    }
    /**table根据条件查询 */
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    render() {
        const columns = [{
            title : '操作',
            dataIndex : 'action',
            render : (text,record) => {
                return (
                    <span>
                        <a  onClick={  actionHandler.bind(
                            null, this.props.router, `${RECORD_BASE_URL}show`, {...record, title: `${RECORD_TITLES.show}`}
                        )}>
                        详情
                        </a>
                    </span>
                )
            }

        },{
            title : '操作人',
            dataIndex : 'loginUsername' 
        },{
            title : '机构名称',
            dataIndex : 'orgName'
        },{
            title : '操作名称',
            dataIndex : 'operationName'
        },{
            title : '模块名称',
            dataIndex : 'moduleName'
        },{
            title : '操作结果',
            dataIndex : 'operationRes'
        },{
            title : '操作时间',
            dataIndex : 'operationDate'
        }];
     const query = this.state.query;
     return (
         <div>
             {
                 this.props.children ||         
              <div>
                <SearchBox query={this.queryHandler}/>
                <FetchTable 
                    query={query}
                    ref='table'
                    columns={columns}
                    url={record.RECORD_LIST}
                    rowKey='operationGuid'
                    />
              </div>
             }
         </div>
     )
    }
}
module.exports = RecordList;