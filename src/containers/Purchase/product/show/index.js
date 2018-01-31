/**
 * @file 我的产品--详情
 */
import React from 'react';
import { Row, Col, Breadcrumb, Tabs } from 'antd';
import { Link } from 'react-router';
import BasicInfo from './basicInfo';
import Certificates from './certificates';
import ChangePrice from './changePrice';
import SupplyRecord from './supplyRecord';
import CertChange from './certChange';
import UnitChange from './unitChange';
const TabPane = Tabs.TabPane;
class ProductShow extends React.Component{
    state = {
        activeKey: '1'
    }
    render(){
        const query = typeof this.props.location.query === 'undefined' ? {} : this.props.location.query ;
        const selectTab = typeof query.activeKey === 'undefined' ? '1' : query.activeKey;
        return (
            <div>
            {
                this.props.children 
                ||
                <div>
                <Row>
                    <Col className="ant-col-6">
                        <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to='/purchase/product'>我的产品</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>产品详情</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row>
                <Tabs defaultActiveKey={selectTab}>
                    <TabPane tab="基本信息" key="1">
                        <BasicInfo router={this.props.router} data={this.props.location.state}/>
                    </TabPane>
                    <TabPane tab="证件信息" key="2">
                        <Certificates  router={this.props.router} data={this.props.location.state}/>
                    </TabPane>
                    <TabPane tab="调价记录" key="3">
                        <ChangePrice  router={this.props.router} data={this.props.location.state}/>
                    </TabPane>
                    <TabPane tab="证件变更记录" key="4">
                        <CertChange  router={this.props.router} data={this.props.location.state}/>
                    </TabPane>
                    <TabPane tab="供货记录" key="5">
                        <SupplyRecord  router={this.props.router} data={this.props.location.state}/>
                    </TabPane>
                    <TabPane tab="单位变更记录" key="6">
                        <UnitChange  router={this.props.router} data={this.props.location.state}/>
                    </TabPane>
                </Tabs>
            </div> 
            }     
        </div>
        )
    }
}
module.exports = ProductShow;