/**
 * @file 手术结算单 产品
 */
import React from 'react';
import { Form, Input, Table, Button, DatePicker,Row, Col ,Icon, message, Modal} from 'antd';
import { purchase ,sales} from 'api';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { hashHistory } from 'react-router';
import uuid from 'uuid';
import moment from 'moment';
import SearchForm from './searchForm';

const confirm = Modal.confirm;
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

class OperProduct extends React.Component{
    state = {
      dataSource: [],
      selected : [],
      selectedRows: [], 
      query : {},
      exceptGuid: []//排除产品列表Guid
    }
    componentWillReceiveProps = nextProps => {
      if(nextProps.data.productData){
        const dataSource = nextProps.data.productData;
        let exceptGuid = [];
        if(dataSource.length > 0){
          dataSource.map((item,index)=>{
            return exceptGuid.push(item.tenderMaterialGuid);
          });
        }
        this.setState({dataSource:dataSource, exceptGuid : exceptGuid});
      }
    }
    redirect = (url,val) =>{
      hashHistory.push({
        pathname: url,
        state:{ 
          orderId: this.props.data.orderId,
          storageGuid: this.props.data.storageGuid,
          rOrgId: this.props.data.rOrgId,
          rOrgName : this.props.data.rOrgName,
          exceptGuid: val
        }
      })
    }
    //查找产品临时数据
    findData = () =>{
      let postData = {};
      postData.orderId = this.props.data.orderId;
      const dataSource = this.state.dataSource;
      if(dataSource.length){
        let query = this.state.query;
        let materialScope = {};let detailList=[];
        materialScope.attributeId = query.attributeId;
        materialScope.tfBrand = query.tfBrand;
        materialScope.searchName = query.searchName;
        postData.materialScope = materialScope;
        dataSource.map((item,index)=>{
          return detailList.push({
            sendDetailGuid:item.sendDetailGuid,
            tenderMaterialGuid:item.tenderMaterialGuid,
            amount:item.amount,
            flot:item.flot,
            prodDate: item.prodDate ? moment(item.prodDate).format('YYYY-MM-DD') : '',
            usefulDate: item.usefulDate ? moment(item.usefulDate).format('YYYY-MM-DD') : '',
          })
        });
        postData.detailList = detailList;
      }
      return postData;
    }
    //保存数据
    saveData = (url,values) => {
          let postData = this.findData();
          //查找手术包数据
          fetchData(purchase.FINDPACKAGE_LIST,
            querystring.stringify({orderId:this.props.data.orderId,headerStyle:'1',submitFlag:'D'}),(data)=>{
              if(data.status){
                if(data.result !== null){
                    let operBagData = data.result.slice(1,data.result.length-1);
                    operBagData.map((item,index)=>{
                        for( let key in item){
                          if(key === 'hasImplantFlag'){
                            item['hasImplantFlag'] ==='是'? item['hasImplantFlag']='01':item['hasImplantFlag']='00';
                          }
                        }
                        return null;
                      });
                    postData.packageList = operBagData;
                    //保存临时数据
                    fetchData(sales.SAVEDRAFTDATA,JSON.stringify(postData),(data)=>{
                      if(data.status){
                        console.log('保存了数据');
                        this.redirect(url,values);
                      }else{
                        message.error(data.msg);
                      }
                    },'application/json')
                  }
                  else{
                    this.redirect(url,values);
                  }
                }else{
                  message.error(data.msg);
                }
              });
         
    }
    //添加模板
    addTemplate = () => {   
      this.saveData('/sales/myOrder/addTemplate');
    }
    
    //添加产品
    addProduct = () => {
      const exceptGuid = this.state.exceptGuid;
      console.log(exceptGuid,'排除产品Guid')
      this.saveData('/sales/myOrder/addProduct',exceptGuid);
    }
    onChange = (key, index, value) => {
      if(  key ==="amount"){
        if (/^\d+$/.test(value.target.value)) {
          if (value.target.value > 9999) {
            return message.warn('输入数值过大, 不能超过10000')
          }
        }else {
          return message.warn('请输入非0正整数')
        }
      }
      let dataSource = this.state.dataSource;
      if (typeof value === 'undefined') {
        dataSource[index][key] = '';
      } else if (typeof value.target === 'undefined' ) {
        dataSource[index][key] = value;
      } else {
        dataSource[index][key] = value.target.value;
      }
      // this.props.cb(dataSource);
      this.setState({
        dataSource: dataSource
      })
    }
    //拆分批次
    split = (record, index) => {
      let dataSource = this.state.dataSource;
      const data = Object.assign({}, record, {
        sendDetailGuid: uuid(),
        amount: 1 
      });
      console.log(data,'添加批次')
      dataSource.splice(index+1, 0, data);
      this.setState({dataSource: dataSource});
    }
    //删除产品
    delete = () =>{
      const { selected, dataSource } = this.state;
      if(!selected.length){
        return message.warning('请至少选择一条数据！')
      }
      else{
        let result = []; 
        dataSource.map( (item, index) => {
          const a = selected.find( (value, index, arr) => {
            return value === item.sendDetailGuid
          })
          if (typeof a === 'undefined') {
            result.push(item);
          }
          return null;
        });
        const orderId = this.props.data.orderId;
        let postData = {};
         postData.orderId = orderId;
         let detailList = [];
          result.map( (item, index) => {
            if(item.amount!==0){
              return detailList.push({
                sendDetailGuid: item.sendDetailGuid,
                tenderMaterialGuid: item.tenderMaterialGuid,
                amount: item.amount,
                flot: item.flot,
                prodDate: item.prodDate ? moment(item.prodDate).format('YYYY-MM-DD') : '',
                usefulDate: item.usefulDate ? moment(item.usefulDate).format('YYYY-MM-DD') : '',
              })
            }
            return null;
          })
          postData.detailList = detailList;
          postData.packageList = null;
          fetchData(sales.SAVEDRAFTDATA,JSON.stringify(postData),(data)=>{
            if(data.status){
              this.setState({selected:[]})
              this.setState({ dataSource: result});
              this.props.cb(result);
            }
            else{
              message.error(data.msg)
            }
          },'application/json')
      }
    }
    //搜索
    queryHandle = (query) =>{
      this.props.search(query);
      query.sendId = this.props.data.orderId;
      query.submitFlag = 'D';
      let updateData = [];
      console.log(query)
      fetchData(purchase.FINDDETAILIST4OPER,querystring.stringify(query), (data)=>{
        if(data.status){
          this.setState({dataSource:data.result})
        }
      });
      this.setState({ query: query });
      
      console.log(updateData,'查询更新后的产品');
    } 
    //生成送货单
    createDelivery = () =>{
      const that = this;
      confirm({
        title: '提示',
        okText:'确认',
        cancelText:'取消' ,
        content: '是否确认生成送货单？',
        onOk() {
            let postData = that.findData();
            //手术包数据
            fetchData(purchase.FINDPACKAGE_LIST,
              querystring.stringify({orderId:that.props.data.orderId,headerStyle:'1',submitFlag:'D'}),(data)=>{
                if(data.status){
                  let operBagData = data.result.slice(1,data.result.length-1);
                  operBagData.map((item,index)=>{
                      for( let key in item){
                        if(key === 'hasImplantFlag' || key === 'sumOperTool'){
                          delete item[key]
                        }
                      }
                      return null;
                    });
                  postData.packageList = operBagData;
                  fetchData(sales.SAVEDRAFTDATA,JSON.stringify(postData),(data)=>{
                    if(data.status){
                      console.log('保存成功！！！！');
                      fetchData(sales.SETTLEGOODSPLAN,querystring.stringify({orderId:that.props.data.orderId}),(data)=>{
                        if(data.status){
                          message.success('生成送货单成功');
                          hashHistory.push({
                            pathname: '/sales/myOrder'
                          })
                        }
                        else{
                          message.error(data.msg);
                        }
                    })
                    }else{
                      message.error(data.msg);
                    }
                  },'application/json');
                  }
            });
          }
    })
  }
	render () {
		const productColumns = [ 
            {
              title : '操作',
              dataIndex : 'orderDetailGuid',
              width: 80,
              fixed: 'left',
              render: (text, record, index) => {
                return <a onClick={this.split.bind(this, record, index)}>
                        <Icon type="plus-circle-o" />拆分批次
                       </a>;
              }
            },{
                title : '产品类型',
                dataIndex : 'attributeName',
                fixed : 'left'
            },{
              title : '产品名称',
              dataIndex : 'materialName',
              width: 180,
            },  {
              title : '通用名称',
              dataIndex : 'geName'
            },  {
              title : '规格',
              dataIndex : 'spec'
            },  {
              title : '型号',
              dataIndex : 'fmodel'
            },  {
              title : '采购单位',
              dataIndex : 'purchaseUnit'
            },  {
              title : '采购价格',
              dataIndex : 'purchasePrice'
            },  {
              title : '包装规格',
              dataIndex : 'tfPacking'
            },  {
              title : '发货数量',
              dataIndex : 'amount',
              width: 100,
              fixed: 'right',
              render: (text, record, index) => {
                return <Input
		            min={0}
		            defaultValue={text || 1}
		            onChange={this.onChange.bind(this, 'amount', index)}
		            />
              }
            },  {
              title : '生产批号',
              dataIndex : 'flot',
              width: 120,
              fixed: 'right',
              render: (text, record, index) => {
                return <Input defaultValue={text} onChange={this.onChange.bind(this, 'flot', index)}/>
              }
            },  {
              title : '生产日期',
              dataIndex : 'prodDate',
              width: 110,
              fixed: 'right',
              render: (text, record, index) => {
                return <DatePicker  value={text!==null && text!== undefined ? moment(text):null} onChange={this.onChange.bind(this, 'prodDate', index)}/>
              }
            },{
              title : '有效期至',
              dataIndex : 'usefulDate',
              width: 110,
              fixed: 'right',
              render: (text, record, index) => {
                return <DatePicker  value={text!==null && text!== undefined ? moment(text):null} onChange={this.onChange.bind(this, 'usefulDate', index)}/>
              }
            }
          ];
		return (
            <div>
                {
                    this.props.children ||
                    <div>
                        <SearchBox query={ this.queryHandle } data={{rOrgId:this.props.data.rOrgId,sendId:this.props.data.orderId}} />
                        <Row>
                            <Col span={4}>
                              <Button type='primary' style={{marginRight:10}} onClick={ this.createDelivery }>生成送货单</Button>
                            </Col>
                            <Col span={20} style={{textAlign:'right'}}>
                                <Button type='primary' style={{marginRight:10}} onClick={ this.addTemplate }>添加模板</Button>
                                <Button type='primary' style={{marginRight:10}} onClick={ this.addProduct }>添加产品</Button>
                                <Button type="danger" ghost style={{marginRight:10}} onClick={this.delete}>删除产品</Button>
                            </Col>
                        </Row>
                        <Table 
                            style={{marginTop:10}}
                            columns={productColumns}
                            rowKey='sendDetailGuid'
                            pagination={false}
                            dataSource={this.state.dataSource}
                            scroll={{ x: '150%' }}
                            rowSelection={{
                                selectedRowKeys: this.state.selected,
                                onChange: (selectedRowKeys, selectedRows) => {
                                this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                                }
                            }}
			            />
                    </div>
                }
            </div>
			
			)
	}
}
module.exports = OperProduct