/**
 * @file 添加模板
 */
import React from 'react';
import { Row, Col, Input,Layout,Tree,Breadcrumb,message,Button } from 'antd';
import { Link ,hashHistory} from 'react-router';
import { department } from '../../../api';
import FetchTable from 'component/FetchTable';
import { fetchData} from 'utils/tools';
import querystring from 'querystring';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../actions';

const { Content, Sider } = Layout;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class AddTemplate extends React.Component {
  state = {
    query: {
    
    },
    deptGuid:this.props.location.state.deptGuid,
    storageGuid:this.props.location.state.storageGuid,
    tempData:[],
    searchName:'',
    tenderDetailGuids:this.props.location.state.tenderDetailGuids,
    dataSource: [],//表格数据,用于清空
    url: null,
    isPagination: true,//是否分页
    selectedNodes: [],//选中模板
    template: {
      id: '',
      name: ''
    },//选择模板
    allRows: [],
    selectedRows: [], 
    selected: []//this.props.location.state.data
  }
  componentDidMount = () => {
    this.createApply({
      deptGuid: this.props.location.state.deptGuid,
      storageGuid:this.props.location.state.storageGuid
    });
    fetchData(department.DEPTTEMPLATE_LIST,
      querystring.stringify({deptGuid:this.state.deptGuid,storageGuid:this.state.storageGuid}),(data)=>{ 
        this.setState({ tempData:data });
    });
     //选中处理
    const selected = this.props.actionState.Apply.dataSource;
    let selectedArr = [];
    selected.map( (item, index) => selectedArr.push(item.RN));
    this.setState({ 
      selected: selectedArr, 
      selectedRows: this.props.actionState.Apply.dataSource,
      allRows: this.props.actionState.Apply.dataSource
    })
  }
  createApply = (apply) => {
    this.props.actions.createApply(apply);
  }
  //树子节点点击
  treeSelectHandler = (selectedKeys, e) => {
    if (selectedKeys.length) {
      const template = {
        id: selectedKeys[0],
        name: e.node.props.title
      };
      this.setState({
        template, 
        selectedNodes: selectedKeys, 
        url: department.GET_TEMPLATE_DETAILS,
        isPagination: true,
        query: {templateId: selectedKeys[0],tenderDetailGuids:this.state.tenderDetailGuids}
      })
    } else {
      this.setState({ template:{}, selectedNodes: [], url: null, query: {}, isPagination: false, storage: {}})
    }
  }
   add = () => {
    if (this.state.selected.length === 0) {
      message.warn('请至少选择一项!')
    } else {
      let rows = this.state.allRows;
      const data = this.props.actionState.Apply.dataSource;
      rows.map( (item, index) => {
        if (data.length > 0) {
          data.map( (list, i) => {
            if (item.tenderMaterialGuid === list.tenderMaterialGuid) {
              return rows[index] = list;
            } 
            return null;
          })
        } 
        return null;
      })
      this.props.actions.createApply({
        dataSource: rows
      })
     
      this.redirect(true);
    }
  }
  redirect = (status) => {
    const url = this.props.location.state.addTemplatelUrL;
    hashHistory.push({
      pathname: url
    })
  }
  render() {
    const columns = [{
                        title : '通用名称',
                        dataIndex : 'geName',
                        fixed: 'left',
                        width: 150
                      },{
                        title : '产品名称',
                        dataIndex : 'materialName',
                        fixed: 'left',
                        width: 150
                      },{
                        title : '规格',
                        dataIndex : 'spec'
                      },{
                        title : '型号',
                        dataIndex : 'fmodel'
                      },{
                        title : '采购单位',
                        dataIndex : 'purchaseUnit'
                      },{
                        title : '包装规格',
                        dataIndex : 'tfPacking'
                      },{
                        title : '生产商',
                        dataIndex : 'produceName'
                      },{
                        title : '品牌',
                        dataIndex : 'tfBrandName'
                      },{
                        title: '需求数量',
                        dataIndex: 'amount',
                        fixed: 'right',
                        width: 80
                      },{
                        title : '采购价格',
                        dataIndex : 'purchasePrice',
                        width: 80,
                        fixed: 'right'
                      }
                    ]

    const loop = data => data.map((item) => {
      return <TreeNode title={item.templateName} key={item.templateId}/>;
    });
    const treeNodes = loop(this.state.tempData);
    return (
      <div>
        { this.props.children 
          || 
            <div>
              <Breadcrumb style={{fontSize: '1.1em',marginBottom: 16}}>
                <Breadcrumb.Item><Link to='/department/departApply'>申请管理</Link></Breadcrumb.Item>
                <Breadcrumb.Item><a onClick={this.redirect.bind(this, false)}>{this.props.location.state.title}</a></Breadcrumb.Item>
                <Breadcrumb.Item>选择模板</Breadcrumb.Item>
              </Breadcrumb>
            <Layout style={{background:'#f9f9f9'}}>
            <Sider style={{ overflow: 'auto' ,background:'#f9f9f9',border:'1px solid #ddd'}}>
              <Tree 
               onSelect={this.treeSelectHandler}
               selectedKeys={this.state.selectedNodes}
              >
                  {treeNodes}
              </Tree>
            </Sider>
            <Content style={{ marginLeft:'8px', overflow: 'initial' }}>
                <Row>
                  <Col span={10}>
                      <Search
                      ref='search'
                      placeholder="产品名称/通用名称/规格/型号/品牌"
                      style={{ width: 260 }}
                      onSearch={value => {
                        if (this.state.template.id) {
                          this.refs.table.fetch({
                            searchName: value,
                            templateId: this.state.template.id,
                            tenderDetailGuids:this.state.tenderDetailGuids
                          })
                          this.setState({searchName: value})
                        } else {
                          message.warn('请选择模板');
                        }
                      }}
                      />
                  </Col>
                  <Col style={{textAlign:'right'}}>
                    <Button 
                    type='primary' 
                    style={{marginTop: 5}} 
                    onClick={this.add}
                  >
                    添加</Button>
                  </Col>
                  </Row>
                  <FetchTable 
                    url={this.state.url}
                    query={this.state.query}  
                    rowKey={'tenderMaterialGuid'}
                    ref='table'
                    columns={columns} 
                    pageSize={10}
                    scroll={{ x: '250%' }}
                     rowClassName={
                      (record,index) => {
                        if(record.chooseFlag === 1){
                          return 'disabledColor'
                        }
                      }
                    }
                    rowSelection={{
                      selectedRowKeys: this.state.selected,
                      onChange: (selectedRowKeys, selectedRows) => {
                        this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                      },
                       onSelect: (record, selected, selectedRows) => {
                        const arr = this.state.allRows;
                        if (selected) {
                          arr.push(record);
                        } else {
                          arr.find(function(value, index, arr) {
                            if (value.RN === record.RN) {
                              arr.splice(index, 1);
                            }
                            return null;
                          }) 
                        }
                        console.log(arr, selected, 'onSelect');
                        this.setState({
                          allRows: arr
                        })
                      },
                      onSelectAll: (selected, selectedRows, changeRows) => {
                        let arr = this.state.allRows;
                        if (selected) {
                          arr = [...arr, ...changeRows]
                        } else {
                          changeRows.map( (item, index) => {
                            arr.find((value, index, arr) => {
                              if (typeof value !== 'undefined'
                                && typeof item !== 'undefined'){
                                if (value.RN === item.RN) {
                                  arr.splice(index, 1);
                                }
                              }
                              return null;
                            }) 
                            return null;
                          })
                        }
                        console.log(arr, 'onSelectAll');
                        this.setState({
                          allRows: arr
                        })
                      },
                      getCheckboxProps: record=>({
                          disabled: record.chooseFlag === 1,

                      })
                    }}
                  />
              </Content>
           </Layout>
           </div>
        }  
      </div>
    )  
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
)(AddTemplate);

          