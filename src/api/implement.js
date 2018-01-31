import {_local} from './local';
export default {
  ORG_LIST: `${_local}/orgInfoController/searchOrgInfoList`,//org list
  ORG_SETTING: `${_local}/implementation/orgModule`,// org setting
  ORG_SETTING_SAVE: `${_local}/implementation/saveOrgModule`,
  //配置管理
  CONFIG_STORAGELIST: `${_local}/storage/findOrgStorageList4yunying`,//查询库房列表
  CONFIG_DEPARTLIST: `${_local}/departmentController/findOrgDeptList4yunying`,//查询科室列表
  SAVE_CONFIG_STORAGE: `${_local}/storage/addUpdateStorage4yunying`,//保存库房基本信息和配置信息
  SAVE_CONFIG_DEPART: `${_local}/departmentController/addUpdateDept4yunying`,//保存科室基本信息和配置信息
  DELETE_CONFIG_STORAGE: `${_local}/storage/deleteOrgStorage`,//删除机构库房
  DELETE_CONFIG_DEPART: `${_local}/departmentController/deleteOrgDepartment`,//删除机构科室
  CONFIG_APPROVELIST: `${_local}/approvalController/selectApprovalList`,//查询审批配置列表
  ADD_CONFIGAPPROVE: `${_local}/approvalController/insertOrUpdateApproval`,//添加、修改审批
  SELECTLOGINSTORAGE: `${_local}/storage/selectLoginOrgStorage`,//查询当前登录用户机构下所有的库房
  SELECTLOGINDEPART: `${_local}/departmentController/selectLoginOrgDept`,//查询当前登录用户机构下所有的科室
  DELETEAPPROVAL: `${_local}/approvalController/deleteApproval`,//删除审批配置
  SELECTBILLTYPES: `${_local}/approvalController/selectAllBills`,//删除审批配置
};