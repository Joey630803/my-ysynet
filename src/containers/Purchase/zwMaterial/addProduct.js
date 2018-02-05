/**
 * @file 选入库房产品
 */
import React from 'react';
import { Row,Col,Button ,Form,Breadcrumb,message, Modal} from 'antd';
import { Link ,hashHistory} from 'react-router';
import FetchTable from 'component/FetchTable';
import { fetchData } from 'utils/tools';
import SearchForm from './choiceSearchForm';
import { purchase } from 'api';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

class StorageMaterial extends React.Component{
    state = {
        query :{
            type:'01'
        },
        selectedRowKeys:[],
        selectedRows:[]
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
     onSelectChange = (selectedRowKeys,selectedRows) => {
        this.setState({selectedRowKeys: selectedRowKeys, selectedRows: selectedRows})
    }
    onClick = () => {
        const storageGuid = this.props.location.state.storageGuid;
        const tenderMaterials  = [];
        if(this.state.selectedRows.length===0){
            return message.info("请选择添加产品!")
        }
        this.state.selectedRows.map((item,index) => {
         return   tenderMaterials.push({fitemid:item.fitemId,certGuid:item.certGuid,rStorageGuid:storageGuid});
        })
         fetchData(purchase.INSERTMATERIAL,JSON.stringify({tenderMaterials:tenderMaterials}),(data)=>{
            if(data.status){
                hashHistory.push({pathname:'/purchase/zwMaterial',query:{storageGuid:storageGuid}});
                message.success('选入产品成功');
            }
            else{
                this.handleError(data.msg);
            }
        },'application/json')
 
    }
    render(){
        const columns = [{
          title : '产品类型',
          dataIndex : 'type',
          width:100,
          render:(text,record) =>{
            if(text === "00"){
              return "医疗器械"
            }else if(text === "01"){
              return "其他耗材"
            }
          }
        },{
            title : '产品名称',
            dataIndex : 'materialName'
        },{
          title : '规格',
          dataIndex : 'spec',
        },{
          title : '型号',
          dataIndex : 'fmodel',
        },{
            title : '最小单位',
            dataIndex : 'leastUnit',
            width:100,
        },{
            title : '证件号',
            dataIndex : 'registerNo'
        },{
            title : '品牌',
            dataIndex : 'tfBrand'
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
                            <Breadcrumb.Item><Link  to={{pathname:'/purchase/zwMaterial',query:{storageGuid:this.state.query.storageGuid}}}>总务物资</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>选入产品</Breadcrumb.Item>
                        </Breadcrumb>
                        <SearchBox query={this.queryHandler} storageGuid={this.props.location.state.storageGuid}/>
                        <Row>
                            <Col span={24}>
                                <Button 
                                    type="primary" 
                                    style={{marginRight:'8px'}}
                                    onClick={this.onClick}
                                >添加</Button>
                            </Col>
                        </Row>
                        <FetchTable 
                            query={query}
                            ref='table'
                            columns={columns}
                            url={purchase.SELECTMATERIALPAGE}
                            rowKey='fitemid'
                            scroll={{ x: '140%' }}
                            rowSelection={rowSelection}
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = StorageMaterial;