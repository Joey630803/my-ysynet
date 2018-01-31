import React from 'react';
import { Form, Row, Col, Input,Button,Select,message,Icon } from 'antd';
 import { CommonData,fetchData} from 'utils/tools';
import {  hashHistory } from 'react-router';
import { storage } from 'api';  
const FormItem = Form.Item;
const Option = Select.Option;
class SearchForm extends React.Component {
    state = {
      expand: false,
      jsfsData: [],
      shfsData: [],
      storageOptions: [],
      defaultValue:"",
      tfbrandDatas:[]
    }
    componentDidMount = () => {
      //库房列表
      fetchData(storage.FINDSTORAGEBYMYUSER,{},(data)=>{
        if(data.result){
          this.setState({ storageOptions : data.result,defaultValue:data.result[0].value})
          this.props.cb(data.result[0].value)
        }
   })
      //计算方式
      CommonData('jsfs', (data) => {
          this.setState({jsfsData:data})
      })
      //品牌
      CommonData('TF_BRAND', (data) => {
        this.setState({tfbrandDatas:data})
       })
       //送货方式
       CommonData('shfs', (data) => {
        this.setState({shfsData:data})
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

    change = () => {
      if (this.props.selected.length === 0) {
        return message.warning('至少选择一项!');
      }
      hashHistory.push({
        pathname: '/tender/product/change',
        state: this.props.selected
      })
    }
    //状态切换
    toggle = () => {
      const { expand } = this.state;
      this.setState({ expand: !expand})
    }
    render = () => {
      const { getFieldDecorator } = this.props.form;
      const children = [
        <Col span={6} key={1}>
        <FormItem  labelCol={{span: 6}} wrapperCol={{span: 18}}label={'库房'}>
            {getFieldDecorator('storageGuid',{
                  initialValue: this.state.defaultValue
            })(
                <Select>
                  {
                      this.state.storageOptions.map((item,index) => {
                      return <Option key={index} value={item.value}>{item.text}</Option>
                      })
                  }
                </Select>
            )}
        </FormItem>
      </Col>,
        <Col span={6} key={2}>
          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label='关键字'>
            {getFieldDecorator(`searchName`)(
              <Input placeholder="请输入产品名称/通用名称/供应商"/>
            )}
          </FormItem>
        </Col>,
        <Col span={6} key={3}>
          <FormItem  labelCol={{span: 6}} wrapperCol={{span: 18}}label={'品牌'}>
              {getFieldDecorator('tfBrand',{
                    initialValue: ""
              })(
                <Select
                showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                   <Option key={-1} value="">全部</Option>
                  {
                      this.state.tfbrandDatas.map((item,index) => {
                        return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                      })
                  }
                </Select>
              )}
          </FormItem>
        </Col>,
        <Col span={6} key={4}>
          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label={`通用名称`}>
            {getFieldDecorator(`geName`)(
              <Input/>
            )}
          </FormItem>
        </Col>,
        <Col span={6} key={5}>
          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}}  label={`供应商`}>
            {getFieldDecorator(`fOrgName`)(
              <Input/>
            )}
          </FormItem>
        </Col>, 
        <Col span={6} key={6}>
          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label={`生产商`}>
            {getFieldDecorator(`productName`)(
              <Input/>
            )}
          </FormItem>
        </Col>,
        <Col span={6} key={7}>
          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}}  label={`注册证号`}>
            {getFieldDecorator(`registerNo`)(
              <Input/>
            )}
          </FormItem>
        </Col>,
        <Col span={6} key={8}>
          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}}  label={`产品名称`}>
            {getFieldDecorator(`materialName`)(
              <Input />
            )}
          </FormItem>
        </Col>,
        <Col span={6} key={9}>
          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label={`规格`}>
            {getFieldDecorator(`spec`)(
              <Input/>
            )}
          </FormItem>
        </Col>,
        <Col span={6} key={10}>
          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label={`型号`}>
            {getFieldDecorator(`fmodel`)(
              <Input/>
            )}
          </FormItem>
        </Col>,
        <Col span={6} key={12}>
          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label={`送货方式`}>
            {getFieldDecorator(`shfs`,{
              initialValue: ""
            })(
              <Select>
                <Option key={-1} value="">全部</Option>
                {
                    this.state.shfsData.map((item,index) => {
                    return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                    })
                }
              </Select>
            )}
          </FormItem>
        </Col>,
        <Col span={6} key={13}>
          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label={`结算方式`}>
            {getFieldDecorator(`settleType`,{
              initialValue: ""
            })(
              <Select>
                <Option key={-1} value="">全部</Option>
                {
                    this.state.jsfsData.map((item,index) => {
                    return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                    })
                }
              </Select>
            )}
          </FormItem>
        </Col>,
        <Col span={6} key={14}>
          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label={`一物一码`}>
            {getFieldDecorator(`qrFlag`,{
               initialValue:""
            })(
              <Select>
                <Option key={-1} value="">全部</Option>
                <Option key={0} value="00">否</Option>
                <Option key={1} value="01">是</Option>
              </Select>
            )}
          </FormItem>
        </Col>
      ];
      const expand = this.state.expand;
      const shownCount = expand ? children.length : 4;
      return (
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.search}
        >
          <Row>
            {children.slice(0, shownCount)}
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                {expand ? '关闭' : '展开'} <Icon type={expand ? 'up' : 'down'} />
              </a>
            </Col>
          </Row>
        </Form>
      )
    }
  }

export default SearchForm;