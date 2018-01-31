import {_local} from './local';
export default {
    FINDPURCHASEGATHER: `${_local}/statement/findCGInfo`,//查询采购汇总列表
    FINDUSERGATHER: `${_local}/statement/findLYInfo`,//查询领用汇总列表
    FINDSTOCKGATHER: `${_local}/statement/findKCInfo`,//查询库存汇总列表
    FINDDYNAMICGATHER: `${_local}/statement/findDTInfo`,//查询动态汇总列表
    CREATEFORMS: `${_local}/statement/createForms`,//生成报表

    FINDSTORAGEBYUSER: `${_local}/storage/findStorageByUser`,//查询用户所属的库房列表
    FINDMYTOPSTORAGEBYUSER: `${_local}/storage/findTopStorageByUser`,//查询用户所属的一级库房列表
    FINDFINANCEPRODUCT: `${_local}/financeTypeController/findProduct`,//查询财务模块产品列表
    SEARCHTREETYPE: `${_local}/financeTypeController/searchTreeFinanceType`,//财务分类下拉框列表
    FINDFINANCETYPE: `${_local}/financeTypeController/findFinanceType`,//查询是否有财务大类
    UPDATEFINANCETYPE: `${_local}/financeTypeController/updateType`,//修改财务大类
};