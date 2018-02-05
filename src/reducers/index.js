import { combineReducers } from 'redux'
import Menu from './menu';
import User from './user';
import Order from './order';
import Apply from './apply';
import AddPh from './addPh';
import AddGzPlan from './addGzPlan';
import AddJsPlan from './addJsPlan';
import initialization from './initialization';
import AddZwWareHouse from './addZwWareHouse';
const rootReducer = combineReducers({
  Menu,
  User,
  Order,
  Apply,
  AddPh,
  AddGzPlan,
  AddJsPlan,
  initialization,
  AddZwWareHouse,
})

export default rootReducer;

