import React from 'react';
import { Tabs } from 'antd';
import NorPlan from './NorPlan';
import HighValuePlan from './HighValuePlan';
import OperPlan from './OperPlan';
import JsPlan from './jsPlan';
const TabPane = Tabs.TabPane;

class PurchasePlan extends React.Component {
  state = {
    activeKey: 'APPLY'
  }
  render() {
    const query = typeof this.props.location.query === 'undefined' ? {} : this.props.location.query
    const selectTab = typeof query.activeKey === 'undefined' ? 'APPLY' : query.activeKey;
    return (
      <div style={{padding: 5}}>
        { this.props.children 
            ||        
          <Tabs defaultActiveKey={selectTab} >
            <TabPane tab="普耗计划单" key="APPLY">
              <NorPlan router={this.props.router}/>
            </TabPane>
            <TabPane tab="高值计划单" key="HIGH_PLAN" >
              <HighValuePlan router={this.props.router}/>
            </TabPane> 
            <TabPane tab="手术计划单" key="OPER_PLAN" disabled>
              <OperPlan router={this.props.router}/>
            </TabPane>
            <TabPane tab="结算计划单" key="JS_PLAN" >
              <JsPlan router={this.props.router}/>
            </TabPane>
          </Tabs>
        }
      </div>
    );
  }
}
module.exports = PurchasePlan;