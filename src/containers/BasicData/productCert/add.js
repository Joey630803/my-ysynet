/**
 * @file 证件添加
 */
import React from 'react';
import {DatePicker, Breadcrumb, Form, Input,Button,message,Select,Upload,Icon,Modal,Row,Col} from 'antd';
import { Link,hashHistory } from 'react-router';
import { CommonData,pathConfig,fetchData} from 'utils/tools';
import { productUrl } from 'api';
import moment from 'moment';
import querystring from 'querystring';

const Option = Select.Option
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
class AddForm extends React.Component {
   state = {
    visible: false,
    dirtyClick: false,
    isOffice: false, //是否是办公耗材
    tfBrandOptions: [],
    tfAccessoryFile: '',
    fileList: [],
    tfAccessory:'',
    instrumentCode:[],
    rtype:'',
    defaultData:null
  }
    //品牌静态数据
    componentDidMount = () => {
        //品牌
        CommonData('TF_BRAND', (data) => {
        this.setState({tfBrandOptions: data})
        })
        //68分类
        CommonData('INSTRUMENT_CODE', (data) => {
        this.setState({instrumentCode:data})
        })

    }
    showModal = ()=>{
        this.setState({visible:true})
    }
    handleOk = () => {
        const rid = this.refs.rid.refs.input.value;
        const rtype = this.state.rtype;
        // this.setState({ defaultData : {rno: '123123123123123',firstTime:'2013.09.22',lastTime: '2017.09.21'} })
        // this.setState({visible:false})
        fetchData(productUrl.GETDATA,querystring.stringify({rid:rid,rtype:rtype}),(data) => {
            if(data.rno){
                this.setState({ defaultData : data })
            }else{
                this.handleError("网络不通畅,请稍后再试!")
            }
           
            this.setState({visible:false})
        })
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    //上传图片限制大小
    beforeUploadPic = (file) => {
    const type = file.type === 'image/jpeg'|| file.type === 'image/png'|| file.type === 'image/bmp';
        if (!type) {
        message.error('您只能上传image/jpeg、png、bmp!');
        }
        const isLt5M = file.size / 1024 / 1024  < 5;
        if (!isLt5M) {
        message.error('上传文件不能大于 5MB!');
        }
        this.setState({defaultpicurl:'111'});
        return type && isLt5M;
    }
     //上传附件限制大小
    beforeUploadFile = (file) => {
        const type =  file.type === 'application/pdf' || file.type ==='application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        if (!type) {
        message.error('您只能上传pdf/doc!');
        }
        const isLt20M = file.size / 1024 / 1024  < 20;
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
    //数据提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
        if (!err) {
           // this.setState({dirtyClick: true})
           console.log(fieldsValue.date)
            fieldsValue.firstTime = fieldsValue.date === undefined  || fieldsValue.date === null? "" : moment(fieldsValue.date[0]).format('YYYY-MM-DD');
            fieldsValue.lastTime = fieldsValue.date === undefined  || fieldsValue.date === null? "" : moment(fieldsValue.date[1]).format('YYYY-MM-DD');
            fieldsValue.tfAccessoryFile = this.state.fileList.length > 0 ? this.state.fileList[0].thumbUrl : '';
            fieldsValue.tfAccessory = this.state.tfAccessory;
            console.log('postData-----',fieldsValue)
            fetchData(productUrl.CERTACTIONS,JSON.stringify(fieldsValue),(data)=>{
              //  this.setState({dirtyClick: false})
                if(data.status){
                    hashHistory.push('/basicData/productCert');
                    message.success("添加成功!");
                }else{
                    this.handleError(data.msg)
                }
            },'application/json')
        }
    }) 
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.tfAccessory !== '') {
        const img = document.querySelector('.pdfUpload .ant-upload-list-item-thumbnail img');
        img.src = `http://192.168.0.200:5656/ysy/ftp/ysyFile/standard/productCert/image/6801/fujian.jpg`
    }
  }
  render() {    
    const { getFieldDecorator } = this.props.form;
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
      return rule;
    };
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
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
           <Row>
            <Col>
            <FormItem 
               {...formItemLayout}
                hasFeedback 
                label={`产品类型`}>
                {getFieldDecorator(`type`, {
                  rules: [{ required: true, message: '请选择产品类型!' }],
                  initialValue: '00'
                })(
                <Select onChange={value => {
                    this.setState({
                      isOffice: value === '00' ? false : true
                    })
                    const resetFields = ['materialName', 'produceName', 'isImport',
                        'enterpriseRegAddr', 'produceAddr', 'instrumentCode','productStructure', 'productScope', 'date','tfBrand']
                    this.props.form.validateFields((err, fieldsValue) => {
                      this.props.form.resetFields(resetFields);
                      let setFileds = {};
                      resetFields.map( (item, index) => setFileds[item] = fieldsValue[item])
                      this.props.form.setFieldsValue(setFileds)
                      if (!this.state.isOffice) {
                        this.props.form.setFieldsValue({registerNo: '无证'})
                        this.props.form.setFieldsValue({date: null})
                        this.props.form.setFieldsValue({isImport: null})
                        this.props.form.setFieldsValue({instrumentCode: null})
                        this.setState({ tfAccessory : ""})
                      } else if (fieldsValue.registerNo === '无证') {
                        this.props.form.setFieldsValue({registerNo: ''})
                      }
                    }) 
                  }}>
                    <Option value={'00'}>医疗器械</Option>
                    <Option value={'01'}>其他耗材</Option>
                  </Select>
                )}
                <Button type="primary" disabled={this.state.isOffice} style={{marginTop:8}} onClick={this.showModal}>获取数据</Button>
            </FormItem>
            <FormItem 
                {...formItemLayout}
                label={`证件号`}>
                {getFieldDecorator(`registerNo`, {
                    ...rule('请选择证件号',25),
                    initialValue: this.state.isOffice ? '无证' : (this.state.defaultData && this.state.defaultData.rno ? this.state.defaultData.rno : null )
                })(
                <Input disabled={this.state.isOffice}/>
                )}
            </FormItem>
            <FormItem 
          {...formItemLayout}
          hasFeedback 
          label={`国产/进口`}>
          {getFieldDecorator(`isImport`, rule('请选择国产/进口'))(
          <Select placeholder="请选择"  disabled={this.state.isOffice}>
              <Option value={'0'}>国产</Option>
              <Option value={'1'}>进口</Option>
          </Select>
          )}
        </FormItem>
            <FormItem 
                {...formItemLayout}
                label={`分类目录`}>
                {getFieldDecorator(`instrumentCode`,rule('请选择分类目录'))(
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
            <FormItem 
                {...formItemLayout}
                label={`证件效期`}>
                {getFieldDecorator(`date`, {
                    ...rule('请输入证件效期'),
                    initialValue: this.state.defaultData && this.state.defaultData.pdate  ? [moment(this.state.defaultData.pdate,'YYYY-MM-DD'),moment(this.state.defaultData.udate,'YYYY-MM-DD')]:undefined 

                })(
                <RangePicker format="YYYY-MM-DD" disabled={this.state.isOffice}/>
                )}
            </FormItem>
            <FormItem 
                {...formItemLayout}
                hasFeedback  
                label={`产品名称`}>
                {getFieldDecorator(`materialName`, {
                  rules: [{ required: true, message: '请输入产品名称!' },
                  { max: 100, message: '不能超过100个字符'}],
                  initialValue: this.state.defaultData && this.state.defaultData.mname ?  this.state.defaultData.mname : null
                })(
                  <Input/>
                )}
            </FormItem>
            <FormItem 
                {...formItemLayout}
                label={`品牌`}>
                {getFieldDecorator(`tfBrand`,{
                rules: [{ required: true, message: '请选择品牌!' }],
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
                {getFieldDecorator(`produceName`,
                 {...rule('请输入生产者名称', 100),
                 initialValue: this.state.defaultData && this.state.defaultData.rname ?  this.state.defaultData.rname : null
                }
                )(
                <Input/>
                )}
            </FormItem>
            <FormItem 
                {...formItemLayout}
                label={`生产者地址`}>
                {getFieldDecorator(`enterpriseRegAddr`, {
                    ...rule('请输入生产者地址', 250),
                    initialValue: this.state.defaultData && this.state.defaultData.raddress ?  this.state.defaultData.raddress : null
                })(
                <Input/>
                )}
            </FormItem>
            <FormItem 
                {...formItemLayout}
                label={`生产地址`}>
                {getFieldDecorator(`produceAddr`, {
                    ...rule('请输入生产者地址', 250),
                    initialValue: this.state.defaultData && this.state.defaultData.paddress ?  this.state.defaultData.paddress : null 
                })(
                <Input/>
                )}
            </FormItem>
            <FormItem 
            {...formItemLayout}
            label={`产品标准`}>
                {getFieldDecorator(`productStandard`, {
                rules: [
                    { max: 100, message: '不能超过250个字符'},
                    
                ],
                initialValue: this.state.defaultData && this.state.defaultData.mstandard ?  this.state.defaultData.mstandard : null 
                })(
                <Input/>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label={`性能/结构组成`}>
                {getFieldDecorator(`productStructure`, {
                    ...rule('请输入性能/结构组成', 2000),
                    initialValue: this.state.defaultData && this.state.defaultData.structure ?  this.state.defaultData.structure : null 
                })(
                    <Input type="textarea"/>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label={`适用范围`}>
                {getFieldDecorator(`productScope`, {
                    ...rule('请输入适用范围', 2000),
                    initialValue: this.state.defaultData && this.state.defaultData.srange ?  this.state.defaultData.srange : null 
                })(
                    <Input type="textarea"/>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label={`产品禁忌`}>
                {getFieldDecorator(`taboo`,{
                    rules: [
                    { max: 250, message: '不能超过250个字符'}
                    ]
                })(
                    <Input type="textarea"/>
                )}
            </FormItem>
            <FormItem 
                {...formItemLayout}
                label={`代理人`}>
                {getFieldDecorator(`agentName`, {
                  rules: [
                    { max: 100, message: '不能超过100个字符'}
                  ],
                  initialValue: this.state.defaultData && this.state.defaultData.aname ?  this.state.defaultData.aname : null 
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
                  initialValue: this.state.defaultData && this.state.defaultData.aaddress ?  this.state.defaultData.aaddress : null 
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
                  initialValue:  this.state.defaultData && this.state.defaultData.serviceOrg ?  this.state.defaultData.serviceOrg : null
                })(
                  <Input/>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label={`备注`}>
                {getFieldDecorator(`tfRemark`,{
                  rules: [
                    { max: 250, message: '不能超过250个字符'}
                  ]
                  ,
                  initialValue: this.state.defaultData && this.state.defaultData.remark ?  this.state.defaultData.remark : null 
                })(
                  <Input type="textarea"/>
                )}
            </FormItem>
            {
                this.state.isOffice ? null
                :
                <div>
                <FormItem {...formItemLayout} label={`证件图片`}>
                    <Upload 
                        action={pathConfig.PICUPLAOD_URL} 
                        fileList={this.state.fileList}
                        listType="picture-card"
                        onChange={({fileList}) => {
                            this.setState({fileList})
                        }}
                        showUploadList={{showPreviewIcon:true,showRemoveIcon:true}}
                        beforeUpload={this.beforeUploadPic}
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
                <FormItem {...formItemLayout} label={`附件`}>
                    <Upload 
                    className='pdfUpload'
                    listType="picture"
                    action={pathConfig.PICUPLAOD_URL}
                    beforeUpload={this.beforeUploadFile}
                    onChange={ (info) => {
                          if (info.file.status === 'done') {
                            console.log(info,'info')
                            this.setState({tfAccessory:info.file.thumbUrl})

                          }else if(info.file.status === 'removed'){
                            this.setState({tfAccessory:""})
                          }
                           
                        }
                    }
                    >{
                        this.state.tfAccessory === "" ?
                        <Button>
                            <Icon type="upload" /> 上传附件
                        </Button>
                        :
                        null

                    }
                    </Upload>
                </FormItem>
                </div>
            }
      
            <FormItem {...tailFormItemLayout}>
                 <Button type="primary" htmlType="submit" loading={this.state.dirtyClick}>保存</Button>
            </FormItem>
            </Col>
            </Row>
            <Modal
            visible={this.state.visible}
            title={'获取医疗器械数据'}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
            <Button key="back" size="large"  onClick={this.handleCancel}>关闭</Button>,
            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                提交
            </Button>
            ]}
          >
          <Select style={{width:'100%'}} placeholder="请选择" onChange={(value)=>{
              this.setState({rtype:value})
          }}>
              <Option value={'0'}>国产</Option>
              <Option value={'1'}>进口</Option>
              <Option value={'2'}>备案</Option>
          </Select>
            <Input style={{marginTop:'16px',width:'100%'}}  ref='rid' />
          </Modal>
      </Form>
    )
  }
}
const ProductAddForm = Form.create()(AddForm);
class CertAdd extends React.Component {

  render() {
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/basicData/productCert'>产品证件</Link></Breadcrumb.Item>
          <Breadcrumb.Item>添加</Breadcrumb.Item>
        </Breadcrumb>
        <ProductAddForm/>
      </div>
    );
  }
}

module.exports = CertAdd;