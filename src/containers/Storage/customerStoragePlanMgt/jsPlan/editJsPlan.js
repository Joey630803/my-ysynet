/**
 * 新建结算计划单
 */
import React from 'react';
import {  Row, Col, Breadcrumb,Table,Input ,Button,Modal,message  } from 'antd';
import { Link ,hashHistory} from 'react-router';
import { fetchData,actionHandler } from 'utils/tools';
import { storage } from 'api';  
import querystring from 'querystring';
class EditJsPlan extends React.Component{
    state = {
        dataSource:[],
        storageGuid:"",
        selected: []
    }
    componentDidMount = () => {
        //获取input的值
        let values = {};
        values.planId = this.props.location.state.planId;
        console.log(values,"搜索")
        //根据送货单号查询信息
        fetchData(storage.FINDCHARGELIST,querystring.stringify(values),(data)=>{
            if(data.result){
                const selected = [];
                data.result.map((item,index) => {
                  return  selected.push(item.chargeGuid)
                })
                this.setState({ 
                    dataSource : data.result,
                    selected : selected
                })
            }else{
                message.info("无数据信息!")
            }
        })
    }
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    total = (record) => {
        let total = 0;
        record.map( (item, index) => {
      
          return total += Number(item.totalPrice) ;
        })
        return total.toFixed(2);
      }


    //提交
    handleSumbit = () =>{
        let postData = {};
        postData.planId = this.props.location.state.planId;
        postData.storageGuid = this.props.location.state.storageGuid;
        postData.tfRemark = this.refs.remark.refs.input.value ;
        postData.fstate = "34";
        postData.planType = "SETTLE_PLAN";
        postData.chargeGuids = this.state.selected;
        console.log(postData,"确认提交的数据")
        fetchData(storage.INSERTEDITSETTLEPLAN,JSON.stringify(postData),(data) => {
            if(data.status){
                message.success("操作成功!")
                hashHistory.push({pathname:'/storage/customerStoragePlanMgt',query:{activeKey:'4'}});
            }else{
                this.handleError(data.msg)
            }
        },'application/json');
    }
    render(){
        const baseData = this.props.location.state;
        const columns = [{
            title: '操作',
            dataIndex: 'action',
            render : (text,record)=>{
                return <span>
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router,`/storage/customerStoragePlanMgt/jsPlan/jsRecord`, {...record, topData: baseData, title:"编辑结算计划",url:"/storage/customerStoragePlanMgt/jsPlan/editJsPlan"}
                    )}>
                   详情
                </a>
                </span>
                }
            }, {
            title: '操作库房',
            dataIndex: 'storageName',
            }, {
            title: '统计日期',
            dataIndex: 'chargeTime',
            }, {
            title: '金额',
            dataIndex: 'totalPrice',
            }, {
            title: '备注',
            dataIndex: 'tfRemark',
            }
        ];
        return (
            <div>
            { this.props.children || 
                <div>
                    <Row>
                        <Col className="ant-col-6">
                          <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/customerStoragePlanMgt'}}>计划管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/customerStoragePlanMgt',query:{activeKey:'4'}}}>结算计划</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>编辑结算计划</Breadcrumb.Item>
                          </Breadcrumb>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="ant-col-12">
                            <div className="ant-row">
                                <div className="ant-col-4 ant-form-item-label-left">
                                    <label>统计时间</label>
                                </div>
                                <div className="ant-col-8">
                                    <div className="ant-form-item-control">
                                    {baseData.storageName}
                                    </div>
                                </div>
                                <div className="ant-col-4 ant-form-item-label-left">
                                    <label>库房</label>
                                </div>
                                <div className="ant-col-8">
                                    <div className="ant-form-item-control">
                                      {baseData.storageName}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-8">
                        <div className="ant-row">
                                <div className="ant-col-4 ant-form-item-label-left">
                                    <label>备注</label>
                                </div>
                                <div className="ant-col-8">
                                    <div className="ant-form-item-control">
                                      <Input ref="remark" style={{width:300}}   defaultValue={
                                          baseData.tfRemark
                                      }/>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-4" style={{textAlign:'right'}}>
                          <Button type="primary" onClick={this.handleSumbit}> 提交</Button>
                        </Col>
                    
                    </Row>
    
                    <Table 
                      rowSelection={{
                        selectedRowKeys: this.state.selected,
                        onChange: (selectedRowKeys, selectedRows) => {
                          this.setState({selected: selectedRowKeys})
                        }
                      }}
                      size={'small'}
                      rowKey={'chargeGuid'}
                      dataSource={ this.state.dataSource } 
                      columns={columns} 
                      scroll={{ x: '100%' }}
                      pagination={true}
                      footer={ this.state.dataSource.length === 0 ?
                              null : () => <span style={{fontSize: '1.5em'}}>总金额:
                                            <a style={{color: '#f46e65'}}>
                                              {this.total(this.state.dataSource)}
                                            </a>
                                          </span>}
                    />
                </div>
            }
            </div>
        )
    }
}
module.exports = EditJsPlan;