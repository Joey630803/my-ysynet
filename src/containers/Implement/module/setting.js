import React from 'react';
import { Layout, Breadcrumb, Checkbox, Button, message } from 'antd';
import { Link } from 'react-router';
import { implement } from 'api'
import { FetchPost } from 'utils/tools';
const { Content } = Layout;
const CheckboxGroup = Checkbox.Group;

class ModuleSetting extends React.Component {
  state = {
    userOptions: [],
    userCheckList: [],
    implementOptions: [],
    implementCheckList: [],
    userIndeterminate: false,
    implementIndeterminate: false,
    userCheckAll: false,
    implementCheckAll: false,
    dirtyClick: false
  };
  submitHandler = () => {
    const posts = this.state.userCheckList.concat(this.state.implementCheckList);
    this.setState({ dirtyClick: true });
    FetchPost(implement.ORG_SETTING_SAVE, 
    'orgId=' + this.props.location.state.ORG_ID + '&modules=' + posts)
    .then(res => {
      this.setState({ dirtyClick: false });
      return res.json();
    })
    .then(json => {
      message.success('保存成功!')
      console.log(json)
    })
    .catch(err => console.log(err))
  }
  fetch = (params = {}) => {
    FetchPost(implement.ORG_SETTING, 
              'orgId=' + this.props.location.state.ORG_ID)
    .then(res => res.json())
    .then(json => {
      let user = [], implementation = [], userCheckList = [], implementCheckList = [];
      json.result.map((item, index) => {
        if(item.PARENT_MODULEID === 'm2') {
          user = [...user, 
            { label: item.MODULE_NAME, value: item.MODULE_ID }
          ];
          if(item.ORGFLAG) {
            userCheckList = [...userCheckList, item.MODULE_ID ]
          }
        } else {
          implementation = [...implementation, { label: item.MODULE_NAME, value: item.MODULE_ID }];
          if(item.ORGFLAG) {
            implementCheckList = [...implementCheckList, item.MODULE_ID ]
          }
        }
        return null;
      })
      this.setState({
        userOptions: user,
        userCheckList: userCheckList,
        implementOptions: implementation,
        implementCheckList: implementCheckList,
        userCheckAll: !!userCheckList.length && (userCheckList.length === user.length),
        implementCheckAll: !!implementCheckList.length && (implementCheckList.length === implementation.length),
        userIndeterminate: !!userCheckList.length && (userCheckList.length < user.length),
        implementIndeterminate: !!implementCheckList.length && (implementCheckList.length < implementation.length),
      })
    })
    .catch(err => console.log(err))
  }
  componentDidMount() {
    this.fetch();
  }
  onChangeAllUser = (e) => {
    this.setState({
      userCheckList: e.target.checked ? this.checkAll(this.state.userOptions): [],
      userIndeterminate: false,
      userCheckAll: e.target.checked,
    });
  }
  checkAll = (options) => {
    let checkAll = [];
    options.map((item, index) => {
      return checkAll = [...checkAll, item.value];
    })
    return checkAll;
  }
  onChangeAllImplement = (e) => {
    this.setState({
      implementCheckList: e.target.checked ? this.checkAll(this.state.implementOptions) : [],
      implementIndeterminate: false,
      implementCheckAll: e.target.checked,
    });
  }
  onChangeUser = (userCheckList) => {
    this.setState({
      userCheckList,
      userIndeterminate: !!userCheckList.length && (userCheckList.length < this.state.userOptions.length),
      userCheckAll: userCheckList.length === this.state.userOptions.length,
    });
  }
  onChangeImplement = (implementCheckList) => {
    this.setState({
      implementCheckList,
      implementIndeterminate: !!implementCheckList.length && (implementCheckList.length < this.state.implementOptions.length),
      implementCheckAll: implementCheckList.length === this.state.implementOptions.length,
    });
  }
  render() {
    return (
       <Layout style={{backgroundColor: '#fff', minHeight: 480}}>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/implement/module'>模块管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>配置模块</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{padding: 16}}>
          <div style={{ borderBottom: '1px solid #E9E9E9' }}>
            <Checkbox
              indeterminate={this.state.userIndeterminate}
              onChange={this.onChangeAllUser}
              checked={this.state.userCheckAll}
            >
              用户中心
            </Checkbox>
          </div>
          <CheckboxGroup 
            options={this.state.userOptions} 
            onChange={this.onChangeUser}
            value={this.state.userCheckList}
          />
          <div style={{ borderBottom: '1px solid #E9E9E9', marginTop: 40 }}>
            <Checkbox
              indeterminate={this.state.implementIndeterminate}
              onChange={this.onChangeAllImplement}
              checked={this.state.implementCheckAll}
            >
              运营中心
            </Checkbox>
          </div>
          <CheckboxGroup 
            options={this.state.implementOptions} 
            onChange={this.onChangeImplement}
            value={this.state.implementCheckList}
          />

          <Button 
            type="primary" 
            loading={this.state.dirtyClick}
            style={{marginTop: 150}} 
            onClick={this.submitHandler}>
            保存  
          </Button>
        </Content>
      </Layout>
    )  
  }
}
module.exports = ModuleSetting;