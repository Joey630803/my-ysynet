/**
 * @file 申请列表
 */
import React from 'react';
import {Button ,Form,Popconfirm,message,Icon,Modal} from 'antd';
import querystring from 'querystring';
import FetchTable from 'component/FetchTable';
import { actionHandler,CommonData,fetchData } from 'utils/tools';
import { hashHistory } from 'react-router';  
import SearchForm from './searchForm';
import { department } from 'api'

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

const actions = {
  details: (action) => <a onClick={action}>查看</a>,
  edit: (action) => <a onClick={action}>编辑</a>,
  delete: (action) => <Popconfirm title="是否删除?" onConfirm={action}>
                        <a>删除</a>
                      </Popconfirm>,
  submit: (action) => <Popconfirm title="是否提交?" onConfirm={action}>
                        <a>提交</a>
                      </Popconfirm>,
  getOver: (action) => <Popconfirm title="是否提交?" onConfirm={action}>
                    <a>完结</a>
                    </Popconfirm>
}
class applyList extends React.Component{
    state = {
        query :{
            applyType: 'APPLY'
        },
        applyFstate: []
    }
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
       //用户所属科室
    componentDidMount = () => {
        //申请单状态
        CommonData('APPLY_FSTATE', (data) => {
            this.setState({applyFstate:data})
        })
    } 
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    redirect = (url, record) => {
        hashHistory.push({
        pathname: url,
        state: record
        })
    }
 
    edit = (record) => {
        this.redirect('/department/departApply/edit', record)
    }
    details = (record) => {
        this.redirect('/department/departApply/show', record)
    }
     //提交
    submit = (record) => {
        fetchData(department.UPDATEAPPLYFSTATE,querystring.stringify({applyId:record.applyId,oldFstate:record.fstate,fstate:"10"}),(data)=>{
            if(data.status){
                this.refs.table.fetch();
                message.success("操作成功")
            }else{
                this.handleError(data.msg);
            }
        });
    }
      //完结
      getOver = (record) => {
          fetchData(department.UPDATEAPPLYFSTATE,querystring.stringify({applyId:record.applyId,oldFstate:record.fstate,fstate:"60"}),(data)=>{
            if(data.status){
                this.refs.table.fetch();
                message.success("操作成功")
            }else{
                this.handleError(data.msg);
            }
          });
    }
    //删除
    delete = (record) => {
        fetchData(department.UPDATEAPPLYFSTATE,querystring.stringify({applyId:record.applyId,oldFstate:record.fstate,fstate:"92"}),(data)=>{
            if(data.status){
                this.refs.table.fetch();
                message.success("操作成功")
            }else{
                this.handleError(data.msg);
            }
        });
    }
    //根据状态显示操作项
    getActions = (text , record) => {
        switch (text) {
            case "00" : 
                return <span>
                      {actions.details(this.details.bind(this, record))}
                      {
            
                          record.auditFlag === "01" || record.approvalFlag === "01"  ? null
                          :
                          <span>
                          <span className="ant-divider" />
                            {actions.edit(this.edit.bind(this,record))}
                            <span className="ant-divider" />
                            {actions.submit(this.submit.bind(this,record))}
                            <span className="ant-divider" />
                            {actions.delete(this.delete.bind(this,record))}
                          </span>
                      }
                    </span>
            case "20" :
                return <span>
                       {actions.details(this.details.bind(this, record))}
                       </span>
            case "40" :
                 return <span>
                        {actions.details(this.details.bind(this, record))}
                        </span>
            case "34" :
                return <span>
                        {actions.details(this.details.bind(this, record))}
                        <span className="ant-divider" />
                        {actions.edit(this.edit.bind(this,record))}
                        <span className="ant-divider" />
                        {actions.getOver(this.getOver.bind(this,record))}
                        </span> 
             case "60" :
             return <span>
                    {actions.details(this.details.bind(this, record))}
                    </span>
            default:
                break;

        }
    }

    render(){
        const columns = [{
            title : '操作',
            dataIndex: 'actions',
            width: 160,
            fixed: 'left',
            render: (text, record) => {
                 return this.getActions(record.fstate, record);
            }
        },{
            title : '状态',
            dataIndex : 'fstateName',
            fixed: 'left',
            width : 120,
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
            title : '申请单号',
            width: 180,
            fixed: 'left',
            dataIndex : 'applyNo',
        },{
            title : '申请单总金额',
            width: 150,
            dataIndex : 'totalPrice'
        },{
            title : '申请科室',
            dataIndex : 'deptName'
        },{
            title : '收货地址',
            width: 250,
            dataIndex : 'tfAddress'
        },{
            title : '备货库房',
            dataIndex : 'storageName'
        },{
            title : '申请人',
            width: 150,
            fixed: 'right',
            dataIndex : 'applyUsername'
        },{
            title : '申请时间',
            width: 150,
            fixed: 'right',
            dataIndex : 'applyTime'
        }];
        const query = this.state.query;
        const exportHref = department.EXPORTAPPLYLIST+"?"+querystring.stringify(this.state.query);
        return(
            <div>
                {this.props.children || 
                    <div>
                     <SearchBox query={this.queryHandler}/>
                    <div>
                        <Button 
                        type="primary" 
                        style={{marginRight:16}} 
                        onClick={actionHandler.bind(
                            null, this.props.router, `/department/departApply/add`, { title: `创建申请`}
                        )}
                        >
                        创建申请
                        </Button>  
                         <a  href={exportHref}><Icon type="export" />导出Excel</a> 
                         
                    </div>
                    <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={department.SEARCHAPPLYLIST}
                        rowKey='applyId'
                        scroll={{ x: '140%' }}
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = applyList;

