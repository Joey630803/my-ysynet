/**
 * 新建结算计划单
 */
import React from 'react';
import {  Row, Col, Breadcrumb,Table,Input,Select ,Button,message,DatePicker, Modal} from 'antd';
import { Link ,hashHistory} from 'react-router';
import { fetchData,actionHandler } from 'utils/tools';
import { storage } from 'api';  
import querystring from 'querystring';
import moment from 'moment';

const { RangePicker } = DatePicker;
const Option = Select.Option;
class AddJsPlan extends React.Component{
    state = {
        dataSource:[],
        storageOptions:[],
        storageGuid:"",
        chargeTimeStart :null,
        chargeTimeEnd: null,
        selectedRows: [], 
        selected: [],
        visible: false,
        recordDataSource:[],
        record:""
    }
    componentDidMount = () => {
        //库房列表
        fetchData(storage.CUSTOMERSTORAGE_BYUSER,{},(data)=>{
            this.setState({ storageOptions : data.result});
        },'application/json')
        if(this.props.location.state.storageGuid){
            this.setState(this.props.location.state)
        }
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
    //搜索计费清单
    handleSearch = () =>{
        //获取input的值
        let values = {};
        values.chargeTimeStart = this.state.chargeTimeStart;
        values.chargeTimeEnd = this.state.chargeTimeEnd;
        values.storageGuid = this.state.storageGuid;
        console.log(values,"搜索")
        //根据送货单号查询信息
        fetchData(storage.FINDCHARGELIST,querystring.stringify(values),(data)=>{
            if(data.status){
                if(data.result.length>0){
                    this.setState({ 
                        dataSource : data.result
                    })
                }else{
                    message.info("无数据信息!")
                }
            }else{
                this.handleError(data.msg)
            }
          
        })
    }
    handleTimeOnChange = (date, dateString) => { 
      this.setState({
          chargeTimeStart :dateString[0],
          chargeTimeEnd:dateString[1]
        })
    }
    handleSelectChange = (value) => {
      this.setState( { storageGuid :value})
    }

    //提交
    handleSumbit = () =>{
        let postData = {};
        postData.storageGuid = this.state.storageGuid;
        postData.tfRemark = this.refs.remark.refs.input.value ;
        postData.fstate = "20";
        postData.planType = "SETTLE_PLAN";
        postData.chargeGuids = this.state.selected;
        console.log(postData,"确认提交的数据")
        fetchData(storage.INSERTEDITSETTLEPLAN,JSON.stringify(postData),(data) => {
            if(data.status){
                message.success("操作成功!")
                hashHistory.push({pathname:'/storage/customerStoragePlanMgt',query:{activeKey:'4'}});
            }else{
                this.handleError(data.msg);
            }

        },'application/json')
    }


 
    render(){
        const columns = [{
            title: '操作',
            dataIndex: 'action',
            render : (text,record)=>{
                return  <a onClick={
                            actionHandler.bind(
                                null, this.props.router,`/storage/customerStoragePlanMgt/jsPlan/jsRecord`, {...record,topData:this.state,title:"添加结算计划",url:"/storage/customerStoragePlanMgt/jsPlan/addJsPlan"}
                            )}>
                        详情
                        </a>
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
            }
        ];

        console.log(this.state.chargeTimeStart,"22222")
   
        return (
            <div>
            { this.props.children || 
                <div>
                    <Row>
                        <Col className="ant-col-6">
                          <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/customerStoragePlanMgt'}}>计划管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/customerStoragePlanMgt',query:{activeKey:'4'}}}>结算计划</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>新建结算计划</Breadcrumb.Item>
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
                                    <RangePicker 
                                    value={this.state.chargeTimeStart === null ||this.state.chargeTimeStart === "" ? null : [moment(this.state.chargeTimeStart, "YYYY-MM-DD"), moment(this.state.chargeTimeEnd, "YYYY-MM-DD")]}
                                    onChange={this.handleTimeOnChange} 
                                    />
                                    </div>
                                </div>
                                <div className="ant-col-4 ant-form-item-label-left">
                                    <label>库房</label>
                                </div>
                                <div className="ant-col-8">
                                    <div className="ant-form-item-control">
                                      <Select
                                        value={this.state.storageGuid}
                                        showSearch
                                        style={{ width: 150 }}
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        onChange={this.handleSelectChange}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                        {
                                            this.state.storageOptions.map((item,index) => {
                                            return <Option key={index} value={item.value}>{item.text}</Option>
                                            })
                                        }
                                      </Select>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-3">
                            <Button type="primary" onClick={this.handleSearch}> 搜索</Button>
                        </Col>
                    
                    </Row>
                    <Row>
                        <Col className="ant-col-12">
                            <div className="ant-row">
                                <div className="ant-col-4 ant-form-item-label-left">
                                    <label>备注</label>
                                </div>
                                <div className="ant-col-8">
                                    <div className="ant-form-item-control">
                                        <Input ref="remark"/>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="ant-col-8" style={{textAlign:'right'}}>
                            <Button type="primary" onClick={this.handleSumbit}> 提交</Button>
                        </Col>
                    </Row>
                    <Table 
                      rowSelection={{
                        selectedRowKeys: this.state.selected,
                        onChange: (selectedRowKeys, selectedRows) => {
                          this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                        }
                      }}
                      size={'small'}
                      rowKey={'chargeGuid'}
                      dataSource={ this.state.dataSource } 
                      columns={columns} 
                      scroll={{ x: '100%' }}
                      pagination={false}
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
module.exports = AddJsPlan;