/**
 * 结算计划详情
 */
import React from 'react';
import {  Row, Col,Input, Breadcrumb ,Table } from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { storage } from 'api'
const Search = Input.Search;
class JsPlanRecord extends React.Component{
     state = {
        dataSource:[]
    }
     //弹出结算记录
    handleRecord = (values) => {
        fetchData(storage.SEARCHCHARGEDETAILS,querystring.stringify(values),(data)=>{
            if(data.result){
                this.setState({ 
                    dataSource : data.result
                })
            }
        })
    }
    componentDidMount = () => {
        let values = {};
        values.chargeGuid = this.props.location.state.chargeGuid;
        this.handleRecord(values);
    }
       
    total = (record) => {
        let total = 0;
        record.map( (item, index) => {
      
          return total += Number(item.price) ;
        })
        return total.toFixed(2);
    }
    handleRecordQuery =(value) =>{
        let values = {};
        values.chargeGuid = this.props.location.state.chargeGuid;
        values.searchName = value
        console.log(values,"搜索")
        this.handleRecord(values);
    }
  
    render(){
          const columns = [{
            title: '二维码',
            dataIndex: 'qrcode',
            }, {
            title: '出库单号',
            dataIndex: 'outNo',
            }, {
            title: '领用科室',
            dataIndex: 'deptName',
            }, {
            title: '产品名称',
            dataIndex: 'materialName',
            }, {
            title: '通用名称',
            dataIndex: 'geName',
            }, {
            title: '型号',
            dataIndex: 'fmodel',
            }, {
            title: '规格',
            dataIndex: 'spec',
            }, {
            title: '采购单位',
            dataIndex: 'purchaseUnit',
            }, {
            title: '数量',
            dataIndex: 'sl',
            }, {
            title: '生产批号',
            dataIndex: 'flot',
            }, {
            title: '采购价格',
            dataIndex: 'purchasePrice',
            render: (text,record)=>{
                return text === 'undefined' ? '0.00':text.toFixed(2);
            }
            }, {
            title: '金额',
            dataIndex: 'price',
            }
        ];
                
        const baseData = this.props.location.state;
        return (
            <div>
                <Row>
                    <Col className="ant-col-6">
                         <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/customerStoragePlanMgt',query:{activeKey:'4'}}}>计划管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to={{pathname:baseData.url,state:this.props.location.state.topData}}>{baseData.title}</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>结算记录</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    
                </Row>
                <Search
                ref='search'
                placeholder="请输入产品名称/通用名称/二维码/型号/规格"
                style={{ width: 260,marginBottom:16 }}
                onSearch={this.handleRecordQuery}
                />
                <Table 
                size={'small'}
                rowKey={'chargeDetailGuid'}
                dataSource={ this.state.dataSource } 
                columns={columns} 
                scroll={{ x: '180%' }}
                pagination={false}
                footer={ this.state.dataSource.length === 0 ?
                        null : () => <span style={{fontSize: '1.5em'}}>总金额:
                                      <a style={{color: '#f46e65'}}>
                                        {this.total(this.state.dataSource)}
                                      </a>
                                    </span>}
              />
                
            </div>
        )
    }
}
module.exports = JsPlanRecord;
