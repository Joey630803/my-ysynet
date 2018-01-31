/**
 * @file 出库管理
 */

import React from 'react';
import { Tabs } from 'antd';
import OutRecord from './outRecord';
import OutDetail from './outDetail';

const TabPane = Tabs.TabPane;

class OutMgt extends React.Component{
    state = {
        activeKey: '1'
    }
    render () {
        const query = typeof this.props.location.query === 'undefined' ? {} : this.props.location.query ;
        const selectTab = typeof query.activeKey === 'undefined' ? '1' : query.activeKey;
        return(
            <div>
            {this.props.children || 
                <div>
                    <Tabs defaultActiveKey={selectTab}>
                    <TabPane tab="出库记录" key="1">
                        <OutRecord router={this.props.router}/>
                    </TabPane>
                    <TabPane tab="出库明细" key="2">
                        <OutDetail router={this.props.router}/>
                    </TabPane>
                </Tabs>
                </div>
            }
            </div>
        )
    }
}

module.exports = OutMgt;