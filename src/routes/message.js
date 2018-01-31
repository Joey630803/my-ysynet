export default {
  path: '/message',
  getComponent: (nextState, cb) => {
    require.ensure([], (require) => {
      cb(null, require('../containers/Message'))
    })
  },
  childRoutes: [
      { path: '/message/postMessage',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Message/PostMessage'))
          })
        }
      } , 
      { path: '/message/inbox',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Message/Inbox'))
          })
        }
      } ,
      { path: '/message/outbox',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Message/Outbox'))
          })
        }
      } , 
      { path: '/message/global',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Message/Global'))
          })
        },
        childRoutes: [
          { path: '/message/global/setting',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Message/Global/setting'))
              })
            }
          } 
        ]
      } ,
      {
        path: '/message/manager',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Message/Manager'))
          })
        },
        childRoutes: [
          { path: '/message/manager/edit',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Message/Manager/edit'))
              })
            }
          } 
        ]
      } 
  ]
}