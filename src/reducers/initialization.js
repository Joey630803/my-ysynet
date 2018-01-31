import {
    CREATE_INITIALIZATION,
  } from '../actions';
  
  const initState = {
    remark: '',
    storageGuid: '',
    dataSource: [],
  }
  
  const initialization = (state = initState, action) => {
    switch (action.type) {
      case CREATE_INITIALIZATION:
        return Object.assign({}, state, action.json);
      default:
        return state
    }
  }
  
  export default initialization;