//实施模块
export default {
    path: '/implement',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../containers/Implement'))
      })
    },
    childRoutes: [
        { path: '/implement/module',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Implement/module'))
            })
          },
          childRoutes: [
            {
              path: '/implement/module/setting',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Implement/module/setting'))
                })
              }
            }
          ]
        },
        { path: '/implement/configMgt',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Implement/configMgt'))
            })
          },
          childRoutes: [
            {
              path: '/implement/configMgt/storage',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Implement/configMgt/storage/list'))
                })
              },
              childRoutes: [
                {
                  path: '/implement/configMgt/storage/add',
                  getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                      cb(null, require('../containers/Implement/configMgt/storage/add'))
                    })
                  }
                },
                {
                  path: '/implement/configMgt/storage/edit',
                  getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                      cb(null, require('../containers/Implement/configMgt/storage/edit'))
                    })
                  }
                }
              ]
            },
            {
              path: '/implement/configMgt/depart',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Implement/configMgt/depart/list'))
                })
              },
              childRoutes: [
                {
                  path: '/implement/configMgt/depart/add',
                  getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                      cb(null, require('../containers/Implement/configMgt/depart/add'))
                    })
                  }
                },
                {
                  path: '/implement/configMgt/depart/edit',
                  getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                      cb(null, require('../containers/Implement/configMgt/depart/edit'))
                    })
                  }
                }
              ]
            },
            {
              path: '/implement/configMgt/approve',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Implement/configMgt/approve/list'))
                })
              },
              childRoutes: [
                {
                  path: '/implement/configMgt/approve/add',
                  getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                      cb(null, require('../containers/Implement/configMgt/approve/add'))
                    })
                  }
                },
                {
                  path: '/implement/configMgt/approve/edit',
                  getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                      cb(null, require('../containers/Implement/configMgt/approve/edit'))
                    })
                  }
                }
              ]
            }
          ]
        }
    ]
}