/**
 * @file 备货
 */
import React from 'react';
import {Input, DatePicker, Row, Col, Button, message, Icon,Table,Form } from 'antd';
import { sales } from 'api';
import { fetchData } from 'utils/tools';
import { hashHistory } from 'react-router';
import querystring from 'querystring';
import uuid from 'uuid';
import moment from 'moment';
import SearchForm from './SearchForm';
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
class Product extends React.Component {
  state = {
    dataSource: [],//this.props.data.dataSource,
    total: {},
    selected: [], 
    selectedRows: [],
    query:{}
  }

  componentWillReceiveProps = nextProps => {
   this.setState({dataSource:nextProps.data.dataSource})
  }
  componentDidMount = () => {
    if(this.props.data.template.id){
       //获取产品数据
       fetchData(sales.SEARCHGKTEMPLATEDETAILS,querystring.stringify({gkTemplateGuid:this.props.data.template.id}),(data) => {
        this.props.cb(data.result.rows);
        this.setState({dataSource:data.result.rows})
      })
    }
  }

  //删除产品
  delete = () => {
    let { selected, dataSource } = this.state;
    if (selected.length === 0) {
      message.warn('请至少选择一条数据')
    } else {
      let result = [];
      dataSource.map( (item, index) => {
        const a = selected.find( (value, index, arr) => {
          return value === item.gkTemplateDetailGuid;
        })
        if (typeof a === 'undefined') {
          result.push(item)
        }
        return null;
      })

      const gkTemplateGuid = this.props.data.template.id;
      let postData = {};
        postData.gkTemplateGuid = gkTemplateGuid;
        let gkTemplateDetails = [];
        result.map( (item, index) => {
          if(item.tfAmount!==0){
            return gkTemplateDetails.push({
              gkTemplateGuid: gkTemplateGuid,
              gkTemplateDetailGuid: item.gkTemplateDetailGuid,
              tenderMaterialGuid: item.tenderMaterialGuid,
              tfAmount: item.tfAmount,
              flot: item.flot,
              prodDate: item.prodDate ? moment(item.prodDate).format('YYYY-MM-DD') : '',
              usefulDate: item.usefulDate ? moment(item.usefulDate).format('YYYY-MM-DD') : '',
            })
          }
          return null;
        })
        postData.gkTemplateDetails = gkTemplateDetails;
      console.log(postData,"updateData")
      fetchData(sales.UPDATEGKTEMPLATEDETAILS,JSON.stringify(postData),(data)=>{
        if (data.status) {
          this.setState({ dataSource: result});
          this.props.cb(result);

        } else {
          message.error(data.msg)
        }
      },'application/json')

 
    }
  }
  //添加批次
  split = (record, index) => {
    let dataSource = this.state.dataSource;
    const data = Object.assign({}, record, {
      gkTemplateDetailGuid: uuid(),
      tfAmount: 1 
    });
    console.log(data,'添加批次')
     dataSource.splice(index+1, 0, data);
    this.setState({dataSource: dataSource});
  }
  onChange = (key, index, value) => {
    if(  key ==="tfAmount"){
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

    this.setState({
      dataSource: dataSource
    })
  }
  save = () => {
    const { dataSource,  } = this.state;
    for (let i=0;i<dataSource.length;i++) {
      if ( isNaN(dataSource[i].tfAmount) || dataSource[i].tfAmount === '') {
        return message.error('第 ' + (i+1) + '行请输入数字')
      } 
    }
    let postData = {};
    if (dataSource.length > 0) {
      const gkTemplateGuid = this.props.data.template.id;
      postData.gkTemplateGuid = gkTemplateGuid;
      let gkTemplateDetails = [];
      dataSource.map( (item, index) => {
        if(item.tfAmount!==0){
          return gkTemplateDetails.push({
            gkTemplateGuid: gkTemplateGuid,
            gkTemplateDetailGuid: item.gkTemplateDetailGuid,
            tenderMaterialGuid: item.tenderMaterialGuid,
            tfAmount: item.tfAmount,
            flot: item.flot,
            prodDate: item.prodDate ? moment(item.prodDate).format('YYYY-MM-DD') : '',
            usefulDate: item.usefulDate ? moment(item.usefulDate).format('YYYY-MM-DD') : '',
          })
        }
        return null;
      })
      postData.gkTemplateDetails = gkTemplateDetails;
    }
    console.log(postData,"postData")
    fetchData(sales.SAVEGKTEMPLATE,JSON.stringify(postData),(data)=>{
      if (data.status) {
        message.success('保存成功!')
      } else {
        message.error(data.msg)
      }
    },'application/json')
  
  }

  // 添加产品
  addProduct = () => {
    const template = this.props.data.template;
      const  rOrgId  = this.props.data.rOrgId;
      const  storage   = this.props.data.storage;
      if (template.id) {
        //更新产品
        const gkTemplateGuid = template.id;
        const dataSource = this.state.dataSource;
      
        let postData = {};
        if (dataSource.length > 0) {
          postData.gkTemplateGuid = gkTemplateGuid;
          let gkTemplateDetails = [];
          dataSource.map( (item, index) => {
            if(item.tfAmount!==0){
              return gkTemplateDetails.push({
                gkTemplateGuid: gkTemplateGuid,
                gkTemplateDetailGuid: item.gkTemplateDetailGuid,
                tenderMaterialGuid: item.tenderMaterialGuid,
                tfAmount: item.tfAmount,
                flot: item.flot,
                prodDate: item.prodDate ? moment(item.prodDate).format('YYYY-MM-DD') : '',
                usefulDate: item.usefulDate ? moment(item.usefulDate).format('YYYY-MM-DD') : '',
              })
            }
            return null;
          })
          postData.gkTemplateDetails = gkTemplateDetails;
          console.log(postData,"updateData")
          fetchData(sales.UPDATEGKTEMPLATEDETAILS,JSON.stringify(postData),(data)=>{
            if (data.status) {
            } else {
              message.error(data.msg)
            }
          },'application/json')
        }
        this.props.cb(dataSource);
        hashHistory.push({
          pathname: '/sales/stockTemplate/addProduct',
          state: { rOrgId:rOrgId, storage,template }
        })

      } else {
        message.warn('请选择模板!');
      }
  }
  queryHandler = (query) => {
    this.props.search(query);

    const gkTemplateGuid = this.props.data.template.id;
    query.gkTemplateGuid = gkTemplateGuid;

    //更新产品
    const dataSource = this.state.dataSource;
    let postData = {};
    if (dataSource.length > 0) {
      postData.gkTemplateGuid = gkTemplateGuid;
      postData.attributeId = query.attributeId;
      postData.tfBrand = query.tfBrand;
      postData.searchName = query.searchName;
      let gkTemplateDetails = [];
      dataSource.map( (item, index) => {
        if(item.tfAmount!==0){
          return gkTemplateDetails.push({
            gkTemplateGuid: gkTemplateGuid,
            gkTemplateDetailGuid: item.gkTemplateDetailGuid,
            tenderMaterialGuid: item.tenderMaterialGuid,
            tfAmount: item.tfAmount,
            flot: item.flot,
            prodDate: item.prodDate ? moment(item.prodDate).format('YYYY-MM-DD') : '',
            usefulDate: item.usefulDate ? moment(item.usefulDate).format('YYYY-MM-DD') : '',
          })
        }
        return null;
      })
      postData.gkTemplateDetails = gkTemplateDetails;
      console.log(postData,"postData")
      fetchData(sales.UPDATEGKTEMPLATEDETAILS,JSON.stringify(postData),(data)=>{
        if (data.status) {
          console.log("保存成功")
        } else {
          message.error(data.msg)
        }
      },'application/json')
    }
 

      //查询的时候更新产品
      fetchData(sales.SEARCHGKTEMPLATEDETAILS,querystring.stringify(query),(data) => {
        this.setState({ dataSource : data.result.rows})
      })
  }
  productReset = () => {

    this.refs.productSearch.resetFields();
  }
  render () {
    const materialColumns = [
      {
        title : '操作',
        dataIndex : 'gkTemplateDetailGuid',
        width: 80,
        fixed: 'left',
        render: (text, record, index) => {
          return <a onClick={this.split.bind(this, record, index)}>
                  <Icon type="plus-circle-o" />添加批次
                 </a>;
        }
      },{
        title : '产品类型',
        dataIndex : 'attributeName',
        width: 100,
        fixed: 'left'
      },
      {
        title : '产品名称',
        dataIndex : 'materialName',
        width: 180,
        fixed: 'left'
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
        dataIndex : 'tfAmount',
        width: 80,
        fixed: 'right',
        render: (text, record, index) => {
          return <Input 
            min={0}
            defaultValue={text}
            onChange={this.onChange.bind(this, 'tfAmount', index)}
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
          return <DatePicker  value={text!==null?moment(text):null} onChange={this.onChange.bind(this, 'prodDate', index)}/>
        }
      },{
        title : '有效期至',
        dataIndex : 'usefulDate',
        width: 110,
        fixed: 'right',
        render: (text, record, index) => {
          return <DatePicker value={ text!==null?moment(text):null } onChange={this.onChange.bind(this, 'usefulDate', index)}/>
        }
      }
    ];
    let query = this.state.query;
    query.gkTemplateGuid = this.props.data.template.id;
    return (
      <div>
        <SearchBox ref='productSearch' query={this.queryHandler} rOrgId={this.props.data.rOrgId}/>
        <Row style={{marginTop: 10, marginBottom: 6}}>
          <Col span={12}>
            <Button type="danger" ghost onClick={this.delete}>删除产品</Button>
            <Button type="primary" onClick={this.save} style={{marginLeft:16}}>保存</Button>
          </Col>
          <Col span={12} style={{textAlign: 'right'}}>
            <Button type="primary" onClick={this.addProduct}>添加产品</Button>
          </Col>
        </Row>
         <Table 
          size={'small'}
          pagination={false}	
          dataSource={this.state.dataSource} 
          columns={materialColumns} 
          scroll={{ x: '150%' }}
            rowSelection={{
            selectedRowKeys: this.state.selected,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
            }
          }}
          rowKey={'gkTemplateDetailGuid'}/> 
      </div>
    )
  }
}
module.exports = Product;