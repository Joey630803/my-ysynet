//产品管理
import React from 'react';
import { Button,Input,Row,Col,message,Modal,Popconfirm} from 'antd';
import FetchTable from 'component/FetchTable';
import { Link } from 'react-router';
import { actionHandler,fetchData } from 'utils/tools';
import querystring from 'querystring';
import { productUrl } from 'api';
import moment from 'moment';

const Search = Input.Search;

class ProductCert extends React.Component {
    state = {
        query: '',
    }
    //处理错误信息
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    //查询
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    //删除
    deleteHandler = (record) => {
        fetchData(productUrl.DELETECERT, querystring.stringify({certGuid:record.certGuid}),(data)=>{
            if(data.status){
                this.refs.table.fetch();
                message.success('删除成功！')
            }else{
                this.handleError(data.msg)
            }
        })
    }
    render(){
        const columns = [{
            title : '操作',
            width: 120,
            dataIndex:'actions',
            render:(text,record) => {
                return (
                    <span>
                        <a onClick={actionHandler.bind(null,this.props.router,`/basicData/productCert/product`,{...record})}>
                            产品
                        </a>
                         <span className="ant-divider" />
                        <a onClick={actionHandler.bind(null,this.props.router,`/basicData/productCert/edit`,{...record})}>
                            编辑
                        </a>
                        <span className="ant-divider" />
                        <Popconfirm title="是否确认删除此条记录?" onConfirm={this.deleteHandler.bind(null, record)} okText="是" cancelText="否">
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        },{
            title:'证件号',
            width: 160,
            dataIndex:'registerNo'
        },{
            title:'产品名称',
            width: 120,
            dataIndex:'materialName'
        },{
            title:'品牌',
            width: 120,
            dataIndex:'tfBrandName'
        },{
            title:'生产商',
            width: 120,
            dataIndex:'produceName'
        },{
            title:'有效期',
            width: 120,
            dataIndex:'firstTime',
            render : firstTime => {
                return firstTime === null ? "" :moment(firstTime).format('YYYY-MM-DD')
            }
        }];

        const query = this.state.query;
        return (
            <div style={{padding: 5}}>
              {this.props.children || 
                <div>
                    <Row>
                        <Col span={10}>
                            {
                                <Search
                                placeholder="请输入证件号／产品名称/品牌/生产商"
                                style={{ width: 300 }}
                                onSearch={value =>  {this.queryHandler({'searchName':value})}}
                                />
                            }
                        </Col>
                        <Col span={10} offset={4} style={{textAlign: 'right'}}>
                            <Button type="primary" style={{marginRight: '10px'}}>
                            <Link to='/basicData/productCert/add'>添加</Link>
                            </Button>
                        </Col>
                    </Row>
                    <FetchTable 
                    query={query}
                    ref='table'
                    columns={columns}
                    url={productUrl.CERT_LIST}
                    rowKey='certGuid'
                    />
                </div>
            }
        </div>
        )
         
    }
}
module.exports = ProductCert;
 

