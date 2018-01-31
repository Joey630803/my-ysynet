import React from 'react';
import { Transfer, Button,message,Breadcrumb } from 'antd';
import querystring from 'querystring';
import { Link } from 'react-router';
import { pathConfig } from 'utils/tools';

class UserGroupChose extends React.Component {
  
  state = {
    mockData: [],
    targetKeys: [],
  }
  componentDidMount() {
    this.getMock();
  }
  getMock = () => {
    const mockData = [],targetKeys=[];
    fetch(pathConfig.USERLISTBYGROUPID_URL, {
          method: 'post',
          mode:'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body:querystring.stringify({groupId:this.props.location.state.groupId})
      })
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
              userNo: result[i].userNo,
  
            });
            if(result[i].selected){
              targetKeys.push(result[i].userId)
            }
          }
          this.setState({mockData:mockData,targetKeys:targetKeys})
        }

      })
      .catch(e => console.log("Oops, error", e))
      
  }
  handleChange = (targetKeys) => {
      fetch(pathConfig.USERGROPSAVE_URL, {
          method: 'post',
          mode:'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body:querystring.stringify({groupId:this.props.location.state.groupId,userIds:targetKeys})
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if(data.status){
           this.setState({ targetKeys });
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
          <Breadcrumb.Item><Link to='/system/userGroup'>用户组</Link></Breadcrumb.Item>
          <Breadcrumb.Item>选择组员</Breadcrumb.Item>
        </Breadcrumb>
      <Transfer
        dataSource={this.state.mockData}
        showSearch
        listStyle={{
          width: '45%',
          height: document.body.clientHeight-160,
          marginTop:'16px'
        }}
        titles={['未选择用户','选入组内用户']}
        searchPlaceholder={'请输入搜索内容'}
        notFoundContent={'列表为空'}
        operations={['添加', '移除']}
        targetKeys={this.state.targetKeys}
        onChange={this.handleChange}
        render={item => `${item.userNo}------${item.userName}`}
        footer={this.renderFooter}
      />
      </div>
    );
  }
}
module.exports = UserGroupChose;