/**
 * 送货单验收
 */
import React from 'react';
import { Input, Button, Table, Select, Row, Col ,Popconfirm,message,Modal,Icon} from 'antd';
import querystring from 'querystring';
import { purchase }  from 'api';
const Option = Select.Option;
const confirm = Modal.confirm;

class DeliveryCheck extends React.Component{
    state = {
        loading: false,
        isloading:false,
        visible: false,
        dirtyClick: false,//通过
        deliveryNo:'',
        deliveryTotal : 0,
        invoiceTotal : 0,
        invoiceTotalPrice : 0,
        storageGuid:'',
        dataSource:[]
    }
    componentDidMount = () => {
        //库房
       fetch(purchase.FINDSTORAGEBYUSER, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
            'Content-Type':'application/json'
        }
        })
        .then(res => res.json())
        .then(data => {
        this.setState({storageOptions: data.result})
        if (data.result.length > 0) {
            this.setState({
                storageGuid:data.result[0].value
            })
        }
        })
        .catch(e => console.log("Oops, error", e))
    }
    //库房valuechange
    handleChange = (value) => {
        const storageGuid = this.state.storageGuid;
        if(this.state.dataSource.length>0){
            const that = this;
            confirm({
                title: '提示',
                okText:'确认',
                cancelText:'取消' ,
                content: '是否切换库房？',
                onOk() {
                    that.setState({
                        dataSource:[],
                        deliveryNo:'',
                        deliveryTotal:0,
                        invoiceTotal:0,
                        invoiceTotalPrice:0,
                        storageGuid : value
                    })
                },
                onCancel() {
                    that.setState({
                        storageGuid : storageGuid
                    })
                },
            });
        }
        else{
            this.setState({
                storageGuid : value
            })
        }
    }
    emitEmpty = () => {
        this.deliveryNoInput.focus();
        this.setState({ deliveryNo: '' });
    }
    onChangedeliveryNo = (e) => {
        this.setState({ deliveryNo: e.target.value });
    }
    //input onPressEnter
    handleInputEnter = (e) => {
        const sendId = e.target.value;
        fetch(purchase.CHECKDELIVERY, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
            'Content-Type':'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({sendId:sendId,storageGuid:this.state.storageGuid})
        })
        .then(res => res.json())
        .then(data => {
            if(data.status){
                const result = data.result;
                let isAdd = true;//判断送货单号是否重复添加
                let deliveryTotal = data.result.totalPrice === null ? 0 : data.result.totalPrice;
                let invoiceTotal = data.result.accountPayed ===null ? 0 : data.result.accountPayed;
                let invoiceTotalPrice = data.result.accountPayed ===null ? 0 : data.result.accountPayed;
                const  invoiceNo = data.result.invoiceNo;
                this.state.dataSource.forEach((item) => {
                    if(item.sendNo === sendId){
                      isAdd = false;
                      message.info("送货单号重复")
                    } else{
                      deliveryTotal += item.totalPrice ;
                      invoiceTotalPrice += item.accountPayed;
                      if(item.invoiceNo !== invoiceNo){
                        invoiceTotal = "无"
                      } else{
                        invoiceTotal += item.accountPayed ;
                      }
                    }
                })
                if(isAdd){
                  this.setState({
                    deliveryTotal : deliveryTotal,
                    invoiceTotal : invoiceTotal,
                    invoiceTotalPrice: invoiceTotalPrice,
                    dataSource : [...this.state.dataSource,result]
                  })
                }
                
            }
            else{
                message.error(data.msg)
            }
          
        })
        .catch(e => console.log("Oops, error", e))
      
    }
    //删除
     onDelete = (index,record) => {
        const dataSource =[ ...this.state.dataSource];
        let invoiceTotalPrice = this.state.invoiceTotalPrice;
        let deliveryTotal = this.state.deliveryTotal;
        dataSource.splice(index,1);
        deliveryTotal -= record.totalPrice ;
        let invoiceTotal = invoiceTotalPrice -  record.accountPayed;
        console.log(invoiceTotalPrice,'发票总金额')
        this.setState({
            dataSource: dataSource,
            deliveryTotal : deliveryTotal,
            invoiceTotal : invoiceTotal,
            invoiceTotalPrice: invoiceTotal
        });
    }
    //验收通过 
    handlePass = () =>{
        const sendIds =[];
        const storageGuid = this.state.storageGuid;
        this.state.dataSource.forEach((r) => {
            sendIds.push(r.sendId)
        });
        console.log({sendIds:sendIds,storageGuid:storageGuid},"验收通过数据");
        fetch(purchase.CHECKDELIVERYTHROUGH, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
             'Content-Type':'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({sendIds:sendIds,storageGuid:storageGuid})
        })
        .then(res => res.json())
        .then(data => {
            this.setState({ loading: true });
            if(data.status){
                message.success("验收通过")
                 this.setState({
                    dataSource: [],
                    deliveryTotal : 0,
                    invoiceTotal : 0,
                    deliveryNo: ''
                })
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
    //验收不通过
    handleOk = () => {
        const failreason = this.refs.failReason.refs.input.value;
        if(failreason.length>200){
            return message.error('长度不能超过200')
        }
        else if(failreason.length<=0){
            return message.error('请输入反馈理由')
        }
        const sendIds =[];
        const storageGuid = this.state.storageGuid;
        this.state.dataSource.forEach((r) => {
            sendIds.push(r.sendId)
        });

        fetch(purchase.CHECKDELIVERYNOTTHROUGH, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
            'Content-Type':'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({sendIds:sendIds,storageGuid:storageGuid,rejectReason:failreason})
        })
        .then(res => res.json())
        .then(data => {
            this.setState({ isloading: false, visible: false });
            if(data.status){
                message.success("验收不通过")
                this.setState({
                    dataSource:[],
                    deliveryNo: '',
                    deliveryTotal : 0,
                    invoiceTotal : 0,
                })
            }
            else{
                message.error(data.msg)
            }
         
        })
        .catch(e => console.log("Oops, error", e))
    }
    render(){
        const columns = [{
                title: '操作',
                key: 'action',
                render: (text,record,index) => {
                    return (
                        <Popconfirm title={ "是否删除？"} onConfirm={() => this.onDelete(index,record)}>
                            <a href="#">删除</a>
                        </Popconfirm>
                    )
                }}, {
                title: '送货单号',
                dataIndex: 'sendNo'
                }, {
                title: '送货单金额',
                dataIndex: 'totalPrice',
                render: (text,record,index) => {
                    return text === 'undefined' ? '0.00' : text.toFixed(2)
                }
                }, {
                title: '供应商',
                dataIndex: 'fOrgName',
                }, {
                title: '发票号',
                dataIndex: 'invoiceNo',
                }
            ];
        const { dataSource , deliveryNo,deliveryTotal ,invoiceTotal} = this.state;
        const footer = () => {
            return <Row><Col className="ant-col-6">送货单总金额:{deliveryTotal.toFixed(2)}</Col><Col className="ant-col-6">发票总金额:{ invoiceTotal==="无" ? "无" :invoiceTotal.toFixed(2) }</Col></Row>
        }; 
        const suffix = deliveryNo ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;   
        return (
            <div>
                <Row>
                    <Col className="ant-col-6">
                        <div className="ant-row ant-form-item">
                            <div className="ant-col-4 ant-form-item-label">
                                <label>库房</label>
                            </div>
                            <div className="ant-col-20">
                                    {
                                        this.state.storageGuid === '' ? null
                                        :
                                        <Select
                                        value={this.state.storageGuid}
                                        style={{width:200}}
                                        onChange={this.handleChange}
                                        >
                                        {
                                            this.state.storageOptions.map(
                                            (item, index) => <Option key={index} value={item.value}>{item.text}</Option>)
                                        }
                                        </Select>
                                    }
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row ant-form-item">
                            <div className="ant-col-6 ant-form-item-label">
                                <label>送货单号</label>
                            </div>
                            <div className="ant-col-18">
                                <Input 
                                suffix={suffix}
                                value={deliveryNo}
                                onChange={this.onChangedeliveryNo}
                                ref={node => this.deliveryNoInput = node}
                                onPressEnter={this.handleInputEnter}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-12" style={{textAlign:'right'}}>
                         <Button type="primary" style={{marginRight:10}} onClick={this.handlePass} loading={this.state.dirtyClick}>验收通过</Button>
                         <Button type="primary" ghost onClick={this.handerNotPass} loading={this.state.dirtyClick}>验收不通过</Button>
                    </Col>
                </Row>
                <Table 
                columns={columns} 
                dataSource={dataSource} 
                pagination={false}
                rowKey="sendId"
                size="small"
                footer={footer}
                />
                <Modal
                visible={this.state.visible}
                title='验收'
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                <Button key="back" size="large"  onClick={this.handleCancel}>关闭</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.isloading} onClick={this.handleOk}>
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

module.exports = DeliveryCheck;