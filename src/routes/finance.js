export default {
    path: '/finance',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../containers/Finance'))
      })
      
    },
    childRoutes: [
        { path: '/finance/purchaseGather',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Finance/purchaseGather'))
            })
          }
        }, 
        { path: '/finance/useGather',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Finance/useGather'))
            })
          }
        }, 
        { path: '/finance/stockGather',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Finance/stockGather'))
            })
          }
        }, 
        { path: '/finance/dynamicGather',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Finance/dynamicGather'))
            })
          }
        }, 
        { path: '/finance/myProduct',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Finance/myProduct'))
            })
          },
          childRoutes: [
            {
              path: '/finance/myProduct/classify',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Finance/myProduct/classify'))
                })
              }
            }
          ]
        }
    ]
  }