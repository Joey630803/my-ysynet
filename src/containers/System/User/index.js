/**
 * @file 用户列表
 */
import React from 'react';
import { Row, Col, Input, Button,message,Popconfirm } from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler,pathConfig } from 'utils/tools';
import querystring from 'querystring';
const Search = Input.Search;
const USER_BASE_URL = '/system/user/',
      USER_TITLES = {
        show: '详情',
        setting: '重置密码',
        edit: '编辑',
        add:'添加'
      }

class User extends React.Component {
  state = {
    query: ''
  }
  /**table根据条件查询 */
  queryHandler = (query) => {
    this.setState({ query: query })
    this.refs.table.fetch(query);
  }
  deleteHandler = (query) => {
       fetch(pathConfig.RESETUSERPWD_URL, {
            method: 'post',
            mode:'cors',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:querystring.stringify({userId:query.userId})
        })
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(data => {
          if(data.status){
            message.success("重置密码成功!");
          }
          else{
            message.error(data.msg);
          }
        })
        .catch(e => console.log("Oops, error", e))
        this.refs.table.fetch(query);
  }
  render() {
    const columns = [{
      title: '操作',
      dataIndex: 'actions',
      render: (text, record) => {
        return (
          <span>
            <Popconfirm title="是否确认重置该用户密码?" onConfirm={this.deleteHandler.bind(null, record)} okText="是" cancelText="否">
              <a>{`${USER_TITLES.setting}`}</a>
            </Popconfirm>
            <span className="ant-divider" />
            <a onClick={
              actionHandler.bind(
                null, this.props.router, `${USER_BASE_URL}edit`, {...record, title: `用户${USER_TITLES.edit}`}
              )}>
              {`${USER_TITLES.edit}`}
            </a>
            <span className="ant-divider" />
            <a onClick={
              actionHandler.bind(
                null, this.props.router, `${USER_BASE_URL}show`, {...record, title: `用户${USER_TITLES.show}`}
              )}>
              {`${USER_TITLES.show}`}
            </a>
          </span>
        )
      }
    },{
      title: '账号',
      dataIndex: 'userNo',
      width: '10%',
    }, {
      title: '用户名',
      dataIndex: 'userName',
      width: '10%',
    }, {
      title: '所属组',
      dataIndex: 'groups',
    },{
      title: '状态',
      dataIndex: 'fstate',
      render :fstate =>{
        if(fstate==="00"){
          return "停用"
        }
        else if(fstate==="01"){
          return "启用"
        }
      }
    }, {
      title: '类型',
      dataIndex: 'orgType',
      render :orgType =>{
        if(orgType==="01"){
          return "医院"
        }
        else if(orgType==="02"){
          return "供应商"
        }
        else if(orgType==="03"){
          return "监管部门" 
        }
        else if(orgType==="09"){
          return "运营商" 
        }
      }
    }, {
      title: '所属机构',
      dataIndex: 'orgName',
    }, {
      title: '最后编辑时间',
      dataIndex: 'modifyTime',
      //sorter: true
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
                  ref='search'
                  placeholder="请输入机构名称/简码/账号/用户名"
                  style={{ width: 260 }}
                  onSearch={value =>  {this.queryHandler({'searchName':value})}}
                />
              </Col>
              <Col span={10} offset={4} style={{textAlign: 'right'}}>
                <Button 
                  type="primary" 
                  style={{marginRight: '10px'}} 
                  onClick={  actionHandler.bind(
                    null, this.props.router, `${USER_BASE_URL}add`, { title: `用户${USER_TITLES.add}`}
                  )}>
                  添加用户
                </Button>
              </Col> 
            </Row>
           <FetchTable 
              query={query}
              ref='table'
              columns={columns}
              url={pathConfig.USERLIST_URL}
              rowKey='userId'
            />
          </div>   
        }  
      </div>
    )  
  }
}
module.exports = User;