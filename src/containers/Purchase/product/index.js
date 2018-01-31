import React from 'react';
import { Form, Row, Col, Input, Button, Select, Icon, message } from 'antd';
import { hashHistory } from 'react-router';
import FetchTable from 'component/FetchTable';
import { fetchData, actionHandler } from 'utils/tools';
import { tender, purchase } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component {
  state = {
    storageOptions: [],
    storageGuid: ''
  }
  componentDidMount = () => {
   
      fetchData(tender.FINDTOPSTORAGEBYUSER,{},(data)=>{
          if(data.result.length > 0){
            if(this.props.storageGuid){
              this.setState({storageGuid:this.props.storageGuid});
              this.props.defaultQuery({storageGuid: this.props.storageGuid})
            }else{
              this.setState({storageGuid:data.result[0].value});
              this.props.defaultQuery({storageGuid: data.result[0].value})
            }
            this.setState({storageOptions: data.result })
          }
      })
    
  }
  //查询
  search = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('查询条件: ', values)
      this.props.query(values);
    })
  }
  //重置
  reset = () => {
    const storageGuid = this.state.storageGuid;
    this.props.form.resetFields();
    this.props.query({storageGuid:storageGuid});
  }
  //状态切换
  toggle = ()=>{
    const { expand } = this.state;
    this.setState({ expand: !expand})
  }
  render = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
    const children = [
      <Col span={8} key={4}>
        <FormItem {...formItemLayout} label={`产品名称/证件号`}>
          {getFieldDecorator(`registerNameNo`)(
            <Input placeholder='请输入'/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={5}>
        <FormItem {...formItemLayout} label={`品牌`}>
          {getFieldDecorator(`tfBrand`)(
            <Input placeholder='请输入'/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={6}>
        <FormItem {...formItemLayout} label={`生产商`}>
          {getFieldDecorator(`produceName`)(
            <Input placeholder='请输入'/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={7}>
        <FormItem {...formItemLayout} label={`组件名称`}>
          {getFieldDecorator(`suitName`)(
            <Input placeholder='请输入'/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={8}>
        <FormItem {...formItemLayout} label={`型号`}>
          {getFieldDecorator(`fmodel`)(
            <Input placeholder='请输入'/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={9}>
        <FormItem {...formItemLayout} label={`规格`}>
          {getFieldDecorator(`spec`)(
            <Input placeholder='请输入'/>
          )}
        </FormItem>
      </Col>,
      <Col span={8} key={10}>
        <FormItem {...formItemLayout} label={`产品编码`}>
          {getFieldDecorator(`cpbm`)(
            <Input placeholder='请输入'/>
          )}
        </FormItem>
      </Col>
    ];
    const expand = this.state.expand;
    const shownCount = expand ? children.length : 0;
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.search}
      >
        <Row>
          <Col span={8} key={1}>
            <FormItem  {...formItemLayout} label={`库房`}>
              {getFieldDecorator(`storageGuid`, {
                initialValue: this.props.storageGuid? this.props.storageGuid: this.state.storageOptions.length > 0 
                              ? this.state.storageOptions[0].value : null
              })(
                <Select
                >
                  {
                    this.state.storageOptions.map(
                      (item, index) => <Option key={index} value={item.value}>{item.text}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={1}>
          </Col>
          <Col span={9} key={2}>
            <FormItem>
              {
                getFieldDecorator(`searchName`
                )(
                  <Input placeholder='请输入产品名称/证件号/通用名称/组件名称'/>
                )
              }
            </FormItem>
          </Col>
          <Col span={4}  key={3} style={{textAlign: 'right'}}>
              <Button type='primary' htmlType="submit">搜索</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.reset}>
                清空
              </Button>
              <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                  {expand ? '关闭' : '展开'} <Icon type={expand ? 'up' : 'down'} />
              </a>
          </Col>
        </Row>
        <Row>
          {children.slice(0, shownCount)}
        </Row>
      </Form>
    )
  }
}

const WrappedSearchForm = Form.create()(SearchForm);
class PurchaseProduct extends React.Component {
  state = {
    query: '',
    selected: [],
    selectedRows: []
  }
  search = (query) => {
    this.refs.table.fetch(query);
    this.setState({ query });
  }
  defaultQuery = (query) => {
    this.setState({
      query: query
    })
  }
  redirect = (url, record,guid) => {
    hashHistory.push({
      pathname: url,
      state: {
        dataSource : record,
        storageGuid : guid
      }
    })
  }
  adjustPrice = ()=>{
    const { selectedRows } = this.state;
    if( selectedRows.length === 0 ){
      return message.warn('请至少选择一条！');
    }else{
      console.log(this.state.query,'query')
      this.redirect('/purchase/product/adjustPrice',selectedRows,this.state.query.storageGuid)
    }
  }
  render() {
      const columns = [{
        title:'操作',
        dataIndex: 'actions',
        width: 60,
        render : (text,record)=>{
          return <span>
                    <a onClick={
                      actionHandler.bind(
                      null, this.props.router, `/purchase/product/show` , {...record}
                      )}>
                      {`查看`}
                    </a>
                </span>
        }
      },{
          title : '产品编码',
          dataIndex : 'cpbm'
      },{
          title : '产品名称',
          dataIndex : 'materialName',
      },{
          title : '型号',
          dataIndex : 'fmodel'
      },{
          title : '规格',
          dataIndex : 'spec'
      },{
          title: '采购单位',
          width: 100,
          dataIndex: 'purchaseUnit'
      },{
          title: '采购价',
          width: 100,
          dataIndex: 'purchasePrice',
          render : (text, record)=>{
            return text === 'undefined' || text === null ? '0.00' : text.toFixed(2)
          } 
      },{
          title: '组件名称',
          width: 140,
          dataIndex: 'suitName'
      },{
          title: '证件号',
          dataIndex: 'registerNo'
      },{
          title : '品牌',
          dataIndex : 'tfBrand'
      },{
          title : '生产商',
          dataIndex : 'produceName'
      }];
    return (
      <div>
      {
          this.props.children ||
          <div>
            <WrappedSearchForm  
              storageGuid={this.state.query.storageGuid?this.state.query.storageGuid:''}
              defaultQuery={(query) => this.defaultQuery(query)}
              query={(query) => this.search(query)}
            />
            {
              this.state.query === '' ? null :
              <div>
                <Row>
                  <Col>
                    <Button type='primary' onClick={this.adjustPrice}>调价</Button>
                  </Col>
                </Row>
                <FetchTable 
                  query={this.state.query}
                  ref='table'
                  rowKey={'tenderMaterialGuid'}
                  url={purchase.FINDMYMATERIALIST}
                  columns={columns} 
                  scroll={{ x: '160%' }}
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
      }
        
      </div>  
    )
  }
}

module.exports = PurchaseProduct;