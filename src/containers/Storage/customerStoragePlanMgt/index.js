/**
 * @file 库房计划管理
 */
import React from 'react';
import { Tabs } from 'antd';
import PhPlan from './phPlan/phPlan';
import GzPlan from './gzPlan/gzPlan';
import ShsPlan from './shsPlan/shsPlan';
import JsPlan from './jsPlan/jsPlan';

const TabPane = Tabs.TabPane;

class PlanMgt extends React.Component{
    state = {
        activeKey: '1'
      }
    render(){
        const query = typeof this.props.location.query === 'undefined' ? {} : this.props.location.query
        const selectTab = typeof query.activeKey === 'undefined' ? '1' : query.activeKey;
        return(
            <div>
            {this.props.children || 
                <div>
                    <Tabs defaultActiveKey={selectTab}>
                    <TabPane tab="普耗计划单" key="1">
                        <PhPlan router={this.props.router}/>
                    </TabPane>
                    <TabPane tab="高值计划单" key="2">
                        <GzPlan router={this.props.router}/>
                    </TabPane>
                    <TabPane tab="手术计划单" disabled key="3">
                        <ShsPlan router={this.props.router}/>
                    </TabPane>
                    <TabPane tab="结算计划单" key="4">
                        <JsPlan router={this.props.router}/>    
                    </TabPane>
                </Tabs>
                </div>
            }
            </div>
        )
    }
}
module.exports = PlanMgt;