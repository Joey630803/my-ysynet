/**
 * 库存查询
 */ 
import React from 'react';
import {  Form } from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler,CommonData } from 'utils/tools';
import SearchForm from './SearchForm';
import { storage } from 'api';  
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

class StockQuery extends React.Component{
    state = {
        query:{

        },
        jsfsData: [],
        shfsData: [],
    }
    componentDidMount = () => {
        //计算方式
        CommonData('jsfs', (data) => {
            this.setState({jsfsData:data})
        })
         //送货方式
         CommonData('shfs', (data) => {
          this.setState({shfsData:data})
        })
        
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    render(){
        const columns = [{
            title : '操作',
            dataIndex : 'action',
            width: 80 ,
            render : (text,record)=>{
                return <span>
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router,`/storage/stockQuery/show`, {...record}
                    )}>
                   详情
                </a>
                </span>
            }

        },{
            title: '通用名称',
            dataIndex: 'geName',
            width: 150
        }, {
            title: '产品名称',
            dataIndex: 'materialName',
            width: 150
        }, {
            title: '规格',
            dataIndex: 'spec',
            width: 120
        }, {
            title: '型号',
            dataIndex: 'fmodel',
            width: 120
        }, {
            title: '采购单位',
            dataIndex: 'purchaseUnit',
            width: 80
        }, {
            title: '库存下限',
            dataIndex: 'lLimit',
            width: 75
        }, {
            title: '库存数量',
            dataIndex: 'amount',
            width: 75
        }, {
            title: '库存上限',
            dataIndex: 'uLimit',
            width: 75
        }, {
            title: '采购价格',
            dataIndex: 'purchasePrice',
            width: 75,
            render:(text,record)=>{
                return text === 'undefined'|| text===null ? '0.00':Number(text).toFixed(2);
            }
        }, {
            title: '金额',
            dataIndex: 'money',
            width: 80
        }, {
            title: '注册证号',
            dataIndex: 'registerNo',
            width: 150
        }, {
            title: '供应商',
            dataIndex: 'fOrgName',
            width: 150
        }, {
            title: '生产商',
            dataIndex: 'productName',
            width: 150,
        }, {
            title: '送货方式',
            dataIndex: 'shfs',
            width: 75,
            render: (text,record,index) =>{
                return this.state.shfsData.map((item,index)=>{
                    if(item.TF_CLO_CODE === text){
                        return item.TF_CLO_NAME
                    }
                    return null;
                })
            }
        }, {
            title: '结算方式',
            dataIndex: 'settleType',
            width: 75,
            render: (text,record,index) =>{
                return this.state.jsfsData.map((item,index)=>{
                    if(item.TF_CLO_CODE === text){
                        return item.TF_CLO_NAME
                    }
                    return null;
                })
            }
        }, {
            title: '一物一码',
            dataIndex: 'qrFlag',
            width: 75,
            render:(text,record,index) =>{
                if(text === "01"){
                    return "是"
                }else{
                    return "否"
                }
            }
          }];
          const query = this.state.query;
        return(
            <div>
                {this.props.children || 
                <div>
                    <SearchBox query={this.queryHandler} cb={(defaultValue)=>{this.setState({query:{storageGuid:defaultValue}})}}/>
                    {
                        query.storageGuid ?
                        <FetchTable 
                        query={query}
                        url={storage.LARGEWAREHOUSEQUERY}  
                        rowKey={'storageMaterialGuid'}
                        ref='table'
                        columns={columns} 
                        scroll={{ x: '250%' }}
                        />:
                        null
                    }
                </div>
                }
            </div>
        )
    }
}
module.exports = StockQuery;