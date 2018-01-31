import React from 'react';
import { Menu, Layout,Row,Col} from 'antd';
import DropdownList from 'component/DropdownList';
const { Header } = Layout;
import { hashHistory } from 'react-router';

class Nav extends React.Component {
  render() {
    return (
      <Header style={{height: '70px', backgroundColor: '#fff',lineHeight:'70px'}}>
         <Row>
          <Col xs={8} sm={6} md={4} lg={4} key={1}>
             <a className='logo'></a>
          </Col>
          <Col xs={8} sm={12} md={16} lg={16} key={2}>
            {
              !this.props.isNotNav ? 
                <Menu
                  onSelect={ (e) => {
                    hashHistory.push(e.item.props.link);
                  }}
                  theme='light'
                  mode='horizontal'
                  style={{float: this.props.position, fontSize: '1.2em', marginTop: '15px'}}
                  selectedKeys={[this.props.defaultSelect ? this.props.defaultSelect.toUpperCase() : null]}
                >
                
                <Menu.Item key='HOME' link={'home'} style={{ paddingLeft:10,paddingRight:10 }}>首页</Menu.Item>
                {
                  typeof this.props.menuList.length === 'undefined' ? null : this.props.menuList.map( (menu, index) => {
                    return <Menu.Item key={menu.key.toUpperCase()} link={menu.subMenus[0].path} style={{ paddingLeft:10,paddingRight:10 }}>{menu.name}</Menu.Item>;
                  })
                }
                </Menu>
                : null
            }
          </Col>
          {
         
            typeof this.props.user === 'undefined' ? null :
              <Col xs={8} sm={6} md={4} lg={4} style={{textAlign:'right'}} key={3}>
              <DropdownList
                  list={[
                    {link: '/persons/personal', text: '设置'}, 
                    {link: '/message/inbox', text: '收件箱'},
                    {link: 'login', text: '退出'}
                  ]}
                  style={{width: 100}}
                  unread={this.props.user.unreadMessage}
                  text={this.props.user.userName}
              />
              </Col>
          }
        </Row>
      </Header>  
    )
  }
}

export default Nav;