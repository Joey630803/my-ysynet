import React from 'react';
import { Link, hashHistory } from 'react-router';
import { Breadcrumb, Row, Col, Steps, Icon, Form, Input, 
         Select, Button, DatePicker, Upload, Modal, message,
         Alert,Popconfirm } from 'antd';;
import { tender,productUrl } from 'api';
import { CommonData,FetchPost  } from 'utils/tools';
import FetchTable from 'component/FetchTable';
import moment from 'moment';
import querystring from 'querystring';
import uuid from 'uuid';

const RangePicker = DatePicker.RangePicker;
const Step = Steps.Step;
const FormItem = Form.Item;
const Option = Select.Option
//第一步 表单
class StepOneForm extends React.Component {
  state = {
    isOffice: false,
    tfBrandOptions: [],
    tfAccessoryFile: '',
    fileList: [],
    dirtyClick: false,
    initData: {},
    rCertGuid: ''
  }
  componentDidMount = () => {
      if (this.props.state.registGuid) {
        FetchPost(tender.REGISTER_INFO,querystring.stringify({registGuid: this.props.state.registGuid}))
        .then(res => res.json())
        .then(data => {
          if(data.result){
             this.setState({
              isOffice: data.result.flag === '01' ? false : true,
              rCertGuid: data.result.rCertGuid,
              initData: data.result,
            })
            if (data.result.tfAccessoryFile) {
            this.setState({
                fileList: [{
                  uid: -1,
                  name: data.result.tfAccessoryFile,
                  status: 'done',
                  thumbUrl: tender.FTP + data.result.tfAccessoryFile,
                  url: tender.FTP + data.result.tfAccessoryFile
                }]
              })
            }
          }
         
        })
        .catch(e => console.log("Oops, error", e))
     }
     CommonData('TF_BRAND', (data) => {
       this.setState({tfBrandOptions: data})
     })
  }
  beforeUpload = (file) => {
    const type = file.type === 'image/jpeg'|| file.type === 'image/png'|| file.type === 'image/bmp' || file.type === 'application/pdf';
    if (!type) {
      message.error('您只能上传image/jpeg、png、bmp、pdf!');
    }
    const isLt5M = file.size / 1024 / 1024  < 5;
    if (!isLt5M) {
      message.error('上传文件不能大于 5MB!');
    }
    this.setState({defaultpicurl:'111'});
    return type && isLt5M;
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
       this.setState({dirtyClick: true})
        fieldsValue.firstTime = typeof fieldsValue.date !== 'undefined' ?
                                moment(fieldsValue.date[0]).format('YYYY-MM-DD') : 'unedfiend';
        fieldsValue.lastTime = typeof fieldsValue.date !== 'undefined' ?
                                moment(fieldsValue.date[1]).format('YYYY-MM-DD') : 'unedfiend';
        fieldsValue.tfAccessoryFile = this.state.fileList.length > 0 ? this.state.fileList[0].thumbUrl : '';
        fieldsValue.rCertGuid = this.state.rCertGuid;
        console.log('partOne--postData--', fieldsValue);
   
        fetch(tender.CERT_SAVE, {
            method: 'post',
            mode:'cors',
            credentials: 'include',
            headers: {
             'Content-Type':'application/json'
            },
            body:JSON.stringify(fieldsValue)
        })
        .then(res => {
          return res.json();
        })
        .then(data => {
          this.setState({dirtyClick: false})
          if (data.status) {
            this.props.cb(1)
            this.props.rCertGuid(data.result.rCertGuid);         
           } else {
            message.error(data.msg);
          }
        })
        .catch(e => console.log("Oops, error", e))
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
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
      return rule.rules[0].length ? rule : {rules: null};
    };
    let disabled = true;
    const auditFstate = this.props.state.auditFstate;
    if (auditFstate === 'warning') {
      disabled = false;
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col span={10} key={1}>
            <FormItem labelCol={{span: 10}} hasFeedback wrapperCol={{span: 14}} label={`产品名称`}>
              {getFieldDecorator(`materialName`, {
                rules: [{ required: true, message: '请输入产品名称!' }],
                initialValue: this.state.initData.materialName
              })(
                <Input disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} key={2}>
            <FormItem labelCol={{span: 10}} hasFeedback wrapperCol={{span: 14}} label={`产品类型`}>
              {getFieldDecorator(`type`, {
                rules: [{ required: true, message: '请选择产品类型!' }],
                initialValue: this.state.initData.type || '00'
              })(
                <Select onChange={value => {
                  this.setState({
                    isOffice: value === '00' ? false : true
                  })
                  const resetFields = ['materialName', 'produceName', 
                      'enterpriseRegAdd', 'produceAdd', 'productStructure', 'productScope', 'date', 'tfBrand']
                  this.props.form.validateFields((err, fieldsValue) => {
                    this.props.form.resetFields(resetFields);
                    let setFileds = {};
                    resetFields.map( (item, index) => setFileds[item] = fieldsValue[item])
                    this.props.form.setFieldsValue(setFileds)
                    if (!this.state.isOffice) {
                      this.props.form.setFieldsValue({registerNo: '无证'})
                    } else if (fieldsValue.registerNo === '无证') {
                      this.props.form.setFieldsValue({registerNo: this.state.initData.registerNo})
                    }
                  }) 
                }}
                  disabled={true}
                >
                  <Option value={'00'}>医疗器械</Option>
                  <Option value={'01'}>办公耗材</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={10} key={0}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label={`证件号`}>
              {getFieldDecorator(`registerNo`, {
                initialValue: this.state.initData.registerNo || '无证'
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} key={3}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label={`品牌`}>
              {getFieldDecorator(`tfBrand` , {
                rules: [{ required: true, message: '请选择品牌!' }],
                initialValue: this.state.initData.tfBrand
              })(
                <Select
                  showSearch
                  disabled={disabled}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    this.state.tfBrandOptions.map(
                      (item, index) => <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={10} key={4}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label={`资质有效期`}>
              {getFieldDecorator(`date`, {
                ...rule('请输入资质有效期'),
                initialValue: [moment(this.state.initData.firstTime || new Date(), 'YYYY-MM-DD'), 
              moment(this.state.initData.lastTime || new Date(), 'YYYY-MM-DD')]
              })(
                <RangePicker format="YYYY-MM-DD" disabled={disabled || this.state.isOffice}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} key={5}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label={`生产企业名称`}>
              {getFieldDecorator(`produceName`, {
                ...rule('请输入生产企业', 100),
                initialValue: this.state.initData.produceName
              })(
                <Input disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} key={6}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label={`企业注册地址`}>
              {getFieldDecorator(`enterpriseRegAdd`, {
                ...rule('企业注册地址', 100),
                initialValue: this.state.initData.enterpriseRegAddr
              })(
                <Input disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} key={7}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label={`生产地址`}>
              {getFieldDecorator(`produceAdd`, {
                ...rule('请输入生成地址', 100),
                initialValue: this.state.initData.produceAddr
              })(
                <Input disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} key={8}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label={`代理人名称`}>
              {getFieldDecorator(`agentName`, {
                rules: [
                  { max: 100, message: '不能超过100个字符'}
                ],
                initialValue: this.state.initData.agentName
              })(
                <Input disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} key={9}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label={`代理人地址`}>
              {getFieldDecorator(`agentAdd`, {
                rules: [
                  { max: 100, message: '不能超过100个字符'}
                ],
                initialValue: this.state.initData.agentAddr
              })(
                <Input disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} key={12}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label={`产品标准`}>
              {getFieldDecorator(`productStandard`, {
                rules: [
                  { max: 100, message: '不能超过100个字符'}
                ],
                initialValue: this.state.initData.productStandard
              })(
                <Input disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} key={11}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label={`适用范围及用途`}>
              {getFieldDecorator(`productScope`, {
                ...rule('请输入适用范围及用途', 2000),
                initialValue: this.state.initData.productScope
              })(
                <Input type="textarea" disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col span={10} key={10}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label={`产品结构描述及组成`}>
              {getFieldDecorator(`productStructure`, {
                ...rule('请输入产品结构描述及组成', 2000),
                initialValue: this.state.initData.productStructure
              })(
                <Input type="textarea" disabled={disabled}/>
              )}
            </FormItem>
          </Col>
           {
            this.state.isOffice ? null
            : <Col span={10} key={13}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label={`产品附件`}>
              <Upload 
                  disabled={disabled}                  
                  action={tender.IMAGE} 
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
          </Col>
             }
        </Row>
        {
          disabled ? null : 
          <Row>
            <Col span={10} push={10}>
              <Button type="primary" htmlType="submit" loading={this.state.dirtyClick}>提交</Button>
            </Col>
          </Row>
        }
      </Form>
    )  
  }
}

const WrappedSearchForm = Form.create()(StepOneForm);

class StepOne extends React.Component {
  render() {
    return (
      <div style={{marginTop: 10}}>
         <WrappedSearchForm cb={this.props.cb} state={this.props.state} rCertGuid={this.props.rCertGuid}/>
      </div>
    )
  }
}

class StepTwoAddForm extends React.Component {
  //添加品规
  state = {
    dirtyClick: false,
    leastUnitOptions: []
  }
  cancel = () => {
    this.props.form.resetFields();
    this.props.cb(false)
  }
   componentDidMount = () => {
    CommonData('UNIT', (data) => {
      this.setState({leastUnitOptions: data})
    })
  } 
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        this.setState({dirtyClick: true})
        fieldsValue.rCertGuid = this.props.rCertGuid;
        fieldsValue.registGuid = this.props.registGuid;
        fieldsValue.rFitemidGuid = this.props.initData.rFitemidGuid;
        console.log('postData => ', fieldsValue);
        fetch(this.props.url || tender.SAVE_MATERIAL, {
            method: 'post',
            mode:'cors',
            credentials: 'include',
            headers: {
              'Content-Type':'application/x-www-form-urlencoded'
            },
            body:querystring.stringify(fieldsValue)
        })       
         .then(res => {
          this.setState({dirtyClick: false})
          return res.json();
        })
        .then(data => {
          if(data.status) {
            this.props.search({registGuid: this.props.registGuid});
            message.success('添加成功!')
            this.props.cb(false);
          } else {
            message.success(data.msg);
          }
        })
        .catch(e => console.log("Oops, error", e))
      }
    })
  }    
  render () {

    const { getFieldDecorator } = this.props.form;
    const wrapStyle = {
      labelCol: {span: 4},
      wrapperCol: {span: 18}
    }
    return (
      <Form
        onSubmit={this.handleSubmit}
      >
        <Row>
          <Col span={24}>
            <Alert type={'info'} message="批量添加建议下载模板后导入" showIcon={true}/>
          </Col>
          <Col span={24}>
            <FormItem {...wrapStyle}  label={`型号`}>
              {getFieldDecorator(`fmodel`, {
                rules: [
                  { required: true, message: '请输入型号' },
                  { max: 200, message: '不能超过200个字符'}
                ],
                initialValue: this.props.initData.fmodel
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...wrapStyle} label={`规格`}>
              {getFieldDecorator(`spec`, {
                rules: [
                  { required: true, message: '请输入规格' },
                  { max: 200, message: '不能超过200个字符'}
                ],
                 initialValue: this.props.initData.spec
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...wrapStyle}  label={`最小单位`}>
              {getFieldDecorator(`leastUnit`, {
                rules: [
                  { required: true, message: '最小单位' },
                  { max: 200, message: '不能超过200个字符'}
                ],
                initialValue: this.props.initData.leastUnit
              })(
                <Select
                  allowClear={true}
                  showSearch={true}
                >
                  { 
                    this.state.leastUnitOptions.map((item, index) => 
                      <Option key={index} value={item.TF_CLO_NAME}>{item.TF_CLO_NAME}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...wrapStyle} label={`条码`}>
              {getFieldDecorator(`fbarCode`, {
                rules: [
                  { max: 200, message: '不能超过200个字符'}
                ],
                 initialValue: this.props.initData.fbarcode
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...wrapStyle} label={`REF`}>
              {getFieldDecorator(`ref`, {
                rules: [
                  { max: 200, message: '不能超过200个字符'}
                ],
                initialValue: this.props.initData.ref
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={22} style={{textAlign: 'right'}}>
            <Button type="primary" htmlType='submit' loading={this.state.dirtyClick}>保存</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.cancel}>取消</Button>
          </Col>
        </Row>  
      </Form>
    )
  }
}
const StepTwoAdd = Form.create()(StepTwoAddForm);
class StepTwoForm extends React.Component {
  state = {
    visible: false,
    dirtyClick: false
  }
  search = (e) => {
    this.props.form.validateFields((err, fieldsValue) => {
      this.props.search({...fieldsValue, registGuid: this.props.state.registGuid});
    })
  }
 save = () => {
    this.setState({dirtyClick: true})
    fetch(tender.SAVE_NEW_PRODUCT, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
          'Content-Type':'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({registGuid: this.props.state.registGuid})
    })
    .then(res => {
      this.setState({dirtyClick: false})
      return res.json();
    })
    .then(data => { 
      if (data.status) {
        this.props.next(2);
      } else {
        message.error(data.msg);
      }
    })
    .catch(e => console.log("Oops, error", e))
  }
  import = (list) => {
    if (list.file.status === 'done') {
      if (list.file.response.status) {
        message.success('导入成功');
        this.props.search({registGuid: this.props.state.registGuid});
      } else {
        message.error(list.file.response.msg);
      }
    }
  }
  cancel = () => {
    this.setState({visible: false})
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.search}
      >
        <Modal
          key={uuid()}         
          title="新增品规"
          visible={this.state.visible}
          footer={null}
          onCancel={this.cancel}
        >
          <StepTwoAdd 
            initData={{}}
            registGuid={this.props.state.registGuid}
            rCertGuid={this.props.rCertGuid} 
            search={this.props.search}
            cb={(status) => this.setState({visible: status})}/>
        </Modal> 
    {
        this.props.state.auditFstate === 'warning' ? 
          <Row>
          <Col span={4}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}}  label={`型号`}>
              {getFieldDecorator(`modelLike`)(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}}  label={`规格`}>
              {getFieldDecorator(`specLike`)(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={2}>
            <Button type="primary" htmlType="submit" style={{marginTop: 2}}>搜索</Button>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button type="danger" ghost onClick={this.props.cb.bind(this, 0)}>
              <Icon type="left" />上一页
            </Button>
            <Button ghost type="primary" style={{ marginLeft: 8 }} onClick={() => this.setState({visible: true})}>新增</Button>
            <Button style={{ marginLeft: 8,marginRight:8 }}>
              <Icon type='cloud-download'/> <a href={tender.DOWNLOAD}>下载</a>
            </Button>
              <Upload
                data={{registGuid: this.props.state.registGuid}}
                action={tender.TEMPLATE_IMPORT}
                showUploadList={false}
                onChange={this.import}
                withCredentials={true}
               
            >
                <Button style={{ marginRight: 8 }}>
                <Icon type='export'/> 导入
                </Button>
            </Upload>
          </Col>
          <Button style={{ marginLeft: 8 }} onClick={this.save} type="primary" loading={this.state.dirtyClick}>
            <Icon type='save'/> 提交
          </Button>
        </Row> : null
      }  
      </Form>
    )
  }
}


const WrappedFormTwo = Form.create()(StepTwoForm);
class StepTwo extends React.Component {
   state = {
    visible: false,
    initData: {}
  }
   query = (query={}) => {
    this.refs.table.fetch(query);
  }
  delete = (record) => {
    fetch(tender.DELETE_MATERIAL, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({rFitemidGuid: record.rFitemidGuid})
    })
    .then(res =>  res.json())
    .then(data => {
      if (data.status) {
        this.query({registGuid: this.props.state.registGuid})
      } else {
        message.error(data.msg);
      }
    })
    .catch(e => console.log("Oops, error", e))
  }
  edit = (record) => {
    this.setState({visible: true, initData: record})
  }
  render() {
    const columns = [
      {
        title : '操作',
        width: 100,
        render: (text, record) => {
            return this.props.state.auditFstate === 'warning'
                    ? <span>
                    <a onClick={this.edit.bind(this, record)}>编辑</a>
                    <span className="ant-divider" />
                    <Popconfirm 
                    title="是否确认删除" 
                    onConfirm={this.delete.bind(this, record)} 
                    okText="是" cancelText="否">
                      <a href="#">删除</a>
                    </Popconfirm>
                  </span>                
                  : null    
        }
      } , {
        title : '产品名称',
        dataIndex : 'materialName',
      } , {
        title : '型号',
        dataIndex : 'fmodel',
      } ,{
        title : '规格',
        dataIndex : 'spec',
      } ,{
        title : '条码',
        dataIndex : 'fbarcode',
      } ,{
        title : '最小单位',
        dataIndex : 'leastUnit',
      } ,{
        title : 'REF',
        dataIndex : 'ref',
      } 
    ];
    return (
      <div style={{marginTop: 10}}>
           <WrappedFormTwo next={this.props.cb} rCertGuid={this.props.rCertGuid} cb={this.props.cb} state={this.props.state} search={this.query}/>
        <Modal
          key={uuid()}
          title="编辑品规"
          visible={this.state.visible}
          footer={null}
          onCancel={() => this.setState({visible: false})}
        >
          <StepTwoAdd 
            search={this.query}
            url={tender.MATERIAL_UPDATE}
            initData={this.state.initData}
            reload={this.query.bind(this, {registGuid: this.props.registGuid})}
            cb={(status) => this.setState({visible: status})} 
            rCertGuid={this.props.rCertGuid}
            registGuid={this.props.state.registGuid}
          />
        </Modal>        
        <FetchTable 
          query={{registGuid: this.props.state.registGuid}}
          ref='table'
          rowKey={'rFitemidGuid'}
          url={tender.MODELS_LIST}
          columns={columns} 
        />
      </div>
    )
  }
}
class StepThree extends React.Component {
  state = {
    loading: false,
    visible: false,
    disabled:false,
    selectReason:'',
    dirtyClick: false,//通过
  }
  handerPass = ()=>{
    this.setState({dirtyClick: true});
    const values = {registGuid:this.props.state.registGuid,auditFstate:'02'}
    console.log('审核通过postData',values)
    //审核交互
    FetchPost(productUrl.CHECKPRODUCT,querystring.stringify(values))
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.setState({dirtyClick: false});
      if(data.status){
        message.success("审核通过");
        hashHistory.push('/checkdata/productMgt');
      }
      else{
        message.error(data.msg);
      }
    })
    .catch(e => console.log("Oops, error", e))
    
  };
  showModal = ()=>{
    this.setState({visible:true})
  }
  handerNotPass = ()=>{
    const that = this;
    that.showModal();
  }
  handleOk = () => {
    const failreason = this.refs.failReason.refs.input.value;
    const selectReason = failreason=== ""? this.state.selectReason:failreason;
    if(failreason.length>200){
      return message.error('长度不能超过200')
    }
    else if(failreason.length <=0 && selectReason.length<=0){
      return message.error('请输入反馈理由')
    }

    const values = {registGuid:this.props.state.registGuid,auditFstate:'03',failReason:selectReason}
    this.setState({ loading: true });
    console.log('审核不通过postData',values)
    //审核交互
    FetchPost(productUrl.CHECKPRODUCT,querystring.stringify(values))
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.setState({ loading: false, visible: false });
      if(data.status){
        message.success("操作成功!");
        hashHistory.push('/checkdata/productMgt');
      }
      else{
        message.error(data.msg);
      }
    })
    .catch(e => console.log("Oops, error", e))

  
  }
   handleCancel = () => {
    this.setState({ visible: false });
  }
 onChange = (value)=>{
      if(value === "其他"){
        this.setState({disabled:false})
        this.setState({selectReason:''})
      }
      else{
         this.setState({disabled:true})
         this.setState({selectReason:value})
      }
      
  }
  add = () => {
    this.props.cb(0);
  }
  redirect = () => {
    hashHistory.push('/checkdata/productMgt');
  }
  render() {
    return (
      <div>
      <Row>
        <Col span={24} style={{marginTop: 20}}>
          <Alert 
            message="产品信息已查看，请审核" 
            type="success" 
            showIcon={true}
            description={
              <div style={{marginTop: 40}}>
                <Button type='primary' onClick={this.handerPass} loading={this.state.dirtyClick}>审核通过</Button>
                <Button style={{marginLeft: 8}} onClick={this.handerNotPass}>审核不通过</Button>
              </div>
            }
          />
        </Col>
      </Row>
      <Modal
        visible={this.state.visible}
        title={'审核'}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
        <Button key="back" size="large"  onClick={this.handleCancel}>关闭</Button>,
        <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
            提交
        </Button>
        ]}
      >
       <Select placeholder="请选择反馈理由" style={{ width: 120 }} onChange={this.onChange}>
            <Option value="申请信息不完整">申请信息不完整</Option>
            <Option value="申请信息不真实">申请信息不真实</Option>
            <Option value="其他">其他</Option>
        </Select>
       <Input style={{marginTop:'16px'}} disabled={this.state.disabled} ref='failReason' type="textarea" rows={4}/>
      </Modal>
      </div>
    )
  }
}
class ApplyDetails extends React.Component {
  state = {
    current: 0,
    rCertGuid: ''
  }
  getSteps = (couldClick) => {
    const steps = [
      <Step key={1} title="证件信息" onClick={couldClick ? this.goIndex.bind(this, 0) : null}/>,
      <Step key={2} title="品规信息" onClick={couldClick ? this.goIndex.bind(this, 1) : null}/>
    ];
     if (!couldClick) {
      steps.push(
        <Step key={3} title="操作状态" icon={<Icon type="smile-o" onClick={couldClick ? this.goIndex.bind(this, 2) : null}/>} />
      )
    }
    return steps;
  }
  goIndex = (index) => {
    this.setState({
      current: index
    })
  }
  render () {
    const steps = [
      { content: <StepOne 
          state={this.props.location.state} 
          cb={index => this.goIndex(index)}
          rCertGuid={id => this.setState({rCertGuid: id})}
        />},
      { content: <StepTwo 
          state={this.props.location.state} 
          cb={index => this.goIndex(index)}
          rCertGuid={this.state.rCertGuid}
        />},
      { content: <StepThree state={this.props.location.state} cb={index => this.goIndex(index)}/>}
    ]
    const auditFstate = this.props.location.state.auditFstate;
    const couldClick = auditFstate === 'warning' ? false : true;
        return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={'/checkdata/productMgt'}>产品审核</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            详情
          </Breadcrumb.Item>
        </Breadcrumb>
        <Row style={{marginTop: 20}}>
          <Col span={24}>
            <Alert  
              type={this.props.location.state.auditFstate} 
              message={this.props.location.state.message}
              showIcon 
            />
          </Col>
        </Row>
        <Steps current={this.state.current} style={{marginTop: 20}}>
           {this.getSteps(couldClick)}
        </Steps>
        {steps[this.state.current].content}
      </div>
    )
  }
}
module.exports = ApplyDetails;