/**
 * @file 科室管理
 */
import React from 'react';
import { Row,Col,Button ,Input,Breadcrumb,Popconfirm,message} from 'antd';
import { Link } from 'react-router';
import FetchTable from 'component/FetchTable';
import querystring from 'querystring';
import { actionHandler,fetchData } from 'utils/tools';
import { implement } from 'api'
//搜索
const Search = Input.Search;
const DEPART_BASE_URL = '/implement/configMgt/depart/',
      DEPART_TITLES = {
        edit: '编辑',
        add: '添加',
      }

class DepartmentList extends React.Component{
    state = {
         query :{
            orgId: this.props.location.state.ORG_ID
        },
    }

    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    deleteHandler = (query) => {
        const that =this;
        fetchData(implement.DELETE_CONFIG_DEPART, querystring.stringify({deptGuid:query.deptGuid}), data => {
          if (data.status) {
            that.refs.table.fetch();
            message.success('删除成功！')
          } else {
            message.error(data.message || '操作失败')
          }
        })
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
                    <Popconfirm title="是否确认删除此条记录?" onConfirm={this.deleteHandler.bind(null, record)} okText="是" cancelText="否">
                    <a>删除</a>
                    </Popconfirm>
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
            render:  text => {
                 if(text === "00"){
                     return "停用"
                 }else if(text === "01"){
                     return "启用"
                 }
                
             }
        },{
            title : '编码',
            dataIndex : 'deptCode',
            width: '15%',
        },{
            title : '备注',
            width: '35%',
            dataIndex : 'tfRemark'
        }]
        const query = this.state.query;
        return(
            <div>
                {this.props.children || 
                    <div>
                        <Breadcrumb style={{fontSize: '1.1em',marginBottom:16}}>
                            <Breadcrumb.Item><Link to='/implement/configMgt'>配置管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>科室列表</Breadcrumb.Item>
                        </Breadcrumb>
                        <Row>
                        <Col span={10}>
                            <Search
                            placeholder="请输入库房名称/编号"
                            style={{ width: 200 }}
                            onSearch={value =>  {this.queryHandler({'searchName':value,orgId:this.props.location.state.ORG_ID || this.props.location.state.orgId})}}
                            />
                        </Col>
                        <Col span={10} offset={4} style={{textAlign: 'right'}}>
                            <Button 
                            type="primary" 
                            style={{marginRight: '10px'}} 
                            onClick={actionHandler.bind(
                                null, this.props.router, `${DEPART_BASE_URL}add`, {orgId:this.props.location.state.ORG_ID || this.props.location.state.orgId }
                            )}>
                            添加
                            </Button>
                        </Col> 
                        </Row>
                    <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={implement.CONFIG_DEPARTLIST}
                        rowKey='deptGuid'
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = DepartmentList;