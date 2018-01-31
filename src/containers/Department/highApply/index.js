/**
 * @file 高值申请
 * @summary 高值耗材申请主页面,包含创建,修改等子页面
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
  applyType: 'HIGH_APPLY'
}

class HighApply extends React.Component {
  state = {
    query: query
  }
  search = (values) => {
    console.log('高值申请查询条件:', { ...values, applyType: 'HIGH_APPLY'});
    this.setState({
      query: { ...values, applyType: 'HIGH_APPLY'}
    })
    this.refs.applyGrid.fetch({ ...values, applyType: 'HIGH_APPLY'});
  }
  render () {
    const { query } = this.state;
    return this.props.children || (
      <div>
        <SearchCondition 
          search={(values) => this.search(values)} 
          create={()=> hashHistory.push({
            pathname: `/department/highApply/details`,
            state: {title: '新建申请', readonly: false}
          })} 
          url={department.EXPORTAPPLYLIST+"?"+querystring.stringify(query)}
        />
        <ApplyGrid 
          to='/department/highApply/details'
          ref='applyGrid'
          query={query}
          url={department.SEARCH_APPLY}
        />
      </div>
    )
  }
}
// <a  href={exportHref}><Icon type="export" />导出Excel</a>  
module.exports = HighApply;