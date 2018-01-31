/**
 * 发票验收
 */
import React from 'react';
import { Input,Table, Select, Row, Col, Icon,message,Modal } from 'antd';
import querystring from 'querystring';
import { actionHandler,FetchPost } from 'utils/tools';
import { purchase }  from 'api';
const Option = Select.Option;
const confirm = Modal.confirm;

class InvoiceList extends React.Component{
    state = {
        storageOptions:[],
        invoiceNo:'',
        dataSource:[],
        rStorageGuid:''
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
            this.setState({rStorageGuid:data.result[0].value})
        }
        })
        .catch(e => console.log("Oops, error", e))
    }
    //库房valuechange
    handleChange = (value) => {
        console.log(value,'库房change')
        const rStorageGuid = this.state.rStorageGuid;
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
                        invoiceNo:'',
                        rStorageGuid : value
                    })
                },
                onCancel() {
                    that.setState({
                        rStorageGuid : rStorageGuid
                    })
                },
            });
        }
        else{
            this.setState({
                rStorageGuid : value
            })
        }
      
    }
    editEmpty = () => {
        this.invoiceNoInput.focus();
        this.setState({ invoiceNo: '' });
    }
    onChangeInvoiceNo = (e) => {
        this.setState({ invoiceNo: e.target.value });
    }
     //input onPressEnter
    handleInputEnter = (e) => {
        console.log(e.target.value,'input enter 事件')
        const invoiceNo = e.target.value;
        FetchPost(purchase.GETINVOICEBYID,querystring.stringify({rStorageGuid:this.state.rStorageGuid,invoiceNo:invoiceNo}))
        .then(res => res.json())
        .then(data => {
            if(data.status){
                if(data.result.rows.length>0){
                    this.setState({dataSource: data.result.rows})
                }
                else{
                    message.error("无数据")
                }
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
                           <a onClick={
                            actionHandler.bind(
                            null, this.props.router, `/purchase/invoiceCheck/show` , {...record}
                            )}>
                            {`查看`}
                        </a>
                    )
                }}, {
                title: '发票代码',
                dataIndex: 'invoiceCode'
                }, {
                title: '发票号码',
                dataIndex: 'invoiceNo',
                }, {
                title: '发票金额',
                dataIndex: 'accountPayed',
                render: (text,record,index) => {
                    return text === 'undefined' ? '0.00' : text.toFixed(2)
                }
                }, {
                title: '开票日期',
                dataIndex: 'invoiceDate',
                }, {
                title: '供应商',
                dataIndex: 'fOrgName',
                }
            ];
            const { dataSource ,invoiceNo } = this.state;
            const suffix = invoiceNo ? <Icon type="close-circle" onClick={this.editEmpty} /> : null;  
        return (
            <div>
                {
                    this.props.children 
                    ||
                    <div>
                        <Row>
                            <Col className="ant-col-6">
                                <div className="ant-row ant-form-item">
                                    <div className="ant-col-4 ant-form-item-label-left">
                                        <label>库房</label>
                                    </div>
                                    <div className="ant-col-20">
                                        {
                                            this.state.rStorageGuid === '' ? null
                                            :
                                            <Select
                                            value={this.state.rStorageGuid}
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
                                    <div className="ant-col-6 ant-form-item-label-left">
                                        <label>发票号码</label>
                                    </div>
                                    <div className="ant-col-18">
                                       <Input 
                                        suffix={suffix}
                                        value={invoiceNo}
                                        onChange={this.onChangeInvoiceNo}
                                        ref={node => this.invoiceNoInput = node}
                                        onPressEnter={this.handleInputEnter}
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                     <Table 
                        columns={columns} 
                        dataSource={dataSource} 
                        pagination={false}
                        rowKey="invoiceId"
                        size="small"
                        />
                    </div>
                }
            </div>
            
        )
    }
}

module.exports = InvoiceList;