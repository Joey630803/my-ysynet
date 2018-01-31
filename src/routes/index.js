import React from 'react';
import { Router, hashHistory } from 'react-router';
import basicData from './basicData';//基础数据
import system from './system';//系统管理
import purchase from './purchase';//采购管理
import sales from './sales';//销售管理
import implement from './implement';//实施模块
import checkdata from './checkData';//审核机构
import persons from './persons';//个人用户设置
import department from './department';//科室管理
import storage from './storage';//库房
import message from './message';//消息
import tender from './tender';//招标
import approve from './approve';//审批
import finance from './finance';//财务


class YSYRoute extends React.Component {
  render (){
    let routes = {
      childRoutes: [
        {
          path: '/',
          getComponent: (nextState, cb) => {
            //if 验证登录成功, 加载Home组件
            //else 验证登录失败, 加载Login组件
            // require.ensure([], (require) => {
            //   cb(null, require('../containers/Login'))
            // })
          },
          onEnter: () => {
            hashHistory.push({pathname: '/login'})//路由进入即触发
          }
        },
        {
          path: 'login',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Login'))
            })
          }
        },
        {
          path: 'register',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Register'))
            })
          }
        },
        { 
          path: 'home',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Home'))
            })
          },
          childRoutes: [
            basicData, //依次挂载相关属性
            system,
            purchase,
            sales,
            message,
            implement,
            checkdata,
            persons,
            department,
            storage,
            message,
            tender,
            approve,
            finance
          ]
        },
        {
          path: '*',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Error'))
            })
          }
        },
      ]
    }
    return (
      <Router 
        history={hashHistory}
        routes={routes}
      >
      </Router>
    )
  }
}

module.exports = YSYRoute;