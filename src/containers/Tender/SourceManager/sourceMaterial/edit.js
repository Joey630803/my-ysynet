import React from 'react';
import { Breadcrumb , Row, Col, Form, Input, Button, Select, message } from 'antd';
import { Link, hashHistory } from 'react-router';
import { CommonData,fetchData,PrivateData} from 'utils/tools';
import { tender } from 'api';
import querystring from 'querystring';
const FormItem = Form.Item;
const Option = Select.Option
class EditForm extends React.Component {
  state = {
    unitOptions: [],
    regOptions: [],
    attributeOptions: [],
    tips: false,
    dirtyClick: false
  }
  componentDidMount = () => {
     CommonData('UNIT', (data) => {
       this.setState({unitOptions: data})
     })
    //特殊属性
     PrivateData('GKATTRIBUTE', (data) => {
       this.setState({attributeOptions:data})
     })
      
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        this.setState({dirtyClick: true})
        values.tenderDetailGuid = this.props.data.tenderDetailGuid;
        console.log(`postData =>`, "供应关系产品编辑");
        fetchData(tender.MODIFY_TENDER,querystring.stringify(values),(data)=>{
        
          if(data.status){
            message.success('编辑成功!');
            hashHistory.push({
              pathname: '/tender/sourceManager/sourceMaterial/material',
              state: this.props.data
            })
          }else{
            message.error(data.msg);
          }
          this.setState({
            dirtyClick: false,
          });
       
        })
      
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const wrapperStyle = {
      labelCol: {span: 8},
      wrapperCol: {span: 16}
    }
    return (
      <Form onSubmit={this.handleSubmit} style={{marginTop: 20}}>
        <Row>
          <Col span={10} key={1}>
            <FormItem {...wrapperStyle} label={`产品名称`}>
              {
                getFieldDecorator(`materialName`, {
                  initialValue: this.props.data.materialName
                })(
                  <Input disabled={true}/>
                ) 
              }
            </FormItem>
          </Col>
          <Col span={10} key={2}>
            <FormItem {...wrapperStyle} label={`通用名称`}>
              {
                getFieldDecorator(`geName`, {
                  initialValue: this.props.data.geName
                })(
                <Input/>
                ) 
              }
            </FormItem>
          </Col>
          <Col span={10} key={3}>
            <FormItem {...wrapperStyle} label={`证件号`}>
              {
                getFieldDecorator(`registerNo`, {
                  initialValue: this.props.data.registerNo
                })(
                    <Input disabled={true}/>
                ) 
              }
            </FormItem>
          </Col>
          <Col span={10} key={4}>
            <FormItem {...wrapperStyle} label={`状态`}>
              {
                getFieldDecorator(`fstate`, {
                  initialValue: this.props.data.fstate,
                  rules: [
                    { required: true, message: '请选择状态'}
                  ],
                })(
                  <Select>
                    <Option value={'00'}>停用</Option>
                    <Option value={'01'}>启用</Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={10} key={5}>
            <FormItem {...wrapperStyle} label={`型号`}>
              {
                getFieldDecorator(`fmodel`, {
                  initialValue: this.props.data.fmodel
                })(
                <Input disabled={true}/>
                ) 
              }
            </FormItem>
          </Col>
          <Col span={10} key={6}>
            <FormItem {...wrapperStyle} label={`招标价`}>
              {
                getFieldDecorator(`tenderPrice`, {
                  initialValue: this.props.data.tenderPrice,
                  rules: [
                    { required: true, message: '请输入招标价'}
                  ]
                })(
                <Input/>
                ) 
              }
            </FormItem>
          </Col>
          <Col span={10} key={7}>
            <FormItem {...wrapperStyle} label={`规格`}>
              {
                getFieldDecorator(`spec`, {
                  initialValue: this.props.data.spec
                })(
                <Input disabled={true}/>
                ) 
              }
            </FormItem>
          </Col>
          <Col span={10} key={8}>
            <FormItem {...wrapperStyle} label={`招标单位`}>
              {
                getFieldDecorator(`tenderUnit`, {
                  initialValue: this.props.data.tenderUnit,
                  rules: [
                    { required: true, message: '请输入招标单位'}
                  ]
                })(
                   <Select>
                      { 
                        this.state.unitOptions.map((item, index) => 
                          <Option key={index} value={item.TF_CLO_NAME}>{item.TF_CLO_NAME}</Option>)
                      }
                    </Select>
                )
              }
            </FormItem>
            
          </Col>
          <Col span={10} key={9}>
            <FormItem {...wrapperStyle} label={`REF`}>
              {
                getFieldDecorator(`ref`, {
                  initialValue: this.props.data.ref
                })(
                <Input disabled={true}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={10} key={10}>
          <FormItem {...wrapperStyle} label={`单位换算`}>
              {
                getFieldDecorator(`conversion`, {
                   rules: [
                    { required: true, message: '请输入单位换算'}
                  ],
                  initialValue: this.props.data.conversion
                })(
                  <Input addonBefore="1招标单位 =" disabled={this.props.data.conversion>0 ? true : false} addonAfter="*最小单位"/>           
                  )
              }
            </FormItem>
          </Col>
          <Col span={10} key={11}>
          <FormItem {...wrapperStyle} label={`最小单位`}>
              {
                getFieldDecorator(`leastUnit`, {
                  initialValue: this.props.data.leastUnit
                })(
                <Input disabled={true}/>
                ) 
              }
            </FormItem>

          </Col>
          <Col span={10} key={12}>
            <FormItem {...wrapperStyle} label={`产品材质`}>
              {
                getFieldDecorator(`tfTexture`, {
                  initialValue: this.props.data.tfTexture
                })(
                <Input/>
                ) 
              }
            </FormItem>
          </Col>
          <Col span={10} key={13}>
              <FormItem {...wrapperStyle} label={`品牌`}>
              {
                getFieldDecorator(`tfBrand`, {
                  initialValue: this.props.data.tfBrand
                })(
                <Input disabled={true}/>
                ) 
              }
            </FormItem>
          </Col>
          <Col span={10} key={14} >
          <FormItem {...wrapperStyle} label={`包装材质`}>
              {
                getFieldDecorator(`packingTexture`, {
                  initialValue: this.props.data.packingTexture
                })(
                <Input/>
                ) 
              }
            </FormItem>
           
          </Col>

          <Col span={10} key={18}>
            <FormItem {...wrapperStyle} label={`生产商`}>
              {
                getFieldDecorator(`produceName`, {
                  initialValue: this.props.data.produceName
                })(
                   <Input disabled={true}/>
                ) 
              }
            </FormItem>
          </Col>
          <Col span={10} key={15}>
            <FormItem {...wrapperStyle} label={`包装规格`}>
              {
                getFieldDecorator(`tfPacking`, {
                  initialValue: this.props.data.tfPacking
                })(
                <Input/>
                ) 
              }
            </FormItem>
          </Col>
         
          <Col span={10} key={16}>
              <FormItem {...wrapperStyle} label={`供应商`}>
              {
                getFieldDecorator(`fOrgName`, {
                  initialValue: this.props.data.fOrgName
                })(
                <Input disabled={true}/>
                )
              }
            </FormItem>
          </Col>
          <Col span={10} key={17}>
              <FormItem  {...wrapperStyle} label={`特殊属性`}>
              {
                  getFieldDecorator(`attributeId`, {
                    initialValue:this.props.data.attributeId
              })(
                  <Select placeholder="请选择">
                  { 
                      this.state.attributeOptions.map((item, index) => 
                      <Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
                  }
                  </Select>
              )
              }
              </FormItem>
          </Col>
     
   
          <Col span={24} style={{textAlign: 'center'}}>
               <Button type="primary" htmlType="submit" loading={this.state.dirtyClick}>提交</Button>
          </Col>
        </Row>
      </Form>    
    )
  }
}

const WrappedDetailsForm = Form.create()(EditForm);

class ProductEdit extends React.Component {
  render () {
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item><Link  to={{pathname:'/tender/sourceManager'}}>供应管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={{pathname:'/tender/sourceManager/sourceMaterial/material',state:this.props.location.state}}>产品</Link></Breadcrumb.Item>
          <Breadcrumb.Item>
            编辑
          </Breadcrumb.Item>
        </Breadcrumb>
        <WrappedDetailsForm data={this.props.location.state}/>
      </div>
    )
  }
}

module.exports = ProductEdit;