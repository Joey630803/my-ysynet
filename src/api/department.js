import {_local} from './local';
export default {
  DEPT_LIST: `${_local}/departmentController/findOrgDeptList4kehu`,//查询科室信息列表
  DEPTADDRESS_LIST: `${_local}/departmentController/searchDeptAddress`,//查询科室地址列表
  SAVEDEPTADDRESS: `${_local}/departmentController/saveDeptLocation`,//保存科室地址
  DEPTCODEEXIST: `${_local}/departmentController/findDeptCodeExist`,//验证科室编码唯一性
  ADDDEPT: `${_local}/departmentController/insertOrgDept`,//新增科室信息
  EDITDEPT: `${_local}/departmentController/updateDept4kehu`,//编辑科室信息
  SEARCHDEPTUSER: `${_local}/departmentController/searchDeptUsers`,//查询科室用户信息
  SAVEDEPTUSER: `${_local}/departmentController/saveDeptUser`,//保存科室用户
  //科室产品
  DEPTMATERIAL_LIST: `${_local}/storageMaterial/findDeptMaterial`,//查询科室产品列表
  DEPTSTORAGE_LIST: `${_local}/storage/findStorageByUserDept`,//查询用户所属的科室对应的库房列表
  //科室模板
  DEPTTEMPLATE_LIST: `${_local}/templateController/searchTemplateList`,//查询科室库房模版列表
  SEARCHTEMPLATEDETAILS: `${_local}/templateController/searchTemplateDetails`,//根据模版id查询模版产品明细
  //科室申请管理
  SEARCHAPPLYLIST:`${_local}/applyManager/searchApplyList`, //根据科室和库房查询申请单列表
  SEARCHAPPLYDETAILS:`${_local}/applyManager/searchApplyDetails`, //根据申请单id查询模版产品明细
  INSERTUPDATEAPPLY:`${_local}/applyManager/insertUpdateApplyAndDetail`, //创建、编辑申请单信息
  UPDATEAPPLYFSTATE:`${_local}/applyManager/updateApplyFstate`, //更新申请单状态
  EXPORTAPPLYLIST:`${_local}/applyManager/exportApplyList`, //导出申请单列表
  EXPORTAPPLYDETAILS:`${_local}/applyManager/exportApplyDetail`, //导出申请单明细列表
  //科室审核管理
  DEPARTCHECK_LIST: `${_local}/audit/selectApplyList`,//科室审核列表
  CHECKPRODUCT_DETAILSLIST: `${_local}/audit/selectApplyDetailList`,//科室申请审核产品明细

  HIGHAPPLYDETAIL_LIST: `${_local}/applyManager/selectHighApplyDetailList`,//（高值、普耗, 手术）查询申请单明细
  BATCHCHECK: `${_local}/audit/updateApplyFstate`,//科室申请审核( 批量审核)
  CHECKAPPLYDETAILS: `${_local}/audit/updateApplyDetail`,//科室申请审核( 单条审核)
  EXPORTPLANDETAIL: `${_local}/applyManager/exportHighAuditDetail`,//审核明细导出

  //使用登记
  SELECRUSEREGISTER:`${_local}/useRegisterController/selecrUseRegisterByPage`,//使用登记列表
  EXPORTUSEREGISTERLIST:`${_local}/useRegisterController/exportUseRegisterList`,//使用登记列表导出
  DELETEUSEREGISTERBYID:`${_local}/useRegisterController/DelectUseRegisterByid`,//使用登记列表删除
  SELECTUSEREGISTERBYSENDID:`${_local}/useRegisterController/selectUseRegisterBySendId`,//查询查询送货单信息
  ADDUSEREGISTER:`${_local}/useRegisterController/addUseRegister`,//使用登记提交按钮
  SELECTUSEREGISTERBYCHARGEGUID:`${_local}/useRegisterController/selectUseRegisterByChargeGuid`,//登记单详情查看及编辑数据初始化查询
  EXPORTUSEREGISTERONE:`${_local}/useRegisterController/exportUseRegisterOne`,//登记详情—导出功能
  PRINTUSEREGISTERONE:`${_local}/useRegisterController/printUseRegisterOne`,//登记详情—打印功能
  UPDATAUSEREGISTER:`${_local}/useRegisterController/UpdataUseRegisterByChargeGuid`,//登记页面编辑提交按钮
  //患者计费
  FINDCHARGEINFO:`${_local}/charge/findChargeInfo`,//查询患者计费记录
  EXPORTCHARGEINFO:`${_local}/charge/exportChargeInfo`,//患者计费，计费清单导出
  FINDOPERATIONCHARGEINFO:`${_local}/charge/findOperationChargeInfo`,//患者计费-手术计费查询
  OPERATIONCHARGE:`${_local}/charge/operationCharge`,//患者计费-手术计费按钮
  FINDHIGHVALUECHARGEINFO:`${_local}/charge/findHighValueChargeInfo`,//患者计费-高值计费查询
  CHOOSEOPERATIONAPPLY:`${_local}/charge/highValueChooseOperationApply`,//患者计费-高值计费选择手术申请单
  FINDGZCHARGEPRODUCT:`${_local}/charge/findHighValueChargeProduct`,//患者计费-高值计费查询产品信息
  HIGHVALUECHARGE:`${_local}/charge/highValueCharge`,//患者计费-高值计费按钮
  FINDOPERATIONREFUND:`${_local}/charge/findOperationRefund`,//患者计费-手术退费查询
  OPERATIONREFUND:`${_local}/charge/operationRefund`,//患者计费-手术退费操作
  FINDHIGHVALUEREFUND:`${_local}/charge/findHighValueRefund`,//患者计费-高值退费查询
  HIGHVALUEREFUND:`${_local}/charge/highValueRefund`,//患者计费-高值退费操作
  FINDHVSUPPLEMENTCHARGE:`${_local}/charge/findHighValueSupplementaryCharge`,//患者计费-高值补计费页面查询
  HVSUPPLEMENTCHARGE:`${_local}/charge/highValueSupplementaryCharge`,//患者计费-高值补操作

  GETCHARGEDETAIL:`${_local}/charge/getChargeDetail`,//患者计费查看详情
  EXPORTCHARGEDETAIL:`${_local}/charge/exportChargeDetail`,//患者计费手术，高值详情导出
  //公共接口
  STORAGEMATERIALLIST: `${_local}/storageMaterial/queryStorageMaterialListWithFlag`,//根据库房添加产品
  FINDDEPTSTORAGEBYUSER:`${_local}/departmentController/findDeptsByUser`,//当前登录人员所属科室下拉框（带出库房）
  FINDDEPTADDRESS:`${_local}/departmentController/searchAddrListByDeptGuid`,// 查询某科室的收货地址下拉框

  //登录人员所属科室下拉框（带出库房）
  DEPT_STORAGE_SELECT: `${_local}/departmentController/findDeptsByUser`,
  //根据dept和storage查询模板
  TEMPLATE_BY_DEPTANDSTORAGE: `${_local}/templateController/searchTemplateList`,
  //新建/编辑模板
  CREATE_EDIT_TEMPLATE: `${_local}/templateController/createEditTemplate`,
  //查询模板明细
  GET_TEMPLATE_DETAILS: `${_local}/templateController/searchTemplateDetails`,
  //模板添加产品 查询
  ADD_TEMPLATE_DETAILS: `${_local}/storageMaterial/queryStorageMaterialListWithFlag`,
  //模板添加产品 选入
  INSERT_TEMPLATE_DETAILS: `${_local}/templateController/insertTemplateDetails`,
  //删除模板
  DELETE_TEMPLATE: `${_local}/templateController/deleteTemplate`,
  //模板排序
  SORT_TEMPLATE: `${_local}/templateController/updateTemplateOrder`,
  //模板修改数量
  EDIT_AMOUNT: `${_local}/templateController/saveTemplateDetail`,
  //删除明细
  DELETE_DETAILS: `${_local}/templateController/deleteTemplateDetials`,
  //申请管理
  SEARCH_APPLY: `${_local}/applyManager/searchApplyList`,
  //查询库房 产品 品牌列表
  QUERY_BRAND: `${_local}/storageMaterial/queryStorageBrandsWithFlag`,
  // 查询库房 产品 列表
  QUERY_MATERIAL: `${_local}/storageMaterial/queryStorageMaterialListWithFlag`,
  //查询供应商
  QUERY_SUPPLIER: `${_local}/source/findFListForSelect`,
  //就诊号查询
  QUERY_OPER: `${_local}/applyManager/findTreatmentOpers`,
  //新增编辑高值申请
  SAVE_AND_UPDATE_HIGHAPPLY: `${_local}/applyManager/insertUpdateHighApplyAndDetail`,
  //导出手术申请明细
  EXPORT_APPLY_DETAIL:`${_local}/applyManager/exportOperApplyDetail`,
  //创建, 编辑手术申请单
  SAVE_AND_UPDATE_OPER: `${_local}/applyManager/insertUpdateOperApplyAndDetail`,
  //查询手术申请单明细
  SEARCH_OPER_DETAILS: `${_local}/applyManager/searchOperApplyDetails`,
  //导出高值明细
  EXPORT_HIGH_DETAILS: `${_local}/applyManager/exportHighApplyDetail`,


  //测试接口
  CUSTOMERSTORAGE_BYUSER:`${_local}/storage/findStorageByUser`,//客户中心查询用户所属的库房列表

};