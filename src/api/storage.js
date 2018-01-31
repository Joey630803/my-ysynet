import {_local} from './local';
export default {
  STORAGE_LIST: `${_local}/storage/findTopStorageList`, //运营中心库房列表
  ORG_LIST:`${_local}/storage/searchOrgList`, //运营查询机构列表（所属机构：下拉搜索)
  FIRSTSTORAGE_LIST:`${_local}/storage/searchStorageList4yunying`, //[运营] 查询指定机构体系内一级库房列表（货物来源：下拉搜索）
  ADDSTORAGE_LIST:`${_local}/storage/addStorage`, // 添加库房
  UPDATESTORAGE_LIST:`${_local}/storage/updateStorage4yunying`, // 运营修改库房
  CUSTOMERUPDATESTORAGE_LIST:`${_local}/storage/updateStorage4kehu`, // 客户修改库房
  CUSTOMERSEARCHSTORAGE_LIST:`${_local}/storage/searchStorageList4kehu`, //[客户中心] 查询本机构体系内一级库房列表（货物来源：下拉搜索）
  CUSTOMERSEARCHDEPT_LIST:`${_local}/storage/searchDeptList`,//客户中心] 查询本机构科室列表（所属科室：下拉搜索）
  CUSTOMERSTORAGE_LIST:`${_local}/storage/findOrgStorageList4kehu`,//客户中心查询本机构的库房列表
  CUSTOMERSTORAGE_DEPT:`${_local}/storage/saveDeptsByStorage`,//客户中心配置库房开放科室
  CUSTOMERSTORAGE_BYSIDDEPT:`${_local}/storage/queryOpenDeptsByStorageGuid`,//查询指定库房的开放科室列表
  CUSTOMERSTORAGE_USER:`${_local}/storage/saveUsersByStorage`,//客户中心配置库房工作人员
  CUSTOMERSTORAGE_BYSIDUSER:`${_local}/storage/queryUsersByStorageGuid`,//查询指定库房的工作人员列表
  CUSTOMERSTORAGE_ADDRESS:`${_local}/storage/saveAddrsByStorage`,//客户中心配置库房地址
  CUSTOMERSTORAGE_BYSIDADDRESS:`${_local}/storage/queryAddrsByStorageGuid`,//客户中心配置库房地址
  //库房产品
  CUSTOMERSTORAGE_BYUSER:`${_local}/storage/findStorageByUser`,//客户中心查询用户所属的库房列表
  CUSTOMERSTORAGEMATERIAL_LIST:`${_local}/storageMaterial/findStorageMaterial`,//客户中心查询库房的产品列表
  CUSTOMERSTORAGEUNMATERIAL_LIST:`${_local}/storageMaterial/findUnStorageMaterial`,//客户中心待移入的库房产品列表
  CUSTOMERSTORAGESAVEMATERIAL:`${_local}/storageMaterial/saveStorageMaterial`,//客户中心保存选择的库房产品
  CUSTOMERSTORAGEUPDATEMATERIAL:`${_local}/storageMaterial/updateBatchStorageMaterial`,//客户中心更新、批量更新库房产品
  CUSTOMERSTORAGEDELETEMATERIAL:`${_local}/storageMaterial/deleteStorageMaterial`,//客户中心删除库房产品
  //客户中心一期改造
  QUERYUSERBYSTORAGE:`${_local}/storage/queryUsersByStorageGuidForSelect`,//客户中心删除库房产品
  //库房计划单
  SERACHPLANLISTPH:`${_local}/planManager/searchPlanList?planType=PLAN`,//查询普耗计划列表
  FINDSURGERY:`${_local}/planManager/findSurgery?planType=OPER_PLAN`,//查询手术计划列表
  SERACHPLANLISTGZ:`${_local}/planManager/searchPlanList?planType=HIGH_PLAN`,//查询高值计划列表
  SERACHPLANLISTJS:`${_local}/planManager/searchPlanList?planType=SETTLE_PLAN`,//查询结算计划列表
  SERACHPLANDETAIL:`${_local}/planManager/searchPlanDetail`,//查询计划产品列表
  SERACHSETTLEPLANDETAILS:`${_local}/planManager/searchSettlePlanDetails`,//查询计划产品列表
  INSERTEDITPLAN:`${_local}/planManager/insertEditPlan`,//普耗计划/高值计划】 新建/编辑计划
  DELETEPLAN:`${_local}/planManager/deletePlan`,//普耗计划/高值计划】 删除草稿计划
  FINDSURGERYDETAILBYID:`${_local}/planManager/findSurgeryLsbhDetailByGzsqid`,//手术计划详情查询手术计划品
  UPDATEPLANFSTATE:`${_local}/planManager/updatePlanFstate`,//普耗计划/高值计划】 确认/驳回计划
  FINDSTORAGEADDREXIST:`${_local}/planManager/findStorageAddrExist`,//验证库房地址是否存在
  FINDCHARGELIST:`${_local}/planManager/findChargeList`,//查询结费清单列表
  INSERTEDITSETTLEPLAN:`${_local}/planManager/insertEditSettlePlan`,//提交、编辑结算计划
  SEARCHCHARGEDETAILS:`${_local}/planManager/searchChargeDetails`,//结算记录
  //申请管理
  SEARCHAPPLYLIST:`${_local}/applyManager/searchApplyList?sign=1`,//查询申请列表
  SEARCHAPPLYDETAILSLIST:`${_local}/applyManager/selectHighApplyDetailList`,//查询申请列表
  CREATEPLAN:`${_local}/applyManager/createPlan`,//生成采购计划单

  //出库管理
  FINDSTORAGEBYMYUSER:`${_local}/storage/findStorageByUser`,//当前登录人员所属库房下拉框
  SEARCHPICKLIST:`${_local}/outWarehouse/searchPickList`,//查询拣货单列表
  SEARCHPICKDETAILS:`${_local}/outWarehouse/searchPickDetails`,//查询拣货单明细
  SAVEPICKDETAILSOUT:`${_local}/outWarehouse/savePickDetailsOut`,//保存拣货单信息
  ENDPICKAPPLY:`${_local}/outWarehouse/endPickApply`,//完结拣货单
  FINDDEPTBYSTORAGEUSER:`${_local}/departmentController/selectDeptByStorageByUser`,//出库记录科室下拉框
  SELECTOUTPORTLIST:`${_local}/outportController/selectOutportList`,//出库记录列表
  SELECTOUTPORTDETAILLIST:`${_local}/outportController/selectOutportDetailList`,//出库记录详情列表
  SELECTTENDERDETAILLIST:`${_local}/outportController/selectTenderDetailList`,//产品出库明细查询
  EXPORTTENDERDETAILLIST:`${_local}/outportController/exporTenderDetailList`,//导出产品出库明细
  SELECTOUTPORTISOUT:`${_local}/outportController/selectOutportIsOut`,//查询退库产品
  INSERTOUTPORTINOUT:`${_local}/outportController/insertOutportInOut`,//执行退库操作
  SEARCHOPENDEPTSBYSTORAGEID:`${_local}/storage/searchOpenDeptsByStorageId`,//查询指定库房的开放科室列表（联想下拉搜索）
  QUERYMATERIALLISTBYSTORAGEID:`${_local}/outportController/queryMaterialListByStorageId`,//根据条件查询指定库房库存的产品
  QUERYMATERIALLISTBYQRCODE:`${_local}/outportController/queryMaterialByQrcode`,//根据二维码查询指定库房库存的产品
  CREATEOUTPORT:`${_local}/outportController/createOutport`,//新建领用出库单
  FINDTREATMENTOPERS:`${_local}/applyManager/findTreatmentOpers`,//根据就诊号查询患者手术信息
  FINDDEPTADDRESS:`${_local}/departmentController/searchAddrListByDeptGuid`,// 查询某科室的收货地址下拉框
  EXPORTOUTDETAIL:`${_local}/outportController/exportOutportDetailList`,// 导出出库单详情

  //入库
  WAREHOUSELIST:`${_local}/import/selectWarehouseList`,//查询入库单列表
  WAREHOUSEDETAILSBYINNO:`${_local}/import/selectWarehouseByInNo`,//入库单详情
  WAREHOUSEDETAILLIST:`${_local}/import/selectWarehouseDetailList`,//查询入库明细列表
  FINDSUPPLIERLISTBYORGID:`${_local}/tenderController/findMySupplierListByOrgId`,//查询供需关系中供应商列表
  FINDDELIVERYINFO:`${_local}/import/findDeliveryInfo`,//根据送货单号查询信息
  NEWINSTOCK:`${_local}/import/newInstock`,//确定新建入库按钮
  NEWOUTSTOCK:`${_local}/import/newOutstock`,//如果当期订单类型为申购，提示框点击确定按钮，进行出库操作
  NEWINITALIZEINSTOCK:`${_local}/import/newInitalizeInstock`,//页面添加当前库房产品
  EXPORTWAREDETAIL:`${_local}/import/exportWarehouseByInId`,// 导出入库单详情
  PRINTIMPORTDETAIL:`${_local}/import/printImportDetail`,// 打印入库单详情
  PRINTOUTDETAIL:`${_local}/outportController/printOutportDetail`,// 打印出库单(一入一出)详情
  //退货
  FINDBACKINNODETAILS:`${_local}/import/findBackImportDetails`,//退货查询
  INSERTBACKNODETAILS:`${_local}/import/insertBackImportDetails`,//退货生成入库记录
  //库存查询
  LARGEWAREHOUSEQUERY:`${_local}/storageInventoryController/storageInventoryQuery`,//库存查询列表
  LARGEWAREHOUSEQUERYDETAIL:`${_local}/storageInventoryController/storageInventoryQueryDetail`,//库存查询列表
  //盘点管理
  GETSTOCKTAKINGLIST:`${_local}/stockTakingController/getStockTakingList`,//查询库房盘点列表
  GETSTOCKTAKINGDETAILLIST:`${_local}/stockTakingController/getStockTakingDetailList`,//查询库房盘点列表
  STARTINVENTORY:`${_local}/stockTakingController/startInventory`,//新建盘点
  SAVEKCPD:`${_local}/stockTakingController/saveKcpd`,//保存盘点
  CONFIRMKCPD:`${_local}/stockTakingController/confirmKcpd`,//确认盘点
};