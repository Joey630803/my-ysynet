import React from 'react';
import { Form, Button, Input, Col, Row, Breadcrumb, Select,Modal,message,Cascader } from 'antd';
import { Link ,hashHistory} from 'react-router';
import { fetchData,City,nvl} from 'utils/tools';
import querystring from 'querystring';
import { tender,purchase } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
class EditForm extends React.Component{
  state = {
    dirtyClick: false,
    citys:[],
    storageOptions:[]
  }
  componentWillMount = () => {
    fetchData(tender.FINDTOPSTORAGEBYUSER,{},(data)=>{
        if(data.result.length > 0){
          this.setState({storageOptions: data.result});
        }
    })

    City((data) => {
      this.setState({citys:data})
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
        values.orgId = this.props.state.orgId;
        values.sourceGuid = this.props.state.sourceGuid;
        values.tfProvince =  nvl(values['residence'][0],'') ;
        values.tfCity =  nvl(values['residence'][1],'') ;
        values.tfDistrict = nvl(values['residence'][2],'');
        fetchData(purchase.INSERTORUPDATEGENERALORGINFO,querystring.stringify(values),(data) =>{
          this.setState({dirtyClick: false});
          if(data.status){
            hashHistory.push('/purchase/zwSupplier');
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
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
    };
    const citysData = this.state.citys;
    return (
      <Form style={{marginTop: 32}} className='show-form' onSubmit={this.submitHandler}>
        <Row>
        <Col span={20} key={1}>
            <FormItem {...formItemLayout} label={`库房`}>
              {getFieldDecorator('storageGuid', {
                rules: [{ required: true, message: '请选择库房!' }],
                initialValue:this.props.state.storageGuid
              })(
                <Select
                placeholder="请选择"
                >
                  {
                    this.state.storageOptions.map(
                      (item, index) => <Option key={index} value={item.value}>{item.text}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={20} key={2}>
            <FormItem {...formItemLayout} label={`供应商名称`}>
              {getFieldDecorator('orgName', {
                rules: [{ required: true, message: '请输入供应商名称' }],
                initialValue:this.props.state.orgName
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={20} key={3}>
            <FormItem {...formItemLayout} label={`状态`}>
              {getFieldDecorator('fstate', {
                rules: [{ required: true, message: '请选择状态' }],
                initialValue:this.props.state.fstate
              })(
                <Select style={{ width: 120 }}>
                  <Option value="01">启用</Option>
                  <Option value="00">停用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={20} key={4}>
            <FormItem {...formItemLayout} label={`编号`}>
              {getFieldDecorator('supplierCode', {
                initialValue:this.props.state.supplierCode
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={20} key={5}>
            <FormItem {...formItemLayout} label={`省市区`}>
                {getFieldDecorator('residence', {
                  initialValue: [this.props.state.tfProvince, this.props.state.tfCity, this.props.state.tfDistrict],
                  rules: [{ type: 'array' },{ required: true, message: '请选择省市区!' }],
                })(
                  <Cascader  options={citysData}/>
                )}
            </FormItem>
          </Col>
          <Col span={20} key={6}>
            <FormItem {...formItemLayout} label={`联系人`}>
              {getFieldDecorator('lxr', {
                rules: [
                    {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
                    {max:20,message:'字符长度不能超过20'}],
                initialValue:this.props.state.lxr
                })(
                  <Input />
              )}
            </FormItem>
          </Col>
          <Col span={20} key={7}>
            <FormItem {...formItemLayout} label={`联系电话`}>
               {getFieldDecorator('lxdh', {
                  rules: [{pattern: /^\d+$/,message:'只能是数字'}],
                  initialValue:this.props.state.lxdh
                })(
                  <Input />
                )}
            </FormItem>
          </Col>
          <Col span={10} key={8} push={4}>
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
          <Breadcrumb.Item><Link to='/purchase/zwSupplier'>总务供应商</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
        <EditBox state={this.props.location.state}/>
      </div>
    )  
  }
}
module.exports = zwSuplierEdit;