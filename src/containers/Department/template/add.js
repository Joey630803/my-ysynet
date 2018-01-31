import React from 'react';
import { Input, Breadcrumb, Row, Col, Button, message, Modal } from 'antd';
import { Link, hashHistory } from 'react-router';
import FetchTable from 'component/FetchTable';
import { fetchData } from 'utils/tools';
import { department } from 'api';
import querystring from 'querystring';
const Search = Input.Search;
const columns = [{
    title: '通用名称',
    dataIndex: 'geName',
    fixed: 'left',
    width: 150
  }, {
    title: '产品名称',
    dataIndex: 'materialName',
  }, {
    title: '规格',
    dataIndex: 'spec',
  }, {
    title: '型号',
    dataIndex: 'fmodel',
  }, {
    title: '品牌',
    dataIndex: 'tfBrandName',
    width: 100
  }, {
    title: '采购单位',
    dataIndex: 'purchaseUnit',
    width: 75
  }, {
    title: '包装规格',
    dataIndex: 'tfPacking',
    width: 100
  }, {
    title: '生产商',
    dataIndex: 'produceName',
  }, {
    title: '采购价格',
    dataIndex: 'purchasePrice',
    width: 100,
    fixed: 'right'
  }
];
class TemplateAdd extends React.Component {
  state = {
    selected: [],
    selectedRows: [],
    query: {}
  }
  handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
      });
  }
  choseHandler = () => {
    const { selected } = this.state;
    const { template } = this.props.location.state;
    if (!selected.length) {
      return message.warn('请至少选择一条记录!')
    }
    console.log(selected)
    fetchData(department.INSERT_TEMPLATE_DETAILS, 
      querystring.stringify({ tenderMaterialGuids: selected, templateId: template.id}),(data)=>{
        if (data.status) {
          const { template, dept, storage } = this.props.location.state;
          Modal.confirm({
            title: '是否返回上一页？',
            content: '点击确认返回，取消则继续选择产品',
            okText: '确认',
            cancelText: '取消',
            onOk: () => hashHistory.push({
              pathname: '/department/template',
              state: {
                template, dept, storage
              }
            })
          });
        }else{
          this.handleError(data.msg);
        }
      });
  }
  render () {
    const { template, storage } = this.props.location.state;
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
          <Breadcrumb.Item><Link to='/department/template'>模板管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>添加产品</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col span={16}>
            <Search
              placeholder="产品名称/通用名称/规格/型号/品牌"
              style={{ width: 300 }}
              onSearch={value => {
                this.refs.table.fetch({
                  templateId: template.id, 
                  storageGuid: storage.value,
                  searchName: value
                })
              }}
            />
          </Col>
          <Col span={8} style={{ textAlign: 'right'}}>
            <Button type="primary" onClick={this.choseHandler}>选入</Button>
          </Col>
        </Row>
        <FetchTable 
          query={{templateId: template.id, storageGuid: storage.value}}
          url={department.ADD_TEMPLATE_DETAILS}  
          rowKey={'tenderMaterialGuid'}
          ref='table'
          cb={(rows) => {
            let defaultSelected = this.state.selected;
            rows.map((item, index) => {
              if (item.chooseFlag && !defaultSelected.find((n) => n === item.tenderMaterialGuid)) {
                defaultSelected.push(item.tenderMaterialGuid);
              }
              return null;
            })
            this.setState({selected: defaultSelected});
          }}
          columns={columns} 
          scroll={{ x: '150%' }}
          rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys})
            }
          }}
        />
      </div>  
    )
  }
}
module.exports = TemplateAdd;