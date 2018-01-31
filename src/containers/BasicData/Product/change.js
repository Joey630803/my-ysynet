/**
 * @file 产品变更
 */
import React from 'react';
import { Row,Col ,Breadcrumb,message,Input,Popconfirm} from 'antd';
import { Link ,hashHistory} from 'react-router';
import FetchTable from 'component/FetchTable';
import querystring from 'querystring';
import {FetchPost} from 'utils/tools';
import { productUrl } from 'api';
import moment from 'moment';
const Search = Input.Search;
class ProductChange extends React.Component{
    state = {
        query :'',
        selectedRowKeys:[]
    }

    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }

    changeHandler = (record) => {
        const values ={
            'fitemids' : this.props.location.state.fitemids,
            'certGuid' : record.certGuid
        }
         FetchPost(productUrl.CHANGEPRODUCTCERT,querystring.stringify(values))
        .then(response => {
          return response.json();
        })
        .then(data => {
          if(data.status){
             hashHistory.push('/basicData/product');
             message.success('变更成功')
          }
          else{
            message.error(data.msg)
          }
        })
        .catch(e => console.log("Oops, error", e))
    }
    render(){
        const columns = [{
            title : '操作',
            dataIndex: 'actions',
            width: 50,
            fixed: 'left',
            render: (text, record) => {
                return (
                <span>
                    <Popconfirm title="是否确认变更证件?" onConfirm={this.changeHandler.bind(null, record)} okText="是" cancelText="否">
                        <a>变更</a>
                    </Popconfirm>
                </span>
                )
        }},{
            title:'证件号',
            width: 180,
            fixed: 'left',
            dataIndex:'registerNo'
        },{
            title:'产品名称',
            width: 180,
            fixed: 'left',
            dataIndex:'materialName'
        },{
            title:'品牌',
            dataIndex:'tfBrandName'
        },{
            title:'状态',
            width:80,
            dataIndex:'fstate',
            render :fstate =>{
                if(fstate==="00"){
                return "异常"
                }
                else if(fstate==="01"){
                    return "正常"
                }
                else if(fstate==="02"){
                    return "异常"
                }
            }
        },{
            title:'生产商',
            dataIndex:'produceName'
        },{
            title:'有效期始',
            width: 110,
            fixed: 'right',
            dataIndex:'firstTime',
            render : firstTime => {
                return firstTime === null ? "" :moment(firstTime).format('YYYY-MM-DD')
            }
        },{
            title:'有效期止',
            width: 110,
            fixed: 'right',
            dataIndex:'lastTime',
            render : lastTime => {
                return lastTime === null ? "" :moment(lastTime).format('YYYY-MM-DD')
            }
        }];
        const query = this.state.query;
        return(
            <div>
                {this.props.children || 
                    <div>
                        <Breadcrumb style={{fontSize: '1.1em',marginBottom:'8px'}}>
                            <Breadcrumb.Item><Link to='/basicData/product'>产品管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>变更</Breadcrumb.Item>
                        </Breadcrumb>
                  
                        <Row>
                            <Col span={10}>
                                <Search
                                placeholder="请输入请输入证件号／产品名称/品牌/生产商"
                                style={{ width: 300 }}
                                onSearch={value =>  {this.queryHandler({'searchName':value})}}
                                />
                            </Col>
                        </Row>
                        <FetchTable 
                            query={query}
                            ref='table'
                            columns={columns}
                            scroll={{ x: '160%' }}
                            url={productUrl.CERT_LIST}
                            rowKey='certGuid'
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = ProductChange;