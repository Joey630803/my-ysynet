import React, { Component } from 'react'
import { hashHistory } from 'react-router';
import { Layout, notification} from 'antd';
import Nav from 'component/Nav';
import Welcome from './Welcome';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../actions'
import { FetchPost, removeItems, sessionOut } from 'utils/tools';
import { login } from '../api';
const { Content, Footer } = Layout;

//不用对比的本地地址
//let unCheckPath = ['HOME','/PERSONS/PERSONAL','/PERSONS/MODIFYPWD'];
// 检查路径
const checkPath = (ownList, index) => {
  const path = window.location.hash.split('#')[1].replace(/\s/g,'').toUpperCase();
  //console.log(ownList, index)
  for (let i=0; i< ownList.length; i++) {
    if (path.includes(ownList[i].path.replace(/\s/g,'').toUpperCase()) || path.includes('HOME') || path.includes('/PERSONS/PERSONAL')|| path.includes('/PERSONS/MODIFYPWD')) {
      return true
    } else if (ownList[i].subMenus && ownList[i].subMenus.length) {
      for (let j=0; j<ownList[i].subMenus.length; j++) {
        if (path.includes(ownList[i].subMenus[j].path.replace(/\s/g,'').toUpperCase())) {
          return true;
        }
      }
    }
  }
}

class Home extends Component { 

  componentWillReceiveProps(nextProps) {
    if (!checkPath(nextProps.actionState.Menu)) {
      hashHistory.push({pathname: '/*'})
    }
  }
  
  componentDidMount() {
    const state = typeof this.props.location.state !== 'undefined' ? this.props.location.state : {};
    //get user menu
    FetchPost(login.USER_MENU)
    .then(response => {
      if(response.status === 999 || response.status === 998) {
        sessionOut();
      } else {
        return response.json();
      }
    })
    .then(json => {
      if ( checkPath(json.result, 1) ) {
        this.props.actions.receivePosts(json.result);
        //get user info
        FetchPost(login.USER_INFO)
        .then(response => {
          if(response.status === 999 || response.status === 998) {
            sessionOut()
          } else {
            return response.json();
          }
        })
        .then(json => {
          this.props.actions.receiveUserInfo(json.result)
          if (localStorage.getItem('userId') && localStorage.getItem('userId') !== json.result.userId) {
            //清空相关缓存
            removeItems(['templateDept'])
          }
          localStorage.setItem('userId', json.result.userId);
        })
        .catch(err => sessionOut())
        } else {
          hashHistory.push({pathname: '/*'})
      }
    })
    .catch(err => sessionOut())
    // if the password is default, give a tip
     if(state.tips && state.tips !== 'success') {
      notification.warning({
        message: '账号密码安全提示',
        description: state.tips,
      })
    }
  }
  getContent() {
    const pathname = this.props.location.pathname;  
    return (
      <div>
        <Nav position='left' 
             menuList={ this.props.actionState.Menu } 
             defaultSelect={pathname.split('/')[1]} 
             user={this.props.actionState.User }
        />
        <Content style={{padding: '16px 12px'}}>
          {this.props.children || <Welcome/>}
        </Content>
        <Footer style={{ textAlign: 'center' ,height:70}}>
          CopyRight ©2017 医商云 YSYNET.COM 版权所有
        </Footer>
      </div>  
    )
  }
  render() {
    return (
        <Layout style={{minHeight:document.body.clientHeight}}>
        { this.getContent() }
        </Layout>
    )
  }
}
export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})
export const mapStateToProps = state => ({
  actionState: state
})
module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);