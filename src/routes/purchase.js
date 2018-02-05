//import { hasPower } from '../utils/tools';
export default {
    path: '/purchase',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../containers/Purchase'))
      })
    },
    childRoutes: [
        {
          path: '/purchase/newOrder',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/newOrder'))
            })
          },
          childRoutes: [
            {
              path: '/purchase/newOrder/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/newOrder/add'))
                })
              },
              onEnter: (nextState, replace, next) => {
                // const canUse = typeof nextState.location.state !== 'undefined' 
                //   && nextState.location.state.storageGuid;
                // hasPower(canUse, '/purchase/newOrder', next)
                next();
              }
            },
          ]
        },
        {
          path: '/purchase/myOrder',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/myOrder'))
            })
          },
          childRoutes: [
            {
              path: '/purchase/myOrder/details',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/myOrder/details'))
                })
              },
              // onEnter: (nextState, replace, next) => {
              //   const canUse = typeof nextState.location.state !== 'undefined';
              //   hasPower(canUse, '/purchase/myOrder', next)
              // }
            },
            {
              path: '/purchase/myOrder/operDetails',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/myOrder/operDetails'))
                })
              }
            },
            {
                path: '/purchase/myOrder/bagShow',
                getComponent: (nextState, cb) => {
                  require.ensure([], (require) => {
                    cb(null, require('../containers/Purchase/myOrder/operShow/operBagShow'))
                  })
                }
            },
            {
              path: '/purchase/myOrder/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/myOrder/add'))
                })
              },
              // onEnter: (nextState, replace, next) => {
              //   const canUse = typeof nextState.location.state !== 'undefined';
              //   hasPower(canUse, '/purchase/myOrder', next)
              // }
            },
            {
              path: '/purchase/myOrder/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/myOrder/edit'))
                })
              }
            }
          ]
        },
        {
          path: '/purchase/product',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/product'))
            })
          },
          childRoutes: [
            {
              path: '/purchase/product/show',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/product/show'))
                })
              }
            },
            {
              path: '/purchase/product/adjustPrice',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/product/adjustPrice'))
                })
              }
            },
          ]
        },
        { 
          path: '/purchase/supplier',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/supplier'))
            })
          },
          childRoutes: [
            {
              path: '/purchase/supplier/product',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/supplier/product'))
                })
              }
            },
            {
              path: '/purchase/supplier/supplierChange',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/supplier/supplierChange'))
                })
              }
            },
            {
              path: '/purchase/supplier/show',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/supplier/show'))
                })
              }
            },
            {
              path: '/purchase/supplier/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/supplier/edit'))
                })
              }
            },
          ]
        }, 
        {
          path: '/purchase/deliveryCheck',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/deliveryCheck'))
              })
            }
        },
        {
          path: '/purchase/myDelivery',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/myDelivery'))
              })
            },
          childRoutes: [
          {
            path: '/purchase/myDelivery/show',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/myDelivery/show'))
              })
            }
          },
          {
            path: '/purchase/myDelivery/operDetails',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/myDelivery/operDetails'))
              })
            }
          },
          {
            path: '/purchase/myDelivery/bagShow',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/myDelivery/operShow/operBagShow'))
              })
            }
          },
          ]
        }, 
        {
          path: '/purchase/invoiceCheck',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/invoiceCheck'))
              })
            },
          childRoutes: [
          {
            path: '/purchase/invoiceCheck/show',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/invoiceCheck/show'))
              })
            }
          },
          {
            path: '/purchase/invoiceCheck/zwShow',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/invoiceCheck/zwShow'))
              })
            }
          }]
        },
        {
          path: '/purchase/myInvoice',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/myInvoice'))
              })
            },
          childRoutes: [
          {
            path: '/purchase/myInvoice/show',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/myInvoice/show'))
              })
            }
          },
          {
            path: '/purchase/myInvoice/zwShow',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/myInvoice/zwShow'))
              })
            }
          }]
        },
        {
          path: '/purchase/summaryMgt',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/summaryMgt'))
              })
            },
          childRoutes: [
          {
            path: '/purchase/summaryMgt/show',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/summaryMgt/show'))
              })
            }
          }]
        }, 
        {
          path: '/purchase/purchasePlanMgt',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/purchasePlanMgt'))
              })
            },
          childRoutes: [
            {
              path: '/purchase/purchasePlanMgt/NorPlan',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/purchasePlanMgt/NorPlan'))
                })
              },
            },
            {
              path: '/purchase/purchasePlanMgt/norDetails',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/purchasePlanMgt/NorPlan_show'))
                })
              },
            },
            {
              path: '/purchase/purchasePlanMgt/highValuePlan',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/purchasePlanMgt/HighValuePlan'))
                })
              },
            },
            {
              path: '/purchase/purchasePlanMgt/deptDetail',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/purchasePlanMgt/HighVal_detail'))
                })
              },
            },
            {
              path: '/purchase/purchasePlanMgt/highValStorageShow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/purchasePlanMgt/NorPlan_show'))
                })
              },
            },
            {
              path: '/purchase/purchasePlanMgt/OperPlanShow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/purchasePlanMgt/OperPlan_show'))
                })
              },
            },
            {
              path: '/purchase/purchasePlanMgt/OperPlan',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/purchasePlanMgt/OperPlan'))
                })
              },
            },
            {
              path: '/purchase/purchasePlanMgt/jsPlan',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/purchasePlanMgt/jsPlan'))
                })
              },
            },
            {
              path: '/purchase/purchasePlanMgt/jsPlanShow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Purchase/purchasePlanMgt/jsPlanShow'))
                })
              },
            }
            ]
        },{
          path: '/purchase/finance',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/finance'))
              })
            },
          childRoutes: [
          {
            path: '/purchase/finance/show',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/finance/show'))
              })
            }
          },  {
            path: '/purchase/finance/checkout',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/finance/checkout'))
              })
            }
          }]
        },
        {
          path: '/purchase/changeCert',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/changeCert'))
              })
            },
          childRoutes: [
          {
            path: '/purchase/changeCert/product',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/changeCert/product'))
              })
            }
          },  {
            path: '/purchase/changeCert/change',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/changeCert/change'))
              })
            }
          },  {
            path: '/purchase/changeCert/classify',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/changeCert/classify'))
              })
            }
          }]
        },
        {
          path: '/purchase/zwSupplier',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/zwSupplier'))
              })
            },
          childRoutes: [
          {
            path: '/purchase/zwSupplier/edit',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/zwSupplier/edit'))
              })
            }
          }, {
            path: '/purchase/zwSupplier/add',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/zwSupplier/add'))
              })
            }
          }]
        },
        {
          path: '/purchase/zwMaterial',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Purchase/zwMaterial'))
              })
            },
          childRoutes: [
          {
            path: '/purchase/zwMaterial/edit',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/zwMaterial/edit'))
              })
            }
          },
          {
            path: '/purchase/zwMaterial/addProduct',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Purchase/zwMaterial/addProduct'))
              })
            }
          }]
        }
    ]
  }