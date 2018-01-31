import React from 'react';
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux';
import { getSubMenu } from 'utils/tools';
import { Link } from 'react-router';

const { Sider, Content } = Layout;
class BasicData extends React.Component {
  render() {
    let subMenu = false;
    if(typeof this.props.userState.Menu.length !== 'undefined') {
      subMenu = getSubMenu(this.props.userState.Menu, this.props.location.pathname);
    }
    const currentPage = this.props.location.pathname.split('/')[2] ? this.props.location.pathname.split('/')[2].toUpperCase() : '';
    return (
      <Layout>
        <Sider width={200} style={{ background: '#fff' ,minHeight:document.body.clientHeight - 172}}>
          <Menu
            mode="inline"
            style={{ height: '100%' }}
            selectedKeys={[currentPage]}
          >
        {
            subMenu ? 
                subMenu.map( (menu, index) => {
                    return <Menu.Item key={menu.key.toUpperCase()}><Link to={menu.path}>{menu.name}</Link></Menu.Item>;
                })
            : null   
        }
        </Menu>
        </Sider>
        <Content style={{backgroundColor: '#fff'}}>
          {this.props.children}
        </Content>
      </Layout>    
    );
  }
}
const mapStateToProps = state => ({
  userState: state
})
module.exports = connect(mapStateToProps)(BasicData);