import {_local} from './local';
export default {
  CERT_LIST: `${_local}/cert/findCertList`,//查询全部证件列表
  CERTACTIONS: `${_local}/cert/saveCert`,//添加或修改证件
  DELETECERT: `${_local}/cert/deleteCert`,//删除证件
  MODELLIST_BYCERTID: `${_local}/cert/findMaterialListByCertGuid`,//查询品规列表（指定证件）
  MODELACTIONS_BYCERTID: `${_local}/cert/saveMaterialForCertGuid`,//添加或修改品规（指定证件）
  IMPORTMODEL: `${_local}/cert/importMaterials`,//导入品规（指定证件）
  UPDATEMODELBATCH: `${_local}/cert/updateMaterialsByFitemids`,//批量修改品规
  UPDATEMATERIALSBYCERTGUID: `${_local}/cert/updateMaterialsByCertGuid`,//指定证件下的全部产品 全部编辑
  DELETEMODEL: `${_local}/cert/deleteMaterial`,//删除品规
  ADDMATERIALEXEND: `${_local}/product/addMaterialExtend`,//产品扩展属性REF/包装材质/包装规格
  DELETEMATERIALEXTENDS: `${_local}/product/deleteMaterialExtends`,//删除产品扩展属性
  SEARCHCERTLIST_PRODUCT: `${_local}/product/searchCertList`,//查询证件列表（绑定证件：下拉搜索）
  SEARCHCHANGELIST_PRODUCT: `${_local}/product/findCertChangeListByFitemid`,//查看指定产品的证件绑定时序列表
  MODELLIST_PRODUCT: `${_local}/product/findMaterialList`,//查询全部品规列表
  FINDCERTLISTBYFITEMID: `${_local}/product/findCertListByFitemid`,//审核产品变更
  CHANGEPRODUCTCERT: `${_local}/product/changCertByFitemids`,//指定证件下的部分产品-变更证件
  CHANGECERTBYCERTGUID: `${_local}/product/changCertByCertGuid`,//指定证件下的全部产品-变更证件
  SEARCHAPPLY: `${_local}/productAudit/findAuditList`,//查询申请列表
  APPLYPRODUCTBYID: `${_local}/productAudit/findCertByRegistGuid`,//[新产品申请] - 查询证件信息
  CHANGEPRODUCTDETAILS: `${_local}/productAudit/findChangeDetailByRegistGuid`,//产品变更申请：详情] - 查询变更详情
  CHECKPRODUCT: `${_local}/productAudit/checkNewProduct`,//审核新产品
  CHECKCHANGEPRODUCT: `${_local}/productAudit/checkChangeCert`,//审核产品变更
  CHANGEMODELLIST: `${_local}/productAudit/findChgProductsByRegistGuid`,//查询被变更的产品品规列表
  GETDATA:'http://118.31.237.150:5000/getData',//获取食药监产品器械数据
};