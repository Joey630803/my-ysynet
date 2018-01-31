/**
 * @file 出库记录/高值 领用
 */
import React from 'react';
import { Breadcrumb, Row, Col, Input, Button ,Steps, Collapse , Table ,message} from 'antd';
import { Link, hashHistory } from 'react-router';
import { actionHandler, fetchData } from 'utils/tools';
import querystring from 'querystring';
import { storage } from 'api';
const Step = Steps.Step;
const Panel = Collapse.Panel;

class OperReceive extends React.Component{
    state = {
        dataSource : [],
        selected: [],
        selectedRows : [],
        sendStatus : true,
        exceptGuid: []//排除产品列表Guid
    }
    componentDidMount = ()=>{
        if(this.props.location.state.dataSource){
            let exceptGuid = [];
            let dataSource = this.props.location.state.dataSource;
            dataSource.map((item,index)=>{
                item.RN = index;
                if(!item.qrcode){
                    exceptGuid.push(item.tenderMaterialGuid);
                }
                item.receiveAmount = 1;
                return null;
            })
            this.setState({ dataSource: dataSource, exceptGuid : exceptGuid});
        }else{
            this.setState({ dataSource: [], exceptGuid:this.state.exceptGuid });
        }
    }
    onPressEnter = (e)=>{
        e.preventDefault();
        this.search();
    }
    search = ()=>{
        const qrcode = this.refs.qrcode.refs.input.value ;
        console.log(qrcode,'二维码');
        const { dataSource } = this.state;
        if(qrcode){
            let flag = true;
            dataSource.map((item,index)=>{
                if(item.qrcode === qrcode){
                    flag = false;
                    return null;
                }
                return null;
            });
            if(flag){
                fetchData(storage.QUERYMATERIALLISTBYQRCODE,querystring.stringify({qrcode:qrcode}),(data)=>{
                    if(data.status){
                        data.result.receiveAmount = 1;
                        dataSource.push( data.result );
                        dataSource.map((item,index)=>{
                            item.RN = index;
                            return null;
                        })
                        this.setState({ dataSource: dataSource});
                    }else{
                        message.info(data.msg);
                    }
                })
            }
            else{
                message.warn('该产品已经添加，请勿重复添加');
                this.setState({dataSource: dataSource, selected: []});
            }
        }else{
            message.warn('请扫描或输入产品二维码！');
        }
        
        
    }
    onChange = (record, index,e) => {
        const amount = e.target.value;
        if (/^\d+$/.test(amount)) {
            if( amount > record.xcsl){
                this.setState({ sendStatus: false});
                return message.warn('领用数量不得大于库存数量');
            } else{
                let { dataSource } = this.state;
                dataSource[index].receiveAmount = amount;
                this.setState({ dataSource : dataSource, sendStatus: true});
            }
        }else {
            this.setState({ sendStatus: false});
            return message.warn('请输入非0正整数')
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
    //添加产品
    add = ()=>{
        hashHistory.push({
            pathname:'/storage/outMgt/operAdd',
            state:{
                ...this.props.location.state,
                dataSource :this.state.dataSource,
                excludeTenderDetailGuids : this.state.exceptGuid,
            }
        })
    }
    //删除产品
    delete = ()=>{
        const { selected, dataSource } = this.state;
        if (selected.length === 0) {
            return message.warn('请至少选择一条数据')
          }else{
            let result = [];
            dataSource.map( (item, index) => {
            const a = selected.find( (value, index, arr) => {
              return value === item.RN;
            })
            if (typeof a === 'undefined') {
                result.push(item)
            }
            return null;
          });
          if(result.length >0 ){
              let exceptGuid = [];
              result.map( (item,index) => {
                if(!item.qrcode){
                    exceptGuid.push(item.tenderMaterialGuid);
                }
                return null;
              });
              this.setState({ exceptGuid });
          }else{
            this.setState({ exceptGuid: [] });
          }
            this.setState({dataSource : result});
          }
    }
    //确认，新建出库领用单
    confirm = ()=>{
        if(this.state.sendStatus){
            let dataSource = this.state.dataSource;
            let patinentData = this.props.location.state.patinent || "";
            let baseData = this.props.location.state.values;
            let postData = {}, treatmentRecord = {}, operRecord = {}, materialList = [];
            postData.storageGuid = baseData.storageGuid;
            postData.deptGuid = baseData.deptGuid;
            postData.receiveUserName = baseData.receiveUserName;
            postData.deptAddress = baseData.addressName;
            postData.deptAddressGuid = baseData.deptAddressGuid;
            if(patinentData){
                treatmentRecord = patinentData.treatmentRecord;
                operRecord = patinentData.operRecord;
            }
            postData.treatmentRecord = treatmentRecord;
            postData.operRecord = operRecord;
            dataSource.map((item,index)=>{
                return materialList.push({
                    tenderMaterialGuid : item.tenderMaterialGuid,
                    qrcode : item.qrcode,
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
        }else{
            message.warn('请检查领用数量填写是否正确！')
        }
        
    }
    render(){
        const baseData = this.props.location.state.values;
        const columns = [{
            title : '领用数量',
            dataIndex : 'receiveAmount',
            width : 80,
            fixed : 'left',
            render : (text, record, index)=>{
                return (
                    record.qrcode ?
                    <span>{text}</span>
                    :
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
            render : (text, record)=>{
                return ( record.qrcode ?
                    1
                    :
                    <span>{text}</span>
                )
            }
        },{
            title: '二维码',
            dataIndex : 'qrcode',
            width: 150
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
            render:(text, record)=>{
                return ( record.receiveAmount * record.purchasePrice).toFixed(2);
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
                                    <Step key={'2'} title="添加领用产品" status='process'/>
                                    <Step key={'3'} title="确认领用单" status="process"/>
                                </Steps>
                            </Col>
                        </Row>
                        <Collapse defaultActiveKey={['1','2','3','4']}>
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
                            <Panel header='手术信息' key='2'>
                                <Row>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>手术名称</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.operName }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>手术医生</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.operDoctor }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>手术时间</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.operTime }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>麻醉方式</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.mzff }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>手术间</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.operRoom }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>巡回护士</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.circuitNurse }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>床位号</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.bedNum }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-12">
                                        <div className="ant-row">
                                            <div className="ant-col-3 ant-form-item-label-left">
                                                <label>手术说明</label>
                                            </div>
                                            <div className="ant-col-20">
                                                <div className="ant-form-item-control">
                                                    { baseData.operExplain }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-12">
                                        <div className="ant-row">
                                            <div className="ant-col-3 ant-form-item-label-left">
                                                <label>手术备注</label>
                                            </div>
                                            <div className="ant-col-20">
                                                <div className="ant-form-item-control">
                                                    { baseData.tfRemark }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Panel>
                            <Panel header='患者信息' key='3'>
                                <Row>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>就诊号</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.treatmentNo }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-18">
                                        <div className="ant-row">
                                            <div className="ant-col-2 ant-form-item-label-left">
                                                <label>手术申请单</label>
                                            </div>
                                            <div className="ant-col-22">
                                                <div className="ant-form-item-control">
                                                        { baseData.operInfo }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>姓名</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.name }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>性别</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                        { baseData.gender }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className='ant-col-6'>
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>年龄</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                        { baseData.age }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Panel>
                            <Panel header="产品信息" key="4">
                                <Row>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-form-item-control">
                                                <Input placeholder="扫产品二维码" ref="qrcode" onPressEnter={this.onPressEnter}/>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-16" push={2} style={{textAlign:'right'}}>
                                        <Button type="primary" onClick={this.add}> 手动添加</Button>
                                        <Button type="danger" ghost onClick={this.delete} style={{marginLeft:16,marginRight:16}}> 删除</Button>
                                    </Col>
                                </Row>
                                <Table 
                                    style={{ marginTop : 24 }}
                                    columns={columns} 
                                    pagination={false}
                                    dataSource={this.state.dataSource}
                                    size="small"
                                    rowKey={'RN'}
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
module.exports = OperReceive;