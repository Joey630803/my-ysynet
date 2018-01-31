/**
 * @file 供应商编辑／详情
 */
import React from 'react';
import { Breadcrumb, Form, message,Input, Select,Button,DatePicker, Cascader, BackTop} from 'antd';
import { Link,hashHistory } from 'react-router';
import moment from 'moment';
import querystring from 'querystring';
import { jsonNull,pathConfig,nvl,CommonData,City ,FetchPost} from 'utils/tools';
import FetchSelect from 'component/FetchSelect';
import PicturesList from 'component/PicWall';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
class AddForm extends React.Component {
  state = {
    uids: [],
    cOrporationOptions: [],
    citys:[],
    gysYyzzImage:{},
    jyxkFileImage:{},
    jgdmzFileImage:{},
    swdjFileImage:{},
    dirtyClick: false
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //营业执照有效期
        const yyzzfirstTimeValue = values['yyzzfirstTimeRangeValue'];
        //医疗机构执业许可证有效期
        const jyxkfirstTimeValue = values['jyxkfirstTimeValueRangeValue'];
        values.orgId = this.props.data.ORG_ID;
        values.orgType = '02';
        values.parentOrgid = this.state.parentOrgid;
        values.tfProvince = nvl(values['residence'][0],'');
        values.tfCity = nvl(values['residence'][1],'');
        values.tfDistrict = nvl(values['residence'][2],'');
        values.gysYyzzFile = this.state.gysYyzzImage;
        values.jyxkFile =   this.state.jyxkFileImage;
        values.jgdmzFile =   this.state.jgdmzFileImage;
        values.swdjFile =   this.state.swdjFileImage;

        //营业执照有效期
        values.yyzzfirstTime = nvl(yyzzfirstTimeValue[0].format('YYYY-MM-DD'),'');
        values.yyzzlastTime = nvl(yyzzfirstTimeValue[1].format('YYYY-MM-DD'),'');
        //医疗器械经营许可证有效期
        values.jyxkfirstTime = nvl(jyxkfirstTimeValue[0].format('YYYY-MM-DD'),'');
        values.jyxklastTime = nvl(jyxkfirstTimeValue[1].format('YYYY-MM-DD'),'');
        values.deleteCertId = this.state.uids;
        const dId =[];
        this.state.uids.map((item,index) => {
          return dId.push(item.deleteId)
        });
        if(dId.indexOf(this.props.data.yyzzCertId)>=0){
            if(!values.gysYyzzFile['thumbUrl']){
              return  message.error('供应商营业执照不能为空！')
          }
        }
       if(dId.indexOf(this.props.data.jyxkCertId)>=0){
          if(!values.jyxkFile['thumbUrl']){
          return  message.error('供应商医疗器械经营企业许可证不能为空！')
        }
       }

        this.setState({dirtyClick: true});
         fetch(pathConfig.EDITSUPPLIER_URL, {
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
            message.success('供应商编辑成功！');
          }
          else{
            message.error(data.msg);
          }
        })
        .catch(e => console.log("Oops, error", e))
      }
    });
  }
   onRemove = (id) =>{
       this.setState({
        uids: [...this.state.uids,{deleteId:id}]
       })
 
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
    const data = this.props.data;
    const cOrporationData =this.state.cOrporationOptions;
    const citysData = this.state.citys;
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
              initialValue:data.ORG_NAME,
              rules: [{ required: true, message: '请输入供应商名称!' },
                      {validator: (rule, value, callback) => {
                            //验证机构名称唯一性
                            FetchPost(pathConfig.ORGNAMEEXIST_URL,querystring.stringify({orgName:value,orgId:data.ORG_ID}))
                            .then(response => {
                              return response.json();
                            })
                            .then(data => {
                              if(data.status){
                                callback();
                                return;
                              }
                              callback('供应商名称重复，请重新输入');
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
            initialValue:data.ORG_ALIAS,
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
            initialValue:data.ORG_CODE,
            rules: [{ required: true, message: '请输入机构代码!' },
            {validator: (rule, value, callback) => {
                            //验证机构代码唯一性
                            FetchPost(pathConfig.ORGCODEEXIST_URL,querystring.stringify({orgCode:value,orgId:data.ORG_ID}))
                            .then(response => {
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
            initialValue: [data.TF_PROVINCE, data.TF_CITY, data.TF_DISTRICT],
            rules: [{ type: 'array' },{ required: true, message: '请选择省市区!' }],
          })(
             <Cascader  options={citysData} placeholder='请选择'/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="状态:"
        >
          {getFieldDecorator('fstate',{
            initialValue:data.FSTATE
          })(
            <Select  style={{ width: 120 }}>
              <Option value="01">正常</Option>
              <Option value="00">停用</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="上级单位:"
        >
           <FetchSelect query={{query:data.ORG_ID}} defaultValue={data.PARENT_ORGNAME} ref='fetchs' url={pathConfig.SEARCHPARORG_URL} 
                  cb={(value) => this.setState({parentOrgid: value})}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="下级单位:"
        >
          {getFieldDecorator('flag', {
              initialValue:data.FLAG,
              rules: [
                { required: true, message: '请选择下级单位' },
              ],
            })(
              <Select>
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
            initialValue:data.LEGAL_MAN,
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
            initialValue:data.CORPORATION_TYPE
            })(
               <Select>
                {
                    cOrporationData.map((item,index) => {
                      return <Option key={item.TF_CLO_CODE} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
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
              initialValue:data.RMB_AMOUNT,
              validateTrigger:'onChange',
              rules: [
              {pattern: /^\d+$/,message:'只能是数字'},
              {required: true, message: '请输入注册资本!' },
              {validator: (rule, value, callback) => {
                              if(value<=100000000000000){
                                
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
           initialValue:data.LXR,
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
            initialValue:data.LXDH,
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
             initialValue:data.TF_ADDRESS,
             rules:[{max:50, message:'字符长度不能超过50'}]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="最后编辑时间:"
        >
          <Input disabled value={data.MODIFY_TIME}/>
        </FormItem>
          <FormItem
          {...formItemLayout}
          label="备注:"
        >
         {getFieldDecorator('tfRemark',{
           initialValue:data.TF_REMARK,
           rules:[{max:200, message:'字符长度不能超过200'}]
         })(
             <Input type="textarea" rows={4}/>
          )}
         
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="营业执照:"
          extra="支持扩展名：jpg、png、bmp.."
        >
            {getFieldDecorator('gysYyzzImage', {
              initialValue:data.yyzzPath,
              validateTrigger:'onChange'
              //rules: [{ required: true, message: '请上传供应商营业执照!'}]
            })(
              <PicturesList name="gysYyzzImage" 
                            action={pathConfig.PICUPLAOD_URL}
                            file={(file) => {
                              if(file.length > 0 && typeof file[0].originFileObj !== 'undefined') {
                                this.setState({
                                  gysYyzzImage: file[0]
                                })
                              }
                            }}
                            url={data.yyzzPath}
                            onRemove={this.onRemove.bind(this,data.yyzzCertId)}
                            picname='yyzzFile.png'/>
            )}
        </FormItem>
        <FormItem
            {...formItemLayout}
            label="营业执照有效期"
          >
          {getFieldDecorator('yyzzfirstTimeRangeValue', {
            initialValue:[moment(data.yyzzfirstTime,'YYYY-MM-DD'),moment(data.yyzzlastTime,'YYYY-MM-DD')],
            rules: [{ type: 'array', required: true, message: '请选择时间' }],
          })(
           <RangePicker showTime format="YYYY-MM-DD"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="医疗器械经营企业许可证:"
          extra="支持扩展名：jpg、png、bmp.."
        >
       
            {getFieldDecorator('jyxkFileImage', {
              initialValue:data.jyxkPath,
             // rules: [{ required: true, message: '请上传医疗器械经营企业许可证!'}]
            })(
              <PicturesList name="jyxkFileImage" 
                        action={pathConfig.PICUPLAOD_URL}
                        file={(file) => {
                          if(file.length > 0 && typeof file[0].originFileObj !== 'undefined') {
                            this.setState({
                              jyxkFileImage: file[0]
                            })
                          }
                        }}
                        url={data.jyxkPath}
                        onRemove={this.onRemove.bind(this,data.jyxkCertId)}
                        picname='yyzzFile.png'/>
            )}
        </FormItem>
        <FormItem
            {...formItemLayout}
            label="医疗器械经营企业许可证"
          >
          {getFieldDecorator('jyxkfirstTimeValueRangeValue', {
             initialValue:[moment(data.jyxkfirstTime,'YYYY-MM-DD'),moment(data.jyxklastTime,'YYYY-MM-DD')],
            rules: [{ type: 'array', required: true, message: '请选择时间' }],
          })(
            <RangePicker showTime format="YYYY-MM-DD"/>
          )}
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="组织机构代码证:"
          extra="支持扩展名：jpg、png、bmp.."
        >

             {getFieldDecorator('jgdmzFileImage', {
                initialValue:data.jgdmzPath,
              })(
                <PicturesList name="jgdmzFileImage" 
                          action={pathConfig.PICUPLAOD_URL}
                          file={(file) => {
                            if(file.length > 0 && typeof file[0].originFileObj !== 'undefined') {
                              this.setState({
                                jgdmzFileImage: file[0]
                              })
                            }
                          }}
                          url={data.jgdmzPath}
                          onRemove={this.onRemove.bind(this,data.jgdmzCertId)}
                          picname='jgdmzFile.png'/>
              )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="税务登记证:"
          extra="支持扩展名：jpg、png、bmp.."
        >
             {getFieldDecorator('swdjFileImage', {
                initialValue:data.swdjPath,
              })(
                <PicturesList name="swdjFileImage" 
                          action={pathConfig.PICUPLAOD_URL}
                          file={(file) => {
                            if(file.length > 0 && typeof file[0].originFileObj !== 'undefined') {
                              this.setState({
                                swdjFileImage: file[0]
                              })
                            }
                          }}
                          url={data.swdjPath}
                          onRemove={this.onRemove.bind(this,data.swdjCertId)}
                          picname='swdjFile.png'/>
              )}
        </FormItem>
       
         <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedHospitalShowForm = Form.create()(AddForm);
class SupplierShow extends React.Component {
  render() {
        const { state } = jsonNull(this.props.location);
        const title = typeof this.props.location.state === 'undefined' 
                  ? '供应商信息' : this.props.location.state.title;
    return (

      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to={{pathname:'basicData/mechanism',query:{activeKey:'supplier'}}}>机构管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{title || ''}</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedHospitalShowForm data={state}/>
      </div>
    );
  }
}

module.exports = SupplierShow;