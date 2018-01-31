/**
 * @file 用户组列表
 */
import React from 'react';
import { Row, Col, Input, Button ,Popconfirm, message} from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler,pathConfig,FetchPost } from 'utils/tools';
import querystring from 'querystring';
const Search = Input.Search;

const USERGROUP_BASE_URL = `/system/customerUserGroup/`,
      USERGROUP_TITLES = {
        delete:'删除',
        chose: '选择组员',
        setting: '配置权限',
        add: '添加'
      };

class UserGroup extends React.Component {
   state = {
    query: ''
  }
  deleteHandler = (query) => {
       FetchPost(pathConfig.DELETEGROUP_URL, querystring.stringify({groupId:query.groupId}))
      .then(response => {
        return response.json();
      })
      .then(d => {
        if(d.status){
            this.refs.table.fetch(query);
            message.success('删除成功！')
        }
        else{
          message.error(d.msg);
        }
      })
      .catch(e => console.log("Oops, error", e))
   
  }
  /**table根据条件查询 */
  queryHandler = (query) => {
    this.refs.table.fetch(query);
    this.setState({query})
  }
  render() {
      const columns = [{
      title: '操作',
      dataIndex: 'actions',
      render: (text, record) => {
        return (
          <span>
            <Popconfirm title="是否确认删除此条记录?" onConfirm={this.deleteHandler.bind(null, record)} okText="是" cancelText="否">
              <a>删除</a>
            </Popconfirm>
            <span className="ant-divider" />
              <a onClick={
              actionHandler.bind(
                null, this.props.router, `${USERGROUP_BASE_URL}chose`, {...record, title: `用户组${USERGROUP_TITLES.edit}`}
              )}>
              {`${USERGROUP_TITLES.chose}`}
            </a>
            <span className="ant-divider" />
            <a onClick={
              actionHandler.bind(
                null, this.props.router, `${USERGROUP_BASE_URL}setting`, {...record, title: `用户组${USERGROUP_TITLES.show}`}
              )}>
              {`${USERGROUP_TITLES.setting}`}
            </a>
          </span>
        )
      }
    }, {
      title: '用户组名称',
      dataIndex: 'groupName',
      width: '20%',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '20%',
    }, {
      title: '备注',
      dataIndex: 'tfRemark',
    }];
    const query = this.state.query;
    return (
      <div>
        { this.props.children 
          || 
          <div>
            <Row>
              <Col span={10}>
                <Search
                  placeholder="用户组名称"
                  style={{ width: 200 }}
                  onSearch={value =>  {this.queryHandler({'searchName':value})}}
                />
              </Col>
              <Col span={10} offset={4} style={{textAlign: 'right'}}>
                 <Button 
                  type="primary" 
                  style={{marginRight: '10px'}} 
                  onClick={  actionHandler.bind(
                    null, this.props.router, `${USERGROUP_BASE_URL}add`, { title: `用户组${USERGROUP_TITLES.add}`}
                  )}>
                  添加用户组
                </Button>
              </Col> 
            </Row>
    
                <FetchTable 
                  query={query}
                  ref='table'
                  columns={columns}
                  url={pathConfig.GROUPLIST_URL}
                  rowKey='groupId'
                />
          </div>   
        }  
      </div>
    )  
  }
}
module.exports = UserGroup;