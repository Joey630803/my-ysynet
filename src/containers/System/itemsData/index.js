/**
 * @file 数据字典内容列表
 */
import React from 'react';
import { Row, Col, Input, Button,Layout,Tree,Dropdown,Icon,Menu,message } from 'antd';
import { Link } from 'react-router';
import { itemsDataUrl } from '../../../api';
import FetchTable from 'component/FetchTable';
import { actionHandler ,FetchPost} from 'utils/tools';
const { Content, Sider } = Layout;
const TreeNode = Tree.TreeNode;
const ButtonGroup = Button.Group;
const Search = Input.Search;
const ITEMSDATA_BASE_URL = '/system/itemsData/',
      ITEMSDATA_TITLES = {
        categoryMgt: '分类管理',
        add:'新建字典',
        edit:'编辑'
      }

class itemsData extends React.Component {
  state = {
    query: '',
    staticId:'' ,
    url: '',
    defaultExpandedKeys:'',
    defaultSelectedKeys:'',
    data:[],
    gridData: false
  }
  /**table根据条件查询 */
  queryHandler = (query) => {
    this.refs.table.fetch(query);
  }
  componentWillMount = () => {
   FetchPost(itemsDataUrl.ITEMSDATABYORGID_LIST)
   .then(response => {
      return response.json();
    })
    .then(data => {
      if(data.status){
        if(data.result.length>0){
          this.setState({
          data:data.result,
          query:{'staticId':data.result[0].children[0]=== undefined ? data.result[0].staticId :data.result[0].children[0].staticId},
          defaultExpandedKeys:data.result[0].staticId,
          defaultSelectedKeys:data.result[0].children[0]=== undefined ? data.result[0].staticId :data.result[0].children[0].staticId
        })
        }
      }
    })
    .catch(e => console.log("Oops, error", e))
  }
  // 选中树
  onSelect = (selectedKeys, info) => {
    this.setState({
      staticId: selectedKeys[0],
      query:{'staticId':selectedKeys[0]}
    })
    if (selectedKeys.length) {
      this.setState({gridData: false})
      this.refs.table.fetch({'staticId':selectedKeys[0]});
    } else {
      this.setState({gridData: []})
    }
  }
  //判断是否选中父节点添加数据字典内容
  onClick = (router, url, state) => {
    if(this.state.staticId || this.state.defaultSelectedKeys){
        actionHandler(router, url, state)
    }
    else {
       message.warning('请选中分类');
    }
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
                null, this.props.router, `${ITEMSDATA_BASE_URL}edit`, {...record, title: `${ITEMSDATA_TITLES.edit}`}
              )}>
              {`${ITEMSDATA_TITLES.edit}`}
            </a>
          </span>
        )
      }
    },{
      title: '编码',
      dataIndex: 'tfCloCode',
    }, {
      title: '名称',
      dataIndex: 'tfCloName',
    }];
    //分类管理菜单
    const menu = (
      <Menu>
        <Menu.Item>
          <Link to='/system/itemsData/categoryMgt'>分类管理</Link>
        </Menu.Item>
      </Menu>
    );

    const loop = data => data.map((item) => {
      if (item.children.length>0) {
        return <TreeNode title={item.tfComment} key={item.staticId}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode title={item.tfComment} key={item.staticId}/>;
    });
    const treeNodes = loop(this.state.data);
    //获取面包屑导航中参数,作为选中的tree节点
     const SelectedKeys = [],ExpandedKeys = [];
     let query ='';
    if(typeof this.props.location.query.staticId === 'undefined' ){
      SelectedKeys.push(this.state.defaultSelectedKeys)
      ExpandedKeys.push(this.state.defaultExpandedKeys);
      query= this.state.query;
    }
    else{
     
       SelectedKeys.push(this.props.location.query.staticId)
       ExpandedKeys.push(this.props.location.query.staticId);
       query =  this.props.location.query;

    }
      console.log(query,'12313123123')
    return (
      <div>
        { this.props.children 
          || 
          <div>
           {
            this.state.defaultExpandedKeys === "" || this.state.defaultSelectedKeys === "" ? null
            :

            <Layout style={{background:'#f9f9f9'}}>
            <Sider style={{ overflow: 'auto' ,background:'#f9f9f9',border:'1px solid #ddd'}}>
              <Tree 
                defaultExpandedKeys={ExpandedKeys}
                defaultSelectedKeys={SelectedKeys}
                onSelect={this.onSelect}
              >
                  {treeNodes}
              </Tree>
            </Sider>
            <Content style={{ marginLeft:'8px', overflow: 'initial' }}>
                <Row>
                  <Col span={10}>
                      <Search
                      ref='search'
                      placeholder="名称编号"
                      style={{ width: 260 }}
                      onSearch={value =>  {this.queryHandler({'searchParams':value,'staticId':this.state.staticId})}}
                      />
                  </Col>
                  <Col span={10} offset={4} style={{textAlign: 'right'}}>
                        <ButtonGroup>
                        <Button 
                        type="primary"
                        onClick={this.onClick.bind(
                            null, this.props.router, `${ITEMSDATA_BASE_URL}add`, {staticId:this.state.staticId === "" ? SelectedKeys[0] : this.state.staticId}
                        )}
                        >
                          <Icon type="plus" />
                          {`${ITEMSDATA_TITLES.add}`}
                        </Button>
                          <Dropdown overlay={menu}>
                          <Button
                            type="primary"
                          >
                              <Icon type="down" />
                          </Button>
                        </Dropdown >
                      </ButtonGroup>
                  </Col> 
                  </Row>
                  <FetchTable 
                    data={this.state.gridData}
                    query={query}
                    ref='table'
                    columns={columns}
                    scroll={this.props.scroll || { x: '100%' }}
                    url={itemsDataUrl.ITEMSDATADETAILS_LIST}
                    rowKey='staticDataGuid'
                  />
              </Content>
           </Layout>
           }
           </div>
        }  
      </div>
    )  
  }
}
module.exports = itemsData;

          