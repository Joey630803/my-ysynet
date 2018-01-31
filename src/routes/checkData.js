export default {
    path: '/checkdata',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../containers/checkData'))
      })
    },
    childRoutes: [
        { path: '/checkdata/mechanism',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/checkData/Mechanism'))
            })
          },
          childRoutes: [
            {
              path: '/checkdata/mechanism/mshow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/checkData/Mechanism/mshow'))
                })
              }
            },
             {
              path: '/checkdata/mechanism/supshow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/checkData/Mechanism/supshow'))
                })
              }
            },
          ]
        },{ path: '/checkdata/productMgt',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/checkData/ProductMgt'))
            })
          },
          childRoutes: [
            {
              path: '/checkdata/productMgt/pshow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/checkData/ProductMgt/pshow'))
                  
                })
              }
            },
             {
              path: '/checkdata/productMgt/pcshow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/checkData/ProductMgt/pcshow'))
                })
              }
            },
            {
              path: '/checkdata/productMgt/model',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/checkData/ProductMgt/model'))
                })
              }
            }
          ]
        }
    ]
  }