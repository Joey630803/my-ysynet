/**
 * @file 科室管理
 */
import React from 'react';
import { Row,Col,Button ,Form} from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler } from 'utils/tools';
import SearchForm from './searchForm';
import { department } from 'api'

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

const DEPART_BASE_URL = '/department/depart/',
      DEPART_TITLES = {
        choice: '用户',
        edit: '编辑',
        add: '添加',
        address:'地址'
      }

class DepartmentList extends React.Component{
    state = {
        query :''
    }

    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }

    render(){
        const columns = [{
            title : '操作',
            dataIndex: 'actions',
            width: '20%',
            render: (text, record) => {
                return (
                <span>
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router, `${DEPART_BASE_URL}edit`, {...record, title: `${DEPART_TITLES.edit}`}
                    )}>
                    {`${DEPART_TITLES.edit}`}
                    </a>
                    <span className="ant-divider" />
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router, `${DEPART_BASE_URL}choice`, {...record, title: `${DEPART_TITLES.choice}`}
                    )}>
                    {`${DEPART_TITLES.choice}`}
                    </a>
                     <span className="ant-divider" />
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router, `${DEPART_BASE_URL}address`, {...record, title: `${DEPART_TITLES.address}`}
                    )}>
                    {`${DEPART_TITLES.address}`}
                    </a>
                </span>
                )
            }
        },{
            title : '名称',
            dataIndex : 'deptName',
            width: '20%',
        },{
            title : '状态',
            dataIndex : 'fstate',
            width: '10%',
            render:  FSTATE => {
                 if(FSTATE === "00"){
                     return "停用"
                 }else if(FSTATE === "01"){
                     return "启用"
                 }
                
             }
        },{
            title : '编码',
            dataIndex : 'deptCode',
            width: '15%',
        },{
            title : '默认地址',
            width: '25%',
            dataIndex : 'defaultAddress'
        },{
            title : '备注',
            width: '10%',
            dataIndex : 'tfRemark'
        }]
        const query = this.state.query;
        return(
            <div>
                {this.props.children || 
                    <div>
                        <Row>
                        <Col span={10}>
                            <SearchBox query={this.queryHandler}/>
                        </Col>
                        <Col span={10} offset={4} style={{textAlign: 'right'}}>
                            <Button 
                            type="primary" 
                            style={{marginRight: '10px'}} 
                            onClick={actionHandler.bind(
                                null, this.props.router, `${DEPART_BASE_URL}add`, { title: `${DEPART_TITLES.add}`}
                            )}>
                            添加
                            </Button>
                        </Col> 
                        </Row>
                    <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={department.DEPT_LIST}
                        rowKey='deptGuid'
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = DepartmentList;