import {_local} from './local';
export default {
  FINDSTORAGEBYUSER: `${_local}/storage/findStorageByUser`,//查询当前登录用户所属的库房列表
  FINDORGLISTFORSELECT: `${_local}/source/findFListForSelect`,//查询当前机构关联的供应机构列表
  FINDMYINVOICELIST: `${_local}/invoiceController/findMyInvoiceList`,//查询我的发票列表
  GETINVOICEBYID: `${_local}/invoiceController/getInvoiceById`,//查询我的发票列表
  GETINVOICEBYIDFSTATE: `${_local}/invoiceController/findInvoiceByInvoiceId`,//根据发票id查询发票状态
  DELIVERYLIST: `${_local}/delivery/rSearchDeliveryList`,//采购模块查询送货单列表
  EXPORTDELIVERYLIST: `${_local}/delivery/rExportDeliveryList`,//采购模块送货单列表导出
  EXPORTDELIVERYDETAILS: `${_local}/delivery/exportDeliveryDetail`,//送货单详情导出
  PRINTDELIVERYDETAILS: `${_local}/delivery/printDeliveryDetail`,//送货单详情打印
  CHECKDELIVERY: `${_local}/check/checkDelivery`,//扫码送货单查询
  CHECKDELIVERYTHROUGH: `${_local}/check/deliveryThrough`,//送货单批量验收通过
  CHECKDELIVERYNOTTHROUGH: `${_local}/check/deliveryNotThrough`,//送货单批量验收不通过
  SEARCHDELIVERYLISTBYINVOICEID: `${_local}/invoiceController/searchDeliveryListByInvoiceId`,//根据发票查询关联的送货单列表
  EXPORTINVOICELIST: `${_local}/invoiceController/exportInvoiceList`,//导出发票列表
  GETDELIVERDETAIL: `${_local}/invoiceController/getDeliveryDetail`,//根据发票GUID查询送货单明细
  INVOICECHECK: `${_local}/invoiceController/invoiceStatusUpdate`,//发票验收
  DELIVERYDTTAILS: `${_local}/delivery/deliveryDetails`,//根据送货单id查询送货单产品列表
  FINDDETAILIST4OPER:`${_local}/delivery/findDetailList4OperBySendId`,//根据送货单id查询手术送货单产品列表
  MATERIAL_LIST: `${_local}/storageMaterial/queryStorageMaterialList`,//产品
  //我的订单
  MYORDER_LIST: `${_local}/order/findMyOrderList`,//查看订单列表
  SAVEORDER_LIST: `${_local}/order/saveDraft`,//新建订单  保存草稿
  CREATEORDER_LIST: `${_local}/order/createOrder`,//新建订单  提交订单
  UPDATEORDER_LIST: `${_local}/order/updateFstate`,//更新订单状态
  EXPORTORDER_LIST: `${_local}/order/exportOrderList`,//导出订单列表
  DETAILS_BY_ORDERID: `${_local}/order/findDetailListByOrderId`,//根据订单ID查差产品信息
  DELIVERY_BY_ORDERID: `${_local}/order/findDeliveryListByOrderId`,//根据订单ID查送货单
  SEND_INFO_C: `${_local}/delivery/rSearchDeliveryList`,//采购查送货单明细
  FINDMYSTORAGELIST: `${_local}/storage/findStorageByTop`,//计划管理 切换采购库房查询我的库房列表
  STORAGE_LIST: `${_local}/storage/findStorageByUser`,//库房列表
  STORAGE_ADDR: `${_local}/storage/searchAddrListByStorageGuid`,//查库房地址
  ADD_ADDR: `${_local}/storage/addAddrsByStorageGuid`,//新增库房地址
  FINDPATIENTOPER_INFO: `${_local}/patient/findPatientOperByApplyId`,//根据applyId查询指定患者的手术信息
  GETPACKAGEBYORDERID: `${_local}/delivery/package/subtotalPackageByOrderId`,//根据订单id查询手术包统计信息
  FINDPACKAGE_LIST: `${_local}/delivery/package/findPackageListByOrderId`,//根据订单id查询手术包列表信息
  FINDSELECTEDTOOLPACKAGE: `${_local}/delivery/package/findToolsOfPackageId`,//根据订单id和手术包id查询手术包已选工具列表
  EXPORTORDERDETAILS: `${_local}/order/exportOrderAndDetails`,//根据订单id导出详情信息
  SEARCHSTORAGE_LIST: `${_local}/storage/selectLoginOrgStorage`,//查询本机构所有库房的列表（下拉列表）
  SEARCHDEPT_LIST: `${_local}/departmentController/selectLoginOrgDept`,//查询本机构所有科室的列表（下拉列表）
  SEARCHNORPLANLIST: `${_local}/planManager/searchPlanList?planType=PLAN&menu=cgManager`,//查询普耗计划列表
  SEARCHHIGHVALUEPLANLIST: `${_local}/planManager/searchPlanList?planType=HIGH_PLAN&menu=cgManager`,//查询高值计划列表
  SEARCHPLANDETAIL: `${_local}/planManager/searchPlanDetail`,//查询计划单详情(普耗+高值)
  FINDSURGERY_LIST: `${_local}/planManager/findSurgery?planType=OPER_PLAN&type=cg`,//查询手术计划列表
  FINDSURGERYBRANDDETAIL: `${_local}/planManager/findSurgeryLsbhDetailByGzsqid`,//查询手术计划品牌列表
  SEARCHJSPLANLIST: `${_local}/planManager/searchPlanList?planType=SETTLE_PLAN&menu=cgManager`,//查询高值计划列表
  
  UPDATEPLANFSTATE: `${_local}/planManager/updatePlanFstate`,//普耗,高值,手术,结算/驳回计划
  MODIFYPLANFSTATE: `${_local}/planManager/modifyPlanFstate`,//普耗,高值 确认计划
  UPDATEEDITPLAN: `${_local}/planManager/updateEditPlan`,//手术计划 完结/重新提交计划
  SEND_ORDERPLAN: `${_local}/planManager/orderPlan`,// 普耗/高值 发送订单
  SEND_OPERATIONPLAN: `${_local}/planManager/creatOrderByGzsqId`,// 手术计划 发送订单
  SENDJSORDERBYSETTLE: `${_local}/planManager/orderBySettle`,// 手术计划 发送订单
  EXPORTPLANLIST: `${_local}/planManager/exportPlanList?planType=PLAN&menu=cgManager`,// 普耗 导出计划列表
  EXPORTHIGHPLANLIST: `${_local}/planManager/exportPlanList?planType=HIGH_PLAN&menu=cgManager`,// 高值 导出计划列表
  EXPORTOPERPLANLIST: `${_local}/planManager/exportPlanList?planType=OPER_PLAN&menu=cgManager`,// 手术 导出计划列表
  EXPORTPLANDETAIL_LIST: `${_local}/planManager/exportPlanDetail`,// 普耗,高值,手术计划 导出计划产品列表
  EXPORTJSPLANLIST: `${_local}/planManager/exportSelltePlanList?planType=SETTLE_PLAN&menu=cgManager`,// 结算导出列表
  SELECTGATHER_LIST: `${_local}/gatherController/selectGatherList`,// 汇总单列表
  UPDATEGATHERAPPROVAL: `${_local}/gatherController/updateGatherApproval`,// 汇总单提交审批
  INSERTALLPLANGATHER: `${_local}/gatherController/insertAllPlanGather`,// (全部汇总)计划单生成汇总单
  EXPORTGATHERLIST: `${_local}/gatherController/exporGatherList`,// 汇总单列表导出
  CREATEGATHERORDER: `${_local}/gatherController/createGatherOrder`,// 汇总单生成订单
  EXPORTGATHERDETAIL: `${_local}/gatherController/exporGatherDetail`,// 汇总单详情导出
  SELECTONEGATHER_LIST: `${_local}/gatherController/selectOneGatherDetail`,// 查询单个汇总单详情
  INSERTPLANGATHER: `${_local}/gatherController/insertPlanGather`,// 计划单生成汇总单
  FINDTOPSTORAGEBYUSER_LIST: `${_local}/storage/findTopStorageByUser`,//查询当前登录者所有的一级库房的列表（下拉列表）
  //财务结账
  SELECTINVOICEBYMONTH: `${_local}/invoiceController/selectInvoiceByMonth`,// 查询财务结账列表
  SELECTINVOICEDETAILBYMONTH: `${_local}/invoiceController/selectInvoiceDetailByMonth`,// 查询已结账详情
  SELECTINVOICEDETAILACCT: `${_local}/invoiceController/selectInvoiceDetailNotAcct`,// 查询未结账列表
  SELECTINVOICEMONTH: `${_local}/invoiceController/selectInvoiceMonth`,// 查询结账月份
  INVOICESETTLEACCOUNT: `${_local}/invoiceController/invoiceSettleAccount`,// 查询结账月份
  //我的供应商
  MYSUPPLIERLIST_URL:`${_local}/source/findMySupplierList`,//查询 我的供应商列表
  EDITMYSUPPLIERLIST_URL:`${_local}/source/modifyMySupplier`,//编辑 我的供应商
  FINDSUPPLIERMATERIALIST:`${_local}/source/findMySupplierMaterialList`,//查询供应商产品列表
  UPDATESUPPLIER:`${_local}/source/updateSupplier`,//变更供应商
  SEARCHALLORGLIST:`${_local}/storage/searchOrgList`,//查询标准库中所有的供应商
  FINDORGDETAILS:`${_local}/source/findOrgDetail`,//查询机构详情

  //我的产品
  FINDMYMATERIALIST:`${_local}/tenderMaterialController/findTenderStorageMaterialList`,//查询 我的产品列表
  SAVETENDERSTORAGEEXTEND:`${_local}/tenderMaterialController/saveTenderMaterialExtend`,//我的产品 保存供货信息
  SEARCHCERTLISTBYCERTID:`${_local}/product/searchCertList`,//根据证件id 查询证件信息
  UPDATEPURCHASEPRICE:`${_local}/tenderMaterialController/updatePurchasePrice`,//调价
  FINDCREATEUSER:`${_local}/tenderMaterialController/findCreateUserForSelect`,//查询某条产品的操作记录的操作员列表
  FINDPURCHASEPRICELIST:`${_local}/tenderMaterialController/findPurchasePriceChanges`,//调价记录列表
  FINDCERTCHANGELIST:`${_local}/tenderMaterialController/findCertChangeList`,//证件变更记录列表 
  FINDSUPPLYLIST:`${_local}/tenderMaterialController/findSupplyChangesList`,//供货记录列表
  FINDUNITCHANGELIST:`${_local}/tenderMaterialController/findPUnitChangesList`,//单位变更记录列表
  //变更证件
  FINDREGISTER:`${_local}/tenderController/findRegister`,//变更证件——证件页
  FINDPRODUCT:`${_local}/tenderController/findProduct`,//变更证件——产品页
  FINDREGISTERNO:`${_local}/tenderController/findRegisterNo`,//变更证件——确认页证件号模糊搜索
  FINDCONFIRM:`${_local}/tenderController/findConfirm`,//变更证件——确认页
  CONFIRMCHANGE:`${_local}/tenderController/confirmChange`,//变更证件——确认变更
  SEARCHTREELISTBYORGID:`${_local}/typeInfo/searchTreeTisByOrgId`,//查询本机构的树形结构物资分类类型
  SAVETMTYPEINFO:`${_local}/typeInfo/saveTmTypeInfo`,//保存证件的物资分类信息
};