import {
  CREATE_ZWADDWAREHOUSE,
  } from '../actions';
  
  const initState = {
    storageGuid: '',
    fOrgId: '',
    remark: '',
    dataSource: [],
  }
  
  const AddZwWareHouse = (state = initState, action) => {
    switch (action.type) {
      case CREATE_ZWADDWAREHOUSE:
        return Object.assign({}, state, action.json);
      default:
        return state
    }
  }
  
  export default AddZwWareHouse;