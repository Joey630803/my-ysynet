/**
 * @file 科室管理
 */
import React from 'react';
import { Breadcrumb,Popconfirm,message,Form} from 'antd';
import { Link } from 'react-router';
import FetchTable from 'component/FetchTable';
import { actionHandler,fetchData } from 'utils/tools';
import querystring from 'querystring';
import { implement } from 'api'
import SearchForm from './searchForm';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
const DEPART_BASE_URL = '/implement/configMgt/approve/',
      DEPART_TITLES = {
        edit: '编辑',
        add: '添加',
      }

class ApproveList extends React.Component{
    state = {
        query :{
            orgId: this.props.location.state.ORG_ID ||this.props.location.state.orgId 
        },
    }

    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    deleteHandler = (query) => {
        const that =this;
        fetchData(implement.DELETEAPPROVAL, querystring.stringify({approvalGuid:query.approvalGuid}),(data)=>{
            if(data.status){
                that.refs.table.fetch();
                message.success('删除成功！')
            }
            else{
            message.error(data.msg);
            }
        })
    
    }
    render(){
        const columns = [{
            title : '操作',
            dataIndex: 'actions',
            width: '10%',
            render: (text, record) => {
                return (
                <span>
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router, `${DEPART_BASE_URL}edit`, {...record,orgId:this.props.location.state.ORG_ID || this.props.location.state.orgId}
                    )}>
                    {`${DEPART_TITLES.edit}`}
                    </a>
                    <span className="ant-divider" />
                    <Popconfirm title="是否确认删除此条记录?" onConfirm={this.deleteHandler.bind(null, record)} okText="是" cancelText="否">
                        <a>删除</a>
                    </Popconfirm>
                </span>
                )
            }
        },{
            title : '状态',
            dataIndex : 'fstate',
            width: 80,
            render:  text => {
                if(text === "00"){
                  return "停用"
                }else if(text === "01"){
                  return "启用"
                }
             }
        },{
            title : '名称',
            dataIndex : 'approvalName',
            width: 150,
        },{
            title : '编码',
            dataIndex : 'approvalNo',
            width: 100,
        },{
            title : '科室',
            width: 120,
            dataIndex : 'deptName'
        },{
            title : '库房',
            width: 120,
            dataIndex : 'storageName'
        },{
            title : '单据类型',
            width: 120,
            dataIndex : 'tfCloName'
        },{
            title : '单据审批状态',
            width: 120,
            dataIndex : 'lastFstateName'
        },{
            title : '通过条件',
            width: 120,
            dataIndex : 'condition',
            render (text ,record) {
              if (text === '01') {
                return '任一人';
              } else {
                return '所有人';
              }
            }
        },{
            title : '备注',
            width: 120,
            dataIndex : 'tfRemark'
        }]
        const query = this.state.query;
        return(
            <div>
                {this.props.children || 
                    <div>
                      <Breadcrumb style={{fontSize: '1.1em',marginBottom:16}}>
                        <Breadcrumb.Item><Link to='/implement/configMgt'>配置管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>审批列表</Breadcrumb.Item>
                      </Breadcrumb>
                      <SearchBox query={this.queryHandler} data={this.props.location.state}/>
                      <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={implement.CONFIG_APPROVELIST}
                        rowKey='approvalGuid'
                        scroll={{ x: '150%' }}
                      />
                    </div>
                }
            </div>
        )
    }
}
module.exports = ApproveList;