/**
 * 添加产品
 */
import React  from 'react';
import { Form, Button,Row, Col, Breadcrumb,message} from 'antd';
import { sales } from 'api';
import FetchTable from 'component/FetchTable';
import { Link, hashHistory } from 'react-router';
import SearchForm from './searchForm';
import uuid from 'uuid';
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

class AddProduct extends React.Component{
    state = {
        selected : [],
        selectedRows : [],
        query: {
            storageGuid: this.props.location.state.storageGuid,
            excludeTenderDetailGuids:this.props.location.state.exceptGuid
        },
        dataSource : []
    }
    queryHandler = (query) => {
        console.log(query)
        query.storageGuid = this.props.location.state.storageGuid;
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    choseHandler = () => {
        const { selectedRows } = this.state;
        if (!selectedRows.length) {
          return message.warn('请至少选择一条记录!')
        }
        selectedRows.forEach((item,index)=>{
            item.amount = 1;
            item.sendDetailGuid = uuid();
            console.log(item);
        });
        hashHistory.push({
            pathname:'/sales/myOrder/opStock',
            state : {
                dataSource:selectedRows,
                storageGuid:this.props.location.state.storageGuid,
                rOrgId:this.props.location.state.rOrgId,
                orderId:this.props.location.state.orderId
            },
            query :{activeKey:'product'}
        })
      }

    render(){
        const productColumns = [{
            title : '产品类型',
            dataIndex : 'attributeName',
            width: 100,
            fixed : 'left'
            },{
            title: '产品名称',
            dataIndex: 'materialName',
            }, {
            title: '通用名称',
            dataIndex: 'geName',
            }, {
            title: '规格',
            dataIndex: 'spec',
            }, {
            title: '型号',
            dataIndex: 'fmodel',
            }, {
            title: '采购单位',
            dataIndex: 'purchaseUnit',
            }, {
            title: '价格',
            dataIndex: 'purchasePrice',
            render : (text, record)=>{
            return text === 'undefined' || text === null ? '0.00' : text.toFixed(2)
            }
            }, {
            title: '包装规格',
            dataIndex: 'tfPacking',
            }, {
            title: '品牌',
            dataIndex: 'tfBrandName',
            },  {
            title : '供应商',
            dataIndex: 'fOrgName'
            }
            ];
        return (
            <div>
                <Row style={{marginBottom:24}}>
                    <Col className="ant-col-6">
                        <Breadcrumb style={{fontSize: '1.1em'}}>
                            <Breadcrumb.Item><Link to='/sales/myOrder'>我的订单</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to={{pathname:'/sales/myOrder/opStock',query:{activeKey:'product'},state : this.props.location.state}}>手术备货</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>添加产品</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col className='ant-col-18' style={{textAlign:'right'}}>
                        <Button type="primary" style={{marginRight:8}} onClick={this.choseHandler}>添加</Button>
                    </Col>
                </Row>
                <SearchBox query={this.queryHandler} data={{rOrgId:this.props.location.state.rOrgId}} />
                <FetchTable 
                    style={{marginTop:10}}
                    columns={productColumns}
                    query={this.state.query}
                    url={sales.QUERYSTORAGEMATERIALLIST}
                    rowKey='tenderMaterialGuid'
                    ref='table'
                    size='small'
                    scroll={{x:'150%'}}
                    rowSelection={{
                        selectedRowKeys: this.state.selected,
                        onChange: (selectedRowKeys, selectedRows) => {
                        this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                        }
                    }}
                />
            </div>
        )
    }
}
module.exports = AddProduct;