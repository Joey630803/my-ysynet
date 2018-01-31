export default {
    path: '/basicData',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../containers/BasicData'))
      })
    },
    getIndexRoute: (location, cb) => {
      cb(null, require('../containers/BasicData/Mechanism'))
    },
    childRoutes: [
        { path: '/basicData/product',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/BasicData/Product'))
            })
          },
           childRoutes: [
            {
              path: '/basicData/product/change',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/Product/change'))
                })
              }
            },{
              path: '/basicData/product/show',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/Product/show'))
                })
              }
            },{
              path: '/basicData/product/record',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/Product/record'))
                })
              }
            }]
        }, 
        { path: '/basicData/productCert',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/BasicData/productCert'))
            })
          },
           childRoutes: [
            {
              path: '/basicData/productCert/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/productCert/add'))
                })
              }
            },{
              path: '/basicData/productCert/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/productCert/edit'))
                })
              }
            },{
              path: '/basicData/productCert/product',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/productCert/product'))
                })
              }
            },{
              path: '/basicData/productCert/productAdd',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/productCert/productAdd'))
                })
              }
            },{
              path: '/basicData/productCert/productEdit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/productCert/productEdit'))
                })
              }
            },{
              path: '/basicData/productCert/changeCert',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/productCert/changeCert'))
                })
              }
            },{
              path: '/basicData/productCert/batchEdit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/productCert/batchEdit'))
                })
              }
            },{
              path: '/basicData/productCert/productAllEdit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/productCert/productAllEdit'))
                })
              }
            }]
        }, 
        { path: '/basicData/mechanism',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/BasicData/Mechanism'))
            })
          },
          childRoutes: [
            {
              path: '/basicData/mechanism/hospitalAdd',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/Mechanism/hospital-add'))
                })
              },
            },
            {
              path: '/basicData/mechanism/hospitalShow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/Mechanism/hospital-show'))
                })
              },
            },
            {
              path: '/basicData/mechanism/hospitalEdit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/Mechanism/hospital-show'))
                })
              },
            },
            {
              path: '/basicData/mechanism/supplierAdd',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/Mechanism/supplier-add'))
                })
              },
            },
            {
              path: '/basicData/mechanism/supplierShow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/Mechanism/supplier-show'))
                })
              },
            },
            {
              path: '/basicData/mechanism/business',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/Mechanism/supplier-business'))
                })
              },
            },
            {
              path: '/basicData/mechanism/supplierEdit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/BasicData/Mechanism/supplier-show'))
                })
              },
            }
          ]
        }, 
        
    ]
  }