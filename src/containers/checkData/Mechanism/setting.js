import React from 'react';
import { Breadcrumb, Menu, Icon, Button, Checkbox, message } from 'antd';
import { Link } from 'react-router';

const SubMenu = Menu.SubMenu;

const MenuList = [
  {
    key: "1", text: '系统模块', subMenu: [
      {key: "1001", text: '用户管理'},
      {key: "1002", text: '消息配置'},
      {key: "1003", text: '操作记录'},
    ]
  },
  {
    key: "2", text: '基础模块', subMenu: [
      {key: "2001", text: '机构管理'},
      {key: "2002", text: '产品管理'},
    ]
  },
  {
    key: "3", text: '审核模块', subMenu: [
      {key: "3001", text: '机构审核'},
      {key: "3002", text: '产品审核'},
    ]
  },
  {
    key: "4", text: '实施模块', subMenu: [
      {key: "4001", text: '模块管理'},
      {key: "4002", text: '库房管理'},
    ]
  },
   {
    key: "6", text: '销售模块', subMenu: [
      {key: "6001", text: '客户管理'},
      {key: "6002", text: '订单管理'},
      {key: "6002", text: '送货管理'},
      {key: "6002", text: '发票管理'}
    ]
  }
]

class UserSetting extends React.Component {
  state = {
    dirtyClick: false,
    roles: [],
    subRole: []
  }
  fetch = (params = {}) => {
    const roles = [{
      "key": 1001,
      "text": "用户管理"
    }, {
      "key": 1002,
      "text": "消息配置"
    }]
    this.setState({
      roles
    })
  }
  isCheck = (key) => {
    let result = false;
    this.state.roles.map((item, index) => {
      if(key == item.key) {
        result = true;
      }
    }) 
    return result;
  }
  componentDidMount() {
    this.fetch();
  }
  menuClickHandler = (item, key, keyPath) => {
    MenuList.filter( (menu, index) => {
      if(menu.key == item.key) {
        this.setState({
          subRole: menu.subMenu
        })
      }
    })
  }
  deleteHandler = (key) => {
    let roles = [];
    this.state.roles.map( (item, index) => {
      if(key != item.key) {
        roles = [...roles, item]
      }
    }) 
    this.setState({
      roles
    })
  }
  chosen = (chosen, e) => {
    let roles = this.state.roles;
    if(e.target.checked) {
      roles.push(chosen);
      this.setState({
        roles
      })
    } else {
      this.deleteHandler(chosen.key)
    }  
  }
  saveHandler = () => {
    this.setState({
      dirtyClick: true
    })
    //模拟提交
    setTimeout( () => {
      this.setState({
        dirtyClick: false
      })
      console.log('提交数据', this.state)
      message.success('用户配置成功!');
    }, 1000)
  }
  render() {
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/system/user'>用户管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>配置用户</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{float: 'left' }}>
          <Menu 
            style={{ width: 240, minHeight: 420 }}
            mode='inline' 
            defaultOpenKeys={['sub1']}
          >
            <SubMenu key="sub1" disabled='true' title={<span style={{color: '#108ee9'}}><Icon type="appstore" /><span>已选中模块</span></span>}>
              {this.state.roles.map( (item, index) => {
                return <Menu.Item key={item.key}>
                        {item.text}
                        <Icon  onClick={this.deleteHandler.bind(this, item.key)} style={{marginLeft: 50}} type="close"/>
                      </Menu.Item>
              })}
            </SubMenu>
          </Menu>
          <Button 
            type="primary" 
            loading={this.state.dirtyClick}
            onClick={this.saveHandler} 
            style={{marginLeft: 80}}>
            保存
          </Button>
        </div>
        <Menu 
          style={{ width: 240, minHeight: 420, float: 'left' }}
          mode='inline' 
          defaultOpenKeys={['sub1']}
          onClick={this.menuClickHandler}
        >
          <SubMenu key="sub1" disabled='true'  title={<span style={{color: '#108ee9'}}><Icon type="appstore" /><span>全部产品</span></span>}>
            {
              MenuList.map( (item, index) => {
                return <Menu.Item key={item.key}>
                        {item.text}
                       </Menu.Item>
              })
            }
          </SubMenu> 
        </Menu>
        <Menu 
          style={{ width: 240, minHeight: 420, float: 'left' }}
          mode='inline' 
          defaultOpenKeys={['sub1']}
        >
        <SubMenu key="sub1" disabled='true'  title={<span style={{color: '#108ee9'}}><Icon type='bars'/>子菜单</span>}>
            {
              this.state.subRole.map( (item, index) => {
                return <Menu.Item key={item.key}>
                          <Checkbox 
                            checked={this.isCheck(item.key)}
                            onChange={this.chosen.bind(this, {
                              key: item.key,
                              text: item.text
                            })}
                          >
                            {item.text}
                          </Checkbox>
                       </Menu.Item>
              })
            }
          </SubMenu>  
        </Menu>
      </div>
    )  
  }
}
module.exports = UserSetting;