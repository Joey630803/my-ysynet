import {
  RECEIVE_POSTS
} from '../actions';


const Menu = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return action.json;
    default:
      return state
  }
}

export default Menu;