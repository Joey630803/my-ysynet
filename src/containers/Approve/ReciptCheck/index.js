/**
 * @file 单据审批
 */
import React from 'react';
import { Form } from 'antd';
import { actionHandler } from 'utils/tools';
import FetchTable from 'component/FetchTable';
import SearchForm from './searchForm';
import { approve } from 'api'

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
const CHECK_BASE_URL = '/approve/ReciptCheck/',
      CHECK_TITLES = {
        show: '详情'
      }
class Reciptcheck extends React.Component{
	state = {
		query : ''
	}
	  /**table根据条件查询 */
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
   render(){
   	 const columns = [{
			   	 	title:'操作',
			   	 	dataIndex:'actions',
			   	 	fixed: 'left',
			   	 	width: 80,
			   	 	render : (text,record)=>{
			   	 		return (
			   	 			record.type === 'OPER_APPLY' || record.type === 'OPER_PLAN' ? 
				   	 			<span>
                                    <a  onClick={  actionHandler.bind(
                                        null, this.props.router, `${CHECK_BASE_URL}operShow`, {...record, title: `${CHECK_TITLES.show}`}
                                    )}>
                                    详情
                                    </a>
				        	    </span>
			          		    :
				   	 		    <span>
                                    <a  onClick={  actionHandler.bind(
                                        null, this.props.router, `${CHECK_BASE_URL}show`, {...record, title: `${CHECK_TITLES.show}`}
                                    )}>
                                    详情
                                    </a>
				                </span> 
			   	 			)
			   	 		 }
		   	 },{
				title:'状态',
				dataIndex:'approvalFstate',
				width: 100,
				fixed:'left',
				render: approvalFstate =>{
					if(approvalFstate==='00'){
						return '待审批'
					}else if(approvalFstate==='01'){
						return '已通过'
					}else if(approvalFstate==='02'){
						return '未通过'
					}
				}
		   	 },{
				title:'单号',
				dataIndex:'approvalRecordNo'
		   	 },{
				title:'金额',
				dataIndex:'totalPrice',
				render : (text, record)=>{
					return text === 'undefined' ? '0.00' : text.toFixed(2)
				} 
		   	 },{
				title:'科室',
				dataIndex:'deptName',
		   	 },{
				title:'库房',
				dataIndex:'storageName',
		   	 },{
				title:'单据类型',
				dataIndex:'tfCloName',
		   	 },{
				title:'发起人',
				dataIndex:'createUsername'
		   	 },{
				title:'发送时间',
				dataIndex:'createTime'
		   	 },{
				title:'审批时间',
				dataIndex:'approvalTime'
		   	 },{
				title:'备注',
				dataIndex:'tfRemark'
		   	 }];
		 const query = this.state.query;
		 return (<div>
				 	{this.props.children||
				 			<div>
					 		 <SearchBox query={this.queryHandler}/>
					 		 <FetchTable
					 		 	query={query}
								ref='table'
								columns={columns}
								size='small'
								url={approve.APPROVE_RECORDACTIONS}
								rowKey={'RN'}
								scroll={{ x: '130%' }}
					 		 />
				 			</div>	
				 	}
				 </div>)
		 		
   		}
}

module.exports = Reciptcheck
