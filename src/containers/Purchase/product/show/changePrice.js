/**
 * @file 我的产品--详情--调价记录
 */
import React from 'react';
import { Form } from 'antd';
import FetchTable from 'component/FetchTable';
import { purchase } from 'api';
import SearchForm from './searchForm';
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
class ChangePrice extends React.Component{
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
            title:'调价(前)',
            dataIndex:'oldPurchasePrice',
            render : (text, record)=>{
                return text === 'undefined' ? '0.00' : Number(text).toFixed(2)
              }
        },{
            title:'调价(后)',
            dataIndex:'newPurchasePrice',
            render : (text, record)=>{
                return text === 'undefined' ? '0.00' : Number(text).toFixed(2)
              }
        },{
            title:'供应商',
            dataIndex:'fOrgName'
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
                    <SearchBox 
                        data={this.props.data}
                        query={(query)=>this.queryHandler(query)}
                    />
                    <FetchTable
                        ref='table'
                        columns={columns}
                        rowKey={'tenderChangeGuid'}
                        query={this.state.query}
                        url={purchase.FINDPURCHASEPRICELIST}
                    />
                </div>
            }
        </div>
    )
    }
}
module.exports = ChangePrice;