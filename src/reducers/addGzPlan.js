import {
    CREATE_ADDGZPLAN,
  } from '../actions';
  
  const initState = {
    addressId: '',
    remark: '',
    storageGuid: '',
    dataSource: [],
    total: ''
  }
  
  const AddGzPlan = (state = initState, action) => {
    switch (action.type) {
      case CREATE_ADDGZPLAN:
        return Object.assign({}, state, action.json);
      default:
        return state
    }
  }
  
  export default AddGzPlan;