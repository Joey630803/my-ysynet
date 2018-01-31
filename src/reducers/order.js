import {
  CREATE_ORDER,
} from '../actions';

const initState = {
  addressId: '',
  expectDate: '',
  storageGuid: '',
  dataSource: [],
  total: ''
}

const Order = (state = initState, action) => {
  switch (action.type) {
    case CREATE_ORDER:
      return Object.assign({}, state, action.json);
    default:
      return state
  }
}

export default Order;