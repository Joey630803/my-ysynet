/**
 * @file 我的产品--调价
 */
import React from 'react';
import { Row, Col, Breadcrumb, Button, Input, Table, message} from 'antd';
import { Link, hashHistory } from 'react-router';
import { fetchData } from 'utils/tools';
import { purchase } from 'api';
class AdjustPrice extends React.Component{
    
    changePrice = (afterMoney)=>{
        let tenderStorageMaterials = [],postData = {};
        const dataSource = this.props.location.state.dataSource;
        dataSource.map((item,index)=>{
            return tenderStorageMaterials.push({
                tenderMaterialExtendGuid:item.tenderMaterialExtendGuid,
                tenderMaterialGuid:item.tenderMaterialGuid
            })
        });
        postData.tenderStorageMaterials = tenderStorageMaterials;
        postData.afterPurchasePrice = afterMoney;
        console.log(postData,'postData')
        fetchData(purchase.UPDATEPURCHASEPRICE,JSON.stringify(postData),(data)=>{
            if(data.status){
                message.success('操作成功!');
                hashHistory.push({pathname:'/purchase/product',query:this.props.location.state.storageGuid});
            }else{
                message.error(data.msg);
            }
        },'application/json')
    }
    //调价确认
    save = ()=>{
        console.log(this.refs.afterMoney.refs.input.value,'value');
        const afterMoney = this.refs.afterMoney.refs.input.value;
        if(!isNaN(afterMoney)){
            if(afterMoney.indexOf('.')>0){
                if(afterMoney.split('.')[1].length > 4){
                    return message.warn('采购价为大于0且小数点后最多保留4位的数字');
                }else{
                    this.changePrice(afterMoney);
                }
            }else{
                this.changePrice(afterMoney);
            }
        }else{
            message.warn('采购价金额格式不正确，请重新输入！');
        }
    }
    render(){
        const columns = [{
              title : '产品名称',
              dataIndex : 'materialName',
          },{
              title : '型号',
              dataIndex : 'fmodel'
          },{
              title : '规格',
              dataIndex : 'spec'
          },{
              title: '当前采购价',
              dataIndex: 'purchasePrice'
          },{
              title: '采购单位',
              dataIndex: 'purchaseUnit'
          },{
              title: '单位换算',
              dataIndex:'unit'
          },{
              title: '组件名称',
              dataIndex: 'suitName'
          },{
              title: '证件号',
              dataIndex: 'registerNo'
          },{
              title : '品牌',
              dataIndex : 'tfBrand'
          },{
              title : '生产商',
              dataIndex : 'produceName'
          }];
        return (
            <div>
                {
                    this.props.children 
                    ||
                    <div>
                        <Row>
                            <Col className="ant-col-6">
                                <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                    <Breadcrumb.Item><Link to={{pathname:'/purchase/product',state:{query:{storageGuid:this.props.storageGuid}}}}>我的产品</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item>产品调价</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="ant-col-8">
                                <div className="ant-row">
                                    <div className="ant-col-6 ant-form-item-label-left">
                                        <label>新采购价</label>
                                    </div>
                                    <div className="ant-col-18">
                                        <div className="ant-form-item-control">
                                            <span>人民币</span>
                                            <Input placeholder='请输入' style={{width:'60%',margin:'0 5%'}} ref='afterMoney'/>
                                            <span>元</span>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col className='ant-col-2'>
                                <Button type='primary' onClick={this.save}>保存</Button>
                            </Col>
                        </Row>
                        <Table 
                            style={{marginTop:12}}
                            columns={columns}
                            dataSource={this.props.location.state.dataSource}
                            rowKey={'RN'}
                            scroll={{ x: '120%' }}
                            pagination={false}
                            
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = AdjustPrice;