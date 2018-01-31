import { CREATE_APPLY } from '../actions';

const initState = {
  applyId:'',
  addressId: '',
  deptGuid: '',
  storageGuid: '',
  dataSource: [],
}

const Apply = (state = initState, action) => {
  switch (action.type) {
    case CREATE_APPLY:
      return Object.assign({}, state, action.json);
    default:
      return state
  }
}

export default Apply;