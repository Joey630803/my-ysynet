/**
 * @file 证件编辑
 */
import React from 'react';
import {DatePicker, Breadcrumb, Form, Input,Button,message,Select,Upload,Icon,Modal} from 'antd';
import { Link,hashHistory } from 'react-router';
import { CommonData,pathConfig,jsonNull,fetchData} from 'utils/tools';
import { productUrl } from 'api';
import moment from 'moment';
const Option = Select.Option
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
class EditForm extends React.Component {
   state = {
    dirtyClick: false,
    isOffice: this.props.data.type === '00' ? false : true, //是否是办公耗材
    tfBrandOptions: [],
    fileList: [],
    fileList2: [],
    tfAccessory:this.props.data.tfAccessory,
    instrumentCode:[]
  }

  componentWillMount = () => {
    if(this.props.data.tfAccessory){
      this.setState({
        fileList2: [{
          uid: 1,
          name: '附件',
          status: 'done',
          thumbUrl: "http://192.168.0.200:5656/ysy/ftp/ysyFile/standard/productCert/image/6801/fujian.jpg",
          url: pathConfig.YSYPATH + this.props.data.tfAccessory
        }]
      })
    }
  }

  //品牌静态数据
  componentDidMount = () => {
    if(this.props.data.tfAccessoryFile){
      this.setState({
        fileList: [{
                uid: -1,
                name: this.props.data.tfAccessoryFile,
                status: 'done',
                thumbUrl: pathConfig.YSYPATH + this.props.data.tfAccessoryFile,
                url: pathConfig.YSYPATH + this.props.data.tfAccessoryFile
              }]
      })
    }
    //品牌
    CommonData('TF_BRAND', (data) => {
       this.setState({tfBrandOptions: data})
    })
    //68分类
    CommonData('INSTRUMENT_CODE', (data) => {
       this.setState({instrumentCode:data})
    })
  }
  beforeUpload = (file) => {
    const type = file.type === 'image/jpeg'|| file.type === 'image/png'|| file.type === 'image/bmp';
    if (!type) {
      message.error('您只能上传image/jpeg、png、bmp!');
    }
    const isLt5M = file.size   < 5 * 1024 * 1024;
    if (!isLt5M) {
      message.error('上传文件不能大于 5MB!');
    }
    return type && isLt5M;
  }
  //上传附件限制大小
  beforeUploadFile = (file) => {
    const typeinfo = file.name.toLowerCase().split('.').splice(-1)[0];
    const type =  typeinfo === 'pdf' || typeinfo ==='docx'|| typeinfo ==='doc'|| typeinfo ==='zip'|| typeinfo ==='rar';
    if (!type) {
      message.error('您只能上传pdf/doc/zip/rar!');
    }
    const isLt20M = file.size  < 20 * 1024 * 1024;
    if (!isLt20M) {
      message.error('上传文件不能大于 20MB!');
    }
    return type && isLt20M;
  }

   //处理错误信息
   handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
      });
}
componentDidUpdate(prevProps, prevState) {
  if (this.state.tfAccessory !== '') {
      const img = document.querySelector('.pdfUpload .ant-upload-list-item-thumbnail img');
      img.src = `http://192.168.0.200:5656/ysy/ftp/ysyFile/standard/productCert/image/6801/fujian.jpg`
  }
}

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        this.setState({dirtyClick: true})
        fieldsValue.certGuid = this.props.data.certGuid;
        fieldsValue.firstTime = fieldsValue.date === undefined ? "" : moment(fieldsValue.date[0]).format('YYYY-MM-DD');
        fieldsValue.lastTime = fieldsValue.date === undefined ? "" : moment(fieldsValue.date[1]).format('YYYY-MM-DD');
        fieldsValue.tfAccessoryFile = this.state.fileList.length > 0 ? this.state.fileList[0].thumbUrl : '';
        fieldsValue.tfAccessory = this.state.tfAccessory;
        console.log('partOne--postData--', fieldsValue);
        fetchData(productUrl.CERTACTIONS,JSON.stringify(fieldsValue),(data)=>{
          this.setState({dirtyClick: false});
          if(data.status){
            hashHistory.push('/basicData/productCert');
            message.success("编辑成功!");
          }
          else{
            console.log(data.msg);
            this.handleError("网络不通畅,请稍后再试!")
          }
        },'application/json')
       
      }
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
    //医疗器械和医疗耗材的验证判断
    const rule = 
    (aMessage,max) => {
      let rule = {
        rules: [
         !this.state.isOffice ? {required: true, message: aMessage} : {}
        ]
      }
      if(typeof max !== 'undefined'){
         rule.rules.push({ max: max, message: `不能超过${max}字符` });
      }
      //return rule.rules[0].length ? rule : {rules: null};
      return rule;
    };
    const data = this.props.data;
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <FormItem 
          {...formItemLayout}
          label={`产品类型`}>
          {getFieldDecorator(`type`,{
            ...rule('请输入生产企业', 100),
            initialValue: data.type === "00" ? "医疗器械" : "其他耗材"
          })(
            <Input disabled={true}/>
          )}
        </FormItem>
        <FormItem 
          {...formItemLayout}
          label={`证件号`}>
          {getFieldDecorator(`registerNo`, {
            ...rule("输入证件号"),
          initialValue: this.state.isOffice ? '无证' : data.registerNo
          })(
          <Input disabled={this.state.isOffice}/>
          )}
        </FormItem>
        <FormItem 
          {...formItemLayout}
          hasFeedback 
          label={`国产/进口`}>
          {getFieldDecorator(`isImport`,{
            ...rule('请选择国产/进口'),
            initialValue: data.isImport
          })(
          <Select placeholder="请选择" disabled={this.state.isOffice}>
              <Option value={'0'}>国产</Option>
              <Option value={'1'}>进口</Option>
          </Select>
          )}
        </FormItem>
        <FormItem 
          {...formItemLayout}
          label={`分类目录`}>
          {getFieldDecorator(`instrumentCode`, {
            ...rule('请选择分类目录'),
            initialValue:data.instrumentCode
          })(
            <Select
              disabled={this.state.isOffice}
              placeholder="请选择"
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {
                this.state.instrumentCode.map(
                  (item, index) => <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_CODE+"--"+item.TF_CLO_NAME}</Option>)
              }
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={`证件效期`}>
          {getFieldDecorator(`date`, {
            ...rule('请输入证件效期'),
            initialValue: data.firstTime === "" ? undefined : [moment(data.firstTime,'YYYY-MM-DD'),moment(data.lastTime,'YYYY-MM-DD')]
          })(
            <RangePicker format="YYYY-MM-DD" disabled={this.state.isOffice}/>
          )}
        </FormItem>
        <FormItem 
          {...formItemLayout}
          hasFeedback  
          label={`产品名称`}>
          {getFieldDecorator(`materialName`, {
            rules: [{ required: true, message: '请输入产品名称!' }],
            initialValue: data.materialName
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem 
            {...formItemLayout}
            label={`品牌`}>
          {getFieldDecorator(`tfBrand`,{
            rules: [{ required: true, message: '请选择品牌!' }],
            initialValue:data.tfBrand
          })(
            <Select
              placeholder="请选择"
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {
                this.state.tfBrandOptions.map(
                  (item, index) => <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
              }
            </Select>
          )}
        </FormItem>
       
        <FormItem 
          {...formItemLayout}
          label={`生产者名称`}>
          {getFieldDecorator(`produceName`,{
            ...rule('请输入生产企业', 100),
            initialValue: data.produceName
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem 
          {...formItemLayout}
          label={`生产者地址`}>
          {getFieldDecorator(`enterpriseRegAddr`,{
             rules: [
              { max: 250, message: '不能超过250个字符'}
            ],
            initialValue: data.enterpriseRegAddr
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem 
          {...formItemLayout}
          label={`生产地址`}>
          {getFieldDecorator(`produceAddr`,{
             rules: [
              { max: 100, message: '不能超过100个字符'}
            ],
            initialValue: data.produceAddr
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem 
        {...formItemLayout}
        label={`产品标准`}>
          {getFieldDecorator(`productStandard`, {
            rules: [
              { max: 100, message: '不能超过100个字符'}
            ],
            initialValue: data.productStandard
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={`性能/结构组成`}>
          {getFieldDecorator(`productStructure`, {
            rules: [
              { max: 2000, message: '不能超过2000个字符'}
            ],
            initialValue: data.productStructure
          })(
            <Input type="textarea"/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={`适用范围及用途`}>
          {getFieldDecorator(`productScope`,{
            rules: [
              { max: 2000, message: '不能超过2000个字符'}
            ],
            initialValue: data.productScope
          })(
            <Input type="textarea"/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={`产品禁忌`}>
          {getFieldDecorator(`taboo`,{
            rules: [
              { max: 250, message: '不能超过250个字符'}
            ],
            initialValue: data.taboo
          })(
            <Input type="textarea"/>
          )}
        </FormItem> 
        <FormItem 
          {...formItemLayout}
          label={`代理人名称`}>
          {getFieldDecorator(`agentName`, {
            rules: [
              { max: 100, message: '不能超过100个字符'}
            ],
            initialValue: data.agentName
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem 
        {...formItemLayout}
        label={`代理人地址`}>
          {getFieldDecorator(`agentAddr`, {
            rules: [
              { max: 100, message: '不能超过100个字符'}
            ],
            initialValue: data.agentAddr
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem 
        {...formItemLayout}
        label={`售后服务机构`}>
        {getFieldDecorator(`afterService`, {
          rules: [
            { max: 250, message: '不能超过250个字符'}
          ],
          initialValue: data.afterService
        })(
          <Input/>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={`备注`}>
        {getFieldDecorator(`tfRemark`,{
          rules: [
            { max: 250, message: '不能超过250个字符'}
          ],
          initialValue: data.tfRemark
        })(
          <Input type="textarea"/>
        )}
        </FormItem>
        {
            this.state.isOffice ? null
              :
              <FormItem {...formItemLayout} label={`证件图片`}>
                <Upload 
                    action={pathConfig.PICUPLAOD_URL} 
                    fileList={this.state.fileList}
                    listType="picture-card"
                    onChange={({fileList}) => this.setState({fileList})}
                    showUploadList={{showPreviewIcon:true,showRemoveIcon:true}}
                    beforeUpload={this.beforeUpload}
                  > 
                  {
                      this.state.fileList.length >= 1 
                      ? null 
                      : <div>
                          <Icon type="plus" />
                          <div className="ant-upload-text">点击上传</div>
                        </div>
                  }
                </Upload>
              </FormItem>
          }
            {
            this.state.isOffice ? null
              :
              <FormItem {...formItemLayout} label={`附件`}>
                   <Upload 
                   className='pdfUpload'
                    listType="picture"
                    defaultFileList={this.state.fileList2}
                    action={pathConfig.PICUPLAOD_URL}
                    beforeUpload={this.beforeUploadFile}
                    onChange={ (info) => {
                          if (info.file.status === 'done') {
                            this.setState({tfAccessory:info.file.thumbUrl,fileList2:info.fileList})

                          }else if(info.file.status === 'removed'){
                            this.setState({tfAccessory:"",fileList2:[]})
                          }
                           
                        }
                    }
                    >
                    {
                      this.state.fileList2.length >=1 ?
                      null
                      :
                      <Button>
                       <Icon type="upload" /> 上传附件
                      </Button>
                    }
                   
                    </Upload>
              </FormItem>
             
          }
          <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={this.state.dirtyClick}>保存</Button>
          </FormItem>
    
      </Form>
    )
  }
}
const WrappedEditForm = Form.create()(EditForm);
class CertEdit extends React.Component {

  render() {
    const { state } = jsonNull(this.props.location);
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/basicData/productCert'>产品证件</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedEditForm data={ state }/>
      </div>
    );
  }
}

module.exports = CertEdit;