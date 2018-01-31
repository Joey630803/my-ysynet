/**
 * 变更证件
 */
import React from 'react';
import { Form,Tooltip} from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler } from 'utils/tools';
import { purchase } from 'api';
import SearchForm from './SearchForm';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

class ChangeCert extends React.Component{
    state = {
        query: {}
    }

    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    };

    render(){
        const columns = [{
			title:'操作',
            dataIndex:'actions',
            width: 60,
            render:(text,record) => {
                return (
                    <span>
                        <a onClick={actionHandler.bind(null,this.props.router,`/purchase/changeCert/product`,{...record})}>
                            产品
                        </a>
                        <span className="ant-divider" />
                        <a onClick={actionHandler.bind(null,this.props.router,`/purchase/changeCert/classify`,{...record})}>
                            分类
                        </a>
                    </span>
                )
            }
		},{
			title:'证件号',
            dataIndex:'registerNo',
            width: 200,
		},{
			title:'产品名称',
            dataIndex:'materialName',
            width: 220,
		},{
			title:'品牌',
            dataIndex:'tfBrandName',
            width: 100,
		},{
			title:'生产商',
            dataIndex:'produceName',
            width: 220,
		},{
			title:'有效期',
            dataIndex:'validTime',
            width: 150,
        },{
            title:'物资分类',
            width:150,
            dataIndex:'typeIdName',
            render: (text) => {
               return text === null ? "" :
               <Tooltip placement="topLeft" title={text}>
               <div style={{whiteSpace:"nowrap",width:"150px",textOverflow:"ellipsis",overflow:"hidden"}}>{text}</div>
               </Tooltip>
            }
        }];
        const query = this.state.query;
        return (
            <div>
            {
            this.props.children || 
                <div>
                    <SearchBox query={(query)=>this.queryHandler(query)}/>
                    <FetchTable 
                        style={{marginTop:10}}
                        columns={columns}
                        query={query}
                        ref='table'
                        url={purchase.FINDREGISTER}
                        rowKey={'tenderStorageGuid'}
                        scroll={{ x: '150%' }}
                    />
                </div>
            }
            </div>
        )
    }
}

module.exports = ChangeCert