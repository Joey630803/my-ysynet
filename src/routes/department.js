export default {
    path: '/department',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../containers/Department'))
      })
    },
    childRoutes: [
        {
          path: '/department/operApply',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Department/operApply'))
            })
          },
          childRoutes: [
            {
              path: '/department/highApply/add',//新增
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/highApply/add'))
                })
              },
              onEnter: (nextState, replace, next) => {
                const { location } = nextState;
                if (!location.state) {
                  replace('/department/highApply')
                } 
                next();
              }
            },
            {
              path: '/department/operApply/details',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/operApply/details'))
                })
              },
              onEnter: (nextState, replace, next) => {
                const { location } = nextState;
                if (!location.state) {
                  replace('/department/highApply')
                } 
                next();
              }
            },
            {
              path: '/department/operApply/addBrand',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/operApply/addBrand'))
                })
              },
              onEnter: (nextState, replace, next) => {
                // const { location } = nextState;
                // if (!location.state) {
                //   replace('/department/highApply')
                // } 
                next();
              }
            },
          ]  
        },
        {
          path: '/department/highApply',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Department/highApply'))
            })
          },
          childRoutes: [
            {
              path: '/department/highApply/details',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/highApply/details'))
                })
              },
              onEnter: (nextState, replace, next) => {
                const { location } = nextState;
                if (!location.state) {
                  replace('/department/highApply')
                } 
                next();
              }
            },
            {
              path: '/department/highApply/template',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/highApply/template'))
                })
              },
              onEnter: (nextState, replace, next) => {
                const { location } = nextState;
                if (!location.state) {
                  replace('/department/highApply')
                } 
                next();
              }
            }
          ]  
        },
        { path: '/department/depart',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Department/dept'))
            })
          },
          childRoutes: [
            {
              path: '/department/depart/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/dept/add'))
                })
              }
            },
            {
              path: '/department/depart/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/dept/edit'))
                })
              }
            },
            {
              path: '/department/depart/choice',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/dept/choiceUser'))
                })
              }
            },
             {
              path: '/department/depart/address',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/dept/address'))
                })
              }
            },
          ]
        }, 
        { path: '/department/deptMaterial',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Department/deptMaterial'))
            })
          }
        }, 
        { path: '/department/template',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Department/template'))
            })
          },
          childRoutes: [
            {
              path: '/department/template/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/template/add'))
                })
              }
            }
          ]
        }, 
        {path: '/department/departApply',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Department/departApply'))
            })
          },
          childRoutes: [
            {
              path: '/department/departApply/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/departApply/add'))
                })
              }
            },
            {
              path: '/department/departApply/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/departApply/edit'))
                })
              }
            },
            {
              path: '/department/departApply/show',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/departApply/show'))
                })
              }
            },
            {
              path: '/department/departApply/addTemplate',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/departApply/addTemplate'))
                })
              }
            },
            {
              path: '/department/departApply/AddMaterial',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/departApply/AddMaterial'))
                })
              }
            }
          ]
        }, 
        { path: '/department/departCheck',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Department/departCheck'))
            })
          },
            childRoutes: [
            {
              path: '/department/departCheck/show',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/departCheck/show'))
                })
              }
            },
            {
              path: '/department/departCheck/check',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/departCheck/check'))
                })
              }
            },
            {
              path: '/department/departCheck/hvShow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/departCheck/HighValShow'))
                })
              }
            },
            {
              path: '/department/departCheck/hvCheck',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/departCheck/highValCheck'))
                })
              }
            },
            {
              path: '/department/departCheck/opShow',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/departCheck/operShow'))
                })
              }
            },
            {
              path: '/department/departCheck/opCheck',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/departCheck/operCheck'))
                })
              }
            }
            ]
        }, 
        //使用登记
        { path: '/department/useRegister',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Department/useRegister'))
            })
          },
          childRoutes: [
            {
              path: '/department/useRegister/register',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/useRegister/register'))
                })
              }
            },
            {
              path: '/department/useRegister/details',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/useRegister/details'))
                })
              }
            },
            {
              path: '/department/useRegister/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/useRegister/edit'))
                })
              }
            },
          ]
        },
        //患者计费
        {
          path: '/department/patientBilling',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Department/patientBilling'))
            })
          },
          childRoutes: [
            {
              path: '/department/patientBilling/billing',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/patientBilling/billing'))
                })
              }
            },
            {
              path: '/department/patientBilling/operDetail',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/patientBilling/operDetail'))
                })
              }
            },
            {
              path: '/department/patientBilling/highDetail',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/patientBilling/highDetail'))
                })
              }
            },
            {
              path: '/department/patientBilling/operRefund',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/patientBilling/operRefund'))
                })
              }
            },
            {
              path: '/department/patientBilling/highRefund',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/patientBilling/highRefund'))
                })
              }
            },
            {
              path: '/department/patientBilling/recharge',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Department/patientBilling/recharge'))
                })
              }
            },
          ]
        }
    ]
  }