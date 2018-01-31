/**
 * @file 选择模板
 */
import React from 'react';
import { Breadcrumb, Layout, message } from 'antd';
import { Link } from 'react-router';
import { apply } from 'component/Department';
import { department } from 'api';
import { fetchData } from 'utils/tools';
import { hashHistory } from 'react-router';
import querystring from 'querystring';
const { Sider, Content } = Layout;
const { HighApplyTempTree, ApplyProduct, ProductSearch } = apply;
const styles = {
  breadcrumb: {
    fontSize: '1.1em'
  },
  layout: {
    backgroundColor: '#fff'
  },
  sider: {
    marginTop: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    border: '1px solid rgba(0, 0, 0, 0.15)'
  },
  content: {
    padding: 4
  }
}

class ChoseTemplate extends React.Component {
  state = {
    treeData: [],
    query: {},
    url: '',
    templateId: '',
    rows: this.props.location.state.detailList || [],
    selectedRows: []
  }
  componentDidMount = () => {
    const { location } = this.props;
    const { deptGuid, storageGuid } = location.state.values;
    if (deptGuid && storageGuid) {
      fetchData(department.DEPTTEMPLATE_LIST, querystring.stringify({deptGuid, storageGuid}), data => {
        const treeData = data.map(item => ({ id: item.templateId, title: item.templateName}))
        this.setState({ treeData })
      })
    } else {
      hashHistory.push({
        pathname: '/department/highApply'
      })
    }
  }
  //添加产品
  add = () => {
    const { fromTo, values, detailList, otherInfo } = this.props.location.state;
    const { selectedRows } = this.state;
    let totalPrice = 0;
    const postData = [ ...detailList, ...selectedRows ];
    for (let i=0;i< postData.length;i++) {
      postData[i].amount = postData[i].amount ? postData[i].amount : 1;
      postData[i].money = postData[i].money ? postData[i].money : Number(postData[i].purchasePrice);
      totalPrice += postData[i].money;
    }
    hashHistory.push({
      pathname: fromTo.back,
      state: {...fromTo, ...values, rows: postData, totalPrice, otherInfo, isEdit: true}
    })
  }
  render () {
    const { fromTo, tenderMaterialGuids, values, otherInfo, detailList} = this.props.location.state;
    const { deptGuid, storageGuid } = values;
    const { treeData } = this.state;
    return (
      <div>
        <Breadcrumb style={styles.breadcrumb}>
          <Breadcrumb.Item><Link to='/department/highApply'>高值申请</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={{pathname: fromTo.back, state: {...fromTo, ...values, otherInfo, rows: detailList, isEdit: true} }} >{ fromTo.title }</Link></Breadcrumb.Item>
          <Breadcrumb.Item> 选择模板 </Breadcrumb.Item>
        </Breadcrumb>
        <Layout style={styles.layout}>
          <Sider style={styles.sider}>
            <HighApplyTempTree
              onSelect={selectedKeys => {
                let url = null, query = {}, templateId = null;
                if (selectedKeys.length) {
                    url = department.GET_TEMPLATE_DETAILS;
                    query = {templateId: selectedKeys[0]}
                    templateId = selectedKeys[0];
                } 
                this.setState({url: url, query, templateId});
              }}
              data={treeData}
            />
          </Sider>
          <Content style={styles.content}>
            <ProductSearch 
              search={postData => {
                const { templateId } = this.state;
                if (templateId) {
                  this.refs.applyGrid.fetch({
                    supplierId: postData.supplierId, 
                    searchName: postData.searchName,
                    deptGuid, storageGuid, templateId, tenderMaterialGuids
                  }) 
                } else {
                  message.error('请选择模板!')
                }
              }}
              add={this.add}
            />
            <ApplyProduct
              getRowSelection={rows => this.setState({selectedRows: rows})}
              rowKey={'templateDetailGuid'}
              url={this.state.url}
              query={{...this.state.query, tenderMaterialGuids}}
              ref='applyGrid'
              readonly={true}
            />
          </Content>
        </Layout>
      </div>
    )
  }
}

module.exports = ChoseTemplate;