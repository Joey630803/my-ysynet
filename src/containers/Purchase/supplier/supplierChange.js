/**
 * @file 我的供应商--供应产品--供应商变更
 */
import React from 'react';
import {  Row, Col, Breadcrumb, Button, Select, message } from 'antd';
import { Link, hashHistory } from 'react-router';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { purchase } from 'api';

const Option = Select.Option;

class SupplierChange extends React.Component{
    state = {
        orgOptions: [],
        fOrgId: '',
        fOrgDetail:''
    }
    componentDidMount = ()=>{
        fetchData(purchase.SEARCHALLORGLIST,querystring.stringify({orgType:'02'}),(data)=>{
            this.setState({ orgOptions: data});
        })
    }
    selectOrg = (value)=>{
        fetchData(purchase.FINDORGDETAILS,querystring.stringify({orgId:value}),(data)=>{
            if(data.status){
                this.setState({fOrgDetail:data.result[0],fOrgId:value})
            }else{
                message.error(data.msg);
            }
        })
    }
    changeOrg = ()=>{
        const data = this.props.location.state;
        let postData = {},extendList = [];
        postData.fOrgId = this.state.fOrgId;
        postData.oldFOrgId = data.oldFOrgId;
        postData.rStorageGuid = data.rStorageGuid;
        data.dataSource.map((item,index)=>{
            return extendList.push({
                tenderMaterialExtendGuid:item.tenderMaterialExtendGuid,
                fitemid:item.fitemid
            })
        });
        postData.extendList = extendList;
        console.log(postData,'postData');
        fetchData(purchase.UPDATESUPPLIER,JSON.stringify(postData),(data)=>{
            if(data.status){
                hashHistory.push({
                    pathname:'/purchase/supplier/product',
                    state:{
                        fOrgId:this.state.fOrgId
                    }
                })
            }else{
                message.error(data.msg);
            }
        },'application/json')

    }
    getComponeyType = (value)=>{
        switch(value){
            case '1':
                return '国有企业';
            case '2':
                return '集体企业';
            case '3':
                return '股份合作企业';
            case '4':
                return '联营企业';
            case '5':
                return '有限责任公司';
            case '6':
                return '股份有限公司';
            case '7':
                return '私营企业';
            case '9':
                return '外资企业（港澳台)';
            case '10':
                return '企业类型-cj';
            case '11':
                return '外资企业';
            default:
                break;
        }
    }
    showTable = ()=>{
        const data = this.state.fOrgDetail;
        return (
            <div>
                <Row>
                    <Col span={4}></Col>
                    <Col span={15}>
                        <table className="certTable">
                            <tbody>
                                <tr>
                                    <td width='15%'>供应商名称:</td>
                                    <td width='35%'>{data.orgName}</td>
                                    <td width='15%'>简称:</td>
                                    <td width='35%'>{data.orgAlias}</td>
                                </tr>
                                <tr>
                                    <td>机构代码:</td>
                                    <td>{data.orgCode}</td>
                                    <td>企业类型:</td>
                                    <td>{this.getComponeyType(data.corporationType)}</td>
                                </tr>
                                <tr>
                                    <td>法人代表:</td>
                                    <td>{data.legalMan}</td>
                                    <td>注册资本:</td>
                                    <td>{data.rmbAmount?data.rmbAmount.toFixed(2):'0'}</td>
                                </tr>
                                <tr>
                                    <td>省市区:</td>
                                    <td colSpan={3}>{data.area}</td>
                                </tr>
                                <tr>
                                    <td>经验许可范围:</td>
                                    <td colSpan={3}>{data.scop}</td>
                                </tr>
                                <tr>
                                    <td>备注:</td>
                                    <td colSpan={3}>{data.tfRemark}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col span={3}></Col>
                </Row>
            </div>
        )
    }
    render(){
        console.log(this.props,'变更供应商')
        const title = typeof this.props.location.state === 'undefined' 
        ? '全部供应商' : this.props.location.state.title;
        return (
            <div>
                {
                    this.props.children
                    ||
                    <div>
                        <Row>
                            <Col>
                                <Breadcrumb style={{fontSize: '1.1em',marginBottom:20}}>
                                    <Breadcrumb.Item><Link to='/purchase/supplier'>我的供应商</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item><Link to={{pathname:this.props.location.state.from,state:{fOrgId:this.props.location.state.oldFOrgId}}}>供应产品</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item>{title || ''}</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="ant-col-6"></Col>
                            <Col className="ant-col-8">
                                <div className="ant-row">
                                    <div className="ant-col-6 ant-form-item-label-left">
                                        <label>新供应商名称</label>
                                    </div>
                                    <div className="ant-col-16">
                                        <div className="ant-form-item-control">
                                            <Select
                                                style={{width:'100%'}}
                                                onSelect={this.selectOrg}
                                                showSearch
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                            {
                                                this.state.orgOptions.map((item,index)=>{
                                                    return <Option key={-1} value={item.value+''}>{item.text}</Option>
                                                })
                                            }
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col className="ant-col-3">
                                <Button type='primary' onClick={this.changeOrg}>变更</Button>
                            </Col>
                        </Row>
                        <Row style={{marginTop:20}}>
                            {
                                this.state.fOrgId && this.showTable()
                            }
                        </Row>
                    </div>
                }
            </div>
        )
    }
}
module.exports = SupplierChange;