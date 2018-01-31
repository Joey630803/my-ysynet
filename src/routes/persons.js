export default {
    path: '/persons',
    getComponent: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, require('../containers/Personal'))
      })
    },
    childRoutes: [
        { path: '/persons/personal',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Personal/show'))
            })
          }
        },
         { path: '/persons/modifyPwd',
          getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../containers/Personal/modifyPwd'))
            })
          }
        }
    ]
}