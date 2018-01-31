import {_local} from './local';

export default {
  TENDER_LIST: `${_local}/tenderController/findTenderList`,//招标产品列表
  IMAGE: `${_local}/ftp/post`,//图片上传服务
  FTP: `${_local}/ftp/`,//图片预览服务
  CERT_SAVE: `${_local}/tenderController/saveOrUpdateCertRegist`,//证件信息SAVE&UPDATE
  SAVE_MATERIAL: `${_local}/tenderController/saveMaterialRegist`,//新增品规
  SAVE_NEW_PRODUCT: `${_local}/tenderController/modifyAuditFstate`,//保存新产品最后一步
  IMPORT_PATH: `${_local}/ftp/post`,//导入地址
  MODELS_LIST: `${_local}/productAudit/findModelsByRegistGuid`,//拼规列表
  CHOSEN_PRODUCT_LIST: `${_local}/tenderController/searchTenderMaterialList`,//选入产品列表
  CHOSEN_PRODUCT_INSERT: `${_local}/tenderController/insertTenderMaterial`,//选入产品新增
  TENDER_CHANGE: `${_local}/tenderController/changeTenderMaterial`,//产品变更
  PERCENT_LIST: `${_local}/tenderController/searchfOrgList`,
  TENDER_SUPPLIER: `${_local}/tenderController/findMySupplierList`,//转换率下拉框
  TENDER_ADD_ORG: `${_local}/tenderController/addTenderfOrgId`,//添加招标供应商
  REGISTER_LIST: `${_local}/tenderController/searchRegisterNoByFitemid`,//注册证下拉框
  FBARCODE_ISONLY: `${_local}/tenderController/findFbarCodeExist`,//判断条码唯一性
  DOWNLOAD: `${_local}/template/MaterialTemplate.xls`,
  MODIFY_TENDER: `${_local}/tenderController/modifyTenderMaterial`,//编辑招标产品
  DELETE_TENDER: `${_local}/tenderController/deleteTenderMaterial`,//删除招标产品
  FIND_AUDIT: `${_local}/productAudit/findAuditList`,//我的申请查询
  STORAGE_MATERIAL: `${_local}/tenderController/findStorageMaterial`,//采购产品
  STORAGE_LIST: `${_local}/storage/findStorageByUser`,
  TENDER_LIST_SALES: `${_local}/tenderController/searchTenderListByForgId`,//中标产品
  REGISTER_NOLIST: `${_local}/tenderController/searchRegisterNoList`,//变更列表
  REGISTER_INFO: `${_local}/productAudit/findCertByRegistGuid`,//查询证件信息
  PERCENT_UPDATE: `${_local}/tenderController/updateTenderfOrgId`,//比例更新
  PERCENT_DELETE: `${_local}/tenderController/deleteTenderfOrgId`,//比例删除
  DELETE_MATERIAL: `${_local}/tenderController/deleteMaterialRegist`,//删除品规
  TEMPLATE_IMPORT: `${_local}/tenderController/saveMaterialRegistFile`,//导入
  MATERIAL_UPDATE: `${_local}/tenderController/updateMaterialRegist`,
  PRIVATE_DATA: `${_local}/staticData/privateData`,//静态数据

  //招标记录
  FINDTOPSTORAGEBYUSER: `${_local}/storage/findTopStorageByUser`,//查询一级库房列表下拉框
  FINDTENDERRECORDLIST: `${_local}/tenderController/findTenderInfo`,//查询 招标记录列表
  SEARCHORGLIST: `${_local}/storage/searchOrgList`,//查询当前机构供应商列表下拉框
  FINDLXR: `${_local}/tenderController/findLxr`,//招标记录联系人，联系电话查询
  INSERTTENDERINFO: `${_local}/tenderController/insertTenderInfo`,//新增 招标记录
  UPDATETENDERINFO: `${_local}/tenderController/updateTenderInfo`,//编辑 招标记录
  DELETETENDERINFO: `${_local}/tenderController/deleteTenderInfo`,//删除 招标记录
  TENDERINFORELEASE: `${_local}/tenderController/tenderInfoRelease`,//发布 招标记录
  //招标详情相关
  TENDERDETAILLIST: `${_local}/biddingFunctionalController/selectBiddingDetailByPage`,//招标详情列表
  SELECTMATERIALS: `${_local}/biddingFunctionalController/selectMaterialByPage`,//添加 招标产品列表
  ADDMATERIALLIST: `${_local}/biddingFunctionalController/addMaterialList`,//添加,全部添加 招标产品列表
  CHECKMATERIALLIST: `${_local}/biddingFunctionalController/checkMaterialList`,//验证 添加,全部添加 是否包含已招标过相同产品
  DELETETENDERPRODUCT: `${_local}/biddingFunctionalController/delBiddingDetailByTenderDetailGuid`,//删除 招标产品
  //DOWNLOADTFACCESSORY: `${_local}/biddingFunctionalController/dowTfAccessoryByTfAccessory`,//招标产品详情—附件下载
  TENDERDETAILEEDITLIST: `${_local}/biddingFunctionalController/selectBiddingDetailByTenderDetailGuid`,//招标产品详情—编辑查询
  TENDERDETAILBATCHSAVE: `${_local}/biddingFunctionalController/batchUpDataBiddingDetailByTenderDetailGuid`,//招标产品详情—批量编辑保存

  SEARCHMATERIALEXTEND: `${_local}/tenderController/searchMaterialExtend`,//招标产品详情—编辑 包装材质、包装规格(下拉框)
  MODIFYTENDERMATERIAL: `${_local}/tenderController/modifyTenderMaterial`,//招标产品详情—编辑 编辑招标产品
  FINDPURCHASEUNITEXIST: `${_local}/tenderController/findPurchaseUnitExist`,//招标产品详情—编辑 验证产品种的采购单位与传入的采购单位是否一致
  
  //一期数据改造
  SEARCHSTORAGELIST: `${_local}/storage/searchStorageList4Source`,//根据医疗机构查询医疗机构库房列表
  ADDMYSOURCEINFO: `${_local}/source/addMySourceInfo`,//添加供应关系
  EDITMYSOURCEINFO: `${_local}/source/modifyMySourceInfo`,//修改供应关系
  MYSOURCEINFO_LIST: `${_local}/source/findMySourceInfoList`,//查询供需关系列表
  TENDPRICE_LIST: `${_local}/tenderController/searchTenderPriceList`,//调价记录
  TENDCHANGE_LIST: `${_local}/tenderController/getTenderChangeList`,//变更记录
  ALLTENDCHANGE_LIST: `${_local}/tenderController/bothChangeTenderMaterial`,//全部记录
  BITCHMODIFYTENDERMATERIAL: `${_local}/tenderController/bitchModifyTenderMaterial`,//招标产品批量编辑
  CHANGEPRICETENDERMATERIAL: `${_local}/tenderController/updateTenderPrice`,//招标产品批量编辑
  POSTTENDERMATERIAL: `${_local}/tenderController/postTenderMaterial`,//招标产品批量编辑
  SEARCHSTORAGELISTSOURCE: `${_local}/storage/searchStorageList4Source`,//查询库房
};