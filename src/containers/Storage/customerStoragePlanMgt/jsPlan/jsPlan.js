/**
 * 结算计划单
 */
import React from 'react';
import { Form,Button,Modal,message } from 'antd';
import phSearchForm from './phSearchForm';
import { actionHandler,fetchData } from 'utils/tools';
import FetchTable from 'component/FetchTable';
import { storage } from 'api';
import querystring from 'querystring';


/** 挂载查询表单 */
const SearchBoxPh = Form.create()(phSearchForm);

class JsPlanMgt extends React.Component{
    state = {
        query :{},
        selected: [],
        selectedRows: [],
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    //完结 重新提交
    handleUpdateFstate = (record,fstate)=>{
        let values = {};
        const planIds = [];
        planIds.push(record.planId);
        values.planIds = planIds;
        values.fstate = fstate;
        console.log(values,"状态数据的提交")
        fetchData(storage.UPDATEPLANFSTATE,querystring.stringify(values),(data)=>{
            if(data.status){
                this.refs.table.fetch();
                message.success("操作成功!")
            }else{
                this.handleError(data.msg)
            }
       
        })
    }
 
    render(){
        const columns = [{
            title : '操作',
            dataIndex : 'action',
            width:200,
            render : (text,record)=>{
                return <span>
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router,`/storage/customerStoragePlanMgt/jsPlan/showJsPlan`, {...record}
                    )}>
                   详情
                </a>
                {
                    record.fstate ==="34"||record.fstate ==="00" ?
                   <span>
                   <span className="ant-divider" />
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router,`/storage/customerStoragePlanMgt/jsPlan/editJsPlan`, {...record}
                    )}>编辑</a>
                   </span>
                   :null
                }
                {
                    record.fstate ==="34"?
                   <span>
                  
                    <span className="ant-divider" />
                    <a onClick={this.handleUpdateFstate.bind(this,record,"60")}>完结</a>
                    <span className="ant-divider" />
                    <a onClick={this.handleUpdateFstate.bind(this,record,"20")}>重新提交</a>
                   </span>
                    :null
                }
                </span>
            }
        },{
            title : '单据号',
            dataIndex : 'planNo',
            width: 180,
           
        },{
            title : '单据状态',
            dataIndex : 'fstateName',
            width: 100,
        },{
            title : '金额',
            dataIndex : 'totalPrice',
            width: 150,
        },{
            title : '库房',
            dataIndex : 'storageName',
            width: 150,
        },{
            title : '操作员',
            dataIndex : 'planUsername',
            width: 120,
        },{
            title : '制单时间',
            dataIndex : 'planTime',
            width: 140
        },{
            title : '驳回原因',
            dataIndex : 'planReject',
            width:150,
        },{
            title : '备注',
            dataIndex : 'tfRemark',
            width:150,
        }];
        const query =  this.state.query;
        return(
            <div>
                {this.props.children || 
                <div>
                    <SearchBoxPh query={this.queryHandler}/>
                    <div>
                    <Button 
                    type="primary" 
                    style={{marginRight: '10px'}} 
                    onClick={  actionHandler.bind(
                        null, this.props.router, `/storage/customerStoragePlanMgt/jsPlan/addJsPlan`, { }
                    )}>
                    添加
                    </Button>
                    </div>
                    <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={storage.SERACHPLANLISTJS}
                        rowKey='planId'
                        scroll={{ x: '120%' }}
                        rowSelection={{
                            selectedRowKeys: this.state.selected,
                            onChange: (selectedRowKeys, selectedRows) => 
                            this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                        }}
                    />
                </div>
                }
            </div>
        )
    }
}
module.exports = JsPlanMgt