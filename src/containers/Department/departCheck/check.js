/**
 * 申请审核
 */
import React from 'react';
import { Row, Col, Breadcrumb ,Table,Button,Modal ,message, Input, InputNumber} from 'antd';
import { Link ,hashHistory} from 'react-router';
import querystring from 'querystring';
import { fetchData,jsonNull } from 'utils/tools';
import { department } from 'api'
const confirm = Modal.confirm;

class ApplyShow extends React.Component{
     state = {
        dataSource:[],
        loading: false,
        visible: false,
        disabled:false,
        selectd:[],
        dirtyClick: false,//通过
    }
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    componentDidMount = () => {
       //根据普耗单id查询产品列表
         const values = {};
        values.applyId = this.props.location.state.applyId;
        values.applyType = this.props.location.state.applyType;
        fetchData(department.HIGHAPPLYDETAIL_LIST,querystring.stringify(values),(data)=>{
            if(data.status){
                this.setState({dataSource: data.result});
            }else{
                message.error('后台异常！');
            }
         });
    }
    
    handerPass = ()=>{
        if(this.state.dataSource.length === 0) {
            return message.warn("产品为空，不能审核通过!")
        }
        console.log(this.state.dataSource,'padsaf')
        const that = this;
        confirm({
        title: '提示',
        okText:'确认',
        cancelText:'取消' ,
        content: '是否确认审核通过？',
        onOk() {
            that.setState({dirtyClick: true});
            let values ={};
            const applyDetail = [];
            that.state.dataSource.map((item,index) => {
                return applyDetail.push({applyDetailGuid: item.applyDetailGuid,applyDetailNum:item.amount})
            })
            values.applyTotalPrice = that.total(that.state.dataSource);
            values.applyId = that.props.location.state.applyId;
            values.applyNextFstate = "0";
            values.applyDetail = applyDetail;
            console.log('审核通过数据',values)
            //审核交互
            fetchData(department.CHECKAPPLYDETAILS,JSON.stringify(values),(data)=>{
              that.setState({dirtyClick: false});
              if(data.status){
                message.success("审核通过");
                hashHistory.push('/department/departCheck');
              }else{
                this.handleError(data.msg);
              }
            },'application/json')
        },
        onCancel() {
        }
        })
        
    };
    showModal = ()=>{
        this.setState({visible:true})
    }
    handerNotPass = ()=>{
        const that = this;
        that.showModal();
    }
    //审核不通过
    handleOk = () => {
        const selectReason = this.refs.failReason.refs.input.value;
        if(selectReason.length>200){
            return message.error('长度不能超过200')
        }

        const values = {applyId:this.props.location.state.applyId,applyNextFstate:'1',tfRemark:selectReason}
        this.setState({ loading: true });
        console.log('审核不通过数据',values)
        //审核交互
        fetchData(department.CHECKAPPLYDETAILS,JSON.stringify(values),(data)=>{
          this.setState({ loading: false, visible: false });
          if(data.status){
            message.success("操作成功!");
            hashHistory.push('/department/departCheck');
          }else{
            this.handleError(data.msg);
          }
        },'application/json');
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    onChange = (record, index, value) => {
      let  dataSource  = this.state.dataSource;
      if (/^\d+$/.test(value)) {
        dataSource[index].amount = value;
      } else {
        dataSource[index].amount = 0;
      }
       this.setState({ dataSource : dataSource})
    }

    //申请单总金额
    total = (record) => {
        let total = 0;
        record.map( (item, index) => {
        let amount = typeof item.amount === 'undefined' ? 1 : item.amount
        return total += amount * item.purchasePrice;
        })
        return total;
    }
     //申请单类型
    getApplyTypes = (value) =>{
      if(value === 'APPLY'){
        return '普耗申请单'
      }
      else if(value === 'OPER_APPLY'){
        return '手术备货单'
      }
      else if(value === 'HIGH_APPLY'){
        return '高值备货单'
      }
    }
    //
    getFstate = (value) => {
      switch (value) {
        case '01':
          return <span>待审核</span>;
        case '02':
          return <span>审核通过</span>;
        case '03':
          return <span>审核未通过</span>;
        default:
          break;
      }
    }
    //删除产品
    delete = () => {
        const dataSource = this.state.dataSource;
        const selected = this.state.selectd;
        if (selected.length === 0) {
          message.warn('请至少选择一条数据')
        } else {
        let result = [];
        dataSource.map( (item, index) => {
            const a = selected.find( (value, index, arr) => {
            return value === item.applyDetailGuid;
            })
            if (typeof a === 'undefined') {
               return result.push(item)
            }
            return null;
        })
        console.log(result)
        this.setState({dataSource: result});
        }
    }
    render(){
          const columns = [ {
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
                title: '采购价格',
                dataIndex: 'purchasePrice',
                }, {
                title: '包装规格',
                dataIndex: 'tfPacking',
                },{
                title : '需求数量',
                dataIndex : 'amount',
                width: 80,
                render: (text, record, index) => {
                    return <InputNumber 
                  defaultValue={text || 1}
                  min={1} onChange={this.onChange.bind(this, record, index)}/>
                  }
                }, {
                title: '金额',
                dataIndex: 'tenderMoney',
                render: (text, record, index) => {
                const amount = this.state.dataSource[index].amount ? this.state.dataSource[index].amount : 1;
                return <a>
                        {record.purchasePrice === undefined ? "0.00" :  (amount * record.purchasePrice).toFixed(2) }
                        </a>
                }
                }, {
                title: '品牌',
                dataIndex: 'tfBrand',
                }, {
                title: '生产商',
                dataIndex: 'produceName',
                }
            ];
        const { dataSource  } = this.state;
        const baseData = jsonNull(this.props.location.state);
         return (
            <div>
                <Row>
                    <Col className="ant-col-6">
                        <Breadcrumb style={{fontSize: '1.1em'}}>
                            <Breadcrumb.Item><Link to='/department/departCheck'>审核管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>详情</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col className="ant-col-18" style={{textAlign:'right'}}>
                        <Button type="primary" style={{marginRight:8}} onClick={this.handerPass}>通过</Button>
                        <Button type="primary" ghost onClick={this.handerNotPass}>不通过</Button>
                    </Col>
                </Row>
                <h2 style={{marginBottom:10}}>审核信息</h2>
                <Row>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>申请科室</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.deptName }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>备货库房</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.storageName }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>收货地址</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                      { baseData.tfAddress }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>申请单号</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.applyNo }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-7 ant-form-item-label-left">
                                <label>申请单类型</label>
                            </div>
                            <div className="ant-col-17">
                                <div className="ant-form-item-control">
                                    { this.getApplyTypes(baseData.applyType) }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>状态</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                     { this.getFstate( baseData.applyFstate )}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>申请人</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.applyUserName }
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="ant-col-6">
                        <div className="ant-row">
                            <div className="ant-col-6 ant-form-item-label-left">
                                <label>申请时间</label>
                            </div>
                            <div className="ant-col-18">
                                <div className="ant-form-item-control">
                                    { baseData.applyTime }
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <h2 style={{marginTop:10,marginBottom:10}}>产品信息</h2>
                <div style={{marginBottom:16}}>
                    <Button type="danger" onClick={this.delete} ghost style={{marginRight: 8}}>删除</Button>
                </div>
                <Table 
                columns={columns} 
                dataSource={dataSource} 
                pagination={false}
                size="small"
                rowKey="applyDetailGuid"
                scroll={{ x: '200%' }}
                rowSelection={{
                    onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({ selectd: selectedRowKeys});
                    }
                }}
                footer={ this.state.dataSource.length === 0 ?
                null : () => <span style={{fontSize: '1.5em'}}>申请单总金额:
                                <a style={{color: '#f46e65'}}>
                                {this.total(this.state.dataSource).toFixed(2)}
                                </a>
                            </span>}
                />
                <Modal
                visible={this.state.visible}
                title={'是否确认审核不通过？'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                <Button key="back" size="large"  onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                    确认
                </Button>
                ]}
            >
            <Input style={{marginTop:'16px'}} placeholder="请填写原因" ref='failReason' type="textarea" rows={4}/>
            </Modal>
            </div>
        )
    }
}

module.exports = ApplyShow
