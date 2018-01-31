//import { hasPower } from '../utils/tools';
export default {
    path: '/sales',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../containers/Sales'))
      })
    },
    childRoutes: [
        {
          path: '/sales/myOrder',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Sales/myOrder'))
            })
          },
          childRoutes: [
            {
              path: '/sales/myOrder/phStock',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Sales/myOrder/stock/phHvStock'))
                })
              },
              // onEnter: (nextState, replace, next) => {
              //   const canUse = typeof nextState.location.state !== 'undefined';
              //   hasPower(canUse, '/sales/myOrder', next)
              // }
            },
            {
              path: '/sales/myOrder/opStock',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Sales/myOrder/stock/operStock'))
                })
              },
              // onEnter: (nextState, replace, next) => {
              //   const canUse = typeof nextState.location.state !== 'undefined';
              //   hasPower(canUse, '/sales/myOrder', next)
              // }
            },
            {
              path: '/sales/myOrder/settStock',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Sales/myOrder/stock/settStock'))
                })
              },
              // onEnter: (nextState, replace, next) => {
              //   const canUse = typeof nextState.location.state !== 'undefined';
              //   hasPower(canUse, '/sales/myOrder', next)
              // }
            },
            {
              path: '/sales/myOrder/details',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Sales/myOrder/details'))
                })
              }
            },
            {
              path: '/sales/myOrder/operDetails',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Sales/myOrder/operDetails'))
                })
              }
            },
            {
              path: '/sales/myOrder/bagShow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Sales/myOrder/operShow/operBagShow'))
                })
              }
            },
            {
              path: '/sales/myOrder/addTemplate',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Sales/myOrder/stock/template'))
                })
              }
            },
            {
              path: '/sales/myOrder/addProduct',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Sales/myOrder/stock/addProduct'))
                })
              }
            },
            {
              path: '/sales/myOrder/choiceTool',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Sales/myOrder/stock/choiceTool'))
                })
              }
            }
          ]
        },
        {
          path: '/sales/vendorMaterial',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Sales/VendorMaterial'))
            })
          }
        },
        { path: '/sales/customer',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Sales/Customer'))
            })
          },
          childRoutes: [
            {
              path: '/sales/customer/show',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Sales/Customer/show'))
                })
              }
            }
          ]
        },{ path: '/sales/order',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Sales/Customer'))
            })
          }
        },{ path: '/sales/salesMyDelivery',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Sales/salesMyDelivery'))
            })
          },
          childRoutes: [
          {
            path: '/sales/salesMyDelivery/show',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Sales/salesMyDelivery/show'))
              })
            }
          },
          {
            path: '/sales/salesMyDelivery/qrcode',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Sales/salesMyDelivery/qrcode'))
              })
            }
          },
          {
            path: '/sales/salesMyDelivery/operDetails',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Sales/salesMyDelivery/operDetails'))
              })
            }
          }]
        },
         { path: '/sales/salesMyInvoice',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Sales/salesMyInvoice'))
            })
          },
          childRoutes: [
          {
            path: '/sales/salesMyInvoice/show',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Sales/salesMyInvoice/show'))
              })
            }
          },{
            path: '/sales/salesMyInvoice/edit',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Sales/salesMyInvoice/edit'))
              })
            }
          }]
        },{ path: '/sales/addDelivery',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Sales/addDelivery'))
            })
          }
        },{ path: '/sales/stockTemplate',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Sales/stockTemplate'))
          })
        },
        childRoutes: [
        {
          path: '/sales/stockTemplate/addProduct',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Sales/stockTemplate/addProduct'))
            })
          }
        },{
          path: '/sales/stockTemplate/product',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Sales/stockTemplate/product'))
            })
          }
        },{
          path: '/sales/stockTemplate/operBag',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Sales/stockTemplate/operBag'))
            })
          }
        },{
          path: '/sales/stockTemplate/choiceTool',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Sales/stockTemplate/choiceTool'))
            })
          }
        }]
      }
    ]
}