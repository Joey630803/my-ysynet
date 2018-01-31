import React from 'react';
import { Form } from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler } from 'utils/tools';
import SearchForm from './searchForm';
import { approve } from 'api';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

const APPROVAL_BASE_URL = '/approve/ApprovalMgt/',
      APPROVAL_TITLES = {
        checkUser: '审批人',
        edit: '编辑',
      };

class ApprovalMgt extends React.Component{
	state = {
        query :''
    };
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    };
    render(){
    	const columns = [
    		{
		 		title:'操作',
		 		dataIndex:'actions',
		 		width:100,
		 		fixed:'left',
		 		render:(text,record)=>{
		 			return (
		 				<span>
		              <a onClick={
		              actionHandler.bind(
		                  null, this.props.router, `${APPROVAL_BASE_URL}edit`, {...record, title: `${APPROVAL_TITLES.edit}`}
		              )}>
		              {`${APPROVAL_TITLES.edit}`}
		              </a>
		              <span className="ant-divider" />
		              <a onClick={
		              actionHandler.bind(
		                  null, this.props.router, `${APPROVAL_BASE_URL}checkUser`, {...record, title: `${APPROVAL_TITLES.checkUser}`}
		              )}>
		              {`${APPROVAL_TITLES.checkUser}`}
		              </a>
		            </span>)
		 			}
	    	},
	    	{
		      title: '状态',
		      dataIndex: 'fstate',
		      width: 60,
		      fixed:'left',
		      render :fstate =>{
		        if(fstate==="00"){
		          return "停用"
		        }
		        else if(fstate==="01"){
		          return "启用"
		        }
		      }
		   }, 
	    	{
	    		title:'名称',
	    		dataIndex:'approvalName',
	    	},
	    	{
	    		title:'编号',
	    		dataIndex:'approvalNo',
	    	},
	    	{
	    		title:'科室',
	    		dataIndex:'deptGuid',
	    		render: (text,record) => {
	    			return record.deptName
	    		}
	    	},
	    	{
	    		title:'库房',
	    		dataIndex:'storageGuid',
	    		width: 130,
	    		render: (text,record) => {
	    			return record.storageName
	    		}
	    	},
	    	{
	    		title:'单据类型',
	    		dataIndex:'type',
	    		render: (text,record) =>{
	    			return record.tfCloName
	    		}
	    	},
	    	{
	    		title:'单据审批状态',
	    		dataIndex:'lastFstate',
	    		render:(text,record)=> {
	    			return record.lastFstateName
	    		}
	    	},
	    	{
	    		title:'通过条件',
	    		dataIndex:'condition',
	    		render: condition =>{
	    				if(condition==='01'){
	    					return '个人';
	    				}
	    				else if(condition==='02'){
	    					return '全体';
	    				}
	    		}
	    	},
	    	{
	    		title:'审批人',
	    		dataIndex:'approvalUser',
	    	}]
	    	const query = this.state.query;
	    
	    return(
            <div>
                {this.props.children || 
                	<div>
		             		<SearchBox query={this.queryHandler}/>
						        <FetchTable 
			         			  query={query}
											ref='table'
											columns={columns}
											url={approve.APPROVE_LIST}
											scroll={{ x: '120%' }}
											size='small'
											rowKey={ record => record.RN }
				         		/>
          				</div>   
                }
            </div>
	        )
	}
}

module.exports = ApprovalMgt;