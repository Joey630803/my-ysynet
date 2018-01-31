/**
 * @file 供应商详情--基本信息
 */

import React from 'react';
import { Row, Col } from 'antd';
import { jsonNull } from 'utils/tools';
class BasicInfo extends React.Component{
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
        const data = jsonNull(this.props.data);
        console.log(data,'tabData');
        return (
            <div>
                <Row>
                    <Col span={3}></Col>
                    <Col span={18}>
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
                                    <td>{data.area}</td>
                                    <td>编号:</td>
                                    <td>{data.supplierCode}</td>
                                </tr>
                                <tr>
                                    <td>联系人:</td>
                                    <td>{data.lxr}</td>
                                    <td>联系电话:</td>
                                    <td>{data.lxdh}</td>
                                </tr>
                                <tr>
                                    <td>经营许可范围:</td>
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
        return (
            <div>
                {
                    this.props.children
                    ||
                    <div>
                        {this.showTable()}
                    </div>
                }
            </div>
        )
    }
}
module.exports = BasicInfo;
