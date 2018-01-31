/**
 * @file 产品管理详情
 */
import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router';
import FetchTable from 'component/FetchTable';
import { productUrl } from 'api';
import moment from 'moment';

class ProductDetails extends React.Component {
  state ={
    query: {fitemid: this.props.location.state.fitemid}
  }
render() {
        const columns = [{
            title:'证件号',
            dataIndex:'registerNo'
        },{
            title:'产品名称',
            dataIndex:'materialName'
        },{
            title:'产品类型',
            width: 80,
            dataIndex:'type',
            render :type =>{
                if(type==="00"){
                return "医疗器械"
                }
                else if(type==="01"){
                    return "办公耗材"
                }
            }
        },{
            title:'品牌',
            dataIndex:'tfBrandName'
        },{
            title:'生产商',
            dataIndex:'produceName'
        },{
            title:'有效期始',
            dataIndex:'firstTime',
            render : firstTime => {
                return firstTime === null ? "" :moment(firstTime).format('YYYY-MM-DD')
            }
        },{
            title:'有效期止',
            dataIndex:'lastTime',
            render : lastTime => {
                return lastTime === null ? "" :moment(lastTime).format('YYYY-MM-DD')
            }
        }];
   const query = this.state.query;
    return (
      
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/basicData/product'>产品管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>证件</Breadcrumb.Item>
        </Breadcrumb>
         <FetchTable 
          query={query}
          ref='table'
          columns={columns}
          url={productUrl.FINDCERTLISTBYFITEMID}
          rowKey='certGuid'
          />
      </div>
    )
  }
}

module.exports = ProductDetails;