/**
 * @file 财务-财务产品
 */
import React from 'react';
import { Form, Row, Col, Button, Input, Select, Icon, message } from 'antd';
import { hashHistory } from 'react-router';
import FetchTable from 'component/FetchTable';
import { fetchData } from 'utils/tools';
import { finance } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
class SearchForm extends React.Component {
    state = {
      storageOptions: [],
      storageGuid: ''
    }
    componentDidMount = () => {
      fetchData(finance.FINDMYTOPSTORAGEBYUSER,{},(data)=>{
          if(data.result.length > 0){
            this.setState({storageOptions: data.result,storageGuid:data.result[0].value});
            this.props.defaultQuery({value: data.result[0].value});
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
      this.props.query({value:storageGuid});
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
            {getFieldDecorator(`mark`)(
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
                {getFieldDecorator(`value`, {
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
                  getFieldDecorator(`searchName`)(
                    <Input placeholder='请输入产品名称/证件号/组件名称'/>
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

  class Product extends React.Component{
    state = {
        selected: [],
        selectedRows: [],
        query:{

        }
    };
    componentWillReceiveProps = () =>{
      this.setState({ selected: [] });
    }
    queryHandle = (query)=>{
      this.refs.table.fetch(query);
      this.setState({ query: query });
    }
    //财务分类
    financeClassify = () =>{
      if(this.refs.table.state.data.length === 0){
        return message.warn('暂无产品数据，无法进行财务分类！')
      }else{
        const { selectedRows } = this.state;
        if( selectedRows.length === 0 ){
          return message.warn('请至少选择一条！');
        }else{
            hashHistory.push({
              pathname: '/finance/myProduct/classify',
              state: {
                dataSource : selectedRows,
                storageGuid: this.state.query.value,
                from:'/finance/myProduct',
                title:'财务分类'
              }
            })
          }
        }
      }
    defaultQuery = (query)=>{
      this.setState({query : query});
    }
    render(){
        const columns = [{
            title: '产品名称',
            dataIndex: 'rMaterialName'
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
            title:'采购价格',
            dataIndex: 'purchasePrice',
            render:(text,record)=>{
              return text === 'undefined'? '0':text.toFixed(2)
            }
        },{
            title:'组件名称',
            dataIndex: 'suitName'
        },{
            title:'证件号',
            dataIndex: 'registerNo'
        },{
            title:'品牌',
            dataIndex: 'tfBrandName'
        },{
            title:'生产商',
            dataIndex: 'produceName'
        },{
            title: '财务分类',
            dataIndex: 'styleName',
            width: 120,
            fixed:'right'
        }];
        return (
            <div>
                {
                    this.props.children
                    ||
                    <div>
                        <WrappedSearchForm
                            defaultQuery={(query) => this.defaultQuery(query)}
                            query={(query) => this.queryHandle(query)}
                        />
                        <Row>
                            <Col>
                                <Button type='primary' onClick={this.financeClassify}>财务分类</Button>
                            </Col>
                        </Row>
                        {
                          this.state.query.value &&
                          <FetchTable 
                              ref='table'
                              rowKey={'tenderMaterialGuid'}
                              url={finance.FINDFINANCEPRODUCT}
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
module.exports = Product;