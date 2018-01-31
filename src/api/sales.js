import {_local} from './local';
export default {
  FINDSTORAGEBYUSER: `${_local}/storage/findStorageByUser`,//查询当前登录用户所属的库房列表
  FINDTOPSTORAGEBYUSER: `${_local}/storage/findTopStorageByUser`,//查询当前登录用户所属的一级库房列表
  FINDORGLISTFORSELECT: `${_local}/source/findRListForSelect`,//查询当前机构关联的供应机构列表
  ADDINVOICEORGLIST: `${_local}/source/findRListForSelect`,//查询当前机构关联的医疗机构列表
  FINDSTORAGEBYORGLIST: `${_local}/invoiceController/findStorageListByOrgId`,//根据医疗机构查询医疗机构库房列表
  SEARCHDELIVERYLIST: `${_local}/invoiceController/searchDeliveryList`,//根据医疗机构和库房查询已关联和未关联的送货单列表
  DELIVERYLIST: `${_local}/delivery/fSearchDeliveryList`,//销售模块查询送货单列表
  EXPORTDELIVERYLIST: `${_local}/delivery/fExportDeliveryList`,//销售模块送货单列表导出
  EXPORTDELIVERYDETAILS: `${_local}/delivery/exportDeliveryDetail`,//送货单详情导出
  PRINTDELIVERYDETAILS: `${_local}/delivery/printDeliveryDetail`,//送货单详情打印
  SHIPMENTDELIVERY: `${_local}/delivery/shipmentDelivery`,//送货单发货
  DELIVERYDTTAILS: `${_local}/delivery/deliveryDetails`,//根据送货单id查询送货单产品列表
  FINDMYINVOICELIST: `${_local}/invoiceController/findMyInvoiceList`,//查询我的发票列表
  GETINVOICEBYID: `${_local}/invoiceController/getInvoiceById`,//根据发票号查询发票信息
  SAVEINVOICE: `${_local}/invoiceController/saveOrUpdateInvoice`,//保存发票
  SEARCHDELIVERYLISTBYINVOICEID: `${_local}/invoiceController/searchDeliveryListByInvoiceId`,//根据发票查询关联的送货单列表
  EXPORTINVOICELIST: `${_local}/invoiceController/exportInvoiceList`,//导出发票列表
  DETAILS_BY_ORDERID: `${_local}/order/findDetailListByOrderId`,//订单列表明细
  SETTLE_GOODS: `${_local}/order/settleGoods`,//备货生成送货单
  MYORDER_LIST: `${_local}/order/findMyOrderList`,//查看订单列表
  EXPORTORDER_LIST: `${_local}/order/exportOrderList`,//导出订单列表
  UPDATEORDER_LIST: `${_local}/order/updateFstate`,//更新订单状态
  //手术模板
  SEARCHGKTEMPLATELIST: `${_local}/gkTemplateController/searchGkTemplateList`,//查询供应关系库房模版列表
  CREATEEDITGKTEMPLATE: `${_local}/gkTemplateController/createEditGkTemplate`,//新建编辑模版
  DELETEGKTEPMLATE: `${_local}/gkTemplateController/deleteGkTemplate`,//删除模版
  SEARCHGKTEMPLATEDETAILS: `${_local}/gkTemplateController/searchGkTemplateDetails`,//根据模版id查询模版产品明细
  SEARCHGKTEMPLATEPACKAGES: `${_local}/gkTemplateController/searchGkTemplatePackages`,//根据模版id查询模版手术包
  FINDTOOLSOFSPECPACKAGE: `${_local}/gkTemplateController/findToolsOfSpecPackage`,//查询手术模版中指定包的工具列表（已选)
  FINDALLTOOLS: `${_local}/gkTemplateController/findAllTools`,//查询手术模版中指定包的工具列表（已选、未选）
  INSERTGKTEMPLATEDETAILS: `${_local}/gkTemplateController/insertGkTemplateDetails`,//添加模版产品
  UPDATEGKTEMPLATEDETAILS: `${_local}/gkTemplateController/updateGkTemplateDetails`,//更新模版产品
  SAVEGKTEMPLATE: `${_local}/gkTemplateController/saveGkTemplate`,//保存模版
  INSERTGKTEMPLATEPACS: `${_local}/gkTemplateController/insertGkTemplatePacs`,//添加模版空手术包
  DELETEGKTEMPLATEPACS: `${_local}/gkTemplateController/deleteGkTemplatePacs`,//删除模版手术包
  UPDATEGKTEMPLATEPACS: `${_local}/gkTemplateController/updateGkTemplatePacs`,//更新模版手术包
  ADDTOOLSBYPACKAGE: `${_local}/gkTemplateController/addToolsByPackage`,//指定模板手术包添加工具
  COUNTTOOLSBYPACKAGE: `${_local}/gkTemplateController/countToolsByPackage`,//指定模板手术包添加工具
  DELETETOOLSBYPACKAGE: `${_local}/gkTemplateController/deleteToolsByPackage`,//指定模板手术包删除工具
  SOURCESTORAGEFORSELECT: `${_local}/source/queryRSourceStorageForSelect`,//查询供方机构供应关系对应的需方库房
  QUERYSTORAGEMATERIALLIST: `${_local}/storageMaterial/queryStorageMaterialList`,//查询供方机构供应关系对应的需方库房
  QUERYPACCOLUMNS: `${_local}/gkTemplateController/queryPacColumns`,//查询供方机构供应关系对应的需方库房
  CLEARTOOLSBYPACKAGEGKTEP: `${_local}/gkTemplateController/clearToolsByPackage`,//删除勾选的模版手术包
  // 我的订单 手术备货
  PACKAGEFINDALLTOOLS: `${_local}/delivery/package/findAllTools`,//查询指定包的工具列表（已选、未选）
  HEADERPACKAGELISTBYSENDID: `${_local}/delivery/package/findHeaderForPackageListBySendId`,//查询手术包列表的表头一行（竖表）
  SUBTOTALPACKAGEBYSENDID: `${_local}/delivery/package/subtotalPackageBySendId`,//查询指定手术包统计信息
  FINDPACKAGELIST: `${_local}/delivery/package/findPackageListBySendId`,//查询指定手术包列表
  SAVEDRAFTDATA: `${_local}/order/oper/saveDraft4Oper`,//备货保存临时数据
  ADDTOOLFROMPACKAGE: `${_local}/delivery/package/addToolsByPackage`,//指定手术包批量添加工具
  ADDTOOLSFROMTEMPLATEPACKAGES: `${_local}/delivery/package/addToolsFromTemplatePackages`,//指定手术包批量添加工具（从指定的模板手术包）
  DELETETOOLSFROMPACKAGE: `${_local}/delivery/package/deleteToolsFromPackage`,//指定手术包批量移除工具
  CLEARTOOLSBYPACKAGE: `${_local}/delivery/package/clearToolsByPackage`,//清理指定一个手术包内的工具
  GETCOUNTTOOLS: `${_local}/delivery/package/countToolsByPackage`,//查询指定手术包的工具数量
  CLEARBYORDERID: `${_local}/order/oper/clearByOrderId`,//生成备货单前清空临时数据
  SETTLEGOODSPLAN: `${_local}/order/oper/settleGoods4Oper`,//备货单生成送货单
  //二维码打印
  PRINTQRCODE: `${_local}/delivery/printQrcode`,//送货单二维码打印
  SEARCHQRCODEBYSENDDETAIL: `${_local}/delivery/searchQrCodesBySendDetail`,//根据送货单明细id查询产品二维码列表
};