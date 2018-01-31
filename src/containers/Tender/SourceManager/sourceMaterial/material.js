/**
 * @file 供应管理产品
 */
import React from 'react';
import { Breadcrumb,Row,Col,Button ,Form,message,Modal} from 'antd';
import { Link,hashHistory } from 'react-router';
import FetchTable from 'component/FetchTable';
import { actionHandler } from 'utils/tools';
import SearchForm from './searchForm';
import { fetchData} from 'utils/tools';
import { tender } from 'api';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
//路径
const MATERIAL_BASE_URL = '/tender/sourceManager/sourceMaterial/material/',
      MATERIAL_TITLES = {
        edit: '编辑',
        allChange: '全部变更',
        change:'变更',
        release:'发布',
        delete:'移除',
        choice:'选入产品'
      }
class sourceMaterial extends React.Component{
    state = {
        //query :this.props.location.search === "" ? {} :  this.props.location.query,
        query:{
            sourceGuid : this.props.location.state.sourceGuid
        },
        sourceGuid:this.props.location.state.sourceGuid,
        selected: [],
        selectedRows: [],
        visible: false ,
        storageData:[]
    }
  
    queryHandler = (query) => {
        query.sourceGuid = this.props.location.state.sourceGuid
        this.refs.table.fetch(query);
        this.setState({ query })
    }
   
    //发布
    handleRelease = () => {
        if (this.state.selected.length === 0) {
            return message.warning('至少选择一项!');
        }
        const values =this.state.selected;
        const postData =[];
         for (let key in values) {
          if(values.hasOwnProperty(key)){
               postData.push({"tenderDetailGuid":values[key]})
          }
        }
        console.log(postData,"发布数据")
        fetchData(tender.POSTTENDERMATERIAL,JSON.stringify({ids:postData}),(data)=>{
            if(data.status){
                this.refs.table.fetch();
                message.success('发布成功！')
            }else{
                message.error(data.msg)
            }
        },"application/json")
           
    }
    //变更
    handleChange = () => {
        if (this.state.selected.length === 0) {
            return message.warning('至少选择一项!');
        }
        hashHistory.push({
            pathname: '/tender/sourceManager/sourceMaterial/material/change',
            query: {sourceGuid: this.state.sourceGuid},
            state: this.state.selectedRows,
        })
    }
     //全部变更
    handleAllChange = (router, url, state) => {
        hashHistory.push({
            pathname: '/tender/sourceManager/sourceMaterial/material/change',
            query: {sourceGuid: this.state.sourceGuid},
            state: this.state.query
        })
    }

    showModal = () => {
        this.setState({
        visible: true,
        });
    }
    hideModal = () => {
        this.setState({
        visible: false,
        });
    }
    handerDelete = () => {
        const values =this.state.selected;
        const postData =[];
        for (let key in values) {
            if(values.hasOwnProperty(key)){
                postData.push({"tenderDetailGuid":values[key]})
            }
        }
        console.log(postData,"移除数据")
        fetchData(tender.DELETE_TENDER,JSON.stringify({ids:postData}),(data)=>{
            if(data.status){
                this.refs.table.fetch();
                message.success('删除成功！')
            }else{
                message.error(data.msg)
            }
            this.setState({
                visible: false,
            });
        },"application/json")
       
    }
    //删除
    deleteOnClick = () => {
        if(this.state.selected.length > 0){
           this.showModal();
        }
        else {
            message.warning('请选中需要删除的数据!');
        }
    }
    render(){
        const columns = [{
            title : '操作',
            dataIndex: 'actions',
            width: 120,
            render: (text, record) => {
                return (
                <span>
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router, `${MATERIAL_BASE_URL}edit`, {...record, title: `${MATERIAL_TITLES.edit}`}
                    )}>
                    {`${MATERIAL_TITLES.edit}`}
                    </a>
                    <span className="ant-divider" />
                     <a onClick={
                    actionHandler.bind(
                        null, this.props.router, `/tender/priceRecord`, {...record}
                    )}>
                    {`记录`}
                    </a>
                </span>
                )
        }},{
            title : '状态',
            dataIndex : 'fstate',
            width: 60,
            render:  fstate => {
                 if(fstate === "00"){
                     return "停用"
                 }else if(fstate === "01"){
                     return "启用"
                 }
                
             }
        },{
            title : '通用名称',
            dataIndex : 'geName',
            width: 200,
        },{
            title : '产品名称',
            dataIndex : 'materialName',
            width: 150,
        },{
            title : '证件号',
            dataIndex : 'registerNo',
            width: 240
        },{
            title : '型号',
            dataIndex : 'fmodel',
            width: 80
        },{
            title : '规格',
            dataIndex : 'spec',
            width: 140
        },{
            title : '招标价',
            dataIndex : 'tenderPrice',
            width: 80
        },{
            title : '招标单位',
            dataIndex : 'tenderUnit',
            width:150,
        },{
            title : '品牌',
            dataIndex : 'tfBrand'
        },{
            title : '生产商',
            dataIndex : 'produceName'
        }];
       
        let query =  this.state.query;

        return(
            <div>
                {this.props.children || 
                     <div>
                    <Breadcrumb style={{fontSize: '1.1em'}}>
                    <Breadcrumb.Item><Link to='/tender/sourceManager'>供应管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>产品</Breadcrumb.Item>
                    </Breadcrumb>    
                    <SearchBox query={this.queryHandler} />
                         <Row>
                            <Col span={24}>
                                <Button 
                                    type="primary" 
                                    style={{marginRight:'8px'}}
                                    onClick={actionHandler.bind(
                                        null, this.props.router, `${MATERIAL_BASE_URL}choice`,{...this.props.location.state}
                                    )}
                                >{`${MATERIAL_TITLES.choice}`}</Button>
                                <Button 
                                    type="primary" ghost
                                    style={{marginRight:'8px'}}
                                    onClick={this.handleRelease}
                                >{`${MATERIAL_TITLES.release}`}</Button>
                                <Button 
                                    type="primary" ghost
                                    style={{marginRight:'8px'}}
                                    onClick={this.handleChange}
                                >{`${MATERIAL_TITLES.change}`}</Button>
                                <Button 
                                    type="primary" ghost
                                    style={{marginRight:'8px'}}
                                    onClick={this.handleAllChange}
                                >{`${MATERIAL_TITLES.allChange}`}</Button>
                                <Button 
                                    type="danger" ghost
                                    onClick={this.deleteOnClick}
                                >{`${MATERIAL_TITLES.delete}`}</Button>
                            </Col>
                        </Row>
                        <FetchTable 
                            query={query}
                            ref='table'
                            columns={columns}
                            url={tender.TENDER_LIST}
                            rowKey='tenderDetailGuid'
                            scroll={{ x: '180%' }}
                            rowSelection={{
                                selectedRowKeys: this.state.selected,
                                onChange: (selectedRowKeys, selectedRows) => 
                                this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                            }}
                        />
                        <Modal
                        title="提示"
                        visible={this.state.visible}
                        onOk={this.handerDelete}
                        onCancel={this.hideModal}
                        okText="确认"
                        cancelText="取消"
                        >
                        <p>是否确认删除选中的产品?</p>
                        </Modal>
                        </div>
                        }
                 
                </div>
           
          
        )
    }
}
module.exports = sourceMaterial;