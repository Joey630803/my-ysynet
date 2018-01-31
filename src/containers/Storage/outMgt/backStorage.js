/**
 * @file 退库
 */

import React from 'react';
import { Breadcrumb, Form, Row, Col, Input, Table, Collapse, Button, message, Modal} from 'antd';
import { Link ,hashHistory} from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { storage } from 'api';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Panel = Collapse.Panel;
class SearchForm extends React.Component{
    handleSearch = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          console.log('查询条件: ', values);
          this.props.query(values);
          if(values.outNo){
            fetchData(storage.SELECTOUTPORTISOUT,querystring.stringify({outNo:values.outNo}),(data)=>{
                if(data.status){
                    this.props.callback(data.result)
                }else{
                    message.info(data.msg);
                }
            })
          }else{
              message.warn('请输入出库单号或扫描产品二维码！');
          }
       });
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row>
                    <Col span={6} key={1}>
                        <FormItem>
                            {getFieldDecorator(`outNo`,{
                                rules:[{required: true, message:'请输入出库单号或扫描产品二维码'},
                                {max: 50, message: '长度不能超过50'}
                            ]
                            })(
                                <span><span style={{color:'red'}}>*</span> <Input placeholder="请输入出库单号或扫描产品二维码" style={{width:'90%'}}/></span>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2} key={2} style={{textAlign:'right'}}>
                        <Button type='primary' htmlType="submit">搜索</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const SearchBox = Form.create()(SearchForm);

class NewBackStorage extends React.Component{
    state = {
        query: {},
        pageData: [],
        dataSource: [],
        tfRemark:'',
        isconfirm: true
    }
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    handleChange = (record,index,e)=>{
        let value = e.target.value;
        if (/^\d+$/.test(value)) {
            if( value > record.cksl){
                this.setState({ isconfirm: false});
                return message.warn('退库数量不得大于出库数量');
            }else if( value > record.ktNum){
                this.setState({ isconfirm: false});
                return message.warn('退库数量不得大于可退数量')
            }
            else{
                let { dataSource } = this.state;
                dataSource[index].tksl = e.target.value;
                this.setState({ dataSource , isconfirm: true });
            }
        }else {
            this.setState({ isconfirm: false});
            return message.warn('请输入正整数');
        }
    }
    total = ()=>{
        let total = 0;
        this.state.dataSource.map( (item, index) => {
            let amount = typeof item.tksl==='undefined' ? 1 : item.tksl;
            return total += amount * item.purchasePrice;
          })
          return total.toFixed(2);
    }
    //确认
    confirm = ()=>{
        const that = this;
        confirm({
            title: '提示',
            okText:'确认',
            cancelText:'取消' ,
            content: '是否确认此退库单信息？',
            onOk() {
                if(that.state.isconfirm){
                    const dataSource = that.state.dataSource;
                    let postData = {};
                    postData.outNo = that.state.query.outNo;
                    postData.tfRemark = that.state.tfRemark;
                    let list = [];
                    dataSource.map((item, index)=>{
                        return list.push({
                            outportDetailGuid : item.outportDetailGuid,
                            fitemid : item.fitemid,
                            tksl : item.tksl
                        });
                    });
                    postData.list = list;
                    fetchData(storage.INSERTOUTPORTINOUT,JSON.stringify(postData),(data)=>{
                        if(data.status){
                            console.log('退库成功！');
                            message.success('操作成功！');
                            if(data.result.outId){
                                window.open(storage.PRINTOUTDETAIL+"?"+querystring.stringify({ outId: data.result.outId }));
                            }
                            hashHistory.push({
                                pathname:'/storage/outMgt',
                                query:{activeKey:'1'}
                            })
                        }else{
                            this.handleError(data.msg);
                        }
                    },'application/json')
                }else{
                    message.warn('请检查填写数量是否正确')
                }
                
            }
        })
        

    }
    onChange = (e)=>{
        if(e.target.value.length > 500){
            message.warn('备注长度不可超过500!');
        }else{
            this.setState({ tfRemark:e.target.value });
        }
        
    }
    getOutTypes = (value)=>{
        if(value === '01'){
            return '拣货单出库'
        }else if(value === '02'){
            return '科室领用出库'
        }else if(value === '03'){
            return '申购出库'
        }else if(value === '04'){
            return '盘亏出库'
        }else if(value === '05'){
            return '退库出库'
        }else if(value === '06'){
            return '结算出库'
        }
    }
    render(){
        const baseData = this.state.pageData;
        const dataSource = this.state.dataSource;
        const columns = [{
            title:'退库数量',
            dataIndex:'tksl',
            width: 80,
            fixed : 'left',
            render: (text, record, index)=>{
                return <Input min={0} defaultValue={text} onChange={this.handleChange.bind(this, record, index)}/>
            }
        },{
            title: '可退数量',
            dataIndex: 'ktNum',
            fixed : 'left',
            width : 70
        },{
            title: '出库数量',
            dataIndex: 'cksl',
            fixed : 'left',
            width : 70
        },{
            title : '二维码',
            dataIndex : 'qrcode'
        },{
            title:'产品名称',
            dataIndex :'materialName'
        },{
            title :'通用名称',
            dataIndex :'geName'
        },{
            title:'型号',
            dataIndex:'fmodel'
        },{
            title:'规格',
            dataIndex:'spec'
        },{
            title:'采购单位',
            dataIndex:'purchaseUnit'
        },{
            title:'采购价格',
            dataIndex:'purchasePrice',
            render: (text, record, index)=>{
                return text === 'undefined' ? '0.0000' : text.toFixed(4);
            }
        },{
            title:'金额',
            dataIndex:'tenderMoney',
            render: (text, record, index)=>{
                return record.tksl === null ? record.purchasePrice.toFixed(2) : (record.tksl*record.purchasePrice).toFixed(2)
            }
        },{
            title:'生产批号',
            dataIndex:'flot'
        },{
            title:'生产日期',
            dataIndex:'prodDate'
        },{
            title:'有效期',
            dataIndex:'usefulDate'
        },{
            title:'供应商',
            dataIndex:'fOrgName'
        },{
            title:'生产商',
            dataIndex:'produceName'
        }];
        const footer = () => {
            return <Row style={{fontSize:'1.2rem'}}><Col className="ant-col-6">总金额:{this.total()}</Col></Row>
        };
        return (
            <div>
                {
                    this.props.children ||
                    <div>
                        <Row>
                            <Col className="ant-col-6">
                                <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                    <Breadcrumb.Item><Link to={{pathname:'/storage/outMgt',query:{activeKey:'1'}}}>出库记录</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item>新建退库</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <SearchBox query={(query)=>{this.setState({query:query})}} callback={(data)=>{this.setState({pageData: data ,dataSource: data.list })}}/>
                        <Row style={{marginBottom:24}}>
                            <Col span={6}>
                                <span>备注：</span><Input 
                                                    placeholder='输入备注' style={{width:'80%'}}  
                                                    value={this.state.tfRemark}
                                                    onChange={this.onChange}/>
                            </Col>
                            <Col span={2} push={1}>
                                <Button type='primary' onClick={this.confirm}>确认</Button>
                            </Col>
                        </Row>
                        <Collapse defaultActiveKey={['1','2','3']}>
                            <Panel header="单据信息" key="1">
                                <Row>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>出库单号</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.outNo }
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
                                                    { baseData.storageName }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>出库方式</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { this.getOutTypes(baseData.outType) }
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
                                                    { baseData.createUserName }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>出库时间</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.outDate }
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
                                                    { baseData.lyr }
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Panel>
                            <Panel header='患者信息' key='2'>
                                <Row>
                                    <Col className="ant-col-6">
                                        <div className="ant-row">
                                            <div className="ant-col-6 ant-form-item-label-left">
                                                <label>住院号</label>
                                            </div>
                                            <div className="ant-col-18">
                                                <div className="ant-form-item-control">
                                                    { baseData.admissionNo }
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
                                    <Col className="ant-col-6">
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
                            <Panel header="产品信息" key="3">
                                <Table 
                                    columns={columns} 
                                    dataSource={dataSource} 
                                    pagination={false}
                                    size="small"
                                    rowKey='outportDetailGuid'
                                    footer={footer}
                                    scroll={{ x: '170%' }}
                                />
                            </Panel>
                        </Collapse>
                    </div>
                }
            </div>
        )
    }
}
module.exports = NewBackStorage;

