import basicData from './basicData';//基础数据
import system from './system';//系统管理
import purchase from './purchase';//采购管理
import sales from './sales';//销售管理
import implement from './implement';//实施模块
import checkdata from './checkData';//审核机构
import persons from './persons';//个人用户设置
import department from './department';//科室管理
import storage from './storage';//库房
import message from './message';//消息
import tender from './tender';//招标
import approve from './approve';//审批
import finance from './finance';//财务

let RouterArr = {};
RouterArr.basicData = basicData;
RouterArr.system = system;
RouterArr.purchase = purchase;
RouterArr.sales = sales;
RouterArr.implement = implement;
RouterArr.checkdata = checkdata;
RouterArr.persons = persons;
RouterArr.department = department;
RouterArr.storage = storage;
RouterArr.message = message;
RouterArr.tender = tender;
RouterArr.approve = approve;
RouterArr.finance = finance;
let arr = Object.keys(RouterArr).map(key=>RouterArr[key]);
exports.RouterArr = arr;
