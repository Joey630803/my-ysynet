/**
 * 手术计划单
 */
import React from 'react';
import { Form ,message, Modal} from 'antd';
import phSearchForm from './phSearchForm';
import { actionHandler,fetchData } from 'utils/tools';
import FetchTable from 'component/FetchTable';
import { storage } from 'api';
import querystring from 'querystring';

/** 挂载查询表单 */
const SearchBoxPh = Form.create()(phSearchForm);

class ShsPlanMgt extends React.Component{
    state = {
        query :{},
    }
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    handleUpdateFstate = (record,fstate)=>{
        const values = {};
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
                this.handleError(data.msg);
            }
       
        })
    }
 
    render(){
        const columns = [{
            title : '操作',
            dataIndex : 'action',
            width: 200,
            render : (text,record)=>{
                return <span>
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router,`/storage/customerStoragePlanMgt/shsPlan/showShsPlan`, {...record}
                    )}>
                   详情
                </a>
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
            width: 150,
           
        },{
            title : '单据来源',
            dataIndex : 'fsource',
            width: 120,
            render : text => {
                return text === "01" ? "申购":"补货"
            }
        },{
            title : '单据状态',
            dataIndex : 'fstateName',
            width: 150,
            render : (text,record) =>{
                if(record.approvalFlag === "01"){
                    return <span style={{color:"#e9002c"}}>{text + "(正在审批)"}</span> 
                }else {
                    return text
                }
            }
        },{
            title : '库房',
            dataIndex : 'storageName',
            width: 150,
        },{
            title : '收货科室',
            dataIndex : 'deptName',
            width: 120,
        },{
            title : '收货地址',
            dataIndex : 'tfAddress',
            width: 200
        },{
            title : '联系人',
            dataIndex : 'lxr',
            width: 100
        },{
            title : '制单时间',
            dataIndex : 'planTime',
            width: 140
        },{
            title : '申请单号',
            dataIndex : 'applyNo',
            width: 160
        },{
            title : '驳回原因',
            dataIndex : 'planReject',
            width:150,
        },{
            title : '备注',
            dataIndex : 'tfRemark'
        }];
        const query =  this.state.query;
        return(
            <div>
                {this.props.children || 
                <div>
                    <SearchBoxPh query={this.queryHandler}/>
               
                    <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={storage.FINDSURGERY}
                        rowKey='planId'
                        scroll={{ x: '180%' }}
                    />
                </div>
                }
            </div>
        )
    }
}
module.exports = ShsPlanMgt