import React from 'react';
import { Layout,Form, message,Input,Radio, DatePicker,Select,Cascader,Upload, Icon, Row, Col, Checkbox, Button } from 'antd';
import querystring from 'querystring';
import { pathConfig,CommonData,nvl ,City,FetchPost} from 'utils/tools';
import { roles, pattern } from 'utils/validate';
import { hashHistory } from 'react-router';

const FormItem = Form.Item;
const Option = Select.Option;
const {Header,Content} = Layout;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;


const rangeConfig = {
  rules: [{ type: 'array', required: true, message: '请选择时间' }],
};

class RegistrationForm extends React.Component {
  state = {
    radioValue: '01',
    hLevelOptions: [],
    cOrporationOptions: [],
    hPropertyOptions: [],
    citys:[],
    gysYyzzfiles:[],
    zyxkfiles:[],
    jyxkfiles:[],
    jgdmzfiles:[],
    swdjfiles:[],
    yyYyzziles:[],
    dirtyClick: false
  };
  componentDidMount = () => {
      CommonData('HOSPITAL_LEVEL', (data) => {
       this.setState({hLevelOptions:data})
     })

     CommonData('CORPORATION_TYPE', (data) => {
       this.setState({cOrporationOptions:data})
     })

     CommonData('HOSPITAL_PROPERTY', (data) => {
       this.setState({hPropertyOptions:data})
     })

     City((data) => {
       this.setState({citys:data})
     })
  }

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
         fieldsValue.orgType = this.state.radioValue;
         fieldsValue.tfProvince = fieldsValue['residence'][0];
         fieldsValue.tfCity = fieldsValue['residence'][1];
         fieldsValue.tfDistrict = fieldsValue['residence'][2];
        //提交数据
        //营业执照有效期
        const yyzzfirstTimeValue = fieldsValue['yyzzfirstTimeRangeValue'];
        //医疗机构执业许可证有效期
        const zyxkfirstTimeValue = fieldsValue['zyxkfirstTimeRangeValue'];
        //医疗器械经营企业许可证有效期
        const jyxkfirstTimeValue = fieldsValue['jyxkfirstTimeRangeValue'];
        let values;
        if(this.state.radioValue==='01'){
           values = {
            ...fieldsValue,
            'yyzzfirstTime': nvl(yyzzfirstTimeValue[0].format('YYYY-MM-DD'),''),
            'yyzzlastTime':  nvl(yyzzfirstTimeValue[1].format('YYYY-MM-DD'),''),
            'zyxkfirstTime': nvl(zyxkfirstTimeValue[0].format('YYYY-MM-DD'),''),
            'zyxklastTime':  nvl(zyxkfirstTimeValue[1].format('YYYY-MM-DD'),''),
            'yyYyzzFile' : nvl(fieldsValue['yyYyzzFile']['fileList'][0],''),
            'zyxkFile' : nvl(fieldsValue['zyxkFile']['fileList'][0],''),
          };
           //传一张必填图片删除后验证不能为空
          if(values['yyYyzzFile'] === ""){
            return message.error('医疗机构营业执照不能为空！')
          }
          if(values['zyxkFile'] === ""){
            return message.error('医疗机构执业许可证不能为空！')
          }
          
        }
        else{
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
         
        }
        this.setState({dirtyClick: true});
        fetch(pathConfig.REGISTER_URL, {
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
            hashHistory.push('/login');
            message.success("注册成功!");
          }
          else{
            message.error(data.msg);
          }
        })
        .catch(e => console.log("Oops, error", e))
        
      }
    });
  }
  //RadioGroup onChange事件
  onChange = (e) => {
      this.setState({
          radioValue: e.target.value,
          gysYyzzfiles:[],
          zyxkfiles:[],
          jyxkfiles:[],
          jgdmzfiles:[],
          swdjfiles:[],
          yyYyzziles:[]
      });
  }

 
  render() {
   
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 7,
        },
      },
    };
   const { getFieldDecorator } = this.props.form;
   const { getFieldValue } = this.props.form;
   const { setFieldsValue } = this.props.form;
   const citysData = this.state.citys;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
   
    //获取医疗机构form
   function getMechanismForm(e){
     const hospitalLevelData = e.state.hLevelOptions;
     const hPropertyData = e.state.hPropertyOptions;
      return (
        <div>
           <FormItem
            {...formItemLayout}
            label="医疗机构营业执照:"
            extra="支持扩展名：jpg、png、bmp.."
          >
             {getFieldDecorator('yyYyzzFile', {
                rules: [{ required: true, message: '请上传营业执照!'}]
              })(
                <Upload name="yyYyzzFile" 
                        listType="picture-card" 
                          onChange={(info)=>{
                            if (info.file.status === 'done') {
                                let fileList = getFieldValue('yyYyzzFile').fileList;
                                e.setState({yyYyzziles:fileList });
                                setFieldsValue({'yyYyzzFile':fileList});
                              }
                              else if(info.file.status === 'removed'){
                                e.setState({yyYyzziles:[] });
                              }
                          }} 
                        beforeUpload={e.beforeUpload}
                        action={pathConfig.PICUPLAOD_URL}>
                    {
                      e.state.yyYyzziles.length >= 1 ? "" : uploadButton
                      }
                </Upload>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="医疗机构执业许可证:"
            extra="支持扩展名：jpg、png、bmp.."
          >
              {getFieldDecorator('zyxkFile', {
                rules: [{ required: true, message: '医疗机构执业许可证!'}],
              })(
                <Upload name="zyxkFile" 
                        listType="picture-card"
                         onChange={(info)=>{
                            if (info.file.status === 'done') {
                                let fileList = getFieldValue('zyxkFile').fileList;
                                e.setState({ zyxkfiles:fileList });
                                setFieldsValue({'zyxkFile':fileList});
                              }
                              else if(info.file.status === 'removed'){
                                e.setState({zyxkfiles:[] });
                              }
                          }} 
                        beforeUpload={e.beforeUpload}
                        action={pathConfig.PICUPLAOD_URL}>
                   {e.state.zyxkfiles.length >= 1 ? "" : uploadButton
                    
                   }
                </Upload>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="医疗机构执业许可证有效期"
            hasFeedback
          >
            {getFieldDecorator('zyxkfirstTimeRangeValue', rangeConfig)(
              <RangePicker showTime format="YYYY-MM-DD"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="类别"
          >
            {getFieldDecorator('hospitalProperty', {
           })(
             <Select placeholder={'请选择'}>
              {
                hPropertyData.map((item,index) => {
                  return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                })
              }
            </Select>
           )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="等级"
          >
          {getFieldDecorator('hospitalLevel', {
           })(
            <Select placeholder={'请选择'}>
              {
                hospitalLevelData.map((item,index) => {
                  return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                })
              }
            </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="纳税人识别号"
          >
            {getFieldDecorator('taxNo',{
              rules:[{max:50, message:'字符长度不能超过50'}]
            })(
               <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="开户银行"
          >
            {getFieldDecorator('tfBank',{
              rules:[{max:50, message:'字符长度不能超过50'}]
            })(
               <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="银行卡号"
          >
           {getFieldDecorator('bankAccount',{
              rules:[{max:50, message:'字符长度不能超过50'}]
            })(
               <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户协议"
          >
               {getFieldDecorator('agreementHospital', {
                  rules: [{ required: true, message: '请勾选!'},
                        {validator: (rule, value, callback) => {
                          if(!value){
                            callback('请同意协议');
                            return;
                          }
                          callback();
                        }}
                  ],
                })(
                  <Checkbox>我同意 <a>协议</a></Checkbox>
                )}
          </FormItem>
        </div>
      )
    }
    //获取供应商form

    function getSupplierForm(e){
      const cOrporationData =e.state.cOrporationOptions;
        return (
           <div>
                <FormItem
                {...formItemLayout}
                  label="注册资本"
                  hasFeedback
              >
                {getFieldDecorator('rmbAmount', {
                  rules: [
                  {pattern: /^\d+$/,message:'只能是数字'},
                  {required: true, message: '请输入注册资本!' },
                  {max:'16', message: '长度为16!' }
                ],
                })(
                  <Input />
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="企业类型"
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
                label="供应商营业执照:"
                extra="支持扩展名：jpg、png、bmp.."
              >
                {getFieldDecorator('gysYyzzFile', {
                 rules: [{ required: true, message: '请上传营业执照!'}],
                })(
                  <Upload name="gysYyzzFile"  listType="picture-card"
                    onChange={(info)=>{
                            if (info.file.status === 'done') {
                                let fileList = getFieldValue('gysYyzzFile').fileList;
                                e.setState({ gysYyzzfiles:fileList });
                                setFieldsValue({'gysYyzzFile':fileList});
                              }
                              else if(info.file.status === 'removed'){
                                e.setState({gysYyzzfiles:[] });
                              }
                          }} 
                   action={pathConfig.PICUPLAOD_URL}>
                  {e.state.gysYyzzfiles.length >= 1 ? "" : uploadButton}
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
              <FormItem
                {...formItemLayout}
                label="医疗器械经营企业许可证:"
                extra="支持扩展名：jpg、png、bmp.."
              >
                {getFieldDecorator('jyxkFile', {
                   rules: [{ required: true, message: '请上传组织机构代码证!'}]
                  })(
                <Upload name="jyxkFile" listType="picture-card" 
                         onChange={(info)=>{
                            if (info.file.status === 'done') {
                                let fileList = getFieldValue('jyxkFile').fileList;
                                e.setState({ jyxkfiles:fileList });
                                setFieldsValue({'jyxkFile':fileList});
                              }
                              else if(info.file.status === 'removed'){
                                e.setState({jyxkfiles:[] });
                              }
                          }} 
                        action={pathConfig.PICUPLAOD_URL}>
                    {e.state.jyxkfiles.length >= 1 ? "" : uploadButton}
                  </Upload>
                )}
              </FormItem>
             <FormItem
                {...formItemLayout}
                label="组织机构代码证:"
                extra="支持扩展名：jpg、png、bmp.."
              >
                {getFieldDecorator('jgdmzFile', {
                  // rules: [{ required: true, message: '请上传组织机构代码证!'}]
                  })(
                <Upload name="jgdmzFile"  listType="picture-card" 
                         onChange={(info)=>{
                            if (info.file.status === 'done') {
                                let fileList = getFieldValue('jgdmzFile').fileList;
                                e.setState({ jgdmzfiles:fileList });
                                setFieldsValue({'jgdmzFile':fileList});
                              }
                              else if(info.file.status === 'removed'){
                                e.setState({jgdmzfiles:[] });
                              }
                          }} 
                        action={pathConfig.PICUPLAOD_URL}>
                     {e.state.jgdmzfiles.length  >= 1 ? "" : uploadButton}
                  </Upload>
                )}
             </FormItem>
             <FormItem
                {...formItemLayout}
                label="税务登记证:"
                extra="支持扩展名：jpg、png、bmp.."
              >
                {getFieldDecorator('swdjFile', {
                  // rules: [{ required: true, message: '请上传组织机构代码证!'}]
                  })(
                <Upload name="swdjFile"  listType="picture-card" 
                         onChange={(info)=>{
                            if (info.file.status === 'done') {
                                let fileList = getFieldValue('swdjFile').fileList;
                                e.setState({ swdjfiles:fileList });
                                setFieldsValue({'swdjFile':fileList});
                              }
                              else if(info.file.status === 'removed'){
                                e.setState({swdjfiles:[] });
                              }
                              
                          }} 
                        action={pathConfig.PICUPLAOD_URL}>
                    {e.state.swdjfiles.length >= 1 ? "" : uploadButton}
                  </Upload>
                )}
              </FormItem>
        
              
           
               <FormItem
            {...formItemLayout}
            label="用户协议"
          >
               {getFieldDecorator('agreementSupplier', {
                  valuePropName: 'checked',
                  rules: [{ required: true, message: '请勾选!'},
                   {validator: (rule, value, callback) => {
                          if(!value){
                            callback('请同意协议');
                            return;
                          }
                           callback();
                        }}
                  ]
                })(
                  <Checkbox>我同意 <a>协议</a></Checkbox>
                )}
          </FormItem>
           </div>
        )
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <h3>用户信息</h3>
        <FormItem
          {...formItemLayout}
          label={(
            <span>账号</span>
          )}
          hasFeedback
        >
          {getFieldDecorator('userNo', {
            rules: [{ required: true, message: '请输入账号!', whitespace: true },
                    pattern('code'),
                    roles('max', '账号', 20),
                    {validator: (rule, value, callback) => {
                      //验证账号唯一性
                      FetchPost(pathConfig.USERNOEXIST_URL,querystring.stringify({userNo:value}))
                      .then(response => {
                        return response.json();
                      })
                      .then(data => {
                        if(!data.status){
                          callback('账号重复，请重新输入');
                          return;
                        }
                        callback();
                      })
                      .catch(e => console.log("Oops, error", e))
                       
                      }}],
          })(
            <Input />
          )}
        </FormItem>
          <FormItem
          {...formItemLayout}
          label={(
            <span>用户名</span>
          )}
          hasFeedback
        >
          {getFieldDecorator('userName', {
            
            rules: [{ required: true, message: '请输入用户名!', whitespace: true },
            {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
            {max:20,message:'字符长度不能超过20'},
            
            ],
          })(
            <Input />
          )}
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="手机号"
        >
          {getFieldDecorator('mobilePhone', {
            rules: [{required: true, message: '请输入手机号!' },
             {pattern: /^\d+$/,message:'只能是数字'},
             {len:11, message: '手机号码长度必须为11位!' }],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="E-mail"
          hasFeedback
        >
          {getFieldDecorator('eMail', {
            rules: [
              {type: 'email', message: '请输入正确邮箱格式'},
              {required: true, message: '请输入邮箱'},
              {max:50, message:'字符长度不能超过50'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="QQ"
          hasFeedback
        >
          {getFieldDecorator('qq', {
            rules: [
              {pattern: /^\d+$/,message:'只能是数字'},
              {max: 20, message: '长度不能超过20'}
            ],
          })(
            <Input/>
          )}
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('userTfRemark')(
            <Input/>
          )}
        </FormItem>
        <h3>机构信息</h3>
        <FormItem
          {...formItemLayout}
          label="用户类型"
          hasFeedback
        >
          <RadioGroup onChange={this.onChange} value={this.state.radioValue}>
            <Radio value='01'>医疗机构</Radio>
            <Radio value='02'>供应商</Radio>
          </RadioGroup>
       </FormItem>
       <FormItem
          {...formItemLayout}
            label="机构名称"
            hasFeedback
          >
            {getFieldDecorator('orgName', {
              rules: [{ required: true, message: '请输入医疗机构名称!' },
                      {validator: (rule, value, callback) => {
                            //验证机构名称唯一性
                            FetchPost(pathConfig.ORGNAMEEXIST_URL,querystring.stringify({orgName:value}))
                            .then(response => {
                              return response.json();
                            })
                            .then(data => {
                              if(!data.status){
                                 callback('机构名称重复，请重新输入');
                                return;
                              }
                              callback();
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
            label="简称"
          >
            {getFieldDecorator('orgAlias',{
              rules:[{max:50, message:'字符长度不能超过50'}]
            })(
              <Input />
            )}
            
          </FormItem>
          <FormItem
            {...formItemLayout}
              label="机构代码"
              hasFeedback
            >
              {getFieldDecorator('orgCode', {
                rules: [{ required: true, message: '请输入机构代码!' },
                        {validator: (rule, value, callback) => {
                              //验证机构代码唯一性
                              FetchPost(pathConfig.ORGCODEEXIST_URL,querystring.stringify({orgCode:value}))
                              .then(response => {
                                return response.json();
                              })
                              .then(data => {
                                if(!data.status){
                                   callback('机构代码重复，请重新输入');
                                    return;
                                }
                                callback();
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
          label="下级单位"
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
          label="省市区"
        >
         {getFieldDecorator('residence', {
            initialValue: ['湖北', '武汉', '江汉区'],
            rules: [{ type: 'array' },{ required: true, message: '请选择省市区!' }],
          })(
            <Cascader  options={citysData} placeholder='请选择'/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="联系人"
        >
          {getFieldDecorator('lxr')(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="联系电话"
          hasFeedback
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
          label="详细地址"
        >
          {getFieldDecorator('tfAddress',{
            rules:[{max:50, message:'字符长度不能超过50'}]
          })(
            <Input />
          )}
        </FormItem>
          <FormItem
            {...formItemLayout}
            label="营业执照有效期"
            hasFeedback
          >
          {getFieldDecorator('yyzzfirstTimeRangeValue', rangeConfig)(
            <RangePicker showTime format="YYYY-MM-DD"/>
          )}
          </FormItem>
         {
            this.state.radioValue === '01' ? getMechanismForm(this) : getSupplierForm(this)
          }
        <FormItem
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('tfRemark',{
            rules:[{max:200, message:'字符长度不能超过200'}]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>注册</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

class Register extends React.Component {
  render() {
    return (
      <div>
        <Layout>
          <Header style={{height:'72px',background:'#ffffff',borderBottom:'1px solid #cccccc'}}>
             <a className='logo'>
            </a>
            <span className='reg_text'>
              注册
            </span>
          </Header>
          <Content style={{paddingTop:'10px',background:'#ffffff'}}>
             <Row type="flex" justify="center">
              <Col span={12}>
                <WrappedRegistrationForm/>
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
    );
  }
}

module.exports = Register;