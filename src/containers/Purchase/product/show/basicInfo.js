/**
 * @file 我的产品--详情--基本信息
 */
import React from 'react';
import { Row, Col, Collapse, Table, Button, Checkbox, Input, message } from 'antd';
import { fetchData } from 'utils/tools';
import { purchase } from 'api';
const Panel = Collapse.Panel;
class BasicInfo extends React.Component{
    state = {
        dataSource: this.props.data.supplyDetails
    }
   
    onChange = (key, index, value)=>{
        let { dataSource } = this.state; 
        let InputValue = value.target.value;
        console.log(InputValue,'value')
        if( key ==='purchaseRatio'){
            if (/^\d+$/.test(InputValue)) {
                if (InputValue > 100) {
                    return message.warn('输入数值过大, 不能超过100')
                }
                }else{
                    return message.warn('请输入非0正数')
                }
            if (typeof value === 'undefined'){
                    dataSource[index][key] = '';
                } else if (typeof value.target === 'undefined' ) {
                    dataSource[index][key] = value;
                } else {
                    dataSource[index][key] = InputValue;
                }
            }else{
                if(/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(InputValue)){
                    if(InputValue> 100000000){
                        return message.warn('您输入的金额过大,不能超过100000000！');
                    }
                    if(InputValue.indexOf('.') >= 0){
                        if(InputValue.split('.')[1].length>4){
                            return message.warn('采购价最多4位小数')
                        }
                    }
                    dataSource[index][key] = InputValue;
            }
        }
        this.setState({dataSource : dataSource});
    }
    onCheckChanage = (e)=>{
        const index = e.target.dataIndex;
        const dataSource = this.state.dataSource;
        dataSource.map((item,idx) => {
            if(index === idx){
                e.target.checked = true;
                dataSource[idx]['tfDefault'] = '01';
                return null;
            }else{
                e.target.checked = false;
                dataSource[idx]['tfDefault'] = '00';
                return null;
            }
        });
        this.setState({ dataSource });
    }
    //保存产品信息
    save = ()=>{
        const { dataSource } = this.state;
        if( dataSource.length === 0){
            return message.warn('暂无产品信息！');
        }else{
            let supplyDetails = [];
            dataSource.map((item,index)=>{
                return supplyDetails.push({
                    tenderMaterialExtendGuid:item.tenderMaterialExtendGuid,
                    purchaseRatio:item.purchaseRatio,
                    purchasePrice:Math.floor(item.purchasePrice*10000)/10000,
                    tfDefault:item.tfDefault
                });
            });
            console.log(supplyDetails,'111')
            fetchData(purchase.SAVETENDERSTORAGEEXTEND,JSON.stringify(supplyDetails),(data)=>{
                if(data.status){
                    message.success('保存成功！');
                }else{
                    message.error(data.msg);
                }
            },'application/json')
        }
    }
    render(){
        const baseData = this.props.data;
        const columns = [{
            title: '设为默认',
            dataIndex: 'tfDefault',
            render:(text,record,index) => {
                return <Checkbox 
                            checked={text==='01'?true:false}
                            onChange={this.onCheckChanage} 
                            dataIndex={index}
                        >
                        </Checkbox>
            }
        },{
            title: '供应商',
            dataIndex: 'fOrgName'
        },{
            title:'参考采购比例',
            dataIndex: 'purchaseRatio',
            width: 90,
            render: (text,record,index)=>{
                return <Input defaultValue={text==='undefined'?'0':text} addonAfter="%" onChange={this.onChange.bind(this,'purchaseRatio',index)}/>
            }
        },{
            title: '采购价',
            dataIndex:'purchasePrice',
            width: 140,
            render: ( text,record,index)=>{
                return <Input defaultValue={text==='undefined'?'0':text} onBlur={this.onChange.bind(this,'purchasePrice',index)}/>
            }
        },{
             title: '采购单位',
             dataIndex:'purchaseUnit'
        },{
             title: '单位换算',
             dataIndex:'pConversion',
             render:(text,record)=>{
                 return ('1 采购单位 = '+ text +'最小单位')
             }
        },{
             title: '包装规格',
             dataIndex:'tfPacking'
        },{
             title: '包装材质',
             dataIndex:'packingTexture'
        }];

        return (
        <div>
            {
                this.props.children 
                ||
                <div>
                    <Row>
                        <Col span={2}></Col>
                        <Col span={20}>
                            <Collapse defaultActiveKey={['1','2']}>
                                <Panel header='产品信息' key='1'>
                                    <Row>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>产品名称</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.materialName }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>通用名称</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.geName }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>型号</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.fmodel }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>规格</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.spec }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>组件名称</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.suitName }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>最小单位</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.leastUnit }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>材质</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.tfTexture }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>骨科产品属性</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.attributeName }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>条码</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.fbarcode }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>证件号</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.registerNo }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>证件有效期</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.lastTime }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>品牌</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.tfBrand }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>生产商</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.produceName }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col className="ant-col-12">
                                            <div className="ant-row">
                                                <div className="ant-col-6 ant-form-item-label-left">
                                                    <label>采购网编码</label>
                                                </div>
                                                <div className="ant-col-18">
                                                    <div className="ant-form-item-control">
                                                        { baseData.purchaseNo }
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Panel>
                                <Panel header='供货信息' key='2'>
                                    <Row>
                                        <Col style={{textAlign:'right'}}>
                                            <Button type='primary' onClick={this.save}>保存</Button>
                                        </Col>
                                    </Row>
                                    <Table 
                                        style={{marginTop:12}}
                                        rowKey={'tenderMaterialExtendGuid'}
                                        dataSource={this.state.dataSource}
                                        scroll={{x:'140%'}}
                                        columns={columns}
                                        pagination={false}
                                    />
                                </Panel>
                            </Collapse>
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                </div>
            }
        </div>)
    }
}
module.exports = BasicInfo;