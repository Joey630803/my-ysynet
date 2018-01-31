/**
 * 变更证件---产品
 */
import React from 'react';
import {Form,Breadcrumb,Row,Col ,Button,message,Input} from 'antd';
import { Link,hashHistory } from 'react-router';
import { jsonNull } from 'utils/tools';
import FetchTable from 'component/FetchTable';
import { purchase } from 'api';
const FormItem = Form.Item;


class SearchForm extends React.Component{
    handleSearch = (e) => {
       e.preventDefault();
      this.props.form.validateFields((err, values) => {
         this.props.query(values);
      });
    }
    handleReset = () => {
      this.props.form.resetFields();
      this.props.query({});
    }
    render() {
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 },
          };
  
      
          return (
              <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row>
                  <Col span={6} key={1}>
                      <FormItem {...formItemLayout} label={'组件名称'}>
                         {getFieldDecorator('nameOrNoLike')(
                               <Input placeholder="请输入"/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={6} key={2}>
                      <FormItem {...formItemLayout} label={'型号'}>
                          {getFieldDecorator('modelLike')(
                               <Input placeholder="请输入"/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={6} key={3}>
                      <FormItem {...formItemLayout} label={'规格'}>
                          {getFieldDecorator('specLike')(
                              <Input placeholder="请输入"/>
                          )}
                      </FormItem>
                  </Col>
                  <Col span={6} style={{ textAlign: 'right' }}>
                      <Button type="primary" htmlType="submit">搜索</Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                          清除
                      </Button>
                  </Col>
                </Row>
              </Form>
          )
      
      }
  }
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);

class Product extends React.Component{
    state = {
        query: {
            certGuid:this.props.location.state.certGuid
        },
        selectedRowKeys:[],
    }
    
    //查询
    queryHandler = (query) => {
        query.certGuid = this.props.location.state.certGuid;
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('选中数据: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
 
  
    //变更证件
    handleChangeCert = () => {
        let data = this.props.location.state;
        data.tenderStorageGuid =  this.state.selectedRowKeys;
        data.title = "变更证件";
        if(this.state.selectedRowKeys.length>0){
            hashHistory.push({pathname:'/purchase/changeCert/change',state: data});
         }
         else {
          message.warning('请选中数据');
         }
    }

    render(){
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
          };
        const baseData = jsonNull(this.props.location.state);
        //列
        const columns = [{
            title:'组件名称',
            width: 160,
            dataIndex:'suitName'
        },{
            title:'型号',
            width: 80,
            dataIndex:'fmodel',
        },{
            title:'规格',
            width: 120,
            dataIndex:'spec'
        },{
            title:'最小单位',
            width: 120,
            dataIndex:'leastUnit'
        },{
            title:'材质',
            width: 120,
            dataIndex:'tfTexture'
        },{
            title:'包装材质',
            width: 120,
            dataIndex:'firstTime',
        },{
            title:'包装规格',
            width: 120,
            dataIndex:'aa',
        },{
            title:'REF',
            width: 120,
            dataIndex:'bb',
        }];
        const query = this.state.query;
      return(
            <div>
                <Breadcrumb style={{fontSize: '1.1em'}}>
                    <Breadcrumb.Item><Link to='/purchase/changeCert'>我的证件</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>产品</Breadcrumb.Item>
                </Breadcrumb>
                <Row style={{marginTop:'8px'}}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="产品名称:">
                            {baseData.materialName}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="证件号:">
                            {baseData.registerNo}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="生产商:">
                            {baseData.produceName}
                        </FormItem>
                    </Col>
                </Row>
                <SearchBox  query={this.queryHandler}/>
                <div>
                    <Button 
                    type="primary" 
                    style={{ marginLeft: 8 }}
                    onClick={this.handleChangeCert}
                    >变更证件</Button>
                </div>
                <FetchTable 
                query={query}
                ref='table'
                columns={columns}
                url={purchase.FINDPRODUCT}
                rowKey='tenderStorageGuid'
                rowSelection={{
                     onChange: this.onSelectChange
                }}
                />
            </div>
        )
    }
}
module.exports = Product;