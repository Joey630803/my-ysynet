export default {
    path: '/system',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../containers/System'))
      })
    },
    childRoutes: [
        { path: '/system/user',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/System/User'))
            })
          },
          childRoutes: [
            {
              path: '/system/user/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/User/actions'))
                })
              }
            },
            {
              path: '/system/user/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/User/show'))
                })
              }
            },
            {
              path: '/system/user/show',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/User/show'))
                })
              }
            }
          ]
        }, { 
            path: '/system/userGroup',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/System/UserGroup'))
              })
            },
            childRoutes: [
              {
                path: '/system/userGroup/chose',
                getComponent: (nextState, cb) => {
                  require.ensure([], (require) => {
                    cb(null, require('../containers/System/UserGroup/chose'))
                  })
                }
              },
              {
                path: '/system/userGroup/add',
                getComponent: (nextState, cb) => {
                  require.ensure([], (require) => {
                    cb(null, require('../containers/System/UserGroup/add'))
                  })
                }
              },
              {
                path: '/system/userGroup/setting',
                getComponent: (nextState, cb) => {
                  require.ensure([], (require) => {
                    cb(null, require('../containers/System/UserGroup/setting'))
                  })
                }
              }
            ]
          },{
              path: '/system/record',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/Record'))
                })
              },
              childRoutes: [
              {
                path: '/system/record/show',
                getComponent: (nextState, cb) => {
                  require.ensure([], (require) => {
                    cb(null, require('../containers/System/Record/show'))
                  })
                }
              }
            ]
          },
          //运营中心数据字典
          { path: '/system/itemsData',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/System/itemsData'))
            })
          },
          childRoutes: [
            {
              path: '/system/itemsData/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/itemsData/add'))
                })
              }
            },{
              path: '/system/itemsData/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/itemsData/edit'))
                })
              }
            },{
              path: '/system/itemsData/categoryMgt',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/itemsData/categoryMgt'))
                })
              }
            },{
              path: '/system/itemsData/categoryMgt/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/itemsData/categoryMgtAdd'))
                })
              }
            },{
              path: '/system/itemsData/categoryMgt/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/itemsData/categoryMgtEdit'))
                })
              }
            },{
              path: '/system/itemsData/categoryMgt/clone',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/itemsData/categoryMgtClone'))
                })
              }
            }]
           },
          //客户数据字典
          { path: '/system/customerItemsData',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/System/CustomerItemsData'))
            })
          },
          childRoutes: [
            {
              path: '/system/customerItemsData/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/CustomerItemsData/add'))
                })
              }
            },{
              path: '/system/customerItemsData/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/CustomerItemsData/edit'))
                })
              }
            }]
           },
          //客户中心用户
          { path: '/system/customerUser',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/System/CustomerUser'))
            })
          },
          childRoutes: [
            {
              path: '/system/customerUser/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/CustomerUser/actions'))
                })
              }
            },
            {
              path: '/system/customerUser/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/CustomerUser/show'))
                })
              }
            },
            {
              path: '/system/customerUser/show',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/System/CustomerUser/show'))
                })
              }
            }
          ]
        }, { 
          path: '/system/customerUserGroup',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/System/CustomerUserGroup'))
              })
            },
            childRoutes: [
              {
                path: '/system/customerUserGroup/chose',
                getComponent: (nextState, cb) => {
                  require.ensure([], (require) => {
                    cb(null, require('../containers/System/CustomerUserGroup/chose'))
                  })
                }
              },
              {
                path: '/system/customerUserGroup/add',
                getComponent: (nextState, cb) => {
                  require.ensure([], (require) => {
                    cb(null, require('../containers/System/CustomerUserGroup/add'))
                  })
                }
              },
              {
                path: '/system/customerUserGroup/setting',
                getComponent: (nextState, cb) => {
                  require.ensure([], (require) => {
                    cb(null, require('../containers/System/CustomerUserGroup/setting'))
                  })
                }
              }
            ]
          }
    ]
  }