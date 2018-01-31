//产品管理
import React from 'react';
import { Form,message} from 'antd';
import FetchTable from 'component/FetchTable';
import SearchForm from './searchForm';
import { actionHandler } from 'utils/tools';
import { productUrl } from 'api';
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
//操作链接
const PRODUCT_BASE_URL = '/basicData/product/',
      PRODUCT_TITLE = {
          'show':'证件',
          'change':'变更',
          'record':'记录'
      };
class ProductCert extends React.Component {
    state = {
        query: '',
        selected: [],
        selectedRows: [],
    }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
     //选中变更的行
    changeClick = (router, url, state) => {
        if(this.state.selected.length>0){
            actionHandler(router, url, state)
         }
        else {
          message.warning('请选中超过一条以上数据');
         }
    }
    render(){
        const columns = [{
            title : '操作',
            width: 120,
            dataIndex:'actions',
            render:(text,record) => {
                return (
                    <span>
                        <a onClick={actionHandler.bind(null,this.props.router,`${PRODUCT_BASE_URL}show`,{...record,title:`${PRODUCT_TITLE.show}`})}>
                            {PRODUCT_TITLE.show}
                        </a>
                         <span className="ant-divider" />
                        <a onClick={actionHandler.bind(null,this.props.router,`${PRODUCT_BASE_URL}record`,{...record,title:`${PRODUCT_TITLE.record}`})}>
                            {PRODUCT_TITLE.record}
                        </a>
                    </span>
                )
            }
        },{
            title:'组件名称',
            width: 160,
            dataIndex:'suitName'
        },{
            title:'型号',
            width: 120,
            dataIndex:'fmodel'
        },{
            title:'规格',
            width: 120,
            dataIndex:'spec'
        },{
            title:'最小单位',
            width: 120,
            dataIndex:'leastUnitName'
        },{
            title:'产品材质',
            width: 120,
            dataIndex:'tfTexture'
        },{
            title:'骨科产品属性',
            width: 120,
            dataIndex:'attributeName',
        },{
            title:'条形码',
            width: 120,
            dataIndex:'fbarcode',
        }];

        const query = this.state.query;
        return (
            <div style={{padding: 5}}>
              {this.props.children || 
                 <div>
                    <SearchBox query={this.queryHandler}/>
                       {/* <Row>
                        <Col span={24}>
                            <Button 
                              type="primary"
                              onClick={this.changeClick.bind(
                                    null, this.props.router, `${PRODUCT_BASE_URL}change`, { fitemids: this.state.selected}
                                )}
                              >
                              变更
                            </Button>
                        </Col>
                    </Row> */}
                    <FetchTable 
                    query={query}
                    ref='table'
                    columns={columns}
                    url={productUrl.MODELLIST_PRODUCT}
                    rowKey='fitemid'
                    rowSelection={{
                        selectedRowKeys: this.state.selected,
                        onChange: (selectedRowKeys, selectedRows) => 
                        this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                    }}
                    />
                </div>
            }
        </div>
        )
         
    }
}
module.exports = ProductCert;
 

