import React, { PropTypes } from 'react';
import FetchTable from 'component/FetchTable';
import { fetchData } from 'utils/tools';
import { Popconfirm, message,Modal } from 'antd';
import { Link } from 'react-router';
import { department } from 'api';
import querystring from 'querystring';


const fstateCode = {
  '00': {text: '草稿', color: '#108EE9'},
  '10': {text: '已提交', color: '#00a854'},
  '20': {text: '待确认', color: '#f04134'},
  '34': {text: '已驳回', color: '#f04134'},
  '40': {text: '采购中', color: '#ffbf00'},
  '60': {text: '完结', color: '#00a854'},
  '92': {text: '已删除', color: '#000'}
}

class ApplyGrid extends React.Component {
  fetch = (values) => {
    this.refs.table.fetch(values);
  }
  handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
      });
  }
  updateFstate = (record, fstate) => {
    fetchData(department.UPDATEAPPLYFSTATE, querystring.stringify({
      applyId: record.applyId,
      oldFstate: record.fstate,
      fstate
    }), data => {
      if (data.status) {
        message.success('操作成功!');
        this.refs.table.fetch();
      } else {
        this.handleError(data.msg);
      }
    });
  }
  render () {
    const { query, url, to } = this.props;
    const operList = {
      edit: (record, to) => <Link to={{pathname: to, state: {...record, readonly: false, title: '编辑', applyId: record.applyId}}}>编辑</Link>,
      detail: (record, to) => <Link to={{pathname: to, state: {...record, readonly: true, title: '详情', applyId: record.applyId}}}>查看</Link>,
      delete: (record) =>  <Popconfirm title="是否确认删除?" onConfirm={this.updateFstate.bind(null, record, 92)} okText="是" cancelText="否">
                      <a href="#">删除</a>
                     </Popconfirm>,
      submit: (record) => <Popconfirm title="是否确认提交?" onConfirm={this.updateFstate.bind(null, record, 10)} okText="是" cancelText="否">
                      <a href="#">提交</a>
                    </Popconfirm>,
      end: (record) =>  <Popconfirm title="是否确认完结?" onConfirm={this.updateFstate.bind(null, record, 60)} okText="是" cancelText="否">
                    <a href="#">完结</a>
                  </Popconfirm>,
    }
    const columns = [
      {
        title : '操作',
        dataIndex : 'applyId',
        render: (value, record, index) => {
          if (record.auditFlag === '01') {
            return operList.detail.call(null, record, to)
          } else if (record.approvalFlag === '01') {
            return operList.detail.call(null, record, to)
          }  
          switch (record.fstate) {
            case '00':
              return (
                <span>
                  { operList.detail.call(null, record, to) }
                  <span className="ant-divider" />
                  { operList.edit.call(null, record, to) }
                  <span className="ant-divider" />
                  { operList.submit.call(null, record) }
                  <span className="ant-divider" />
                  { operList.delete.call(null, record) }
                </span>
              )
            case '34':
              return (
                <span>
                  { operList.detail.call(null, record, to) }
                  <span className="ant-divider" />
                  { operList.edit.call(null, record, to) }
                  <span className="ant-divider" />
                  { operList.end.call(null, record) }
                </span>
              )
            default:
              return  operList.detail.call(null, record, to) ;
          }
        }
      }, {
        title : '状态',
        dataIndex : 'fstate',
        render: (value, record) => {
          if (record.auditFlag === '01') {
            return <span style={{color: '#f04134'}}>正在审核</span>
          } else if (record.approvalFlag === '01') {
            return <span style={{color: '#f04134'}}>正在审批</span>
          } else {
            return <span style={{color: fstateCode[value].color || '#fff'}}>{ fstateCode[value].text }</span>
          }
        }
      }, {
        title : '申请单号',
        dataIndex : 'applyNo'
      }, {
        title : '就诊号',
        dataIndex : 'treatmentNo'
      }, {
        title : '手术名称',
        dataIndex : 'operName'
      },   {
        title : '患者姓名',
        dataIndex : 'name'
      },   {
        title : '申请科室',
        dataIndex : 'deptName'
      },   {
        title : '收货地址',
        dataIndex : 'tfAddress'
      },   {
        title : '备货库房',
        dataIndex : 'storageName'
      }, {
        title : '申请人',
        dataIndex : 'applyUsername'
      }, {
        title : '申请时间',
        dataIndex : 'applyTime'
      }
    ]
    return (
      <FetchTable 
        ref='table'
        columns={columns}
        query={query}
        url={url}
        rowKey={'applyId'}
      />
    )
  }
}

ApplyGrid.propTypes = {
  query: PropTypes.object,
  url: PropTypes.string.isRequired
}

export default ApplyGrid;