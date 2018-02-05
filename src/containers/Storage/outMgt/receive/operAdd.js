/**
 * @file 添加产品/高值添加
 */

import React from 'react';
import { Form , Row, Col, Button, Icon, message} from 'antd';
import FetchTable from 'component/FetchTable';
import { hashHistory} from 'react-router';
import { storage } from 'api';
import SearchForm from './searchForm';
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
class AddProduct extends React.Component{
   state = {
       dataSource : [],
       selected: [],
       selectedRows: [],
       totalSelectedRow: [],
       selectedGuids: [],//勾选项 tenderMaterialGuid
       query: {
           storageGuid: this.props.location.state.values.storageGuid,
           excludeTenderMaterialGuids: this.props.location.state.excludeTenderDetailGuids,
       }
     }
   queryHandler = (query) => {
       query.excludeTenderMaterialGuids = this.state.query.excludeTenderMaterialGuids;
       query.storageGuid = this.state.query.storageGuid;
       this.refs.table.fetch(query);
       this.setState({ query });
   }
   //关闭返回上一页面
    close = () =>{
        let dataSource = this.props.location.state.dataSource, totalData = [];
        if(this.state.totalSelectedRow.length > 0){
            totalData = dataSource.concat(this.state.totalSelectedRow);
        }else{
            totalData = dataSource;
        }
        hashHistory.push({
            pathname: '/storage/outMgt/operReceive',
            state:{
                ...this.props.location.state,
                dataSource : totalData,
            }
        });
    }
    //添加结束
    addFinish = ()=>{
        const { selectedRows }  = this.state;
        if(selectedRows.length === 0 && this.state.totalSelectedRow.length === 0){
            return message.warn('请至少勾选一项！');
        }
        else{
            let dataSource = [], totalData = [];
            if(this.props.location.state.dataSource.length > 0){
                dataSource = this.props.location.state.dataSource;
                if(this.state.totalSelectedRow.length){
                    let totalSelectedRow = this.state.totalSelectedRow;
                    totalData =  dataSource.concat(totalSelectedRow,selectedRows);
                }else{
                    selectedRows.map((item,index)=>{
                        dataSource.push(item);
                        return null;    
                    });
                    totalData = dataSource;
                }
            }else{
                if(this.state.totalSelectedRow.length){
                    totalData = this.state.totalSelectedRow;
                }else{
                    totalData = selectedRows;
                }
            }
            
            this.setState({ dataSource : totalData });
            hashHistory.push({
                pathname: '/storage/outMgt/operReceive',
                state:{
                    ...this.props.location.state,
                    dataSource : totalData
                }
            })
        }
        
    }
    //添加并继续
    addContinue = ()=>{
        const { selectedRows }  = this.state;
        if(selectedRows.length === 0){
            return message.warn('请至少勾选一项！');
        }else{
            let totalSelectedRow = [];
            if(this.state.totalSelectedRow.length){
                totalSelectedRow = this.state.totalSelectedRow;
            }
            let guids = this.props.location.state.excludeTenderDetailGuids;
            let selectedGuids = this.state.selectedGuids;
            selectedRows.map((item,index)=>{
                selectedGuids.push(item.tenderMaterialGuid);
                totalSelectedRow.push(item);
                return null;
            });
            let query = this.state.query;
            query.excludeTenderMaterialGuids = selectedGuids.concat(guids);
            this.refs.table.fetch(query);
            this.setState({ totalSelectedRow ,selectedRows: [], selected: [],selectedGuids: selectedGuids.concat(guids), query});
        }
        
    }
   render(){
       const columns = [{
            title: '产品名称',
            dataIndex: 'materialName'
       },{
            title: '通用名称',
            dataIndex: 'geName'
        },{
           title: '型号',
           dataIndex: 'fmodel'
       },{
           title: '规格',
           dataIndex: 'spec'
       },{
           title: '采购单位',
           dataIndex: 'purchaseUnit'
       },{
           title: '采购价格',
           dataIndex: 'purchasePrice',
           render:( text,record )=>{
                return text === 'undefined'|| text===null ? '0.0000':text.toFixed(4);
           }
       },{
           title: '供应商',
           dataIndex: 'fOrgName'
       },{
           title: '生产商',
           dataIndex: 'produceName'
       }];
        return (
            <div>
                {
                    this.props.children ||
                    <div>
                        <Row style={{marginBottom:24}}>
                            <Col span={12}><h2>添加产品</h2></Col>
                            <Col span={12} style={{textAlign:'right'}}>
                                <a style={{ marginRight: 16, fontSize: 24 }} onClick={this.close}>
                                    <Icon type="close" />
                                </a>
                            </Col>
                        </Row>
                        <SearchBox query={(query)=>this.queryHandler(query)} state={this.props.location.state} cb={(data)=>{this.setState({ dataSource : data})}}/>
                        <Row>
                            <Col style={{textAlign:'right'}}>
                                <Button type='primary' onClick={this.addContinue}>添加并继续</Button>
                                <Button type='primary' style={{marginLeft:16,marginRight:16}} onClick={this.addFinish}>添加结束</Button>
                            </Col>
                        </Row>
                        <FetchTable 
                           query={this.state.query}
                           style={{marginTop:24}}
                           columns={columns}
                           ref='table'
                           rowKey={'RN'}
                           url={storage.QUERYMATERIALLISTBYSTORAGEID}
                           scroll={{ x: '150%' }}
                           rowSelection={{
                               selectedRowKeys: this.state.selected,
                               onChange: (selectedRowKeys, selectedRows) => {
                               this.setState({selected: selectedRowKeys, selectedRows : selectedRows})
                               }
                           }}
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = AddProduct;
