/**
 * @file 科室产品
 */
import React from 'react';
import {Form} from 'antd';
import FetchTable from 'component/FetchTable';
import SearchForm from './searchForm';
import { department } from 'api'

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

class DeptMaterial extends React.Component{
    state = {
        query :''
    }

    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    render(){
        const columns = [{
            title : '库房名称',
            dataIndex : 'storageName',
            fixed: 'left',
            width: 130
        },{
            title : '通用名称',
            dataIndex : 'geName',
            fixed: 'left',
            width: 180
        },{
            title : '产品名称',
            dataIndex : 'materialName',
            fixed: 'left',
            width: 180
        },{
            title : '通用简码',
            dataIndex : 'geFqun'
        },{
            title : '证件号',
            dataIndex : 'registerNo'
        },{
            title : '条码',
            dataIndex : 'fbarcode'
        },{
            title : '品牌',
            dataIndex : 'tfBrandName'
        },{
            title : '生产商',
            dataIndex : 'produceName'
        },{
            title : '采购单位',
            dataIndex : 'purchaseUnit'
        },{
            title : '型号',
            dataIndex : 'fmodel'
        },{
            title : '规格',
            dataIndex : 'spec'
        }]
        const query = this.state.query;
        return(
            <div>
                {this.props.children || 
                    <div>
                    <SearchBox query={this.queryHandler}/>
                    <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={department.DEPTMATERIAL_LIST}
                        scroll={{ x: '150%' }}
                        rowKey='RN'
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = DeptMaterial;