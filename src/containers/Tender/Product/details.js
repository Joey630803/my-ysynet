import React from 'react';
import { Breadcrumb , Row, Col, Form, Input, 
         Icon, Button, Select, Tag, message } from 'antd';
import { Link, hashHistory } from 'react-router';
import { CommonData,  } from 'utils/tools';
import { tender } from 'api';
import querystring from 'querystring';
const FormItem = Form.Item;
const Option = Select.Option
class DetailsForm extends React.Component {
  state = {
    unitOptions: [],
    regOptions: [],
    attributeOptions: [],
    tips: false,
    dirtyClick: false
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({dirtyClick: true})
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        values.tenderDetailGuid = this.props.data.tenderDetailGuid;
        //values.certGuid = this.props.data.certGuid;
        console.log(`postData =>`, values);
        fetch(tender.MODIFY_TENDER, {
          method: 'post',
          mode:'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: querystring.stringify(values)
        })
        .then(res => {
          this.setState({dirtyClick: false})
          return res.json();
        })
        .then(data => {
          console.log('响应数据 =>', data);
          if (data.status) {
            message.success('编辑成功!');
            hashHistory.push({
              pathname: '/tender/product'
            })
          } else {
            message.error(data.msg);
          }
        })
        .catch(e => console.log("Oops, error", e))
      }
    })
  }
  componentDidMount = () => {
     CommonData('UNIT', (data) => {
       this.setState({unitOptions: data})
     })
     CommonData('GKATTRIBUTE', (data) => {
       this.setState({attributeOptions: data})
     }, {orgId: this.props.data.R_ORG_ID, type: 'GKATTRIBUTE'}, tender.PRIVATE_DATA)
    fetch(tender.REGISTER_LIST, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({searhName: '', fitemid: this.props.data.fitemid})
    })
    .then(res => res.json())
    .then(data => {
      this.setState({
        regOptions: data
      })
    })
    .catch(e => console.log("Oops, error", e))
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
          <Col span={8} key={1}>
            <FormItem {...wrapperStyle} label={`产品名称`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`materialName`, {
                  initialValue: this.props.data.materialName
                })(
                  <Input disabled={true}/>
                ) : this.props.data.materialName
              }
            </FormItem>
          </Col>
          <Col span={8} key={2}>
            <FormItem {...wrapperStyle} label={`耗材分类`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`instrumentName`, {
                  initialValue: this.props.data.instrumentName
                })(
                  <Input disabled={true}/>
                ) : this.props.data.instrumentName
            }
            </FormItem>
          </Col>
          <Col span={8} key={3}>
            <FormItem {...wrapperStyle} label={`生产商` }>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`produceName`, {
                  initialValue: this.props.data.produceName
                })(
                <Input disabled={true}/>
                ) : this.props.data.produceName
              }
            </FormItem>
          </Col>
          <Col span={8} key={4}>
            <FormItem {...wrapperStyle} label={`规格`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`spec`, {
                  initialValue: this.props.data.spec
                })(
                <Input disabled={true}/>
                ) : this.props.data.spec
              }
            </FormItem>
          </Col>
          <Col span={8} key={5}>
            <FormItem {...wrapperStyle} label={`型号`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`fmodel`, {
                  initialValue: this.props.data.fmodel
                })(
                <Input disabled={true}/>
                ) : this.props.data.fmodel
              }
            </FormItem>
          </Col>
          <Col span={8} key={6}>
            <FormItem {...wrapperStyle} label={`供应商`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`fOrgName`, {
                  initialValue: this.props.data.fOrgName
                })(
                <Input disabled={true}/>
                ) : this.props.data.fOrgName
              }
            </FormItem>
          </Col>
          <Col span={8} key={7}>
            <FormItem {...wrapperStyle} label={`资质有效期`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`lastTime`, {
                  initialValue: this.props.data.lastTime
                })(
                <Input disabled={true}/>
                ) : this.props.data.lastTime
              }
            </FormItem>
          </Col>
          <Col span={8} key={8}>
            <FormItem {...wrapperStyle} label={`最小单位`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`leastUnit`, {
                  initialValue: this.props.data.leastUnit
                })(
                <Input disabled={true}/>
                ) : this.props.data.leastUnit
              }
            </FormItem>
          </Col>
          <Col span={8} key={9}>
            <FormItem {...wrapperStyle} label={`REF`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`ref`, {
                  initialValue: this.props.data.ref
                })(
                <Input disabled={true}/>
                ) : this.props.data.ref
              }
            </FormItem>
          </Col>
          <Col span={8} key={10}>
            <FormItem {...wrapperStyle} label={`品牌`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`tfBrand`, {
                  initialValue: this.props.data.tfBrand
                })(
                <Input disabled={true}/>
                ) : this.props.data.tfBrand
              }
            </FormItem>
          </Col>
          <Col span={8} key={14}>
            <FormItem {...wrapperStyle} label={`通用名称`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`geName`, {
                  initialValue: this.props.data.geName
                })(
                <Input/>
                ) : this.props.data.geName
              }
            </FormItem>
          </Col>
          <Col span={8} key={12}>
            <FormItem {...wrapperStyle} label={`证件号`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`registerNo`, {
                  rules: [
                    { required: true, message: '请输入证件号'}
                  ],
                  initialValue: this.props.data.certGuid
                })(
                    <Select>
                      { 
                        this.state.regOptions.map((item, index) => 
                        <Option key={index} value={item.value}>{item.text}</Option>)
                      }
                    </Select>
                ) : this.props.data.registerNo
              }
            </FormItem>
          </Col>
          <Col span={8} key={11}>
            <FormItem {...wrapperStyle} label={`状态`}>
              {
                this.props.data.isEdit ?
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
                ) : ( this.props.data.fstate === '00' ? '停用' : '启用')
              }
            </FormItem>
          </Col>
          <Col span={6} key={13} >
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 13}} label={`条码`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`fbarcode`, {
                  initialValue: this.props.data.fbarcode,
                  rules: [{validator: (rule, value, cb) => {
                    this.setState({tips: false});
                    if(value !== '') {
                      fetch(tender.FBARCODE_ISONLY, {
                        method: 'post',
                        mode:'cors',
                        credentials: 'include',
                        headers: {
                          'Content-Type':'application/x-www-form-urlencoded'
                        },
                        body: querystring.stringify({fbarCode: value, tenderDetailGuid: this.props.data.tenderDetailGuid})
                      })
                      .then(res => res.json())
                      .then(data => {
                        if (!data.status) {
                          this.setState({tips: true})
                        } 
                      })
                    }
                    cb();
                  }}]
                })(
                    <Input/>
                ) : this.props.data.fbarcode
              } 
            </FormItem>
          </Col>
          <Col span={1} style={{paddingTop: 6, paddingLeft: 2}}>
            {
              this.props.data.isEdit 
              ? <a 
                  onClick={() => this.props.form.setFieldsValue({
                    'fbarcode': this.props.data.fbarcodeMaterial
                  })}>
                  <Icon type='reload'/>重置
                </a> 
              : null
            }
          </Col>
          <Col span={1} style={{padding: 5}}>
            { this.state.tips ? <Tag color="#ffbf00">已使用</Tag> : null}
          </Col>
          <Col span={8} key={18}>
            <FormItem {...wrapperStyle} label={`骨科产品属性`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`attributeId`, {
                  initialValue: this.props.data.attributeId
                })(
                  <Select>
                    { 
                      this.state.attributeOptions.map((item, index) => 
                      <Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
                    }
                  </Select>
                ) : this.props.data.attributeName
              }
            </FormItem>
          </Col>
          <Col span={8} key={15}>
            <FormItem {...wrapperStyle} label={`招标单位`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`tenderUnit`, {
                  initialValue: this.props.data.tenderUnit
                })(
                <Select>
                      { 
                        this.state.unitOptions.map((item, index) => 
                          <Option key={index} value={item.TF_CLO_NAME}>{item.TF_CLO_NAME}</Option>)
                      }
                    </Select>
                ) : this.props.data.tenderUnit
              }
            </FormItem>
          </Col>
         
          <Col span={8} key={19}>
            <FormItem {...wrapperStyle} label={`产品材质`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`tfTexture`, {
                  initialValue: this.props.data.tfTexture
                })(
                <Input/>
                ) : this.props.data.tfTexture
              }
            </FormItem>
          </Col>
          <Col span={8} key={16}>
            <FormItem {...wrapperStyle} label={`招标价`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`tenderPrice`, {
                  initialValue: this.props.data.tenderPrice
                })(
                <Input/>
                ) : this.props.data.tenderPrice
              }
            </FormItem>
          </Col>
        
          <Col span={8} key={20}>
            <FormItem {...wrapperStyle} label={`包装材质`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`packingTexture`, {
                  initialValue: this.props.data.packingTexture
                })(
                <Input/>
                ) : this.props.data.packingTexture
              }
            </FormItem>
          </Col>
          <Col span={8} key={17}>
            <FormItem {...wrapperStyle} label={`单位换算`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`conversion`, {
                  initialValue: this.props.data.conversion
                })(
                  <Input disabled={this.props.data.conversion>0 ? true : false} addonBefore="1招标单位 =" addonAfter="*最小单位"/>              
                  ) : this.props.data.conversion
              }
            </FormItem>
          </Col>
          <Col span={8} key={21}>
            <FormItem {...wrapperStyle} label={`包装规格`}>
              {
                this.props.data.isEdit ?
                getFieldDecorator(`tfPacking`, {
                  initialValue: this.props.data.tfPacking
                })(
                <Input/>
                ) : this.props.data.tfPacking
              }
            </FormItem>
          </Col>
          <Col span={24} style={{textAlign: 'center'}}>
            {
              this.props.data.isEdit 
              ?
               <Button type="primary" htmlType="submit" loading={this.state.dirtyClick}>提交</Button>
              : null
            }
          </Col>
        </Row>
      </Form>    
    )
  }
}

const WrappedDetailsForm = Form.create()(DetailsForm);

class ProductDetails extends React.Component {
  render () {
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={'/tender/product'}>招标产品</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            { this.props.location.state.isEdit ? '编辑' : '详情' }
          </Breadcrumb.Item>
        </Breadcrumb>
        <WrappedDetailsForm data={this.props.location.state}/>
      </div>
    )
  }
}

module.exports = ProductDetails;