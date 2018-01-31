/**
 * 盘点记录详情--待确认
 */
import React from 'react';
import {  Row, Col, Breadcrumb,Table,Collapse,Input ,Button,message  } from 'antd';
import { Link ,hashHistory} from 'react-router';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { storage } from 'api';  

const Search = Input.Search;

const Panel = Collapse.Panel;
class InventoryMgtShow extends React.Component{
    state = {
        dataSource:[],
        loading: false,
        page: 1
    }
    componentDidMount = () => {
     //根据盘点Id查询产品列表
        fetchData(storage.GETSTOCKTAKINGDETAILLIST,querystring.stringify({kcpdId:this.props.location.state.kcpdId}),(data=>{
            this.setState({dataSource: data.result})
        }));
    }
    total = () => {
        let total = 0;
        this.state.dataSource.map( (item, index) => {
          let amount = typeof item.amount === 'undefined' ? 1 : item.amount
          return total += amount * item.purchasePrice;
        })
        return total.toFixed(2);
    }
    handleChange = (record, index,e) => {
        const value = e.target.value;
        if (/^\d+$/.test(value)) {
            let { dataSource,page } = this.state;
            page >1 ?
            dataSource[ index+ ((page-1) * 10) ].sjsl = value
            : 
            dataSource[index].sjsl = value;
            this.setState({dataSource : dataSource})
        }else {
            return message.warn('请输入非0正整数')
        }
    }
    handleRecovery = () =>{
        this.setState({ loading: true });
        this.setState({dataSource: []})
        //根据盘点Id查询产品列表
        fetchData(storage.GETSTOCKTAKINGDETAILLIST,querystring.stringify({kcpdId:this.props.location.state.kcpdId}),(data=>{
            this.setState({loading: false,dataSource: data.result})
            
        }));
    }
    save = () => {
        let postData = {};
        const dataSource = this.state.dataSource;
        postData.kcpdId = this.props.location.state.kcpdId;
        const  pdDetailList = [];
        dataSource.map((item,index)=>{
            return pdDetailList.push({kcpdDetailGuid : item.kcpdDetailGuid,sjsl:item.sjsl});
         })
         postData.pdDetailList = pdDetailList;
        fetchData(storage.SAVEKCPD,JSON.stringify(postData),(data) => {
            if(data.status){
                message.success("操作成功!");
                hashHistory.push('/storage/inventoryMgt');
            }
            else{
                message.error(data.msg);
            }
        },'application/json')
    }
    handleOk = () => {
        let postData = {};
        const dataSource = this.state.dataSource;
        postData.kcpdId = this.props.location.state.kcpdId;
        const  pdDetailList = [];
        dataSource.map((item,index)=>{
            return pdDetailList.push({kcpdDetailGuid : item.kcpdDetailGuid,sjsl:item.sjsl});
         })
        postData.pdDetailList = pdDetailList;
        fetchData(storage.CONFIRMKCPD,JSON.stringify(postData),(data) => {
            if(data.status){
                message.success("操作成功!");
                hashHistory.push('/storage/inventoryMgt');
            }
            else{
                message.error(data.msg);
            }
        },'application/json')
    }
    //搜索
    handleSearch = (value) =>{
        //根据盘点Id查询产品列表
        fetchData(storage.GETSTOCKTAKINGDETAILLIST,querystring.stringify({kcpdId:this.props.location.state.kcpdId,searchName:value}),(data=>{
            this.setState({dataSource: data.result})
        }));
    }
    render(){
        const columns = [{
            title: '通用名称',
            dataIndex: 'geName',
            }, {
            title: '产品名称',
            dataIndex: 'materialName',
            }, {
            title: '规格',
            dataIndex: 'spec',
            }, {
            title: '型号',
            dataIndex: 'fmodel',
            }, {
            title: '采购单位',
            dataIndex: 'purchaseUnit',
            }, {
            title: '采购价格',
            dataIndex: 'purchasePrice',
            },{
            title: '实际数量',
            dataIndex: 'sjsl',
            width: 100,
            render: (text, record, index) => {
                return <Input
                        defaultValue={text || 0}
                        min={1} onInput={this.handleChange.bind(this, record, index)}/>
                }
            }, {
            title: '实际金额',
            dataIndex: 'actualPrice',
            }, {
            title: '账面数量',
            dataIndex: 'zmsl',
            }, {
            title: '账面金额',
            dataIndex: 'paperPrice',
            }, {
            title: '盈亏数量',
            dataIndex: 'yksl',
            render: (text,record,index)=>{
                return Number(record.sjsl) - Number(record.zmsl)
            }
            }, {
                title: '盈亏金额',
                dataIndex: 'ykPrice',
                render: (text,record,index)=>{
                    return (Number(record.sjsl) - Number(record.zmsl)) * record.purchasePrice
                }
            }, {
            title: '供应商',
            dataIndex: 'fOrgName',
            }, {
            title: '生产商',
            dataIndex: 'productName',
            }
        ];
        const baseData = this.props.location.state;
        return (
            <div>
            { this.props.children || 
                <div>
                     <Row>
                        <Col className="ant-col-6">
                            <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                <Breadcrumb.Item><Link to={{pathname:'/storage/inventoryMgt'}}>盘点管理</Link></Breadcrumb.Item>
                                <Breadcrumb.Item>详情</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
        
                    </Row>
                    <Collapse defaultActiveKey={['1','2']}>
                        <Panel header="单据信息" key="1">
                            <Row>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>盘点单号</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                            {baseData.kcpdNo}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>状态</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                            {baseData.fstateName}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>库房</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                            {baseData.rStorageName}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>盘点周期</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                            {baseData.kcpdDate}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>操作员</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                            {baseData.createUserName}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            
                                <Col className="ant-col-6">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>制单时间</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                            {baseData.createTime}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Panel>
                        <Panel header="产品信息" key="2">
                        <Row style={{marginBottom:8}}>
                            <Col span={12}>
                            <Search
                                placeholder="请输入产品名称/通用名称/供应商"
                                style={{ width: 300 }}
                                onSearch={this.handleSearch}
                            />
                            </Col>
                            <Col span={12} style={{textAlign:'right'}}>
                                <Button type="default" onClick={this.save}>保存</Button>
                                <Button type="default" onClick={this.handleRecovery}  style={{marginLeft:10,marginRight:10}}>恢复</Button>
                                <Button type="primary" onClick={this.handleOk}>确认</Button>
                            </Col>
                        </Row>
                        <Table 
                        columns={columns} 
                        dataSource={this.state.dataSource} 
                        pagination={{
                            onChange: (page, pageSize)=>{
                                this.setState({ page });
                            }
                        }}
                        size="small"
                        loading={this.state.loading}
                        rowKey='kcpdDetailGuid'
                        scroll={{ x: '150%' }}
                        />
                        </Panel>
                    </Collapse>
                </div>
            }
            </div>
        )
    }
}
module.exports = InventoryMgtShow;