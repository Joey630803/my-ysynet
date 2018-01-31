/**
 * @file 品规
 */
import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router';
import FetchTable from 'component/FetchTable';
import { productUrl } from '../../../api';

class ProductModel extends React.Component{

    render(){
        const columns = [{
            title : '名称',
            dataIndex : 'materialName'
        },{
            title : '型号',
            dataIndex : 'fmodel',
        },{
            title : '规格',
            dataIndex : 'spec'
        },{
            title : '最小单位',
            dataIndex : 'leastUnit'
        },{
            title : '条码',
            dataIndex : 'fbarcode'
        },{
            title : 'REF',
            dataIndex : 'ref'
        }]
        return(
            <div>
                {this.props.children || 
                  <div>
                    <Breadcrumb style={{fontSize: '1.1em',marginBottom:'8px'}}>
                        <Breadcrumb.Item><Link to='/checkdata/productMgt'>产品审核</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={{pathname:'/checkdata/productMgt/pcshow',state:{registGuid:this.props.location.state.registGuid}}}>变更产品审核</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>品规</Breadcrumb.Item>
                    </Breadcrumb>
                    <FetchTable 
                        query={{'registGuid' : this.props.location.state.registGuid}}
                        ref='table'
                        columns={columns}
                        url={productUrl.CHANGEMODELLIST}
                        rowKey='fitemid'
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = ProductModel;