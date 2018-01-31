import React from 'react';
import { Transfer, Button,message,Breadcrumb } from 'antd';
import querystring from 'querystring';
import { Link } from 'react-router';
import { FetchPost } from 'utils/tools';
import { storage } from '../../../api';
//清掉科室移除用户时的数据池保存的数据问题
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../actions';

class CustomerStorageChose extends React.Component {
  
  state = {
    mockData: [],
    targetKeys: [],
  }
  componentDidMount() {
    this.getMock();
  }
  getMock = () => {
    const mockData = [],targetKeys=[];
    FetchPost(storage.CUSTOMERSTORAGE_BYSIDUSER,querystring.stringify({storageGuid:this.props.location.state.storageGuid}))
    .then(response => {
      return response.json();
    })
    .then(data => {
      if(data.status){
        const result = data.result;
        for (let i = 0; i < result.length; i++) {
          mockData.push({
            key: result[i].userId,
            userName: result[i].userName,
            orgName: result[i].orgName,

          });
          if(result[i].isSelected){
            targetKeys.push(result[i].userId)
          }
        }
          this.setState({mockData:mockData,targetKeys:targetKeys})
      }
    })
    .catch(e => console.log("Oops, error", e))
      
  }
  handleChange = (targetKeys) => {
      FetchPost(storage.CUSTOMERSTORAGE_USER,querystring.stringify({storageGuid:this.props.location.state.storageGuid,userIds:targetKeys}))
      .then(response => {
        return response.json();
      })
      .then(data => {
        if(data.status){
           this.setState({ targetKeys });
             this.props.actions.createOrder({
               addressId: '',
               dataSource: [],
               expectDate: '',
               storageGuid: '',
               total: ''
             });
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
          <Breadcrumb.Item>工作人员</Breadcrumb.Item>
        </Breadcrumb>
      <Transfer
        dataSource={this.state.mockData}
        showSearch
        listStyle={{
          width: '45%',
          height: document.body.clientHeight-160,
          marginTop:'16px'
        }}
        titles={['未选择用户','已选用户']}
        searchPlaceholder={'请输入搜索内容'}
        notFoundContent={'列表为空'}
        operations={['添加', '移除']}
        targetKeys={this.state.targetKeys}
        onChange={this.handleChange}
        render={item => `${item.orgName}------${item.userName}`}
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
)(CustomerStorageChose);