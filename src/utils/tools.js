import { hashHistory } from 'react-router';
import { Modal, message } from 'antd';
import querystring from 'querystring';
import { login } from 'api';
import {_local} from 'api/local';
const confirm = Modal.confirm;
/**
 * @desc fetch post 
 * @param {string} api  url
 * @param {string || object} body params
 * @author vania
 * @returns response
 */
export const FetchPost = (api, 
  body, 
  type='application/x-www-form-urlencoded', 
  method='post') => {
  const query = typeof body === 'object' ? JSON.stringify(body) : body;
  return fetch(api, {
    method: method,
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': type
    },
    body: query
  })
}

export const fetchData = (
  api, body, callback, type='application/x-www-form-urlencoded', method='post'
) => {
  const query = typeof body === 'object' ? JSON.stringify(body) : body;
  fetch(api, {
    method: method,
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': type
    },
    body: query
  })
    .then(res => {
      
      switch (res.status) {
        case 997:
          hashHistory.push({pathname: '/login'});
          return message.warn('非法访问，请重新登录');
        case 998:
          hashHistory.push({pathname: '/login'});
          return message.warn('会话失效，请重新登录');
        case 999:
          hashHistory.push({pathname: '/login'});
          return message.warn('登录失效，请重新登录');
        default:
          return res.json();
      }
    })
    .then(data => {
      callback(data)
    })
    .catch(e => {
      console.log(e)
      message.error('存在异常' + e.message)
    });
}

/**
 * @desc navbar use to get submenu
 * @param {object array} menus 
 * @param {string} pathname 
 * @author vania
 * @returns menus
 */
export const getSubMenu = (menus, pathname) => {
  let menu = pathname.split('/')[1];
  let subMenus = [];
  let i = 0;
  for(;i<menus.length;i++) {
    const path = menus[i].path ? menus[i].path.split('/')[1].replace( /\//, '' ).toUpperCase() : '';
    if( path === menu.toUpperCase()) {
      subMenus = menus[i].subMenus;
    }
  }
  return subMenus;
}
/**
 * @desc router use to change 
 * @param {symbol} router 
 * @param {string} url 
 * @param {object} state 
 * @author vania
 * @returns null
 */
export const actionHandler = (router, url, state) => {
  router.push({ 
    pathname: url,
    state: state
  }); 
}
/**
 * @desc login use to check 
 * @param {object} nextState 
 * @param {function} replace 
 * @param {function} next 
 * @param {string} url 
 * @author vania
 * @returns null
 */
export const loginHandler = (nextState, replace, next, url=login.USER_INFO) => {
  //检查cookies
  this.loginCheck(url)
    .then(
      () => {
        return next();
      },
      () => {
        replace('/login')
        next()
      }
    )
}


/**
 * @desc private login check
 * @param {string} url
 * @author vania 
 * @returns null
 */
export const loginCheck = (url) => {
  return new Promise((resolve, reject) => {
    let fetchJ = FetchPost(url)
    fetchJ.then((res) => res.json()).then((json) => {
      if (json.result && json.status) {
        resolve();
      } else {
        reject();
      }
    })
  })
}

export const jsonNull =function(obj){
  for(var key in obj) { 
      if(JSON.stringify(obj[key])==="null") {
          obj[key] = "";
      } else if (typeof obj[key] ==="object") {
          obj[key] = jsonNull(obj[key]);
      }
   }
   return obj;
}

export const nvl = function(originVal,defval){
    if(typeof(originVal)==='undefined' || originVal==="null" || originVal==='undefined'){
      if(typeof(defval)!=='undefined'){
        return defval;
      }
      return null;
    }else{
      if(typeof originVal ==='string' && (originVal === '' || originVal.trim()==='')){
        if(typeof(defval)!=='undefined'){
          return defval;
        }
        return null;
      }
      return originVal;
    }
  }

/**
 * @desc get static data
 * @param { string } type 
 * @param { function } callback 
 * @author vania
 * @returns data
 */
export const CommonData = (type, cb, params={}, url) => {
  if(localStorage.getItem(type)) {
    cb(JSON.parse(localStorage.getItem(type)));
  } else {
    fetch(url || `${_local}/staticData/commonData?type=` + type, {
      credentials: 'include',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: querystring.stringify(params)
    })
    .then((res) => res.json())
    .then((json) => {
      cb(json.result)
      localStorage.setItem(type, JSON.stringify(json.result));
    })
    .catch((err) => cb(err))
  }
}

/**
 * @desc get static private data
 * @param { string } type 
 * @param { function } callback 
 * @author gaofengjiao
 * @returns data
 */
export const PrivateData = (type, cb) => {
  if(localStorage.getItem(type)) {
    cb(JSON.parse(localStorage.getItem(type)));
  } else {
    fetch(`${_local}/staticData/privateData?type=` + type, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    })
    .then((res) => res.json())
    .then((json) => {
      cb(json.result)
      localStorage.setItem(type, JSON.stringify(json.result));
    })
    .catch((err) => cb(err))
  }
}

/**
 * @desc deal with fetch status
 * @param {*} status code
 * @param {*} cb callback
 * @author Vania
 * @return null
 */
export const requestException = (status, cb) => {
  let result = '';
  switch (status) {
    case 999:
      result = '尚未登录，请重新登录！';
      break;
    case 998:
      result = '会话失效，请重新登录！';
      break;
    case 997:
      result = '非法访问，请重新登录';
      break;
    default:
      result = '';
  }
  if (result !== '') {
    hashHistory.push('login')
  }
  if (typeof cb === 'function') {
    cb(result)
  }
}
/**
 * @desc 是否拥有访问页面权限 
 * @param {*} state 传入参数
 * @param {*} url 重定向路径
 * @param {*} cb 回调
 */
export const hasPower = (state, url, cb) => {
  if (state) {
    cb();
  } else {
    message.warn('您未拥有该页面权限!')
    hashHistory.push({
      pathname: url
    })
  }
}

export const City = (cb) => {
   if(localStorage.getItem(City)) {
    cb(JSON.parse(localStorage.getItem(City)));
  } else {
    fetch(`${_local}/js/City.json`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    })
    .then((res) => res.json())
    .then((json) => {
      cb(json)
      localStorage.setItem(City, JSON.stringify(json));
    })
    .catch((err) => cb(err))
  }
}
/**
 * @desc done and go next
 * @param {*} url 
 * @param {*} info 
 * @author Vania
 */
export const historyGoBack = (url, info) => {
  confirm({
    title: info + '，是否跳转至上级菜单?',
    content: '点击确认或回车前往上级菜单',
    onOk() {
      hashHistory.push(url);
    },
    onCancel() {},
  });
}
/**
 * @desc 判断json所有键值对是否全部为空
 * @param {*} json 
 */
export const checkJsonAllEmpty = (json) => {
  for (let key in json) {
    if( json[key].length !== 0 ){
      return false;
    }
  }
  return true;
}

/**
 * @desc 函数节流
 * @param {*} method 
 * @param {*} context 
 * @param {*} timer 
 */
let timeoutId = null;
export const throttle = (method, context, timer) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout( () => { 
    method.call(context)
  }, timer || 500);
}

/**
 * 批量移除缓存
 * @param {*} items array
 */
export const removeItems = (items) => {
  items.map(item => {
    if (item) {
      localStorage.removeItem(item);
    }
    return null;
  })
}
/**
 * session失效
 */
export const sessionOut = () => {
  hashHistory.push({
    pathname: '/login',
    state: {message: 'session失效,请重新登录'}
  });
}

/**
 * json obj 比较
 * @param {*} obj1 
 * @param {*} obj2 
 * @param {*} except 不比较项
 */
export const objCompare = (obj1, obj2) => {
  if (typeof obj1 !== 'object' || obj1 === null) {
    return false;
  }
  if (typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  // get all key
  var aProps = Object.getOwnPropertyNames(obj1);  
  var bProps = Object.getOwnPropertyNames(obj2);
  if (aProps.length !== bProps.length) {  
    return false;  
  }  
  for (let i = 0; i < aProps.length; i++) {  
    let propName = aProps[i];  
    if ((obj1[propName] !== obj2[propName])) {  
      return false;  
    }  
  }  
  return true;
}
/**参数说明： 
 * 根据长度截取先使用字符串，超长部分追加… 
 * str 对象字符串 
 * len 目标字节长度 
 * 返回值： 处理结果字符串 
 */
export const cutString = (str, len) => { 
    //length属性读出来的汉字长度为1 
    if(str.length*2 <= len) { 
      return str; 
    } 
    let strlen = 0; 
    let s = ""; 
    for(let i = 0;i < str.length; i++) { 
      s += str.charAt(i); 
      if (str.charCodeAt(i) > 128) { 
        strlen += 2; 
        if(strlen >= len){ 
          return s.substring(0,s.length-1) + "..."; 
        } 
      } else { 
        strlen += 1; 
        if(strlen >= len){ 
          return s.substring(0,s.length-2) + "..."; 
        } 
      } 
    } 
    return s; 
  } 


export const pathConfig ={
  PICUPLAOD_URL: `${_local}/ftp/post`,
  YSYPATH:`${_local}/ftp`,//项目地址
  TEMPLATEPATH:`${_local}`,//模版下载地址
  LOGIN_URL:`${_local}/login/userLogin`,//登录
  LOGINGETUSER_URL:`${_local}/login/getUserM`,//获取登录信息
  FINDUSERBYID_URL:`${_local}/user/findOrgUserById`,//查询指定用户信息
  COMMONDATA_URL:`${_local}/staticData/commonData?type=`,
  REGISTER_URL:`${_local}/orgRegistController/insertRegistInfo`,//注册
  ORGCODEEXIST_URL:`${_local}/orgRegistController/findOrgCodeExist`,//验证机构代码唯一性
  ORGNAMEEXIST_URL:`${_local}/orgRegistController/findOrgNameExist`,//验证机构名称唯一性
  HOSPITALLIST_URL:`${_local}/orgInfoController/searchOrgInfoList?orgType=01`,//医疗机构列表
  SUPPLIERLIST_URL:`${_local}/orgInfoController/searchOrgInfoList?orgType=02`,
  SEARCHPARORG_URL:`${_local}/orgInfoController/searchParentOrgInfoList`,//查询上级机构列表
  ADDORG_URL:`${_local}/orgInfoController/insertOrgInfo`,//添加医疗机构/供应商
  EDITHOSPITAL_URL:`${_local}/orgInfoController/updateOrgInfo`,//编辑医疗机构
  EDITSUPPLIER_URL:`${_local}/orgInfoController/updateOrgInfo`,//编辑供应商
  CHECKLIST_URL:`${_local}/orgRegistController/searchRegistList`,//审核列表
  CHECKHOSPITAL_URL:`${_local}/orgRegistController/updateRegistInfo`,//审核接口
  USERLIST_URL:`${_local}/user/findOrgAdminUserList`,//查询全部用户的列表
  ORGUSERLIST_URL:`${_local}//user/findOrgUserList`,//查询当前机构的全部用户的列表
  USERNOEXIST_URL:`${_local}/orgRegistController/findUserNoExist`,
  ADDUSER_URL:`${_local}/user/addUser`,//添加用户
  UPDATEUSER_URL:`${_local}/user/updateUser`,//修改用户
  MODIFYPWD_URL:`${_local}/user/modifyUserPwd`,//修改密码
  WECHATUNBING_URL:`${_local}/login/weUnBind`,//解绑微信
  FINDORGUSER_URL:`${_local}/user/findOrgUserById`,//查询指定用户信息
  RESETUSERPWD_URL:`${_local}/user/resetUserPwd`,//重置密码
  FINDORGLIST_URL:`${_local}/user/findWithoutAdminOrgList`,//查找所属机构列表
  GROUPLIST_URL:`${_local}/group/findGroupList`,//组列表
  ADDGROUP_URL:`${_local}/group/addGroup`,//新增组
  EDITGROUP_URL:`${_local}/group/updateGroup`,//编辑组
  DELETEGROUP_URL:`${_local}/group/deleteGroup`,//删除组
  SETTINGUSERGROUP_URL:`${_local}/group/findUserListByGroupId`,//组配置用户
  //EDITGROUP_URL:`${_local}/group/updateGroup',//编辑组
  MENULIST_URL:`${_local}/group/findMenuList`,//查询菜单列表
  MENULISTBYGROUPID_URL:`${_local}/group/findMenuListByGroupId`,//查询指定组的菜单列表
  USERLISTBYGROUPID_URL:`${_local}/group/findUserListByGroupId`,//查询指定组的用户列表
  USERGROPSAVE_URL:`${_local}/group/saveUsers`,//组内用户列表保存
  MENUUSERGROPSAVE_URL:`${_local}/group/saveMenus`,//组内菜单列表保存
  MYSUPPLIERLIST_URL:`${_local}/source/findMySupplierList`,//我的供应商列表
  FINDSUPPLIERLIST_URL:`${_local}/source/findUnsourceOrgList`,//查询没有供需关系的供应商列表
  ADDMYSUPPLIERLIST_URL:`${_local}/source/addMySupplier`,//添加：我的供应商
  EDITMYSUPPLIERLIST_URL:`${_local}/source/modifyMySupplier`,//修改：我的供应商的附属信息
  FINDMYHOSIPITAL_URL:`${_local}/source/findMyHospitalList`,//销售管理-客户管理-机构列表
  MYHOSIPITALDETAILS_URL:`${_local}/orgInfoController/searchOrgInfoList`,//机构详情
  SCOPEBUSINESSLIST_URL:`${_local}/scopeBusiness/findScopeBusinessList`,//供应商经营范围
  SAVESCOPEBUSINESS_URL:`${_local}/scopeBusiness/saveScopeBusiness`,//保存供应商经营范围

}
