
/**
 * @file 我的产品--详情--供货记录
 */
import React from 'react';
import { Form } from 'antd';
import FetchTable from 'component/FetchTable';
import { purchase } from 'api';
import SearchForm from './searchForm';
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
class SupplyRecord extends React.Component{
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
            title:'供应商',
            dataIndex:'fOrgName'
        },{
            title:'采购份额',
            dataIndex:'purcharseRatio',
            render:(text,record)=>{
                return text ==='undefined' ? '0':(text*100+'%')
            }
        },
        {
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
                        rowKey={'RN'}
                        url={purchase.FINDSUPPLYLIST}
                        query={this.state.query}
                    />
                </div>
            }
        </div>
    )
    }
}
module.exports = SupplyRecord;