/**
 * @file 医疗机构编辑／详情
 */
import React from 'react';
import { Breadcrumb, Form, message,Input, Select, Button, DatePicker, Cascader, BackTop} from 'antd';
import { Link,hashHistory } from 'react-router';
import moment from 'moment';
import querystring from 'querystring';
import { jsonNull,pathConfig,nvl,CommonData,City,FetchPost } from 'utils/tools';
import FetchSelect from 'component/FetchSelect';
import PicturesList from 'component/PicWall';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
class AddForm extends React.Component {
  state = {
    uids:[],
    yyzzImage: {},
    zyxkImage: {},
    hLevelOptions: [],
    hPropertyOptions: [],
    dirtyClick: false
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
         //营业执照有效期
        const yyzzfirstTimeValue = values['yyzzfirstTimeRangeValue'];
        //医疗机构执业许可证有效期
        const zyxkfirstTimeValue = values['zyxkfirstTimeRangeValue'];
        values.orgId = this.props.data.ORG_ID;
        values.orgType = '01';
        values.parentOrgid = this.state.parentOrgid;
        values.tfProvince = nvl(values['residence'][0],'');
        values.tfCity = nvl(values['residence'][1],'');
        values.tfDistrict = nvl(values['residence'][2],'');
        //营业执照有效期
        values.yyzzfirstTime = nvl(yyzzfirstTimeValue[0].format('YYYY-MM-DD'),'');
        values.yyzzlastTime = nvl(yyzzfirstTimeValue[1].format('YYYY-MM-DD'),'');
        //医疗机构执业许可证有效期
        values.zyxkfirstTime = nvl(zyxkfirstTimeValue[0].format('YYYY-MM-DD'),'');
        values.zyxklastTime = nvl(zyxkfirstTimeValue[1].format('YYYY-MM-DD'),'');
        values.yyYyzzFile = this.state.yyzzImage;
        values.zyxkFile =   this.state.zyxkImage;
        values.deleteCertId = this.state.uids;
        const dId =[];
        this.state.uids.map((item,index) =>{
        return  dId.push(item.deleteId)
        });
        if(dId.indexOf(this.props.data.yyzzCertId)>=0){
              if(!values.yyYyzzFile['thumbUrl']){
                return  message.error('营业执照不能为空！')
            }
          }
        if(dId.indexOf(this.props.data.zyxkCertId)>=0){
            if(!values.zyxkFile['thumbUrl']){
            return  message.error('医疗器械经营企业许可证不能为空！')
          }
        }
         this.setState({dirtyClick: true});
         fetch(pathConfig.EDITHOSPITAL_URL, {
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
            hashHistory.push('/basicData/mechanism');
            message.success("编辑成功!");
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
      CommonData('HOSPITAL_LEVEL', (data) => {
       this.setState({hLevelOptions:data})
     })
     CommonData('HOSPITAL_PROPERTY', (data) => {
       this.setState({hPropertyOptions:data})
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
   
    const data = jsonNull(this.props.data);
    const hospitalLevelData = this.state.hLevelOptions;
    const hPropertyData = this.state.hPropertyOptions;
    const citysData = this.state.citys;
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <BackTop>
          <div className="ant-back-top-inner">TOP</div>
        </BackTop>
          <FormItem
          {...formItemLayout}
          label="医疗机构名称:"
        >
          {getFieldDecorator('orgName', {
              initialValue:data.ORG_NAME,
              rules: [{ required: true, message: '请输入医疗机构名称!' },
                      {validator: (rule, value, callback) => {
                              //验证账号唯一性
                              FetchPost(pathConfig.ORGNAMEEXIST_URL,querystring.stringify({orgName:value,orgId:data.ORG_ID}))
                              .then(response => {
                                return response.json();
                              })
                              .then(data => {
                                if(data.status){
                                  callback();
                                  return;
                                }
                                callback('医疗机构名称重复，请重新输入');
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
              <Option value="01">启用</Option>
              <Option value="00">停用</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="上级单位:"
        >
       
            <FetchSelect query={{orgId:data.ORG_ID}}  defaultValue={data.PARENT_ORGNAME} ref='fetchs' url={pathConfig.SEARCHPARORG_URL} 
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
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="机构类型:"
        >
         {getFieldDecorator('hospitalProperty', {
            initialValue:data.HOSPITAL_PROPERTY
            })(
            
             <Select style={{ width: 120 }} placeholder="请选择">
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
          label="等级:"
        >
         {getFieldDecorator('hospitalLevel', {
            initialValue:data.HOSPITAL_LEVEL
            })(
              <Select style={{ width: 120 }} placeholder="请选择">
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
          label="联系人:"
        >
         {getFieldDecorator('lxr',{
           initialValue:data.LXR
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
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="纳税人识别号:"
        >
          {getFieldDecorator('taxNo',{
            initialValue:data.TAX_NO,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="开户银行:"
        >
          {getFieldDecorator('tfBank',{
             initialValue:data.TF_BANK,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="银行卡号:"
        >
          {getFieldDecorator('bankAccount',{
            initialValue:data.BANK_ACCOUNT,
             rules: [{max:20, message: '字符长度不能超过20!' },
              {pattern: /^\d+$/,message:'只能是数字'}]
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
            
            {getFieldDecorator('yyYyzzFileImage', {
              valuePropName: 'fileList',
            })(
              <PicturesList name="yyYyzzFileImage" 
                            action={pathConfig.PICUPLAOD_URL}
                            file={(file) => {
                           
                              if(file.length > 0 && typeof file[0].originFileObj !== 'undefined') {
                                this.setState({
                                  yyzzImage: file[0]
                                })
                              }
                            }}
                            url={data.yyzzPath==="undefined" ? "":data.yyzzPath}
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
          label="医疗机构执业许可证:"
          extra="支持扩展名：jpg、png、bmp.."
        >
          {getFieldDecorator('zyxkFileImage', {
               valuePropName: 'fileList',
            })(
              <PicturesList name="zyxkFileImage" 
                            action={pathConfig.PICUPLAOD_URL}
                            file={(file) => {
                              if(file.length > 0 && typeof file[0].originFileObj !== 'undefined') {
                                this.setState({
                                  zyxkImage: file[0]
                                })
                              }
                            }}
                            url={data.zyxkPath==="undefined" ? "": data.zyxkPath}
                            onRemove={this.onRemove.bind(this,data.zyxkCertId)}
                            picname='zyxkFile.png'/>
            )}
        </FormItem>
         <FormItem
            {...formItemLayout}
            label="医疗机构执业许可证有效期"
          >
          {getFieldDecorator('zyxkfirstTimeRangeValue', {
            initialValue:[moment(data.zyxkfirstTime,'YYYY-MM-DD'),moment(data.zyxklastTime,'YYYY-MM-DD')],
             rules: [{ type: 'array', required: true, message: '请选择时间' }],
          })(
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
const WrappedHospitalShowForm = Form.create()(AddForm);

class HospitalShow extends React.Component {
  render() {
        const { state } = jsonNull(this.props.location);
        const title = typeof this.props.location.state === 'undefined' 
                  ? '医疗机构信息' : this.props.location.state.title;
    return (

      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/basicData/mechanism'>机构管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{title || ''}</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedHospitalShowForm data={state}/>
      </div>
    );
  }
}

module.exports = HospitalShow;