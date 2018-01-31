/**
 * @file 选入库房产品
 */
import React from 'react';
import { Row,Col,Button ,Form,Breadcrumb,message, Modal} from 'antd';
import { Link ,hashHistory} from 'react-router';
import FetchTable from 'component/FetchTable';
import querystring from 'querystring';
import {fetchData} from 'utils/tools';
import SearchForm from './choiceSearchForm';
import { storage } from 'api';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
//路径
const MATERIAL_TITLES = {
        choice:'选入'
      };
class StorageMaterial extends React.Component{
    state = {
        query :{'storageGuid':this.props.location.state.storageGuid},
        selectedRowKeys:[]
    }
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }

    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
     onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    onClick = () => {
        const storageGuid = this.props.location.state.storageGuid;
        const tenderMaterialGuids = this.state.selectedRowKeys;
         fetchData(storage.CUSTOMERSTORAGESAVEMATERIAL,querystring.stringify({storageGuid:storageGuid,tenderMaterialGuids:tenderMaterialGuids}),(data)=>{
            if(data.status){
                hashHistory.push({pathname:'/storage/customerStorageMaterial',query:{storageGuid:storageGuid}});
                message.success('选入产品成功');
            }
            else{
                this.handleError(data.msg);
            }
         })
 
    }
    render(){
        const columns = [{
            title : '通用名称',
            dataIndex : 'geName',
        },{
            title : '产品名称',
            dataIndex : 'materialName'
        },{
            title : '通用简码',
            dataIndex : 'geFqun'
        },{
            title : '条码',
            dataIndex : 'fbarcode'
        },{
            title : '品牌',
            dataIndex : 'tfBrandName'
        },{
            title : '生产商',
            dataIndex : 'produceName'
        }]
        const query = this.state.query;
        const rowSelection = {
            onChange: this.onSelectChange,
        };
        return(
            <div>
                {this.props.children || 
                    <div>
                        <Breadcrumb style={{fontSize: '1.1em',marginBottom:'8px'}}>
                            <Breadcrumb.Item><Link  to={{pathname:'/storage/customerStorageMaterial',query:{storageGuid:this.state.query.storageGuid}}}>库房产品</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>选入产品</Breadcrumb.Item>
                        </Breadcrumb>
                        <SearchBox query={this.queryHandler} storageGuid={this.props.location.state.storageGuid}/>
                        <Row>
                            <Col span={24}>
                                <Button 
                                    type="primary" 
                                    style={{marginRight:'8px'}}
                                    onClick={this.onClick}
                                >{`${MATERIAL_TITLES.choice}`}</Button>
                            </Col>
                        </Row>
                        <FetchTable 
                            query={query}
                            ref='table'
                            columns={columns}
                            url={storage.CUSTOMERSTORAGEUNMATERIAL_LIST}
                            rowKey='tenderMaterialGuid'
                            rowSelection={rowSelection}
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = StorageMaterial;