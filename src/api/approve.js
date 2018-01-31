import {_local} from './local';
export default {
  APPROVE_LIST: `${_local}/approvalController/selectApprovalList`,//查询审批管理信息列表
  APPROVE_SINGLE_TEMP: `${_local}/approvalController/selectOneApproval`,//查询单个审批模板
  APPROVE_ADD_EDIT: `${_local}/approvalController/insertOrUpdateApproval`,//添加,编辑审批配置
  DELETE_APPROVE: `${_local}/approvalController/deleteApproval`,//删除审批配置
  EDIT_APPROVELIST: `${_local}/approvalController/insertOrUpdateApproval?insertOrUpdate=1`,//编辑审批配置基本信

  APPROVE_EXITUSER: `${_local}/approvalController/selectIsExistApprovalUser`,//查询已选审批人列表 
  APPROVE_NOEXITUSER: `${_local}/approvalController/selectNotExistApprovalUser`,//查询未选选审批人列表

  INSERT_APPROVEUSER: `${_local}/approvalController/insertApprovalUser`,//添加审批人
  DELETE_APPROVALUSER: `${_local}/approvalController/deleteApprovalUser`,//移除审批人
  
  //单据审批
  APPROVE_RECORDACTIONS: `${_local}/approvalRecordController/selectMyApprovalRecordList`,//查询审批单列表
  APPROVE_RECORD_DETAIL: `${_local}/approvalRecordController/selectOneApprovalRecord`,//查询审批单详情
  UPDATE_APPROVALFSTATE: `${_local}/approvalRecordController/updateApprovalRecordFstate`,//执行审批
 

  //公共接口
  SELECTLOGINORG__STORAGE: `${_local}/storage/selectLoginOrgStorage`,//查询当前登录用户机构下所有的库房

  SELECTLOGINORG_DEPT: `${_local}/departmentController/selectLoginOrgDept`,//查询当前登录用户机构下所有科室
  SELECTALLBILLS: `${_local}/approvalController/selectAllBills`//查询查询所有单据类型

};