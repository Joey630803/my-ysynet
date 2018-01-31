/**
 * 普耗计划单
 */
import React from 'react';
import { Form } from 'antd';
import SearchForm from './SearchForm';
import { actionHandler,CommonData } from 'utils/tools';
import FetchTable from 'component/FetchTable';
import { storage } from 'api';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

class ApplyMgt extends React.Component{
    state = {
        query :{},
        selected: [],
        selectedRows: [],
        billTypes: []
    }
    componentDidMount = () => {
        //单据类型
        CommonData('DEPT_BTYPE', (data) => {
            this.setState({billTypes:data})
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
            width:80,
            render : (text,record)=>{
                return <span>
                    
                   {
                       record.applyType === "APPLY" ? 
                       <a onClick={
                        actionHandler.bind(
                            null, this.props.router,`/storage/applyStorageMgt/showPh`, {...record}
                        )}>
                            详情
                        </a>
                        :
                        <a onClick={
                        actionHandler.bind(
                            null, this.props.router,`/storage/applyStorageMgt/showGz`, {...record}
                        )}>
                         详情
                        </a>
                   }
                </span>
            }

        },{
            title : '单据号',
            dataIndex : 'applyNo',
            width: 180,
           
        },{
            title : '单据类型',
            dataIndex : 'applyType',
            width: 120,
            render:(text,record)=>{
                return   this.state.billTypes.map((item,index) => {
                    if(text === item.TF_CLO_CODE){
                         return item.TF_CLO_NAME
                    }
                    return null;
                })
            }
        },{
            title : '单据状态',
            dataIndex : 'fstateName',
            width: 120,
            render : (text,record) =>{
                if(record.auditFlag === "01"){
                    return <span style={{color:"#e9002c"}}>{text + "(正在审核)"}</span>
                }else if(record.approvalFlag === "01"){
                    return <span style={{color:"#e9002c"}}>{text + "(正在审批)"}</span> 
                }else {
                    return text
                }
            }
        },{
            title : '申请科室',
            dataIndex : 'deptName',
            width: 150,
        },{
            title : '申请人',
            dataIndex : 'applyUsername',
            width: 120,
        },{
            title : '科室地址',
            dataIndex : 'tfAddress',
            width: 200
        },{
            title : '联系电话',
            dataIndex : 'lxdh',
            width: 100
        },{
            title : '库房',
            dataIndex : 'storageName',
            width: 140
        },{
            title : '操作员',
            dataIndex : 'qrr',
            width: 140
        },{
            title : '制单时间',
            dataIndex : 'applyTime',
            width:150,
        },{
            title : '驳回说明',
            dataIndex : 'applyReject'
        }];
        const query =  this.state.query;
        return(
            <div>
                {this.props.children || 
                <div>
                    <SearchBox query={this.queryHandler}/>
                    <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={storage.SEARCHAPPLYLIST}
                        rowKey='applyId'
                        scroll={{ x: '180%' }}
                    />
                </div>
                }
            </div>
        )
    }
}
module.exports = ApplyMgt