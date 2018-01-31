/**
 * @file 产品记录
 */
import React from 'react';
import { Breadcrumb} from 'antd';
import { Link } from 'react-router';
import FetchTable from 'component/FetchTable';

import { productUrl } from '../../../api';

class ProductChange extends React.Component{
    state = {
        query :{'fitemid':this.props.location.state.fitemid},
    }

    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    render(){
        const columns = [{
            title : '证件号',
            dataIndex : 'registerNo'
        },{
            title : '产品名称',
            dataIndex : 'materialName'
        },{
            title : '变更人',
            dataIndex : 'createUsername'
        },{
            title : '变更时间',
            dataIndex : 'createTime'
        }]
        const query = this.state.query;
        return(
            <div>
                {this.props.children || 
                    <div>
                        <Breadcrumb style={{fontSize: '1.1em',marginBottom:'8px'}}>
                            <Breadcrumb.Item><Link to='/basicData/product'>产品管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>变更记录</Breadcrumb.Item>
                        </Breadcrumb>
                        <FetchTable 
                            query={query}
                            ref='table'
                            columns={columns}
                            url={productUrl.SEARCHCHANGELIST_PRODUCT}
                            rowKey='certGuid'
                            pagination={false}
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = ProductChange;