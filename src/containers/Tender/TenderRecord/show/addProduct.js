/**
 * @file 招标记录--招标详情--添加产品
 */
import React from 'react';
import { Form, Row, Col, Breadcrumb, Button, message, Modal} from 'antd';
import { Link } from 'react-router';
import FetchTable from 'component/FetchTable';
import { fetchData } from 'utils/tools';
import { tender } from 'api';
import SearchForm from './addSearchform';
const confirm = Modal.confirm;
const SearchBox = Form.create()(SearchForm);
class AddProduct extends React.Component{
    state = {
        selected: [],
        selectedRows: [],
        chosed: [],
        query:{},
        url:null,
        rStorageGuid:this.props.location.state.rStorageGuid
    }
    queryHandle = (query)=>{
        console.log(query,'query');
        this.refs.table.fetch(query);
        this.setState({query:query,url:tender.SELECTMATERIALS });
    }
    //添加
    add = (e)=>{
        console.log(e ,'target')
        const { selectedRows } = this.state;
        if(selectedRows.length === 0){
            return message.warn('请至少选择一条！')
        }else{
            this.addProduct(selectedRows);
        }
    }
    //全部添加
    addAll = ()=>{
         if(this.refs.table.state.data.length === 0){
            return message.warn('暂无产品，无法添加！');
        }else{
            this.addProduct(this.refs.table.state.data);
        }
    }
    sendData = (record,rStorageGuid)=>{
        const tenderGuid = this.props.location.state.tenderGuid;
        let result = [],chosed = [];
        record.map((item,index)=>{
            chosed.push(item.fitemId);
            return result.push({
                materialName:item.materialName,
                tenderGuid:tenderGuid,
                rStorageGuid:rStorageGuid,
                fitemId:item.fitemId,
                suitName:item.suitName,
                certGuid:item.certGuid,
                registerNo:item.registerNo,
                tfBrand:item.tfBrand,
                produceName:item.produceName,
                fmodel:item.fmodel,
                spec:item.spec,
                leastUnit:item.leastUnit
            })
        });
        this.setState({ chosed:chosed })
        fetchData(tender.ADDMATERIALLIST,JSON.stringify({materialList:result}),(data)=>{
            if(data.status){
                message.success('添加成功！',5);
            }else{
                message.error(data.msg);
            }
        },'application/json')
    }

    addProduct = (record)=>{
        const { rStorageGuid } = this.state;
        let materialListDto = {},materialList = [];
        record.map((item,index)=>{
            return materialList.push({
                rStorageGuid:rStorageGuid,
                fitemId:item.fitemId
            })
        });
        materialListDto.materialList = materialList;
        
        //验证是否添加过相同产品
         fetchData(tender.CHECKMATERIALLIST,JSON.stringify(materialListDto),(data)=>{
            if(data.result.checkState){
                this.sendData(record,rStorageGuid);
            }else{
                //判断是否继续添加
                const that = this;
                confirm({
                    title: '提示',
                    content: '库房已招标过相同产品，是否继续添加 ?',
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                        console.log('ok');
                        that.sendData(record,rStorageGuid);
                    },
                    onCancel() {
                        console.log('not Ok')
                    }
                })
            }
        },'application/json') 
    }
    render(){
        const columns = [{
            title: '产品名称',
            dataIndex:'materialName',
        },{
            title: '组件名称',
            dataIndex:'suitName',
        },{
            title: '型号',
            dataIndex:'fmodel',
        },{
            title: '规格',
            dataIndex:'spec',
        },{
            title: '最小单位',
            dataIndex:'leastUnit',
        },{
            title: '证件号',
            dataIndex:'registerNo',
        },{
            title: '品牌',
            dataIndex:'tfBrand',
        },{
            title: '生产商',
            dataIndex:'produceName',
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
                                    <Breadcrumb.Item>
                                        <Link to={{pathname:'/tender/tenderRecord/show',
                                            state:{
                                                tenderGuid:this.props.location.state.tenderGuid,
                                                rStorageGuid:this.props.location.state.rStorageGuid,
                                                releaseFlag:this.props.location.state.releaseFlag
                                                }}}>
                                            招标详情
                                        </Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>添加</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <SearchBox 
                            query={(query)=>this.queryHandle(query)}
                            rStorageGuid={this.props.location.state.rStorageGuid}
                        />
                        <Row>
                            <Col>
                                <Button type='primary' onClick={this.add}>添加</Button>
                                <Button type='primary' style={{marginLeft:8}} onClick={this.addAll}>全部添加</Button>
                            </Col>
                        </Row>
                        <FetchTable 
                            columns={columns}
                            rowKey={'guid'}
                            ref='table'
                            query={this.state.query}
                            url={this.state.url}
                            scroll={{x:'140%'}}
                            size={'small'}
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
module.exports = AddProduct;