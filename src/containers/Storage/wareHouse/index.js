/**
 * 入库管理
 */
import React from 'react';
import { Tabs } from 'antd';
import WareHouseRecord from './wareHouseRecord';
import WareHouseDetails from './wareHouseDetails';

const TabPane = Tabs.TabPane;

class WareHouse extends React.Component{
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
                    <TabPane tab="入库记录" key="1">
                        <WareHouseRecord router={this.props.router}/>
                    </TabPane>
                    <TabPane tab="入库明细" key="2">
                        <WareHouseDetails router={this.props.router}/>
                    </TabPane>
                </Tabs>
                </div>
            }
            </div>
        )
    }
}

module.exports = WareHouse;