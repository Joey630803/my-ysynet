/**
 * @file 客户中心库房管理
 */
import React from 'react';
import { Row,Col,Input } from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler } from 'utils/tools';
import { storage } from 'api';
const Search = Input.Search;
const STORAGE_BASE_URL = '/storage/customerStorage/',
      STORAGE_TITLES = {
        edit: '编辑',
        add: '添加',
        user:'工作人员',
        depart:'供应科室',
        address:'库房地址'
      }

class CustomerStorageList extends React.Component{
    state = {
        query :'',
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
   
    render(){
        const columns = [{
            title : '操作',
            dataIndex: 'actions',
            width: '25%',
            render: (text, record) => {
                return (
                <span>
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router, `${STORAGE_BASE_URL}edit`, {...record, title: `${STORAGE_TITLES.edit}`}
                    )}>
                    {`${STORAGE_TITLES.edit}`}
                    </a>
                    <span className="ant-divider" />
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router, `${STORAGE_BASE_URL}choice`, {...record, title: `${STORAGE_TITLES.user}`}
                    )}>
                    {`${STORAGE_TITLES.user}`}
                    </a>
                    <span className="ant-divider" />
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router, `${STORAGE_BASE_URL}depart`, {...record, title: `${STORAGE_TITLES.depart}`}
                    )}>
                    {`${STORAGE_TITLES.depart}`}
                    </a>
                     <span className="ant-divider" />
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router, `${STORAGE_BASE_URL}address`, {...record, title: `${STORAGE_TITLES.address}`}
                    )}>
                    {`${STORAGE_TITLES.address}`}
                    </a>
                </span>
                )
            }
        },{
            title : '名称',
            dataIndex : 'storageName',
            width: '20%',
            sorter:true
        },{
            title : '编号',
            dataIndex : 'storageCode',
            width:'15%',
            sorter:true
        },{
            title : '状态',
            dataIndex : 'fstate',
            width: '10%',
            sorter:true,
            render: text =>{
                if(text==="01"){
                    return '启用'
                }else if(text==="00"){
                    return "停用"
                }
            }
        },{
            title : '默认地址',
            width: '15%',
            sorter:true,
            dataIndex : 'defaultAddress'
        },{
            title : '备注',
            width: '15%',
            sorter:true,
            dataIndex : 'tfRemark'
        }];
        const query = this.state.query;
        return(
            <div>
                {this.props.children || 
                    <div>
                        <Row>
                            <Col span={10}>
                                <Search
                                placeholder="请输入库房名称"
                                style={{ width: 200 }}
                                onSearch={value =>  {this.queryHandler({'searchName':value})}}
                                />
                            </Col>
                        </Row>
                        <FetchTable 
                            query={query}
                            ref='table'
                            columns={columns}
                            url={storage.CUSTOMERSTORAGE_LIST}
                            rowKey='storageGuid'
                        />
                    </div>
                 }
                
            </div>
        )
    }
}

module.exports = CustomerStorageList;