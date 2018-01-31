import {
  CREATE_ADDJSPLAN,
  } from '../actions';
  
  const initState = {
    addressId: '',
    remark: '',
    storageGuid: '',
    dataSource: [],
    total: ''
  }
  
  const AddJsPlan = (state = initState, action) => {
    switch (action.type) {
      case CREATE_ADDJSPLAN:
        return Object.assign({}, state, action.json);
      default:
        return state
    }
  }
  
  export default AddJsPlan;