/**
 * @file 变更
 */
import React from 'react';
import { Breadcrumb, Row, Col, Input, message, Popconfirm } from 'antd';
import { Link, hashHistory } from 'react-router';
import FetchTable from 'component/FetchTable';
import { fetchData} from 'utils/tools';
import querystring from 'querystring';
import { tender } from 'api';
const Search = Input.Search;

class ProductChange extends React.Component {
  state = {
    query: {}
  }
  save = (record) => {
    const tenderChange =[];
    const selectDatas = this.props.location.state;
    if(selectDatas.length>0){
        selectDatas.map((item)=>{
          return tenderChange.push({"flag":item.flag,"fitemid":item.fitemid,"tenderDetailGuid":item.tenderDetailGuid,"certGuid":item.certGuid})
        })
        const postData = {
          tenderChange: tenderChange,
          newCertGuid: record.certGuid
        }
        console.log('postData: =>', postData);
        fetchData(tender.TENDER_CHANGE, JSON.stringify(postData),(data)=>{
            if (data.status) {
            message.success('变更成功!');
            hashHistory.push({
              pathname: '/tender/sourceManager/sourceMaterial/material',
              state:this.props.location.query
            })
          } else {
            message.error(data.msg);
          }
        },'application/json')
    }else{
        const allChangeData = {...this.props.location.state,newCertGuid: record.certGuid};

        fetchData(tender.ALLTENDCHANGE_LIST, querystring.stringify(allChangeData),(data)=>{
            if (data.status) {
            message.success('变更成功!');
            hashHistory.push({
              pathname: '/tender/sourceManager/sourceMaterial/material',
              state:this.props.location.query
            })
          } else {
            message.error(data.msg);
          }
        })
    }
   
  
  }
  render() {
    console.log(this.props.location.query.sourceGuid,'change')
    const columns = [
      {
        title: '操作',
        dataIndex: 'fitemid',
        width: 80,
        render: (text, record) => {
          return <Popconfirm 
                    title="是否确认变更" 
                    onConfirm={this.save.bind(this, record)} 
                    okText="是" cancelText="否">
                    <a href="#">保存</a>
                  </Popconfirm>
        }
      }, {
        title : '证件号',
        dataIndex : 'registerNo',
      } , {
        title : '状态',
        width: 80,
        dataIndex : 'fstate',
        render: (text, record) => {
          let status;
          switch (text) {
            case '00':
                status = <span style={{color: '#f04134'}}>到期</span>
              break;
            case '01':
                status = <span style={{color: '#00a854'}}>正常</span>
              break;
            case '02':
                status = <span style={{color: '##f04134'}}>异常</span>
              break;
            default:
                status = '什么鬼';
              break;
          }
          return status;
        }
      } , {
        title : '产品名称',
        dataIndex : 'materialName',
      } , {
        title : '品牌',
        dataIndex : 'tfBrandName',
      }  , {
        title : '生产商',
        dataIndex : 'produceName',
      } , {
        title : '有效期',
        dataIndex : 'lastTime',
      } 
    ]
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item><Link  to={{pathname:'/tender/sourceManager'}}>供应管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={{pathname:'/tender/sourceManager/sourceMaterial/material',state:this.props.location.query}}>产品</Link></Breadcrumb.Item>
          <Breadcrumb.Item>变更</Breadcrumb.Item>
        </Breadcrumb>
        <Row style={{marginTop: 20}}>
          <Col span={8}>
            <Search
              placeholder="请输入证件号/产品名称/品牌/生产商"
              style={{ width: 280 }}
              onSearch={value => {
                this.refs.table.fetch({
                  searchName: value
                })
                this.setState({query: {searchName: value}})
              }}
            />
          </Col>
        </Row>
        <FetchTable 
          query={this.state.query}
          ref='table'
          url={tender.REGISTER_NOLIST}
          columns={columns}
          scroll={{ x: '140%' }}
          rowKey={'certGuid'}
        />
      </div>
    )
  }
}

module.exports = ProductChange;