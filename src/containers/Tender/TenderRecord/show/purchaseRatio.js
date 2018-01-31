/**
 * @file 招标记录--招标详情--采购份额
 */
import React from 'react';
import { Breadcrumb, Row, Col, Button,Table,Input } from 'antd';
import { Link } from 'react-router';

class PurchaseRatio extends React.Component{
    render(){
        const columns = [{
            title: '序号',
            dataIndex: 'Num',
            render:(text, record, index )=>{
                return index+1
            }
        },{
            title: '供应商编号',
            dataIndex: 'fOrgCode'
        },{
            title: '供应商名称',
            dataIndex: 'fOrgName'
        },{
            title: '招标单位',
            dataIndex: 'tenderUnit'
        },{
            title: '采购单位',
            dataIndex: 'purchaseUnit'
        },{
            title: '单位换算',
            dataIndex: 'unitChange'
        },{
            title: '采购价',
            dataIndex: 'purchasePrice'
        },{
            title: '采购份额',
            dataIndex: 'purchaseRatio',
            render:( text, record)=>{
                return (<Input defaultValue={text}/>+"%")
            }
        }];
        const data = [{
            'fOrgCode':'5438',
            'purchaseRatio':'50'
        },{
            'fOrgCode':'1314',
            'purchaseRatio':'50'
        }]
        return (
            <div>
                {
                    this.props.children
                    ||
                    <div>
                        <Row>
                            <Col>
                                <Breadcrumb style={{fontSize: '1.1em',marginBottom : 24}}>
                                    <Breadcrumb.Item><Link to={{pathname:'/tender/tenderRecord',}}>招标记录</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item><Link to={{pathname:'/tender/tenderRecord/show'}}>招标详情</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item>编辑</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button type='primary'>发布</Button>
                            </Col>
                        </Row>
                        <Table 
                            style={{marginTop:12}}
                            columns={columns}
                            dataSource={data}
                            rowKey={'fOrgCode'}
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = PurchaseRatio;