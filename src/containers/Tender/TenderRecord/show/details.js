/**
 * @file 招标记录--招标详情--产品详情
 */
import React from 'react';
import { Breadcrumb, Row, Col} from 'antd';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { Link } from 'react-router';
import { tender } from 'api';
class ProductShow extends React.Component{
    state = {
        baseData:''
    }
    componentDidMount = ()=>{
        fetchData(tender.TENDERDETAILEEDITLIST,
            querystring.stringify({tenderDetailGuid:this.props.location.state.tenderDetailGuid}),(data)=>{
                if(data.status){
                    this.setState({ baseData : data.result })
                }
        })
    }
    render(){
        const baseData = this.state.baseData;
        return (
            <div>
                {
                    this.props.children
                    ||
                    <div>
                        <Row>
                            <Col>
                                <Breadcrumb style={{fontSize: '1.1em',marginBottom : 24}}>
                                    <Breadcrumb.Item><Link to={{pathname:'/tender/tenderRecord',}}>招标记录</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to={{pathname:'/tender/tenderRecord/show',
                                            state:{
                                                tenderGuid:this.props.location.state.tenderGuid,
                                                rStorageGuid:this.props.location.state.rStorageGuid,
                                                releaseFlag:this.props.location.state.releaseFlag}}}
                                            >
                                            招标详情
                                        </Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>产品详情</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5}></Col>
                            <Col span={8}>
                                <Col className="ant-col-24">
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
                                <Col className="ant-col-24">
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
                                <Col className="ant-col-24">
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
                                <Col className="ant-col-24">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>证件效期</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.lastTime }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-24">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>分类</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.instrumentCode }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-24">
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
                                <Col className="ant-col-24">
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
                                <Col className="ant-col-24">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>供应商</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.fOrgName }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-24">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>备注</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.tfRemark }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-24">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>证件照片</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.tfAccessoryFile && <a href={tender.FTP+baseData.tfAccessoryFile.substring(1)} target='_blank'>点击浏览</a> }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Col>
                            <Col span={8}>
                                <Col className="ant-col-24">
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
                                <Col className="ant-col-24">
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
                                <Col className="ant-col-24">
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
                                <Col className="ant-col-24">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>骨科产品属性</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.attributeId }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-24">
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
                                <Col className="ant-col-24">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>招标单位</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.tenderUnit }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-24">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>招标价</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.tenderPrice }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-24">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>采购单位</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.purchaseUnit }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-24">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>产品材质</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.tfTexture }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-24">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>包装材质</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.packingTexture }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-24">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>包装规格</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.tfPacking }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="ant-col-24">
                                    <div className="ant-row">
                                        <div className="ant-col-6 ant-form-item-label-left">
                                            <label>挂网编码</label>
                                        </div>
                                        <div className="ant-col-18">
                                            <div className="ant-form-item-control">
                                                { baseData.purchaseNo }
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        )
    }
}
module.exports = ProductShow;