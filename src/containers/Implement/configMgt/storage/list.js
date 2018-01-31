/**
 * @file 运营库房管理
 */
import React from 'react';
import { Row,Col,Button,Breadcrumb,Input ,Popconfirm,message} from 'antd';
import { Link } from 'react-router';
import FetchTable from 'component/FetchTable';
import querystring from 'querystring';
import { actionHandler,CommonData,fetchData } from 'utils/tools';
import { implement } from 'api'
//搜索
const Search = Input.Search;

const STORAGE_BASE_URL = '/implement/configMgt/storage/',
      STORAGE_TITLES = {
        edit: '编辑',
        add: '添加'
      }

class StorageList extends React.Component{
    state = {
        query :{
            orgId: this.props.location.state.ORG_ID
        },
        storageLevels: [],
    }

    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    componentDidMount = () => {
        //库房级别
        CommonData('STORAGE_LEVEL_CODE_OPERATION', (data) => {
        this.setState({storageLevels:data})
        })
    }

     deleteHandler = (query) => {
        const that =this;
        fetchData(implement.DELETE_CONFIG_STORAGE, querystring.stringify({storageGuid:query.storageGuid}),(data) => {
            if(data.status){
                that.refs.table.fetch();
                message.success('删除成功！')
            }else{
                message.error(data.msg)
            }
        })
       
    }
 
    render(){
        const { storageLevels } = this.state;
        const columns = [{
            title : '操作',
            dataIndex: 'actions',
            render: (text, record) => {
                return (
                <span>
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router, `${STORAGE_BASE_URL}edit`, {...record, title: `${STORAGE_TITLES.edit}`}
                    )}>
                    {`${STORAGE_TITLES.edit}`}
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
            render: text =>{
                if(text === "01"){
                    return "正常"
                }else{
                    return "停用"
                }
            }
        },{
            title : '编号',
            dataIndex : 'storageCode',
        },{
            title : '库房名称',
            dataIndex : 'storageName',
        },{
            title : '级别',
            dataIndex : 'storageLevelCode',
            render : text => {
                return  storageLevels.map((item,index) => {
                    if(text === item.TF_CLO_CODE){
                         return item.TF_CLO_NAME
                    }
                    return null;
                })
            }
        },{
            title : '上级',
            dataIndex : 'parentStorageName',
        },{
            title : '备注',
            dataIndex : 'tfRemark',
        }];
        const query = this.state.query;
        return(
            <div>
                { this.props.children || 
                  <div>
                    <Breadcrumb style={{fontSize: '1.1em',marginBottom:16}}>
                        <Breadcrumb.Item><Link to='/implement/configMgt'>配置管理</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>库房列表</Breadcrumb.Item>
                    </Breadcrumb>
                    <Row>
                        <Col span={18}>
                            <Search
                            placeholder="请输入库房名称/编号"
                            style={{ width: 200 }}
                            onSearch={value =>  {this.queryHandler({'searchName':value,orgId:this.props.location.state.ORG_ID|| this.props.location.state.orgId})}}
                            />
                        </Col>
                        <Col span={4} offset={2} style={{textAlign: 'right'}}>
                            <Button 
                            type="primary" 
                            style={{marginRight: '10px'}} 
                            onClick={actionHandler.bind(
                                null, this.props.router, `${STORAGE_BASE_URL}add`, {orgId:this.props.location.state.ORG_ID || this.props.location.state.orgId }
                            )}>
                            添加
                            </Button>
                        </Col> 
                    </Row>
                    <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={implement.CONFIG_STORAGELIST}
                        rowKey='storageGuid'
                    />
                    </div>
                  }
            </div>
            
        )
    }
}
module.exports = StorageList ;