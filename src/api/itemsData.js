import {_local} from './local';
export default {
  ITEMSDATA_LIST: `${_local}/staticData/searchStaticInfo`,//查询所有数据字典类型
  ITEMSDATABYORGID_LIST: `${_local}/staticData/searchStaticByOrgId`,//查询本机构的数据字典类型
  ORG_LIST: `${_local}/orgInfoController/findOrgs`,//查询所有机构列表
  ADDITEMSDATA_CLASS: `${_local}/staticData/insertStaticInfo`,//新增数据字典类型
  EDITITEMSDATA_CLASS: `${_local}/staticData/updateStaticInfo`,//编辑数据字典类型
  ITEMSDATADETAILS_LIST: `${_local}/staticData/searchStaticData`,//数据字典内容查询
  ADDITEMSDATA: `${_local}/staticData/insertStaticData`,//数据字典内容新增
  EDITITEMSDATA: `${_local}/staticData/updateStaticData`,//数据字典内容编辑
  COPYITEMSDATA: `${_local}/staticData/copyStaticInfo`,//克隆
  ORGSTATICDATA_LIST: `${_local}/staticData/orgStaticInfo`//查询机构字典下拉框
};