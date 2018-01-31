/**
 * @file 手术申请
 * @summary 手术耗材申请主页面,包含创建,修改等子页面
 * @author Vania
 */
import React from 'react';
import { apply } from 'component/Department';
import { department } from 'api';
import { hashHistory } from 'react-router'; 
import moment from 'moment';
import querystring from 'querystring';
const { SearchCondition, ApplyGrid } = apply; 
//第一次加载默认查询条件
const query = {
  deptGuid: '',
  storageGuid: '',
  applyFstate: '',
  applyStartDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
  applyEndDate: moment(new Date()).format('YYYY-MM-DD'),
  applyType: 'OPER_APPLY'
}

class OperApply extends React.Component {
  state = {
    query: query
  }
  search = (values) => {
    console.log('手术申请查询条件:', values);
    this.setState({
      query: { ...values, applyType: 'OPER_APPLY'}
    })
    this.refs.applyGrid.fetch({ ...values, applyType: 'OPER_APPLY'});
  }
  render () {
    const { query } = this.state;
    return this.props.children || (
      <div>
        <SearchCondition 
          search={(values) => this.search(values)} 
          create={()=> hashHistory.push({
            pathname: `/department/operApply/details`,
            state: {title: '新建申请', readonly: false}
          })} 
          url={department.EXPORTAPPLYLIST+"?"+querystring.stringify(query)}
        />
        <ApplyGrid 
          to='/department/operApply/details'
          ref='applyGrid'
          query={query}
          url={department.SEARCH_APPLY}
        />
      </div>
    )
  }
}

module.exports = OperApply;