/**
 * @file 我的产品--详情--单位变更
 */
import React from 'react';
import { Form } from 'antd';
import FetchTable from 'component/FetchTable';
import { purchase } from 'api';
import SearchForm from './searchForm';
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
class UnitChange extends React.Component{
    state = {
        query:{
            tenderMaterialGuid: this.props.data.tenderMaterialGuid
        }
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query: query })
    };
    render(){
        const columns = [{
            title:'采购单位(前)',
            dataIndex:'oldValue'
        },{
            title: '单位换算(前)',
            dataIndex:'pConversionOld'
        },{
            title:'采购单位(后)',
            dataIndex:'newValue'
        },{
            title: '单位换算(后)',
            dataIndex:'pConversionNew'
        },{
            title:'操作员',
            dataIndex:'createUserName'
        },{
            title:'操作时间',
            dataIndex:'createTime'
        }]
        return (
        <div>
            {
                this.props.children
                ||
                <div>
                    <SearchBox query={(query)=>this.queryHandler(query)} data={this.props.data}/>
                    <FetchTable
                        ref='table'
                        columns={columns}
                        query={this.state.query}
                        rowKey={'tenderChangeGuid'}
                        url={purchase.FINDUNITCHANGELIST}
                        
                    />
                </div>
            }
        </div>
    )
    }
}
module.exports = UnitChange;