/**
 * @file 我的供应商--供应产品
 */
import React from 'react';
import { Form, Row, Col, Breadcrumb, Button, Input, Select, Icon, message } from 'antd';
import { Link, hashHistory } from 'react-router';
import FetchTable from 'component/FetchTable';
import { fetchData } from 'utils/tools';
import { tender, purchase } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
class SearchForm extends React.Component {
    state = {
      storageOptions: [],
      storageGuid: ''
    }
    componentDidMount = () => {
      console.log(this.props.fOrgId,'forgID');
      fetchData(tender.STORAGE_LIST,{},(data)=>{
          if(data.result.length > 0){
            this.setState({storageOptions: data.result,storageGuid:data.result[0].value});
            this.props.defaultQuery({storageGuid: data.result[0].value,fOrgId:this.props.fOrgId});
          }
      })
    }
    //查询
    search = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        console.log('查询条件: ', values)
        values.fOrgId = this.props.fOrgId;
        this.props.query(values);
      })
    }
    //重置
    reset = () => {
      const storageGuid = this.state.storageGuid;
      this.props.form.resetFields();
      this.props.query({storageGuid:storageGuid,fOrgId:this.props.fOrgId});
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
          <FormItem {...formItemLayout} label={`产品名称`}>
            {getFieldDecorator(`materialName`)(
              <Input placeholder='请输入'/>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={5}>
          <FormItem {...formItemLayout} label={`通用名称`}>
            {getFieldDecorator(`geName`)(
              <Input placeholder='请输入'/>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={6}>
          <FormItem {...formItemLayout} label={`证件号`}>
            {getFieldDecorator(`registerNo`)(
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
          <FormItem {...formItemLayout} label={`品牌`}>
            {getFieldDecorator(`tfBrand`)(
              <Input placeholder='请输入'/>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={11}>
          <FormItem {...formItemLayout} label={`生产商`}>
            {getFieldDecorator(`produceName`)(
              <Input placeholder='请输入'/>
            )}
          </FormItem>
        </Col>,
        <Col span={8} key={12}>
          <FormItem {...formItemLayout} label={`采购份额`}>
            {getFieldDecorator(`purchaseRatio`,{
              initialValue:''
            })(
              <Select>
                <Option key={-1} value=''>全部</Option>
                <Option key={1} value='0'>0%</Option>
                <Option key={2} value='1'>不为0%</Option>
              </Select>
            )}
          </FormItem>
        </Col>,
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
                  initialValue: this.state.storageOptions.length > 0 
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
                  getFieldDecorator(`searchName`,{
                    rules:[{max:25,message:'长度不能超过25'}]
                  })(
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

  class SupplyProduct extends React.Component{
    state = {
        selected: [],
        selectedRows: [],
        query:{

        }
    };
    queryHandle = (query)=>{
      this.refs.table.fetch(query);
      this.setState({ query: query });
    }
    //变更供应商
    changeSuppliers = () =>{
      if(this.refs.table.state.data.length === 0){
        return message.warn('暂无产品数据，无法变更！')
      }else{
        const { selectedRows } = this.state;
        if( selectedRows.length === 0 ){
          return message.warn('请至少选择一条！');
        }else{
          let flag = false
          selectedRows.map((item,index)=>{
            if(item.purchaseRatio !==0 ){
              flag = true;
              return null;
            }
            return null;
          })
          if(flag){
            hashHistory.push({
              pathname: '/purchase/supplier/supplierChange',
              state: {
                dataSource : selectedRows,
                oldFOrgId: this.props.location.state.fOrgId,
                rStorageGuid: this.props.location.state.storageGuid,
                from:'/purchase/supplier/product',
                title:'供应商变更'
              }
            })
          }else{
            return message.warn('请选择有采购份额的产品变更!');
          }
          
        }
      }
    }
    defaultQuery = (query)=>{
      this.setState({query : query});
    }
    render(){
        const columns = [{
            title: '产品名称',
            dataIndex: 'materialName'
        },{
            title:'型号',
            dataIndex: 'fmodel'
        },{
            title:'规格',
            dataIndex: 'spec'
        },{
            title:'采购单位',
            dataIndex: 'purchaseUnit'
        },{
            title:'采购份额',
            dataIndex: 'purchaseRatio',
            render:(text,record)=>{
              return text === 'undefined'? '0':(text*100+'%')
            }
        },{
            title:'组件名称',
            dataIndex: 'suitName'
        },{
            title:'通用名称',
            dataIndex: 'geName'
        },{
            title:'证件号',
            dataIndex: 'registerNo'
        },{
            title:'品牌',
            dataIndex: 'tfBrand'
        },{
            title:'生产商',
            dataIndex: 'produceName'
        }];
        return (
            <div>
                {
                    this.props.children
                    ||
                    <div>
                        <Row>
                            <Col className="ant-col-6">
                                <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                    <Breadcrumb.Item><Link to='/purchase/supplier'>我的供应商</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item>供应产品</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <WrappedSearchForm   
                            fOrgId={this.props.location.state.fOrgId}
                            defaultQuery={(query) => this.defaultQuery(query)}
                            query={(query) => this.queryHandle(query)}
                        />
                        <Row>
                            <Col>
                                <Button type='primary' onClick={this.changeSuppliers}>变更供应商</Button>
                            </Col>
                        </Row>
                        {
                          this.state.query.storageGuid &&
                          <FetchTable 
                              ref='table'
                              rowKey={'tenderMaterialExtendGuid'}
                              url={purchase.FINDSUPPLIERMATERIALIST}
                              query={this.state.query}
                              columns={columns}
                              scroll={{x:'140%'}}
                              rowSelection={{
                                  selectedRowKeys: this.state.selected,
                                  onChange: (selectedRowKeys, selectedRows) => {
                                  this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                                  }
                              }}
                          />
                        }
                    </div>
                }
            </div>
        )
    }
  }
module.exports = SupplyProduct;