/**
 * @file 患者计费--计费
 */
import React from 'react';
import { Row, Col, Breadcrumb, Tabs } from 'antd';
import { Link } from 'react-router';
import OperAccount from './operAccounting';
import HighAccount from './gzAccounting';
const TabPane = Tabs.TabPane;
class Billing extends React.Component{
    state = {
        activeKey: '1'
    }
    render(){
        const query = typeof this.props.location.query === 'undefined' ? {} : this.props.location.query ;
        const selectTab = typeof query.activeKey === 'undefined' ? '2' : query.activeKey;
        return (
        <div>
            {this.props.children || 
                <div>
                    <Row>
                        <Col className="ant-col-6">
                            <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                <Breadcrumb.Item><Link to='/department/patientBilling'>患者计费</Link></Breadcrumb.Item>
                                <Breadcrumb.Item>我的计费</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row>
                    <Tabs defaultActiveKey={selectTab}>
                        <TabPane tab="手术" key="1" disabled>
                            <OperAccount router={this.props.router}/>
                        </TabPane>
                        <TabPane tab="高值" key="2">
                            <HighAccount 
                                router={this.props.router}
                                chargeGuid={this.props.location.state.chargeGuid}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            }
        </div>
        )
    }
}
module.exports = Billing;