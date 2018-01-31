import React from 'react';
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router';

const { Sider, Content } = Layout;
class Persons extends React.Component {
  render() {
       let currentPage = this.props.location.pathname.split('/')[2] ? this.props.location.pathname.split('/')[2].toUpperCase() : '';
  return (
      <Layout>
        <Sider width={200} style={{ background: '#fff' ,minHeight:document.body.clientHeight - 172}}>
          <Menu
            mode="inline"
            style={{ height:'100%'}}
            selectedKeys={[currentPage]}
          >
          <Menu>
            <Menu.Item key="PERSONAL"><Link to='/persons/personal'>基本资料</Link></Menu.Item>
            <Menu.Item key="MODIFYPWD"><Link  to='/persons/modifyPwd'>账号密码</Link></Menu.Item>
          </Menu>
        </Menu>
        </Sider>
        <Content style={{backgroundColor: '#fff', padding: '10px' }}>
          {this.props.children || '账号信息'}
        </Content>
      </Layout>    
    );
  }
}
const mapStateToProps = state => ({
  userState: state
})
module.exports = connect(mapStateToProps)(Persons);