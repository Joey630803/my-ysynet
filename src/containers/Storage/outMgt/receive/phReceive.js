/**
 * @file 出库记录/普耗等 领用
 */
import React from 'react';
import { Breadcrumb, Row, Col, Input, Button ,Steps, Collapse , Table ,message} from 'antd';
import { Link ,hashHistory } from 'react-router';
import { actionHandler, fetchData} from 'utils/tools';
import querystring from 'querystring';
import { storage } from 'api';
const Step = Steps.Step;
const Panel = Collapse.Panel;

class PhReceive extends React.Component{
    state = {
        dataSource : [],// 临时dataSorce
        addedDataSource: [],//正式数据(添加页面添加)
        selected: [],
        selectedRows : [],
        exceptGuid: []//排除产品列表Guid
    }
    componentDidMount = ()=>{
        if(this.props.location.state.dataSource){
            let exceptGuid = [];
            let dataSource = this.props.location.state.dataSource;
            dataSource.map((item,index)=>{
                exceptGuid.push(item.tenderMaterialGuid);
                item.receiveAmount = 1;
                return null;
            })
            this.setState({ dataSource: dataSource, exceptGuid, addedDataSource : dataSource });
        }else{
            this.setState({ dataSource: [], exceptGuid:this.state.exceptGuid, addedDataSource: [] });
        }
    }
    handleSearch = ()=>{
        this.search();
    }
    onPressEnter = (e)=>{
        e.preventDefault();
        this.search();
    }
    search = ()=>{
        const searchName = this.refs.searchName.refs.input.value ;
        if(searchName){
            const dataSource = this.state.dataSource;
            let searchData = [];
            dataSource.map((item,index)=>{
                if(searchName === item.materialName || searchName === item.geName || searchName === item.fOrgName ){
                    searchData.push(item);
                };
                return null;
            });
            this.setState({ dataSource: searchData });
        }else{
            this.setState({ dataSource: this.state.addedDataSource });
        }
        
    }
    //添加
    add = ()=>{
        hashHistory.push({
            pathname:'/storage/outMgt/phAdd',
            state:{
                ...this.props.location.state,
                dataSource :this.state.dataSource,
                excludeTenderDetailGuids : this.state.exceptGuid,
            }
        })
    }
    //删除
    delete = ()=>{
        const { selected , dataSource } = this.state;
        if (selected.length === 0) {
            return message.warn('请至少选择一条数据')
          }else{
            let result = [];
            dataSource.map( (item, index) => {
            const a = selected.find( (value, index, arr) => {
              return value === item.tenderMaterialGuid;
            })
            if (typeof a === 'undefined') {
                result.push(item)
            }
            return null;
          });
          if(result.length >0 ){
            let exceptGuid = [];
            result.map( (item,index) => {
              exceptGuid.push(item.tenderMaterialGuid);
              return null;
            });
            this.setState({ exceptGuid });
        }else{
            this.setState({ exceptGuid: [] });
          }
            this.setState({dataSource : result, addedDataSource : result});
          }
    }

    total = () => {
        let total = 0;
        this.state.dataSource.map( (item, index) => {
          let amount = typeof item.receiveAmount === 'undefined' ? 1 : item.receiveAmount
          return total += amount * item.purchasePrice;
        })
        return total.toFixed(2);
    }

    onChange = (record, index,e) => {
        const amount = e.target.value;
        if (/^\d+$/.test(amount)) {
            if( amount > record.xcsl){
                return message.warn('领用数量不得大于库存数量');
            } else{
                let { dataSource } = this.state;
                dataSource[index].receiveAmount = amount;
                this.setState({ dataSource : dataSource});
            }
        }else {
            return message.warn('请输入非0正整数')
        }
    }
    //确认，新建出库领用单
    confirm = ()=>{
        let dataSource = this.state.dataSource;
        let baseData = this.props.location.state;
        let postData = {}, materialList = [];
        postData.storageGuid = baseData.storageGuid;
        postData.deptGuid = baseData.deptGuid;
        postData.receiveUserName = baseData.receiveUserName;
        postData.deptAddress = baseData.addressName;
        postData.deptAddressGuid = baseData.deptAddressGuid;
        dataSource.map((item,index)=>{
            return materialList.push({
                tenderMaterialGuid : item.tenderMaterialGuid,
                amount : item.receiveAmount,
                geName : item.geName,
                fmodel : item.fmodel,
                spec : item.spec,
                purchaseUnit : item.purchaseUnit
            })
        });
        postData.materialList = materialList;
        console.log(postData,'postData');
        fetchData(storage.CREATEOUTPORT,JSON.stringify(postData),(data)=>{
            if(data.status){
                message.success('操作成功！');
                if(data.result.outId){
                    window.open(storage.PRINTOUTDETAIL+"?"+querystring.stringify({ outId: data.result.outId }));
                }
                hashHistory.push({
                    pathname:'/storage/outMgt',
                    query:{ activeKey : '1' }
                })
            }else{
                message.error(data.msg);
            }
        },'application/json')
    }
    render(){
        const baseData = this.props.location.state;
        const columns = [{
            title : '领用数量',
            dataIndex : 'receiveAmount',
            width : 80,
            fixed : 'left',
            render : (text, record, index)=>{
                return (
                    <Input 
                        min={ 1 }
                        defaultValue={text || 1}
                        onChange={this.onChange.bind(this, record, index)}
                    />
                )
            }
        },{
            title : '库存数量',
            dataIndex : 'xcsl',
            fixed : 'left',
        },{
            title : '产品名称',
            dataIndex : 'materialName'
        },{
            title : '通用名称',
            dataIndex : 'geName'
        },{
            title : '型号',
            dataIndex : 'fmodel'
        },{
            title : '规格',
            dataIndex : 'spec'
        },{
            title : '采购单位',
            dataIndex : 'purchaseUnit'
        },{
            title : '采购价格',
            dataIndex : 'purchasePrice',
            render:(text, record)=>{
                return text === 'undefined' ? '0.0000':text.toFixed(4);
            }
        },{
            title : '金额',
            dataIndex : 'totalPrice',
            render: (text, record) => {
                return (record.receiveAmount * record.purchasePrice).toFixed(2);
            }
        },{
            title : '供应商',
            dataIndex : 'fOrgName'
        },{
            title : '生产商',
            dataIndex : 'produceName'
        }];
        const footer = () => {
            return <Row style={{fontSize : '1.2rem'}}><Col className="ant-col-6">金额 : {this.total()}</Col></Row>
        };
        return (
            <div>
                {
                    this.props.children ||
                    <div>
                        <Breadcrumb style={{fontSize: '1.1em',marginBottom : 24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/outMgt',query:{activeKey:'1'}}}>出库记录</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>领用</Breadcrumb.Item>
                        </Breadcrumb>
                        <Row style={{marginBottom:24}}>
                            <Col span={18} push={3}>
                                <Steps>
                                    <Step key={'1'} title="填写单据信息" status="finish"/>
                                    <Step key={'2'} title="添加领用产品" status="process"/>
                                    <Step key={'3'} title="确认领用单" status="process"/>
                                </Steps>
                            </Col>
                        </Row>
                        <Collapse defaultActiveKey={['1','2']}>
                            <Panel header="单据信息" key="1">
                                <Row>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>库房</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.storageName }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>领用科室</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.deptName }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>领用人</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                { baseData.receiveUserName }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>科室地址</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.addressName }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Panel>
                            <Panel header="产品信息" key="2">
                                <Row>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-form-item-control">
                                                <Input placeholder="请输入产品名称/通用名称/供应商" ref="searchName" onPressEnter={this.onPressEnter}/>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-2" push={2}>
                                        <Button type="primary" onClick={this.handleSearch}> 搜索</Button>
                                    </Col>
                                    <Col className="ant-col-14" push={2} style={{textAlign:'right'}}>
                                        <Button type="primary" onClick={this.add}> 添加</Button>
                                        <Button type="danger" ghost onClick={this.delete} style={{marginLeft:16,marginRight:16}}> 删除</Button>
                                    </Col>
                                </Row>
                                <Table 
                                    style={{ marginTop : 24 }}
                                    columns={columns} 
                                    pagination={false}
                                    size="small"
                                    rowKey={'tenderMaterialGuid'}
                                    dataSource={this.state.dataSource}
                                    footer={footer}
                                    scroll={{ x: '150%' }}
                                    rowSelection={{
                                        selectedRowKeys: this.state.selected,
                                        onChange: (selectedRowKeys, selectedRows) => {
                                        this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                                        }
                                    }}
                                />
                            </Panel>
                        </Collapse>
                        <Row style={{marginTop:24}}>
                            <Col span={11} key={'a'} style={{textAlign:'right'}}>
                                <Button type='primary' style={{marginRight: 16}} onClick={this.confirm}>确认</Button>
                            </Col>
                            <Col span={11} key={'b'} style={{textAlign:'left'}}>
                                <Button type='primary' onClick={actionHandler.bind(null, this.props.router, `/storage/outMgt/receive`, { })}>取消</Button>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        )
    }
}
module.exports = PhReceive;
