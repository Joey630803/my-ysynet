export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const RECEIVE_USERINFO = 'RECEIVE_USERINFO';
export const MESSAGE_READ_UPDATE = 'MESSAGE_READ_UPDATE';
export const MESSAGE_UNREAD_UPDATE = 'MESSAGE_UNREAD_UPDATE';
export const CREATE_ORDER = 'CREATE_ORDER';
export const GET_ORDER = 'GET_ORDER';
export const CREATE_APPLY = 'CREATE_APPLY';
export const GET_APPLY = 'GET_APPLY';
export const CREATE_ADDPH = 'CREATE_ADDPH';
export const GET_ADDPH = 'GET_ADDPH';
export const CREATE_ADDGZPLAN = "CREATE_ADDGZPLAN";
export const GET_ADDGZPLAN = "GET_ADDGZPLAN";
export const CREATE_ADDJSPLAN = "CREATE_ADDJSPLAN";
export const GET_ADDJSPLAN = "GET_ADDJSPLAN";
export const CREATE_INITIALIZATION = "CREATE_INITIALIZATION";
export const GET_INITIALIZATION = "GET_INITIALIZATION";

export const receivePosts = (json) => ({
  type: RECEIVE_POSTS,
  json
})
export const receiveUserInfo = (json) => ({
  type: RECEIVE_USERINFO,
  json
})
export const messageReadUpdate = (json) => ({
  type: MESSAGE_READ_UPDATE,
  json
})

export const messageUnreadUpdate = (json) => ({
  type: MESSAGE_UNREAD_UPDATE,
  json
})

export const createOrder = (json) => ({
  type: CREATE_ORDER,
  json
})

export const getOrder = (json) => ({
  type: GET_ORDER,
  json
})

export const createApply = (json) => ({
  type: CREATE_APPLY,
  json
})

export const getApply= (json) => ({
  type: GET_APPLY,
  json
})
// 普耗
export const createAddPh = (json) => ({
  type: CREATE_ADDPH,
  json
})

export const getAddPh= (json) => ({
  type: GET_ADDPH,
  json
})
//高值
export const createAddGzPlan = (json) => ({
  type: CREATE_ADDGZPLAN,
  json
})

export const getAddGzPlan= (json) => ({
  type: GET_ADDGZPLAN,
  json
})
//高值
export const createAddJsPlan = (json) => ({
  type: CREATE_ADDJSPLAN,
  json
})

export const getAddJsPlan= (json) => ({
  type: GET_ADDJSPLAN,
  json
})

//入库初始化
export const createInitialization = (json) => ({
  type: CREATE_INITIALIZATION,
  json
})

export const getInitialization= (json) => ({
  type: GET_INITIALIZATION,
  json
})