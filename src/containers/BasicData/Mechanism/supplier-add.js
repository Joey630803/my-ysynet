/**
 * @file 添加供应商
 */
import React from 'react';
import { Breadcrumb, Form, message,Input, Select,Button,DatePicker, Upload, Icon, Cascader, BackTop} from 'antd';
import { Link,hashHistory } from 'react-router';
import querystring from 'querystring';
import { pathConfig,nvl ,CommonData,City,FetchPost} from 'utils/tools';
import FetchSelect from 'component/FetchSelect';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;


const rangeConfig = {
  rules: [{ type: 'array', required: true, message: '请选择时间' }],
};

class AddForm extends React.Component {
   state = {
    cOrporationOptions: [],
    citys:[],
    yyzzfiles:[],
    jgdmzfiles:[],
    swdjfiles:[],
    jyxkfiles:[],
    dirtyClick: false
  };
   beforeUpload = (file) => {
      const type = file.type === 'image/jpeg'|| file.type === 'image/png'|| file.type === 'image/bmp';
      if (!type) {
        message.error('您只能上传image/jpeg、png、bmp!');
      }
      const isLt5M = file.size / 1024 / 1024  < 5;
      if (!isLt5M) {
        message.error('图片不能大于 5MB!');
      }
      return type && isLt5M;
    }
   handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
         fieldsValue.orgType = '02';
         fieldsValue.parentOrgid = this.state.parentOrgid;
         fieldsValue.tfProvince = fieldsValue['residence'][0];
         fieldsValue.tfCity = fieldsValue['residence'][1];
         fieldsValue.tfDistrict = fieldsValue['residence'][2];
        //提交数据
        //营业执照有效期
        const yyzzfirstTimeValue = fieldsValue['yyzzfirstTimeRangeValue'];
        //医疗机构执业许可证有效期
        const jyxkfirstTimeValue = fieldsValue['jyxkfirstTimeRangeValue'];
      
        let values;
        values = {
            ...fieldsValue,
            'yyzzfirstTime': nvl(yyzzfirstTimeValue[0].format('YYYY-MM-DD'),''),
            'yyzzlastTime':  nvl(yyzzfirstTimeValue[1].format('YYYY-MM-DD'),''),
            'jyxkfirstTime': nvl(jyxkfirstTimeValue[0].format('YYYY-MM-DD'),''),
            'jyxklastTime':  nvl(jyxkfirstTimeValue[1].format('YYYY-MM-DD'),''),
            'gysYyzzFile' : nvl(fieldsValue['gysYyzzFile']['fileList'][0],''),
            'jyxkFile' : nvl(fieldsValue['jyxkFile']['fileList'][0],''),
            'jgdmzFile' : fieldsValue['jgdmzFile'] === undefined ? null : fieldsValue['jgdmzFile']['fileList'][0],
            'swdjFile' : fieldsValue['swdjFile'] === undefined ? null : fieldsValue['swdjFile']['fileList'][0],
          };
          //传一张必填图片删除后验证不能为空
          if(values['gysYyzzFile'] === ""){
            return message.error('供应商营业执照不能为空！')
          }
          if(values['jyxkFile'] === ""){
            return message.error('医疗器械经营企业许可证不能为空！')
          }
        this.setState({dirtyClick: true});
        fetch(pathConfig.ADDORG_URL, {
            method: 'post',
            mode:'cors',
            credentials: 'include',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify(values)
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
           this.setState({dirtyClick: false});
          if(data.status){
            hashHistory.push({pathname:'basicData/mechanism',query:{activeKey:'supplier'}});
            message.success("供应商添加成功!");
          }
          else{
            message.error(data.msg);
          }
        })
        .catch(e => console.log("Oops, error", e))
        
      }
    });
  }
   componentWillMount = () => {
     CommonData('CORPORATION_TYPE', (data) => {
       this.setState({cOrporationOptions:data})
     })
     City((data) => {
       this.setState({citys:data})
     })
  }
  render() {    
    const { getFieldDecorator } = this.props.form;
    const { getFieldValue } = this.props.form;
    const { setFieldsValue } = this.props.form;
    const cOrporationData =this.state.cOrporationOptions;
    const citysData = this.state.citys;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 9 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    };
     const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <BackTop>
          <div className="ant-back-top-inner">TOP</div>
        </BackTop>
        <FormItem
          {...formItemLayout}
          label="供应商名称:"
          hasFeedback
        >
          {getFieldDecorator('orgName', {
              rules: [{ required: true, message: '请输入医疗机构名称!' },
                      {validator: (rule, value, callback) => {
                            //验证机构名称唯一性
                            FetchPost(pathConfig.ORGNAMEEXIST_URL,querystring.stringify({orgName:value}))
                            .then(response => {
                              console.log(response);
                              return response.json();
                            })
                            .then(data => {
                              if(data.status){
                                callback();
                                return;
                              }
                              callback('医疗机构重复，请重新输入');
                            })
                            .catch(e => console.log("Oops, error", e))
                            
                            }},
                      {max:50, message:'字符长度不能超过50'}],
            })(
              <Input />
            )}
        </FormItem>
    
        <FormItem
          {...formItemLayout}
          label="简称:"
        >
          {getFieldDecorator('orgAlias',{
            rules:[{max:50, message:'字符长度不能超过50'}]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="机构代码:"
          hasFeedback
        >
           {getFieldDecorator('orgCode', {
            rules: [{ required: true, message: '请输入机构代码!' },
            {validator: (rule, value, callback) => {
                            //验证机构代码唯一性
                            FetchPost(pathConfig.ORGCODEEXIST_URL,querystring.stringify({orgCode:value}))
                            .then(response => {
                              console.log(response);
                              return response.json();
                            })
                            .then(data => {
                              if(data.status){
                                callback();
                                return;
                              }
                              callback('机构代码重复，请重新输入');
                            })
                            .catch(e => console.log("Oops, error", e))
                            
                            }},
            {max:50, message:'字符长度不能超过50'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="省市区:"
        >
          {getFieldDecorator('residence', {
            initialValue: ['湖北', '武汉', '江汉区'],
            rules: [{ type: 'array' },{ required: true, message: '请选择省市区!' }],
          })(
            <Cascader  options={citysData}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="状态:"
        >
           {getFieldDecorator('fstate',{
              initialValue:'01',
           })(
              <Select  style={{ width: 120 }}>
              <Option value="01">正常</Option>
              <Option value="00">停业</Option>
            </Select>
           )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="上级单位:"
        >
           <FetchSelect  ref='fetchs' url={pathConfig.SEARCHPARORG_URL} 
                  cb={(value) => this.setState({parentOrgid: value})}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="下级单位:"
        >
          {getFieldDecorator('flag', {
              rules: [
                { required: true, message: '请选择下级单位' },
              ],
            })(
              <Select placeholder="请选择">
                <Option value="00">有</Option>
                <Option value="01">无</Option>
              </Select>
           )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="法人代表:"
        >
          {getFieldDecorator('legalMan',{
              rules: [{max:50, message: '字符长度不能超过50!' }]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="企业类型:"
        >
         {getFieldDecorator('corporationType', {
            })(
             <Select placeholder={'请选择'}>
                {
                  cOrporationData.map((item,index) => {
                      return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                    })
                }
              </Select>
           )}
          
        </FormItem>
        <FormItem
            {...formItemLayout}
              label="注册资本"
              hasFeedback
          >
            {getFieldDecorator('rmbAmount', {
              rules: [
              {pattern: /^\d+$/,message:'只能是数字'},
              {required: true, message: '请输入注册资本!' },
                   {validator: (rule, value, callback) => {
                              if(value<100000000000000){
                                
                                callback();
                                return;
                              }
                              callback('注册资本不能大于100000000000000，请重新输入');
                            }},
            ],
            })(
              <Input />
            )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="联系人:"
        >
         {getFieldDecorator('lxr',{
             rules: [{max:50, message: '字符长度不能超过50!' }]
         })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="联系电话:"
        >
          {getFieldDecorator('lxdh', {
            rules: [{required: true, message: '请输入手机号!' },
            {min:8, message: '联系电话最少8位!' },
            {pattern: /^\d+$/,message:'只能是数字'},
            {max:11, message: '联系电话最多11位!' }],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="详细地址:"
        >
          {getFieldDecorator('tfAddress',{
            rules:[{max:50, message:'字符长度不能超过50'}]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="备注:"
        >
         {getFieldDecorator('tfRemark',{
           rules:[{max:200, message:'字符长度不能超过200'}]
         })(
             <Input type="textarea" rows={4}/>
          )}
         
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="供应商营业执照:"
          extra="支持扩展名：jpg、png、bmp.."
        >
           {getFieldDecorator('gysYyzzFile', {
              rules: [{ required: true, message: '请上传供应商营业执照!'}]
            })(
           <Upload name="gysYyzzFile" listType="picture-card" 
                   onChange={(info)=>{
                    if (info.file.status === 'done') {
                        let fileList = getFieldValue('gysYyzzFile').fileList;
                        this.setState({ yyzzfiles:fileList });
                        setFieldsValue({'gysYyzzFile':fileList});
                      }
                    else if(info.file.status === 'removed'){
                        this.setState({yyzzfiles:[] });
                    }
                  }} 
                  beforeUpload={this.beforeUpload}
                  action={pathConfig.PICUPLAOD_URL}>
                 {this.state.yyzzfiles.length >= 1 ? "" : uploadButton}
            </Upload>
          )}
        </FormItem>
        <FormItem
            {...formItemLayout}
            label="营业执照有效期"
          >
          {getFieldDecorator('yyzzfirstTimeRangeValue', rangeConfig)(
            <RangePicker showTime format="YYYY-MM-DD"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="组织机构代码证:"
          extra="支持扩展名：jpg、png、bmp.."
        >
         {getFieldDecorator('jgdmzFile', {
            })(
           <Upload name="jgdmzFile" listType="picture-card" 
                  onChange={(info)=>{
                    if (info.file.status === 'done') {
                        let fileList = getFieldValue('jgdmzFile').fileList;
                        this.setState({jgdmzfiles:fileList });
                        setFieldsValue({'jgdmzFile':fileList});
                      }
                    else if(info.file.status === 'removed'){
                        this.setState({jgdmzfiles:[] });
                    }
                  }} 
               
                  beforeUpload={this.beforeUpload}
                  action={pathConfig.PICUPLAOD_URL}>
              {this.state.jgdmzfiles.length >= 1 ? "" : uploadButton}
            </Upload>
          )}
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="税务登记证:"
          extra="支持扩展名：jpg、png、bmp.."
        >
         {getFieldDecorator('swdjFile', {
            })(
           <Upload name="swdjFile" listType="picture-card" 
                   onChange={(info)=>{
                    if (info.file.status === 'done') {
                        let fileList = getFieldValue('swdjFile').fileList;
                        this.setState({swdjfiles:fileList });
                        setFieldsValue({'swdjFile':fileList});
                      }
                    else if(info.file.status === 'removed'){
                        this.setState({swdjfiles:[] });
                    }
                  }} 
                  beforeUpload={this.beforeUpload}
                  action={pathConfig.PICUPLAOD_URL}>
             {this.state.swdjfiles.length >= 1 ? "" : uploadButton}
            </Upload>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="医疗器械经营企业许可证:"
          extra="支持扩展名：jpg、png、bmp.."
        >
         {getFieldDecorator('jyxkFile', {
              rules: [{ required: true, message: '请上传医疗器械经营企业许可证!'}]
            })(
           <Upload name="jyxkFile" listType="picture-card" 
                  onChange={(info)=>{
                    if (info.file.status === 'done') {
                        let fileList = getFieldValue('jyxkFile').fileList;
                        this.setState({jyxkfiles:fileList });
                        setFieldsValue({'jyxkFile':fileList});
                      }
                    else if(info.file.status === 'removed'){
                        this.setState({jyxkfiles:[] });
                    }
                  }} 
                  beforeUpload={this.beforeUpload}
                  action={pathConfig.PICUPLAOD_URL}>
              {this.state.jyxkfiles.length >= 1 ? "" : uploadButton}
            </Upload>
          )}
        </FormItem>
         <FormItem
            {...formItemLayout}
            label="医疗器械经营企业许可证有效期"
          >
          {getFieldDecorator('jyxkfirstTimeRangeValue', rangeConfig)(
            <RangePicker showTime format="YYYY-MM-DD"/>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedHospitalAddForm = Form.create()(AddForm);
class SupplierAdd extends React.Component {
  render() {
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to={{pathname:'basicData/mechanism',query:{activeKey:'supplier'}}}>机构管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>新增供应商</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedHospitalAddForm/>
      </div>
    );
  }
}

module.exports = SupplierAdd;