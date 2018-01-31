import {_local} from './local';

export default {
  MESSAGE_LIST: `${_local}/messageController/getMessageList`,//消息列表
  ORG_TYPE_LIST: `${_local}/messageController/getOrgListByType`,//根据类型获取机构
  SEND_MESSAGE: `${_local}/messageController/sendMessage`,//发送消息
  MESSAGE_READ: `${_local}/messageController/changeMessageReadfstate`,
  MESSAGE_DEL: `${_local}/messageController/updateOrDeleteMessage`,
  GLOBAL_LIST: `${_local}/messageConfig/globalMItemList`,//全局设置菜单列表
  GLOBAL_SETTING: `/message/global/setting`,//跳转 全局设置
  GLOBAL_SAVE: `${_local}/messageConfig/updateGlobalMItem`,//全局设置更新
  ORG_MODULES: `${_local}/implementation/orgModule`,//机构模块
  ORG_M_LIST: `${_local}/messageConfig/orgMItemList`,//机构菜单
  ORG_CHANGE_TYPE: `${_local}/messageConfig/changeOrgMISendType`,//修改发送类型
  ORG_EDIT: `/message/manager/edit`, //收发管理跳转修改
  ORG_USER: `${_local}/messageConfig/findOrgReceives`,//获取收件人
  ORG_UPDATE: `${_local}/messageConfig/updateOrgMItem`,//更新
  ORG_CODE: `${_local}/messageController/getCodeByOrgId`
};