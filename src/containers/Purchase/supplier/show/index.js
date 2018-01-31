/**
 * @file 供应商详情
 */
import React from 'react';
import { Breadcrumb, Row, Col,Tabs} from 'antd';
import { Link } from 'react-router';
import BasicInfo from './basicInfo';
import YyLicense from './yyLicense';
import PermitLicense from './permit';

const TabPane = Tabs.TabPane;

class SupplierShow extends React.Component {
  state = {
    activeKey: '1'
  }
  render() {
    const query = typeof this.props.location.query === 'undefined' ? {} : this.props.location.query ;
    const selectTab = typeof query.activeKey === 'undefined' ? '1' : query.activeKey;
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
                  <Breadcrumb.Item><Link to={this.props.location.state.from}>我的供应商</Link></Breadcrumb.Item>
                  <Breadcrumb.Item>{title || ''}</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
            <Tabs defaultActiveKey={selectTab}>
              <TabPane tab='基本信息' key='1'>
                <BasicInfo router={this.props.router} data={this.props.location.state}/>
              </TabPane>
              <TabPane tab='营业执照' key='2'>
                <YyLicense router={this.props.router} src={this.props.location.state.yyzzPath}/>
              </TabPane>
              <TabPane tab='许可证' key='3'>
                <PermitLicense router={this.props.router} src={this.props.location.state.jyxkPath}/>
              </TabPane>
            </Tabs>
          </div>
        }
      </div>
    )
  }
}

module.exports = SupplierShow;