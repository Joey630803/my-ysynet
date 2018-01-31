export default {
    path: '/approve',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../containers/Approve'))
      })
      
    },
    childRoutes: [
        { path: '/approve/ApprovalMgt',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Approve/ApprovalMgt'))
            })
          },
          childRoutes: [
            {
              path: '/approve/ApprovalMgt/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Approve/ApprovalMgt/edit'))
                })
              }
            },
            {
              path: '/approve/ApprovalMgt/checkUser',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Approve/ApprovalMgt/checkUser'))
                })
              }
            }
          ]
        }, 
        { path: '/approve/ReciptCheck',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Approve/ReciptCheck'))
            })
          },
          childRoutes: [
            {
              path: '/approve/ReciptCheck/show',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Approve/ReciptCheck/show'))
                })
              }
            },
            {
              path: '/approve/ReciptCheck/operShow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Approve/ReciptCheck/operShow'))
                })
              }
            }
          ]
        }
    ]
  }