import { hashHistory } from 'react-router';
import { message } from 'antd';
export default {
    path: '/tender',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../containers/Tender'))
      })
    },
    childRoutes: [
      {
        path: '/tender/sourceManager',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Tender/SourceManager'))
          })
        },
         childRoutes: [
           {
              path: '/tender/sourceManager/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Tender/SourceManager/add'))
                })
              }
           },
           {
              path: '/tender/sourceManager/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Tender/SourceManager/edit'))
                })
              }
           },
           {
              path: '/tender/sourceManager/sourceMaterial/material',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Tender/SourceManager/sourceMaterial/material'))
                })
              },
              childRoutes: [
                {
                    path: '/tender/sourceManager/sourceMaterial/material/choice',
                    getComponent: (nextState, cb) => {
                      require.ensure([], (require) => {
                        cb(null, require('../containers/Tender/SourceManager/sourceMaterial/choiceMaterial'))
                      })
                    }
                },
                {
                  path: '/tender/sourceManager/sourceMaterial/material/edit',
                  getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                      cb(null, require('../containers/Tender/SourceManager/sourceMaterial/edit'))
                    })
                  }
                },
                {
                  path: '/tender/sourceManager/sourceMaterial/material/change',
                  getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                      cb(null, require('../containers/Tender/SourceManager/sourceMaterial/change'))
                    })
                  }
                }
              ]
           }
         ]
      },
      {
        path: '/tender/apply',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Tender/Apply'))
          })
        },
        childRoutes: [
        {
            path: '/tender/apply/add',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/Apply/add'))
              })
            }
          },
           {
              path: '/tender/apply/pcshow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Tender/Apply/pcshow'))
                })
              }
           },
           {
            path: '/tender/apply/details',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/Apply/details'))
              })
            },
            onEnter: (nextState, replace, next) => {
              if (typeof nextState.location.state !== 'undefined') {
                next();
              } else {
                message.warn('您未拥有该页面权限!')
                hashHistory.push({
                  pathname: '/tender/apply'
                })
              }
            }
          }
        ]
      },
      { 
        path: '/tender/product',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Tender/Product'))
          })
        },
        onEnter: (nextState, replace, next) => {
          next();
        },
        childRoutes: [
          {
            path: '/tender/product/change',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/Product/change'))
              })
            }
          },
          {
            path: '/tender/product/chose',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/Product/chose'))
              })
            }
          },
          {
            path: '/tender/product/details',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/Product/details'))
              })
            }
          },
          {
            path: '/tender/product/percent',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/Product/percent'))
              })
            }
          },
          {
            path: '/tender/product/batchEdit',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/Product/batchEdit'))
              })
            }
          },
          {
            path: '/tender/product/changePrice',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/Product/changePrice'))
              })
            }
          }
        ]
      }, 
      {
        path: '/tender/priceRecord',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Tender/PriceRecord'))
          })
        }
      }, 
      {
        path: '/tender/changeRecord',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Tender/ChangeRecord'))
          })
        }
      },
      {
        path: '/tender/tenderRecord',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Tender/TenderRecord'))
          })
        },
        childRoutes:[
          {
            path: '/tender/tenderRecord/add',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/TenderRecord/add'))
              })
            }
          },
          {
            path: '/tender/tenderRecord/edit',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/TenderRecord/edit'))
              })
            }
          },
          {
            path: '/tender/tenderRecord/show',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/TenderRecord/show'))
              })
            }
          },
          {
            path: '/tender/tenderRecord/details',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/TenderRecord/show/details'))
              })
            }
          },
          {
            path: '/tender/tenderRecord/detailsEdit',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/TenderRecord/show/edit'))
              })
            }
          },
          {
            path: '/tender/tenderRecord/batchEdit',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/TenderRecord/show/batchEdit'))
              })
            }
          },
          {
            path: '/tender/tenderRecord/addProduct',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Tender/TenderRecord/show/addProduct'))
              })
            }
          },
        ]
      }
    ]
  }