/**
 * @file 运营库房管理
 */
import React from 'react';
import { Row,Col,Button,Form } from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler,CommonData } from 'utils/tools';
import SearchForm from './searchForm';
import { storage } from '../../../api';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

const STORAGE_BASE_URL = '/storage/storageMgt/',
      STORAGE_TITLES = {
        edit: '编辑',
        add: '添加'
      }

class StorageList extends React.Component{
    state = {
        query :'',
        storageTypes: [],
        productSource: []
    }

    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    componentDidMount = () => {
        //库房类型
        CommonData('STORAGE_FTYPE_CODE', (data) => {
        this.setState({storageTypes:data})
        })
        //货物来源
        CommonData('STORAGE_SOURCE_TPYE_OPERATION', (data) => {
        this.setState({productSource:data})
        })
    }
 
    render(){
        const { storageTypes ,productSource} = this.state;
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
                </span>
                )
            }
        },{
            title : '所属机构',
            dataIndex : 'orgName',
            sorter:true
        },{
            title : '库房名称',
            dataIndex : 'storageName',
            sorter:true
        },{
            title : '库房类型',
            dataIndex : 'storageFtypeCode',
            sorter:true,
            render : storageFtypeCode => {
                return  storageTypes.map((item,index) => {
                    if(storageFtypeCode === item.TF_CLO_CODE){
                         return item.TF_CLO_NAME
                    }
                    return null;
                })
            }
        },{
            title : '货物来源',
            dataIndex : 'storageSourceTpye',
            sorter:true,
            render : storageSourceTpye => {
                return  productSource.map((item,index) => {
                    if(storageSourceTpye === item.TF_CLO_CODE){
                         return item.TF_CLO_NAME
                    }
                    return null;
                })
            }
        }];
        const query = this.state.query;
        return(
            <div>
                { this.props.children || 
                  <div>
                    <Row>
                        <Col span={18}>
                            <SearchBox query={this.queryHandler}/>
                        </Col>
                        <Col span={4} offset={2} style={{textAlign: 'right'}}>
                            <Button 
                            type="primary" 
                            style={{marginRight: '10px'}} 
                            onClick={actionHandler.bind(
                                null, this.props.router, `${STORAGE_BASE_URL}add`, { title: `${STORAGE_TITLES.add}`}
                            )}>
                            添加
                            </Button>
                        </Col> 
                    </Row>
                    <FetchTable 
                        query={query}
                        ref='table'
                        columns={columns}
                        url={storage.STORAGE_LIST}
                        rowKey='storageGuid'
                    />
                    </div>
                  }
            </div>
            
        )
    }
}
module.exports = StorageList ;