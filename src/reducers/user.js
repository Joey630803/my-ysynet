import {
  RECEIVE_USERINFO, MESSAGE_READ_UPDATE, MESSAGE_UNREAD_UPDATE
} from '../actions';
import { Map } from 'immutable';
const UserInfo = (state = {}, action) => {
  let map = Map(state);
  switch (action.type) {
    case RECEIVE_USERINFO:
      return Object.assign({}, state, action.json);
    case MESSAGE_READ_UPDATE:
      return map.set('unreadMessage', state.unreadMessage - 1).toJS();
    case MESSAGE_UNREAD_UPDATE:
      return map.set('unreadMessage', action.json).toJS();
    default:
      return state
  }
}

export default UserInfo;