/**
 * @file 客户中心配置科室
 */
import React from 'react';
import { Transfer, Button,message,Breadcrumb } from 'antd';
import querystring from 'querystring';
import { Link } from 'react-router';
import { FetchPost,jsonNull } from 'utils/tools';
import { storage } from '../../../api';
//清掉库房移除时的数据池保存的数据问题
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../actions';
class CustomerStorageDept extends React.Component {
  
  state = {
    mockData: [],
    targetKeys: [],
  }
  componentDidMount() {
    this.getMock();
  }
  getMock = () => {
    const mockData = [],targetKeys=[];
    FetchPost(storage.CUSTOMERSTORAGE_BYSIDDEPT,querystring.stringify({storageGuid:this.props.location.state.storageGuid}))
    .then(response => {
      return response.json();
    })
    .then(data => {
      if(data.status){
        const result = jsonNull(data.result);
        for (let i = 0; i < result.length; i++) {
          mockData.push({
            key: result[i].deptGuid,
            deptName: result[i].deptName,
            orgName: result[i].orgName,

          });
          if(result[i].IS_SELECTED){
            targetKeys.push(result[i].deptGuid)
          }
        }
          this.setState({mockData:mockData,targetKeys:targetKeys})
      }
    })
    .catch(e => console.log("Oops, error", e))
      
  }
  handleChange = (targetKeys) => {
      FetchPost(storage.CUSTOMERSTORAGE_DEPT,querystring.stringify({storageGuid:this.props.location.state.storageGuid,deptIds:targetKeys}))
      .then(response => {
        return response.json();
      })
      .then(data => {
        if(data.status){
          this.setState({ targetKeys });
          this.props.actions.createApply({
            applyId:'',
            addressId: '',
            deptGuid: '',
            storageGuid: '',
            dataSource: [],
          }) 
        }
        else{
          message.error(data.msg);
        }

      })
      .catch(e => console.log("Oops, error", e))
    
  }
  renderFooter = () => {
    return (
      <Button size="small" style={{ float: 'right', margin: 5 }}
        onClick={this.getMock}
      >
        刷新
      </Button>
    );
  }
  render() {
    return (
       <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/storage/customerStorage'>库房管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>供应科室</Breadcrumb.Item>
        </Breadcrumb>
      <Transfer
        dataSource={this.state.mockData}
        showSearch
        listStyle={{
          width: '45%',
          height: document.body.clientHeight-160,
          marginTop:'16px'
        }}
        titles={['未选择科室','已选科室']}
        searchPlaceholder={'请输入搜索内容'}
        notFoundContent={'列表为空'}
        operations={['添加', '移除']}
        targetKeys={this.state.targetKeys}
        onChange={this.handleChange}
        render={item => `${item.orgName}------${item.deptName}`}
        footer={this.renderFooter}
      />
      </div>
    );
  }
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})
export const mapStateToProps = state => ({
  actionState: state
})
module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerStorageDept);