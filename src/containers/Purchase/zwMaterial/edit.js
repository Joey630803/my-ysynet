/**
 * 编辑
 */
import React from 'react';
import { Form, Button, Input, Col, Row, Breadcrumb, Select,Modal,message } from 'antd';
import { Link ,hashHistory} from 'react-router';
import { fetchData,CommonData} from 'utils/tools';
import querystring from 'querystring';
import { purchase } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
class EditForm extends React.Component{
  state = {
    dirtyClick: false,
    unitData:[]
  }
  componentWillMount = () => {
     //单位
     CommonData('UNIT', (data) => {
      this.setState({unitData:data})
    })
  }
  //处理错误信息
  handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
    });
  }
  submitHandler = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({dirtyClick: true});
        const storageGuid = this.props.state.storageGuid;
        values.tenderMaterialGuid = this.props.state.tenderMaterialGuid;
        fetchData(purchase.UPDATEMATERIAL,querystring.stringify(values),(data) =>{
          this.setState({dirtyClick: false});
          if(data.status){
            hashHistory.push({pathname:'/purchase/zwMaterial',query:{storageGuid:storageGuid}});
            message.success("编辑成功!");
          }
          else{
            this.handleError(data.msg);
          }
        })
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    const { unitData } = this.state;

    return (
      <Form style={{marginTop: 32}} className='show-form' onSubmit={this.submitHandler}>
        <Row>
          <Col span={2}></Col>
          <Col span={8}>
            <Row>
              <Col key={1}>
              <FormItem {...formItemLayout} label={`产品编码`}>
                {
                  this.props.state.cpbm
                }
              </FormItem>
              </Col>
              <Col key={3}>
                <FormItem {...formItemLayout} label={`产品名称`}>
                {
                  this.props.state.materialName
                }
                </FormItem>
              </Col>
              <Col key={7}>
                <FormItem {...formItemLayout} label={`规格`}>
                {
                  this.props.state.spec
                }
                </FormItem>
              </Col>
              <Col key={8}>
                <FormItem {...formItemLayout} label={`型号`}>
                {
                  this.props.state.fmodel
                }
                </FormItem>
              </Col>
              <Col key={9}>
                <FormItem {...formItemLayout} label={`证件号`}>
                {
                  this.props.state.registerNo
                }
                </FormItem>
              </Col>
              <Col key={10}>
                <FormItem {...formItemLayout} label={`品牌`}>
                {
                  this.props.state.tfBrand
                }
                </FormItem>
              </Col>
              <Col key={11}>
                <FormItem {...formItemLayout} label={`生产商`}>
                {
                  this.props.state.produceName
                }
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col  key={2}>
                <FormItem {...formItemLayout} label={`最小单位`}>
                  {
                    this.props.state.leastUnit
                  }
                </FormItem>
              </Col>
              <Col  key={4}>
                <FormItem {...formItemLayout} label={`采购单位`}>
                  {getFieldDecorator('purchaseUnit', {
                        initialValue:this.props.state.purchaseUnit,
                        rules:[
                          {required:true,message:'请选择采购单位'}]
                        })(
                            <Select 
                            placeholder={'请选择'}  
                            style={{width:200}}
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                              <Option key={-1} value=''>请选择</Option>
                              {
                                unitData.map((item,index) => {
                                  return <Option key={index} value={item.TF_CLO_NAME}>{item.TF_CLO_NAME}</Option>
                                  })
                              }
                            </Select>
                    )}
                </FormItem>
              </Col>
              <Col key={5}>
                  <FormItem {...formItemLayout} label={' '} colon={false}>
                      {
                          getFieldDecorator(`pConversion`,{
                              initialValue:this.props.state.pConversion ? this.props.state.pConversion:'',
                              rules:[
                                  {pattern:/^[0-9]*[1-9][0-9]*$/,message:'只能是正整数'},
                                  {required:true,message:'请输入采购转换系数'}]
                          })(
                              <Input  addonBefore='1 采购单位 =' addonAfter='最小单位' disabled={this.props.state.pConversion?true:false}/>      
                          )
                      }
                  </FormItem>
              </Col>
              <Col key={6}>
                <FormItem {...formItemLayout} label={`采购价`}>
                    {
                        getFieldDecorator(`purchasePrice`,{
                            initialValue:this.props.state.purchasePrice?this.props.state.purchasePrice:'',
                            rules:[
                                {pattern:/^[0-9]+(.[0-9]{1,4})?$/,message:'请注意格式,最多4位小数'}
                            ]
                        })(
                            <Input addonBefore='人民币' addonAfter='元'/>
                        )
                    }
                </FormItem>
            </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={12} key={12} push={6}>
            <FormItem>
              <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      )
    }
}

const EditBox = Form.create()(EditForm);

class zwSuplierEdit extends React.Component {
  render() {
    return (
      <div>
         <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
          <Breadcrumb.Item><Link  to={{pathname:'/purchase/zwMaterial',query:{storageGuid:this.props.location.state.storageGuid}}}>总务物资</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
        <EditBox state={this.props.location.state}/>
      </div>
    )  
  }
}
module.exports = zwSuplierEdit;