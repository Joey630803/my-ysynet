/**
 * @file 招标记录--招标详情
 */
import React from 'react';
import { Breadcrumb, Form, Row, Col, Button, Popconfirm, message} from 'antd';
import FetchTable from 'component/FetchTable';
import { Link, hashHistory } from 'react-router'; 
import { fetchData, actionHandler } from 'utils/tools';
import querystring from 'querystring';
import { tender } from 'api';
import SearchForm from './searchForm';

const SearchBox = Form.create()(SearchForm);
const actions = {
    details: (action) => <a onClick={action}>详情</a>,
    edit: (action) => <a onClick={action}>编辑</a>,
    delete: (action) => <Popconfirm title="是否确认删除?" onConfirm={action}>
                          <a>删除</a>
                        </Popconfirm>
  }
class TenderDetails extends React.Component{
    state = {
        query:{
            tenderGuid :this.props.location.state.tenderGuid
        },
        selected: [],
        selectedRows: []
    }
    queryHandle = (query)=>{
        this.refs.table.fetch(query);
        this.setState({ query: query });
    }
    getActions = (text,record)=>{
        if(text ==='00'){
            return <span>
                        {actions.details(this.details.bind(this,record))}
                        <span className="ant-divider" />
                        {actions.edit(this.edit.bind(this,record))}
                        <span className="ant-divider" />
                        {actions.delete(this.delete.bind(this,record))}
                    </span>
        }else{
            return <span>
                        {actions.details(this.details.bind(this,record))}
                    </span>
        }
    }
    redirect = (url, record) => {
        hashHistory.push({
          pathname: url,
          state: {
              ...record,
              rStorageGuid:this.props.location.state.rStorageGuid,
              releaseFlag:this.props.location.state.releaseFlag
          }
        })
    }
    details = (record)=>{
        this.redirect('/tender/tenderRecord/details',record);
    }
    edit = (record)=>{
        this.redirect('/tender/tenderRecord/detailsEdit',record);
    }
    //删除
    delete = (record)=>{
        fetchData(tender.DELETETENDERPRODUCT,querystring.stringify({tenderDetailGuid:record.tenderDetailGuid}),(data)=>{
            if(data.status){
                this.refs.table.fetch();
                message.success('删除成功！');
            }else{
                message.error(data.msg);
            }
        })
    }
    
    batchEdit = ()=>{
        const { selectedRows } = this.state;
        if(selectedRows.length === 0){
            return message.warn('请至少选择一条！')
        }
        else{
            hashHistory.push({
                pathname: '/tender/tenderRecord/batchEdit',
                state: {
                    dataSource: selectedRows,
                    tenderGuid:this.props.location.state.tenderGuid,
                    rStorageGuid:this.props.location.state.rStorageGuid,
                    releaseFlag:this.props.location.state.releaseFlag
                }
            });
        }
    }
    render(){
        console.log(this.props.location.state,'详情')
        const releaseFlag = this.props.location.state.releaseFlag;
        const columns = [{
            title: '操作',
            dataIndex: 'action',
            width: 130,
            fixed: 'left',
            render:(text,record)=>{
                return this.getActions(releaseFlag,record);
            }
        },{
            title: '产品名称',
            dataIndex: 'materialName'
        },{
            title: '型号',
            dataIndex: 'fModel'
        },{
            title: '规格',
            dataIndex: 'spec'
        },{
            title: '招标价格',
            dataIndex: 'tenderPrice'
        },{
            title: '招标单位',
            dataIndex: 'tenderUnit'
        },{
            title: '采购单位',
            dataIndex: 'purchaseUnit'
        },{
            title: '组件名称',
            dataIndex: 'suitName'
        },{
            title: '证件号',
            dataIndex: 'registerNo'
        },{
            title: '品牌',
            dataIndex: 'tfBrand'
        },{
            title: '生产商',
            dataIndex: 'produceName'
        }];
        return (
            <div>
                {
                    this.props.children
                    ||
                    <div>
                        <Row>
                            <Col>
                                <Breadcrumb style={{fontSize: '1.1em',marginBottom : 24}}>
                                    <Breadcrumb.Item><Link to={{pathname:'/tender/tenderRecord',}}>招标记录</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item>招标详情</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <SearchBox query={(query)=>this.queryHandle(query)} tenderGuid={this.props.location.state.tenderGuid}/>
                        {
                            this.props.location.state.releaseFlag==='00'
                            &&
                            <Row>
                                <Col>
                                    <Button type='primary' 
                                        onClick={actionHandler.bind(null, this.props.router, `/tender/tenderRecord/addProduct`, 
                                        { tenderGuid:this.props.location.state.tenderGuid,
                                            rStorageGuid:this.props.location.state.rStorageGuid,
                                            releaseFlag:this.props.location.state.releaseFlag
                                        })}>
                                        选产品
                                    </Button>
                                    <Button type='primary' style={{marginLeft:8}} onClick={this.batchEdit}>批量编辑</Button>
                                </Col>
                            </Row>
                        }
                        <FetchTable 
                            ref='table'
                            columns={columns}
                            query={this.state.query}
                            url={tender.TENDERDETAILLIST}
                            rowKey={'tenderDetailGuid'}
                            scroll={{x:'150%'}}
                            rowSelection={{
                                selectedRowKeys: this.state.selected,
                                onChange: (selectedRowKeys, selectedRows) => {
                                this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                                }
                            }}
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = TenderDetails;