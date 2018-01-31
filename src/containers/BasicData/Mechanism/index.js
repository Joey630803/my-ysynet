import React from 'react';
import { Tabs } from 'antd';
import Hospital from './hospital';
import Supplier from './supplier'
const TabPane = Tabs.TabPane;

class Mechanism extends React.Component {
  state = {
    activeKey: 'hospital'
  }
  render() {
    const query = typeof this.props.location.query === 'undefined' ? {} : this.props.location.query
    const selectTab = typeof query.activeKey === 'undefined' ? 'hospital' : query.activeKey;
    return (
      <div style={{padding: 5}}>
        { this.props.children 
            ||        
          <Tabs defaultActiveKey={selectTab} >
            <TabPane tab="医疗机构" key="hospital">
              <Hospital router={this.props.router}/>
            </TabPane>
            <TabPane tab="供应商" key="supplier" >
              <Supplier router={this.props.router}/>
            </TabPane>
          </Tabs>
        }
      </div>
    );
  }
}
module.exports = Mechanism;