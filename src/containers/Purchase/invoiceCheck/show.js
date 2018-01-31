/**
 * 发票验收
 */
import React from 'react';
import { Input, Button, Table, Row, Col ,message,Modal,Spin,Breadcrumb} from 'antd';
import { Link,hashHistory } from 'react-router';    
import querystring from 'querystring';
import { FetchPost } from 'utils/tools';
import { purchase } from 'api'

class InvoiceCheck extends React.Component{
    state = {
        loading: false,
        visible: false,
        isLoading : true,
        selectReason:'',
        dirtyClick: false,//通过
        invoiceNo:'',
        deliveryTotal : '0.00',
        dataSource:[],
        fstate: ''
    }
    componentDidMount = () => {
        //根据发票查询关联的送货单列表
         FetchPost(purchase.GETDELIVERDETAIL,querystring.stringify({invoiceId:this.props.location.state.invoiceId}))
        .then(res => res.json())
        .then(data => {
            this.setState({
                dataSource: data.result.rows,
                deliveryTotal: data.result.fieldName
            })
        })
        .catch(e => console.log("Oops, error", e))
        //根据发票id查询发票信息（主要获取发票状态）
        FetchPost(purchase.GETINVOICEBYIDFSTATE,querystring.stringify({invoiceId:this.props.location.state.invoiceId}))
        .then(res => res.json())
        .then(data => {
            this.setState({
                fstate: data.result.fstate
            })
        })
        .catch(e => console.log("Oops, error", e))
    }
    //处理送货单输入后的处理
    handleChangeValue = (value) => {
        
        this.setState({
            invoiceNo: value,
            loading : true
        })
        console.log(value,'select fetch')
        this.setState({
            loading : false
        })
    }
    //删除
     onDelete = (index) => {
        const dataSource =[ ...this.state.dataSource];
        dataSource.splice(index,1);
        this.setState({dataSource});
    }
    //验收通过 
    handlePass = () =>{
          this.setState({ loading: true });
        const invoiceId = this.props.location.state.invoiceId;
        //验收通过
        FetchPost(purchase.INVOICECHECK,querystring.stringify({invoiceId:invoiceId,fstate:'1'}))
        .then(res => res.json())
        .then(data => {
            this.setState({ loading: false });
            if(data.status){
                 hashHistory.push('/purchase/invoiceCheck');
                 message.success("该发票验收通过!");
            }
            else{
                message.error(data.msg)
            }
        })
        .catch(e => console.log("Oops, error", e))
    }
    //验收不通过
    showModal = ()=>{
        this.setState({visible:true})
    }
    handerNotPass = ()=>{
        const that = this;
        that.showModal();
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    handleOk = () => {
      
        const failreason = this.refs.failReason.refs.input.value;
        if(failreason.length>200){
            return message.error('长度不能超过200')
        }
        else if(failreason.length<=0){
            return message.error('请输入反馈理由')
        }
        this.setState({ loading: true });
        const invoiceId = this.props.location.state.invoiceId;
         //验收不通过
        FetchPost(purchase.INVOICECHECK,querystring.stringify({invoiceId:invoiceId,rejectReason:failreason,fstate:'9'}))
        .then(res => res.json())
        .then(data => {
            this.setState({ loading: false, visible: false });
            if(data.status){
                hashHistory.push('/purchase/invoiceCheck');
                 message.success("该发票验收不通过!");
            }
            else{
                message.error(data.msg)
            }
        })
        .catch(e => console.log("Oops, error", e))
    }
    render(){
        const columns = [{
                title: '送货单号',
                dataIndex: 'sendNo',
                width: 150,
                }, {
                title: '送货单状态',
                dataIndex: 'sendFstate',
                width: 120,
                }, {
                title: '通用名称',
                dataIndex: 'geName',
                width: 150,
                }, {
                title: '产品名称',
                dataIndex: 'materialName',
                width: 150,
                }, {
                title: '规格',
                dataIndex: 'spec',
                width: 150,
                }, {
                title: '型号',
                dataIndex: 'fmodel',
                width: 150,
                }, {
                title: '采购单位',
                width: 100,
                dataIndex: 'purchaseUnit',
                }, {
                title: '包装规格',
                dataIndex: 'tfPacking',
                width: 100,
                }, {
                title: '采购价格',
                width: 100,
                dataIndex: 'purchasePrice',
                render: (text,record,index) => {
                    return text === 'undefined' || text === null ? '0.00' : text.toFixed(2)
                }
                }, {
                title: '发货数量',
                width: 100,
                dataIndex: 'amount',
                }, {
                title: '金额',
                dataIndex: 'amountMoney',
                width: 100,
                render: (text,record,index) => {
                    return text === 'undefined' ? '0.00' : text.toFixed(2)
                }
                }, {
                title: '生产批号',
                width: 100,
                dataIndex: 'flot',
                }, {
                title: '生产日期',
                width: 100,
                dataIndex: 'prodDate',
                }, {
                title: '有效期至',
                width: 100,
                dataIndex: 'usefulDate',
                }
            ];
        const { dataSource  } = this.state;
        const baseData = this.props.location.state;
        const footer = () => {
            return <Row><Col className="ant-col-6">送货单总金额:{this.state.deliveryTotal}</Col></Row>
        }; 
        return (
            <div>
                <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                    <Breadcrumb.Item><Link to='/purchase/invoiceCheck'>发票验收</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>详情</Breadcrumb.Item>
                </Breadcrumb>
                {
                    this.state.fstate !== "0" ? null
                    :
                    <Row>
                    <Col className="ant-col-24" style={{textAlign:'right'}}>
                         <Button type="primary" style={{marginRight:10}} onClick={this.handlePass} loading={this.state.dirtyClick}>验收通过</Button>
                         <Button type="primary" ghost onClick={this.handerNotPass} loading={this.state.dirtyClick}>验收不通过</Button>
                    </Col>
                     </Row>

                }
                
                <Spin spinning={this.state.loading}>
                <h2 style={{marginBottom:16}}>基本信息</h2>
                <Row>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>发票代码</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                     {baseData.invoiceCode}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>发票号码</label>
                            </div>
                            <div className="ant-col-18">
                                 <div className="ant-form-item-control">
                                     {baseData.invoiceNo}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>开票日期</label>
                            </div>
                            <div className="ant-col-18">
                                 <div className="ant-form-item-control">
                                     {baseData.invoiceDate}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>发票金额</label>
                            </div>
                            <div className="ant-col-18">
                                 <div className="ant-form-item-control">
                                     {baseData.accountPayed=== null ? "0.00" : baseData.accountPayed.toFixed(2) }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-8">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>供应商</label>
                            </div>
                            <div className="ant-col-18">
                                 <div className="ant-form-item-control">
                                    {baseData.fOrgName}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <h2 style={{marginTop:16,marginBottom:16}}>送货单信息</h2>
                <Table 
                columns={columns} 
                dataSource={dataSource} 
                pagination={false}
                size="small"
                rowKey="sendDetailGuid"
                footer={footer}
                scroll={{ x: '180%' }}
                />
                </Spin>
                <Modal
                visible={this.state.visible}
                title='验收'
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                <Button key="back" size="large"  onClick={this.handleCancel}>关闭</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                    提交
                </Button>
                ]}
            >
            <Input style={{marginTop:'16px'}}  ref='failReason' type="textarea" rows={4}/>
            </Modal>
            </div>
        )
    }
}
module.exports = InvoiceCheck;
