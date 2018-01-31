export default {
    path: '/storage',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../containers/Storage'))
      })
    },
    childRoutes: [
        { path: '/storage/storageMgt',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Storage/StorageMgt'))
            })
          },
          childRoutes: [
            {
              path: '/storage/storageMgt/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/StorageMgt/add'))
                })
              }
            },
            {
              path: '/storage/storageMgt/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/StorageMgt/edit'))
                })
              }
            }
          ]
        },
        { path: '/storage/applyStorageMgt',
          getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Storage/applyStorageMgt'))
          })
          },
        childRoutes: [
          {
            path: '/storage/applyStorageMgt/showPh',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Storage/applyStorageMgt/showPh'))
              })
            }
          },
          {
            path: '/storage/applyStorageMgt/showGz',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Storage/applyStorageMgt/showGz'))
              })
            }
          }
        ]
      },
          //客户中心库房
        { path: '/storage/customerStorage',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Storage/CustomerStorage'))
            })
          },
          childRoutes: [
            {
              path: '/storage/customerStorage/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/CustomerStorage/add'))
                })
              }
            },
            {
              path: '/storage/customerStorage/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/CustomerStorage/edit'))
                })
              }
            },
            {
              path: '/storage/customerStorage/choice',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/CustomerStorage/choiceUser'))
                })
              }
            },
            {
              path: '/storage/customerStorage/depart',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/CustomerStorage/depart'))
                })
              }
            },
            {
              path: '/storage/customerStorage/address',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/CustomerStorage/address'))
                })
              }
            }
          ]
        },
        //客户中心库房产品
        { path: '/storage/customerStorageMaterial',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Storage/CustomerStorageMaterial'))
            })
          },
          childRoutes: [
            {
              path: '/storage/customerStorageMaterial/allEdit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/CustomerStorageMaterial/allEdit'))
                })
              }
            },
            {
              path: '/storage/customerStorageMaterial/edit',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/CustomerStorageMaterial/edit'))
                })
              }
            },
            {
              path: '/storage/customerStorageMaterial/choice',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/CustomerStorageMaterial/choiceMaterial'))
                })
              }
            }
          ]
        },
        { path: '/storage/customerStoragePlanMgt',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Storage/customerStoragePlanMgt'))
            })
          },
          childRoutes: [
            //普耗计划
            {
              path: '/storage/customerStoragePlanMgt/phPlan/addPh',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/phPlan/addPh'))
                })
              }
            },
            {
              path: '/storage/customerStoragePlanMgt/phPlan/editPh',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/phPlan/editPh'))
                })
              }
            },
            {
              path: '/storage/customerStoragePlanMgt/phPlan/showPh',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/phPlan/showPh'))
                })
              }
            },
            {
              path: '/storage/customerStoragePlanMgt/phPlan/addPhMaterial',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/phPlan/addPhMaterial'))
                })
              }
            },
            {
              path: '/storage/customerStoragePlanMgt/phPlan/editPhMaterial',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/phPlan/editPhMaterial'))
                })
              }
            },
            //高值计划
            {
              path: '/storage/customerStoragePlanMgt/gzPlan/addGzPlan',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/gzPlan/addGzPlan'))
                })
              }
            },
            {
              path: '/storage/customerStoragePlanMgt/gzPlan/editGzPlan',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/gzPlan/editGzPlan'))
                })
              }
            },
            {
              path: '/storage/customerStoragePlanMgt/gzPlan/showGz',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/gzPlan/showGz'))
                })
              }
            },
            {
              path: '/storage/customerStoragePlanMgt/gzPlan/addGzMaterial',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/gzPlan/addGzMaterial'))
                })
              }
            },
            {
              path: '/storage/customerStoragePlanMgt/gzPlan/editGzMaterial',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/gzPlan/editGzMaterial'))
                })
              }
            },
            //结算计划
            {
              path: '/storage/customerStoragePlanMgt/jsPlan/addJsPlan',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/jsPlan/addJsPlan'))
                })
              }
            },
            {
              path: '/storage/customerStoragePlanMgt/jsPlan/editJsPlan',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/jsPlan/editJsPlan'))
                })
              }
            },
            {
              path: '/storage/customerStoragePlanMgt/jsPlan/jsRecord',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/jsPlan/jsRecord'))
                })
              }
            },
            {
              path: '/storage/customerStoragePlanMgt/jsPlan/showJsPlan',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/jsPlan/showJsPlan'))
                })
              }
            },
            //手术计划
            {
              path: '/storage/customerStoragePlanMgt/shsPlan/showShsPlan',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/customerStoragePlanMgt/shsPlan/showShsPlan'))
                })
              }
            }
            
          ]
        },   //客户中心库房入库管理
        { path: '/storage/wareHouse',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Storage/wareHouse'))
            })
          },
          childRoutes: [
            {
              path: '/storage/wareHouse/wareHouseRecord',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/wareHouse/wareHouseRecord'))
                })
              }
            },
            {
              path: '/storage/wareHouse/wareHouseDetails',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/wareHouse/wareHouseDetails'))
                })
              }
            },
            {
              path: '/storage/wareHouse/add',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/wareHouse/add'))
                })
              }
            },
            {
              path: '/storage/wareHouse/addProduct',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/wareHouse/addProduct'))
                })
              }
            },
            {
              path: '/storage/wareHouse/show',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/wareHouse/show'))
                })
              }
            },
            {
              path: '/storage/wareHouse/refund',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/wareHouse/refund'))
                })
              }
            },
            {
              path: '/storage/wareHouse/initialization',
              getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                  cb(null, require('../containers/Storage/wareHouse/initialization'))
                })
              }
            }
          ]
        },
        //库存查询
        { path: '/storage/stockQuery',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Storage/stockQuery'))
          })
        },
        childRoutes: [
          {
            path: '/storage/stockQuery/show',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Storage/stockQuery/show'))
              })
            }
          },
        ]
      },
      //盘点管理
      { path: '/storage/inventoryMgt',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../containers/Storage/inventoryMgt'))
        })
      },
      childRoutes: [
        {
          path: '/storage/inventoryMgt/show',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Storage/inventoryMgt/show'))
            })
          }
        },
        {
          path: '/storage/inventoryMgt/showC',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Storage/inventoryMgt/showC'))
            })
          }
        }
      ]
    },
    //出库管理
  { path: '/storage/outMgt',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../containers/Storage/outMgt'))
      })
    },
    childRoutes: [
      {
        path: '/storage/outMgt/show',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Storage/outMgt/show'))
          })
        }
      },
      {
        path: '/storage/outMgt/picking',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Storage/outMgt/picking/picking'))
          })
        },
        childRoutes:[
          {
            path: '/storage/outMgt/confirm',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Storage/outMgt/picking/confirmPick'))
              })
            },
          },
          {
            path: '/storage/outMgt/endPick',
            getComponent: (nextState, cb) => {
              require.ensure([], (require) => {
                cb(null, require('../containers/Storage/outMgt/picking/endPick'))
              })
            },
          },
          
        ]
      },
      {
        path: '/storage/outMgt/receive',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Storage/outMgt/receive/receive'))
          })
        }
      },
      {
        path: '/storage/outMgt/phReceive',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Storage/outMgt/receive/phReceive'))
          })
        }
      },
      {
        path: '/storage/outMgt/phAdd',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Storage/outMgt/receive/phAdd'))
          })
        }
      },
      {
        path: '/storage/outMgt/operReceive',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Storage/outMgt/receive/operReceive'))
          })
        }
      },
      {
        path: '/storage/outMgt/operAdd',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Storage/outMgt/receive/operAdd'))
          })
        }
      },
      {
        path: '/storage/outMgt/backStorage',
        getComponent: (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../containers/Storage/outMgt/backStorage'))
          })
        }
      },
    ]
  },
    ]
  }