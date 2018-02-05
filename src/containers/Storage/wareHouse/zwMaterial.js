/**
 * 总务物资 ----入库
 */
import React from 'react';
import { Form, Row, Col, Input, Breadcrumb, Button,Select,Icon,Table,message,Modal,Popover } from 'antd';
import { fetchData } from 'utils/tools';
import { Link, hashHistory } from 'react-router';
import querystring from 'querystring';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../actions';
import { storage } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component{
    state = {
        storageOptions: [],
        storageGuid: '',
        fOrgOptions: [],
        fOrgId:''
    }
    componentWillMount = ()=>{
        //库房
        fetchData(storage.FINDSTORAGEBYMYUSER,querystring.stringify({ generalFlag:'01'}),(data)=>{
            if(data.status){
                if(data.result.length > 0){
                    this.setState({ storageOptions:data.result });
                    if(!this.props.data.fOrgId){
                        this.props.cb({ storageGuid:data.result[0].value })
                    }
                    this.findForgList(data.result[0].value);
                }else{
                    message.warn('暂无总务库房，请添加处理')
                }
            }
        });
        /* fetchData(storage.FINDMYSUPPLIERLIST,{},(data)=>{
            if(data.length > 0){
                this.setState({fOrgOptions: data,fOrgId:data[0].value+"" });
                this.props.cb({fOrgId:data[0].value+"" });
            }else{
                message.warn('暂无供应商，请添加处理')
            }
        }) */
    }
    
    findForgList = (value,op)=>{
        fetchData(storage.FINDMYSUPPLIERLIST,querystring.stringify({ generalFlag:'01', rStorageGuid:value }),(data)=>{
            if(data.length > 0){
                this.setState({fOrgOptions: data,fOrgId:data[0].value+"" });
                if(!this.props.data.fOrgId){
                    this.props.cb({ fOrgId:data[0].value+"" });
                }
                if(op){
                    this.props.cb({storageGuid: value });
                }
            }else{
                message.warn('暂无供应商，请添加处理')
            }
        })
    }
    
    handSubmit = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                if(this.props.data.dataSource.length>0){
                    console.log('查询条件: ', values);
                    let postData = {},materialList = [];
                    postData.rStorageGuid = values.storageGuid;
                    postData.fOrgId = values.fOrgId;
                    postData.inRemark = values.remark;
                    let flag = true,errIndex = 0;
                    this.props.data.dataSource.map((item,index)=>{
                        if(item.purchasePrice && item.amount > 0){
                            return null
                        }else{
                            flag = false; 
                            errIndex = index;
                            return null;
                        }
                    });
                    if(flag){
                        this.props.data.dataSource.map((item,index)=>{
                            return materialList.push({
                                tenderMaterialGuid:item.tenderMaterialGuid,
                                amount: item.amount,
                                purchaseUnit: item.purchaseUnit,
                                purchasePrice:  item.purchasePrice
                            })
                        });
                        postData.materialList = materialList; 
                        console.log(postData,'postData');
                        fetchData(storage.CREATEZWIMPORT,JSON.stringify(postData),(data)=>{
                            if(data.status){
                                message.success('操作成功！');
                                this.props.cb({
                                    storageGuid: '',
                                    fOrgId:'',
                                    dataSource: [],
                                    remark: '',
                                })
                                hashHistory.push({pathname:'/storage/wareHouse',query:{activeKey:'1'}});
                            }else{
                                this.props.handleError(data.msg);
                            }
                        },'application/json')
                    }else{
                        this.props.handleError(`请检查第 ${errIndex + 1} 行数据填写是否规范,采购价与数量是必填项`)
                    }
                }else{
                    return message.warn('无法提交，请添加产品');
                }
                
            }
          })
        
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 17 },
        };
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handSubmit}>
                <Row>
                    <Col span={8} key={1}>
                        <FormItem {...formItemLayout} label={`库房`}>
                            {
                                getFieldDecorator('storageGuid',{
                                    rules:[{required: true, message:'请选择库房'}],
                                    initialValue: this.props.data.storageGuid ||this.state.storageGuid
                                })(
                                    <Select placeholder='请选择'
                                        onSelect={(value,options)=>this.findForgList(value,options)}
                                    >
                                        {
                                            this.state.storageOptions.map((item,index)=>{
                                                return <Option value={item.value} key={index}>{item.text}</Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8} key={2}>
                        <FormItem {...formItemLayout} label={`供应商`}>
                            {
                                getFieldDecorator('fOrgId',{
                                    rules:[{required: true, message:'请选择供应商'}],
                                    initialValue: this.props.data.fOrgId || this.state.fOrgId
                                })(
                                    <Select 
                                        showSearch
                                        onSelect={(value)=>this.props.cb({ fOrgId: value })}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        placeholder='请选择'>
                                        {
                                            this.state.fOrgOptions.map((item,index)=>{
                                                return <Option value={item.value+""} key={index}>{item.text}</Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={8} key={3}>
                        {
                            <FormItem {...formItemLayout} label={`备注`}>
                                {
                                    getFieldDecorator(`remark`,{
                                        rules:[{max:100,message:'请注意备注长度，请勿超过100'}],
                                        initialValue: this.props.data.remark || null
                                    })(
                                        <Input placeholder='请输入' onBlur={(e)=>{
                                            this.props.cb({remark: e.target.value})
                                        }}/>
                                    )
                                }
                            </FormItem>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col span={3}>
                        <Button type='primary' htmlType='submit'>提交</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const WrappSearchForm = Form.create()(SearchForm);
const spanSty = {
    marginLeft:8
}

class ZwMaterial extends React.Component{
    state = {
        dataSource: this.props.actionState.AddZwWareHouse.dataSource,
        excludeGuids: [], //排除产品guid
        selected: [],
        selectedRows: [],
        historyPrice: {
            nearestPrice : null,
            nearestMonthPrice: null,
            nearestYearPrice: null
        }//历史价格
    }
    componentWillMount = ()=>{
        if(this.props.actionState.AddZwWareHouse.dataSource.length > 0){
            let dataSource = this.props.actionState.AddZwWareHouse.dataSource;
            let excludeGuids = [];
            dataSource.map((item,index)=>{
                return excludeGuids.push(item.tenderMaterialGuid);
            });
            this.setState({ excludeGuids })
        }
        console.log(this.props.actionState.AddZwWareHouse,'props')
    }
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    showPrice = (guid)=>{
        fetchData(storage.ANALYSEPURCHASEPRICE,querystring.stringify({tenderMaterialGuid:guid }),(data)=>{
            if(data.status){
                this.setState({ historyPrice:data.result })
            }else{
                this.handleError(data.msg);
            }
        })
    }
    delete = ()=>{
        let { dataSource, selected } = this.state;
        if(dataSource.length === 0){
            return  message.warn('暂无产品，无法删除');
        }
        if( selected.length === 0){
            return message.warn('请至少选择一条');
        } else{
            let result = [];
            dataSource.map( (item, index) => {
            const a = selected.find( (value, index, arr) => {
              return value === item.tenderMaterialGuid;
            })
            if (typeof a === 'undefined') {
                result.push(item)
            }
            return null;
            });
            console.log(result,'result')
            if(result.length >0 ){
                let excludeGuids = [];
                result.map( (item,index) => {
                     return  excludeGuids.push(item.tenderMaterialGuid );
                });
                this.setState({ excludeGuids });
            }else{
              this.setState({ excludeGuids: [] });
            }
            this.createAddZWWareHouse({
                dataSource: result
            })
            this.setState({dataSource : result});
        }
    }
    total = (record) => {
        let total = 0;
        record.map( (item, index) => {
          let amount = typeof item.amount === 'undefined' ? 1 : item.amount
          return total += amount * item.purchasePrice;
        })
        return total;
    }
    onClick = ()=>{
        if(this.props.actionState.AddZwWareHouse.storageGuid){
            hashHistory.push({
                pathname: `/storage/wareHouse/zwAddProduct`,
                state:{
                    excludeGuids: this.state.excludeGuids
                }
            })
        }else{
            message.warn('暂无总务库房')
        }
    }
    onChange = (record, index,key, e)=>{
        let value = e.target.value;
        let { dataSource } = this.props.actionState.AddZwWareHouse;
            if(key === 'amount'){
                if (/^\d+$/.test(value)) {
                    if(value > 9999){
                        e.target.value  = 9999;
                        dataSource[index].amount = 9999;
                        return message.warn('输入数值过大, 不能超过10000')
                    }else{
                        dataSource[index].amount = value;
                    }
                }else{
                    return message.warn('请输入非0正整数')
                }
            } else {
                //key === purchasePrice
                if(!isNaN(value)){
                    if(value.indexOf('.')>0){
                        if(value.split('.')[1].length > 2){
                            return message.warn('采购价为大于0且小数点后最多保留2位的数字');
                        }else{
                            dataSource[index].purchasePrice = value;
                        }
                    }else{
                        dataSource[index].purchasePrice = value;
                    }
                }else{
                    message.warn('采购价金额格式不正确，请重新输入！');
                }
            }
        this.createAddZWWareHouse({
            dataSource: dataSource
        });
        this.setState({ dataSource });
    }
    createAddZWWareHouse = (zwList)=>{
        this.props.actions.createAddZWWareHouse(zwList);
    }
    render(){
        const { historyPrice,dataSource } = this.state;
        const content = (
            <div>
                <p>上次入库价:<span style={spanSty}>{historyPrice.nearestPrice!==null? historyPrice.nearestPrice.toFixed(2):'--'}</span></p>
                <p>月平均价格:<span style={spanSty}>{historyPrice.nearestMonthPrice!==null? historyPrice.nearestMonthPrice.toFixed(2):'--'}</span></p>
                <p>年平均价格:<span style={spanSty}>{historyPrice.nearestYearPrice!==null? historyPrice.nearestYearPrice.toFixed(2):'--'}</span></p>
            </div>
        )
        const columns = [{
            title: '通用名称',
            dataIndex: 'geName'
        },{
            title: '产品名称',
            dataIndex: 'materialName'
        },{
            title:'规格',
            dataIndex: 'spec'
        },{
            title:'型号',
            dataIndex: 'fmodel'
        },{
            title:'采购单位',
            dataIndex: 'purchaseUnit',
            width: 70,
            fixed:'right',
        },{
            title:'采购价格',
            dataIndex: 'purchasePrice',
            width: 150,
            fixed:'right',
            render:(text,record,index)=>{
               return record.generalFlag === '01'?
                <p><Input 
                    defaultValue={record.purchasePrice} 
                    onChange={this.onChange.bind(this,record,index,'purchasePrice')}
                    style={{width: 80}}/>
                    <Popover content={content}>
                        <Icon type="info-circle-o" style={{ fontSize: 16,marginLeft:8}} onMouseEnter={()=>this.showPrice(record.tenderMaterialGuid)}/>
                    </Popover>
                </p>
                 :
               text === 'undefined'? '0':text.toFixed(2)
            }
        },{
            title:'数量',
            dataIndex: 'amount',
            width: 120,
            fixed:'right',
            render: (text,record,index)=>{
                return <Input style={{width:90}} defaultValue={text || 1}
                    min={1} max={9999} onChange={this.onChange.bind(this, record, index,'amount')}
                />
            }
        },{
            title:'金额',
            dataIndex: 'total',
            width: 120,
            fixed:'right',
            render: (text,record,index)=>{
                const amount = this.props.actionState.AddZwWareHouse.dataSource.length>0 ? this.props.actionState.AddZwWareHouse.dataSource[index].amount : 1;
                const purchasePrice = this.props.actionState.AddZwWareHouse.dataSource.length>0 ? this.props.actionState.AddZwWareHouse.dataSource[index].purchasePrice : record.purchasePrice;
                return purchasePrice === undefined ? "0.00" :  (amount * purchasePrice).toFixed(2) 
            }
        }];
        return (
            <div>
                {
                    this.props.children ||
                    <div>
                        <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/storage/wareHouse',query:{activeKey:'1'}}}>入库管理</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>总务物资入库</Breadcrumb.Item>
                        </Breadcrumb>
                        <Row>
                            <Col span={19}>
                                <WrappSearchForm 
                                    handleError={(data)=>this.handleError(data)}
                                    cb={(zwList)=>this.createAddZWWareHouse(zwList)}
                                    data={this.props.actionState.AddZwWareHouse}
                                />
                            </Col>
                            <Col span={5} style={{marginTop:48}}>
                                <Button type='primary' onClick={this.onClick}>
                                    添加产品
                                </Button>
                                <Button type='danger' style={{marginLeft:8}} onClick={this.delete}>
                                    删除产品
                                </Button>
                            </Col>
                        </Row>
                        <Table 
                            columns={columns}
                            pagination={false}
                            dataSource={dataSource}
                            style={{marginTop:12}}
                            scroll={{ x: '110%'}}
                            rowKey='tenderMaterialGuid'
                            size="small"
                            rowSelection={{
                                selectedRowKeys: this.state.selected,
                                onChange: (selectedRowKeys, selectedRows) => {
                                this.setState({selected: selectedRowKeys,selectedRows : selectedRows})
                                }
                            }}
                            footer={ this.props.actionState.AddZwWareHouse.dataSource.length === 0 ?
                                null : () => <span style={{fontSize: '1.5em'}}>总金额:
                                              <a style={{color: '#f46e65'}}>
                                                {this.total(this.props.actionState.AddZwWareHouse.dataSource).toFixed(2)}
                                              </a>
                                            </span>}
                        />
                    </div>
                }
            </div>
        )
    }
}
export const mapDispatchToProps = dispatch => ({
        actions: bindActionCreators(Actions, dispatch)
    })
export const mapStateToProps = state => ({
    actionState: state
})
module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(ZwMaterial);