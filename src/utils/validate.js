import { FetchPost } from './tools';
/**
 * @desc 返回校验提示信息
 * @param {校验字段名} st 
 * @param {校验规则} sb 
 */
const _message = (st, sb) => {
  return {
    max: `${st}不能大于${sb}`,
    min: `${st}不能少于${sb}`,
    len: `${st}必须为${sb}位!`,
    isNumber: `只能是数字`,
    isCode: `只能是英文、数字、下划线(_)、中横线(-)`,
    all: `只能是中文、英文、数字、下划线(_)、中横线(-)`,
    required: `${st}不允许为空`,
    repeat: `${st}重复`
  }
}
/**
 * 校验正则匹配
 */
const _reg = {
  number: /^\d+$/,//数字
  code: /^[A-Za-z0-9_\-]+$/, //数字英斜杠
  all: /[A-Za-z0-9_\-\u4e00-\u9fa5]+$///中英数字斜杠
}
/**
 * @desc 正则校验
 * @param {校验规则 number || code || all} pat 
 * @author Vania
 * @return pattern {}
 */
export const pattern = (pat) => {
  switch (pat) {
    case 'number':
      return { pattern: _reg.number, message: _message().isNumber};
    case 'code':
      return { pattern: _reg.code, message: _message().isCode }
    default:
      return { pattern: _reg.all, message: _message().all }
  }
}
/**
 * @desc 异步校验
 * @param
 * @author Vania
 * @return null
 */
export const asyncValidate = (params) => {
  const { url, query, success, error } = params;
  FetchPost(url, query)
  .then(res => res.json())
  .then(data => success(data))
  .catch(err => typeof error === 'function' ? error() : console.log(err))
}
/**
 * @desc 标准校验
 * @param {*} key 
 * @param {*} st 
 * @param {*} sb 
 */
export const roles = (key, st, sb) => {
  //console.log({role: key, message: _message(st, sb)[key]})
  let result = {};
  result[key] = sb;
  result['message'] = _message(st, sb)[key];
  return result;
}
