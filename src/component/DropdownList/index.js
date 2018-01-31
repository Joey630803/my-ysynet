import React from 'react';
import { Menu, Dropdown, Icon, Badge } from 'antd';
import { hashHistory } from 'react-router';

class DropdownList extends React.Component {
  selectHandler = (link) => {
    const uri = location.hash.substring(2, location.hash.length);
    if(uri !== link) {
      hashHistory.push(link);
      if (link === 'login') {
        window.location.reload();
      }
    }
  }
  menus = () => {
    return (
      <Menu style={this.props.style}>
        {
          this.props.list.map( (item, index) => {
            return (
              <Menu.Item key={index}>
                <a onClick={this.selectHandler.bind(this, item.link)}>{item.text}</a>
              </Menu.Item>
            )
          })
        }
      </Menu>
    )
  }
  render() {
    return (
      <Dropdown overlay={this.menus()} trigger={['click']} style={this.props.style}>
        <Badge count={this.props.unread}>
          <a className="ant-dropdown-link">
            {this.props.text || 'down'} <Icon type="down" />
          </a>
        </Badge>
      </Dropdown>
    )
  }
}

export default DropdownList;