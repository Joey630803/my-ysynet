import {
    CREATE_ADDPH,
  } from '../actions';
  
  const initState = {
    addressId: '',
    remark: '',
    storageGuid: '',
    dataSource: [],
    total: ''
  }
  
  const AddPh = (state = initState, action) => {
    switch (action.type) {
      case CREATE_ADDPH:
        return Object.assign({}, state, action.json);
      default:
        return state
    }
  }
  
  export default AddPh;