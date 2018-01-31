import React from 'react';
import { Row, Col, Input, Button } from 'antd';
import { Link } from 'react-router';
import FetchTable from 'component/FetchTable';
import { actionHandler ,pathConfig} from 'utils/tools';

const Search = Input.Search;
const HOSPITAL_BASE_URL = '/basicData/mechanism/',
      HOSPITA_TITLES = {
        show: '详情',
        edit: '编辑'
      }

class Hospital extends React.Component {
   state = {
    query: ''
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
              <a onClick={
                actionHandler.bind(
                  null, this.props.router, `${HOSPITAL_BASE_URL}hospitalEdit`, {...record, title: `医疗机构${HOSPITA_TITLES.edit}`}
                )}>
                {`${HOSPITA_TITLES.edit}`}
              </a>
              <span className="ant-divider" />
              <a onClick={
                actionHandler.bind(
                  null, this.props.router, `${HOSPITAL_BASE_URL}hospitalShow`, {...record, title: `医疗机构${HOSPITA_TITLES.show}`}
                )}>
                {`${HOSPITA_TITLES.show}`}
              </a>
          </span>
        )
      }
    },{
      title: '医疗机构名称',
      dataIndex: 'ORG_NAME',
      width: '20%',
    }, {
      title: '状态',
      dataIndex: 'FSTATE',
      width: '20%',
      render :FSTATE =>{
        if(FSTATE==="00"){
          return "停用"
        }
        else if(FSTATE==="01"){
          return "启用"
        }
      }
    }, {
      title: '简称',
      dataIndex: 'ORG_ALIAS',
    }, {
      title: '省',
      dataIndex: 'TF_PROVINCE',
    }, {
      title: '市',
      dataIndex: 'TF_CITY',
    }, {
      title: '区',
      dataIndex: 'TF_DISTRICT',
    }, {
      title: '最后编辑时间',
      dataIndex: 'MODIFY_TIME',
      //sorter: true
    }];
    const query = this.state.query;
    return (
      <div>
        <Row>
          <Col span={10}>
            <Search
              placeholder="请输入机构名称/简称/简码"
              style={{ width: 200 }}
              onSearch={value =>  {this.queryHandler({'searchName':value})}}
            />
          </Col>
          <Col span={10} offset={4} style={{textAlign: 'right'}}>
            <Button type="primary" style={{marginRight: '10px'}}>
              <Link to='/basicData/mechanism/hospitalAdd'>添加机构</Link>
            </Button>
          </Col>
        </Row>
        <FetchTable 
          query={query}
          ref='table'
          columns={columns}
          url={pathConfig.HOSPITALLIST_URL}
          rowKey='ORG_NAME'
        />
      </div>
    )  
  }
}
module.exports = Hospital;