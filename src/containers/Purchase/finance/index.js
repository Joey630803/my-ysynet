/**
 * @file财务结账
 */

import React from 'react';
import { Form,Button} from 'antd';
import FetchTable from 'component/FetchTable';
import { purchase } from 'api';
import { actionHandler } from 'utils/tools';
import { hashHistory } from 'react-router';
import SearchForm from './SearchForm';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

class Finance extends React.Component{
    state = {
        query :'',
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }

    defaultQuery = (query) => {
        this.setState({
        query: query
        })
    }

    render(){
        const columns = [{
            title : '操作',
            dataIndex : 'action',
            width: 80,
            render : (text,record)=>{
                return <a onClick={
                        actionHandler.bind(
                            null, this.props.router,`/purchase/finance/show`, {...record}
                        )}>
                        详情
                    </a>
          
              
            }
        },{
            title : '会计月',
            dataIndex : 'acctYh',
            width: 180,
           
        },{
            title : '结账金额',
            dataIndex : 'money',
            width: 100,
        },{
            title : '结账操作员',
            dataIndex : 'acctUserName',
            width: 150,
        },{
            title : '结帐时间',
            dataIndex : 'acctDate',
            width: 150,
        }];
        const query =  this.state.query;
        console.log(query,'1')
        return(
            <div>
                {this.props.children || 
                <div>
                    <SearchBox query={this.queryHandler} defaultQuery={(query) => this.defaultQuery(query)}/>
                    <Button type="primary" onClick={()=>{
                          hashHistory.push({
                            pathname: '/purchase/finance/checkout'
                          })
                    } }>结账</Button>
                    {
                    this.state.query === '' ? null :
                    <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={purchase.SELECTINVOICEBYMONTH}
                        rowKey='invoiceId'
                        scroll={{ x: '100%' }}
                    />
                    }
                </div>
                }
            </div>
        )
    }
}
module.exports = Finance