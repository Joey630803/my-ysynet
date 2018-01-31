import React from 'react';
import { Breadcrumb, Row, Col, Steps, Icon, Form, Input, 
         Select, Button, DatePicker, Upload, Modal, message,
         Alert, Popconfirm } from 'antd';
import { Link, hashHistory } from 'react-router';
import { tender } from 'api';
import { CommonData,  } from 'utils/tools';
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
    instrumentCode:[],
    tfAccessoryFile: '',
    fileList: [

    ],
    dirtyClick: false,
    initData: { 

    }
  }
  componentDidMount = () => {
     if (this.props.registGuid) {
        fetch(tender.REGISTER_INFO, {
            method: 'post',
            mode:'cors',
            credentials: 'include',
            headers: {
             'Content-Type':'application/x-www-form-urlencoded'
            },
            body: querystring.stringify({registGuid: this.props.registGuid})
        })
        .then(res => res.json())
        .then(data => {
          this.setState({
            isOffice: data.result.type === '01' ? true : false,
            initData: data.result
          })
          if (data.result.tfAccessoryFile) {
            this.setState({
              fileList: [
                { 
                  uid: -1,
                  name: '图片.png',
                  status: 'done',
                  thumbUrl: tender.FTP + data.result.tfAccessoryFile,
                  url: tender.FTP + data.result.tfAccessoryFile
                }
              ],
            })
          }
        })
        .catch(e => console.log("Oops, error", e))
     }
     CommonData('TF_BRAND', (data) => {
       this.setState({tfBrandOptions: data})
     })
       //68分类
    CommonData('INSTRUMENT_CODE', (data) => {
       this.setState({instrumentCode:data})
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({dirtyClick: true})
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        this.setState({dirtyClick: false})
        return;
      } else {
        fieldsValue.firstTime = typeof fieldsValue.date !== 'undefined' ?
                                moment(fieldsValue.date[0]).format('YYYY-MM-DD') : 'unedfiend';
        fieldsValue.lastTime = typeof fieldsValue.date !== 'undefined' ?
                                moment(fieldsValue.date[1]).format('YYYY-MM-DD') : 'unedfiend';
        fieldsValue.tfAccessoryFile = this.state.fileList.length > 0 ? this.state.fileList[0].thumbUrl : '';
        fieldsValue.rCertGuid = this.state.initData.rCertGuid;
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
          this.setState({dirtyClick: false})
          return res.json();
        })
        .then(data => {
          if (data.status) {
            this.props.cb(1, data.result.rCertGuid, data.result.registGuid);
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
    const rule = !this.state.isOffice ? 
    (aMessage, max) => {
      let rule = {
        rules: [
          { required: true, message: aMessage }
        ]
      }
      if (typeof max !== 'undefined') {
        rule.rules.push({ max: max, message: `超过${max}字符` });
      }
      return rule;
    } : () => {};
    return (
      <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label={`产品类型`}>
              {getFieldDecorator(`type`, {
                rules: [{ required: true, message: '请选择产品类型!' }],
                initialValue: this.state.initData.type || '00'
              })(
                <Select onChange={value => {
                  this.setState({
                    isOffice: value === '00' ? false : true
                  })
                  const resetFields = ['materialName', 'produceName', 
                      'enterpriseRegAdd', 'produceAdd', 'productStructure','instrumentCode', 'productScope', 'date', 'tfBrand']
                  this.props.form.validateFields((err, fieldsValue) => {
                    this.props.form.resetFields(resetFields);
                    let setFileds = {};
                    resetFields.map( (item, index) => setFileds[item] = fieldsValue[item])
                    this.props.form.setFieldsValue(setFileds)
                    if (!this.state.isOffice) {
                      this.props.form.setFieldsValue({registerNo: '无证'})
                    } else if (fieldsValue.registerNo === '无证') {
                      this.props.form.setFieldsValue({registerNo: ''})
                    }
                  }) 
                }}>
                  <Option value={'00'}>医疗器械</Option>
                  <Option value={'01'}>办公耗材</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={`证件号`}>
              {getFieldDecorator(`registerNo`, {
                initialValue: this.state.initData.registerNo ||
                   (this.state.isOffice ? '无证' : null)
              })(
                <Input disabled={this.state.isOffice}/>
              )}
            </FormItem>
            <FormItem 
                {...formItemLayout}
                label={`68分类`}>
                {getFieldDecorator(`instrumentCode`, {
                  ...rule('请选择68分类'),
                  initialValue: this.state.initData.instrumentCode
                })(
                  <Select
                   disabled={this.state.isOffice}
                    placeholder="请选择"
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      this.state.instrumentCode.map(
                        (item, index) => <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>)
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={`资质有效期`}>
              {getFieldDecorator(`date`, 
                { ...rule('请输入资质有效期'),
                 initialValue: [moment(this.state.initData.firstTime || new Date(), 'YYYY-MM-DD'), 
                                moment(this.state.initData.lastTime || new Date(), 'YYYY-MM-DD')]
                })(
                <RangePicker format="YYYY-MM-DD" />
              )}
            </FormItem>
              <FormItem {...formItemLayout} label={`品牌`}>
              {getFieldDecorator(`tfBrand`, {
                rules: [{ required: true, message: '请选择品牌!' }],
                initialValue: this.state.initData.tfBrand
              })(
                <Select
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
            <FormItem {...formItemLayout} label={`生产企业名称`}>
              {getFieldDecorator(`produceName`, {
                ...rule('请输入生产企业', 200),
                initialValue: this.state.initData.produceName
              }
                )(
                <Input/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={`企业注册地址`}>
              {getFieldDecorator(`enterpriseRegAdd`, {
                ...rule('企业注册地址', 200),
                initialValue: this.state.initData.enterpriseRegAddr
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={`生产地址`}>
              {getFieldDecorator(`produceAdd`, {
                ...rule('请输入生成地址', 200),
                initialValue: this.state.initData.produceAddr
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={`产品名称`}>
              {getFieldDecorator(`materialName`, {
                rules: [{ required: true, message: '请输入产品名称!' }],
                initialValue: this.state.initData.materialName
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={`产品标准`}>
              {getFieldDecorator(`productStandard`, {
                rules: [
                  { max: 200, message: '不能超过200个字符'}
                ],
                initialValue: this.state.initData.productStandard
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={`产品结构描述及组成`}>
              {getFieldDecorator(`productStructure`, {
                ...rule('请输入产品结构描述及组成', 2000),
                initialValue: this.state.initData.productStructure
              })(
                <Input type="textarea"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout}label={`适用范围及用途`}>
              {getFieldDecorator(`productScope`, {
                ...rule('请输入适用范围及用途', 2000),
                initialValue: this.state.initData.productScope
              })(
                <Input type="textarea"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={`产品禁忌`}>
                {getFieldDecorator(`taboo`,{
                  initialValue: this.state.initData.taboo,
                  rules: [
                    { max: 250, message: '不能超过250个字符'}
                  ]
                })(
                  <Input type="textarea"/>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label={`代理人名称`}>
              {getFieldDecorator(`agentName`, {
                rules: [
                  { max: 200, message: '不能超过200个字符'}
                ],
                initialValue: this.state.initData.agentName
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={`代理人地址`}>
              {getFieldDecorator(`agentAdd`, {
                rules: [
                  { max: 200, message: '不能超过200个字符'}
                ],
                initialValue: this.state.initData.agentAddr
              })(
                <Input/>
              )}
            </FormItem>
             <FormItem 
                {...formItemLayout}
                label={`售后服务机构`}>
                {getFieldDecorator(`afterService`, {
                  initialValue: this.state.initData.afterService,
                  rules: [
                    { max: 250, message: '不能超过250个字符'}
                  ]
                })(
                  <Input/>
                )}
              </FormItem>
              <FormItem {...formItemLayout}label={`备注`}>
                {getFieldDecorator(`tfRemark`,{
                  initialValue: this.state.initData.tfRemark,
                  rules: [
                    { max: 250, message: '不能超过250个字符'}
                  ]
                })(
                  <Input type="textarea"/>
                )}
              </FormItem>
              {
                this.state.isOffice ? null :
                  <FormItem {...formItemLayout} label={`产品附件`}>
                    <Upload 
                        action={tender.IMAGE} 
                        fileList={this.state.fileList}
                        listType="picture-card"
                        disabled={this.state.isOffice}
                        onChange={({fileList}) => this.setState({fileList})}
                        showUploadList={{showPreviewIcon:true,showRemoveIcon:true}}
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
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" loading={this.state.dirtyClick}>提交</Button>
          </FormItem>

      </Form>
    )  
  }
}

const WrappedSearchForm = Form.create()(StepOneForm);

class StepOne extends React.Component {
  render() {
    return (
      <div style={{marginTop: 10}}>
        <WrappedSearchForm cb={this.props.cb} registGuid={this.props.registGuid}/>
      </div>
    )
  }
}

class StepTwoAddForm extends React.Component {
  state = {
    dirtyClick: false,
    leastUnitOptions: []
  }
  componentDidMount = () => {
    CommonData('UNIT', (data) => {
      this.setState({leastUnitOptions: data})
    })
  }  
  cancel = () => {
    this.props.form.resetFields();
    this.props.cb(false)
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        this.setState({dirtyClick: true})
        console.log('postData => ', fieldsValue);
        fieldsValue.rCertGuid = this.props.rCertGuid;
        fieldsValue.rFitemidGuid = this.props.initData.rFitemidGuid;
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
            message.success('添加成功!')
            this.props.reload();
          } else {
            message.error(data.msg);
          }
          this.props.cb(false);
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
      this.props.search({...fieldsValue, registGuid: this.props.registGuid});
    })
  }
  reload = () => {
    this.props.search({
      registGuid: this.props.registGuid
    });
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
        body: querystring.stringify({registGuid: this.props.registGuid})
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
    if (list.file.response.status) {
      message.success('导入成功');
      this.props.search({registGuid: this.props.registGuid});
    } else {
      message.error(list.file.response.msg);
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
          okText="确认"
          cancelText="取消"
        >
          <StepTwoAdd 
            initData={{}}
            reload={this.reload}
            cb={(status) => this.setState({visible: status})} 
            rCertGuid={this.props.rCertGuid}
          />
        </Modal>
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
          <Button style={{ marginLeft: 8 }}>
            <Icon type='cloud-download'/> <a href={tender.DOWNLOAD}>下载</a>
          </Button>
          <Upload
            data={{registGuid: this.props.registGuid}}
            action={tender.TEMPLATE_IMPORT}
            withCredentials={true}
            showUploadList={false}
            onChange={this.import}
          >
            <Button style={{ marginLeft: 8 }}>
              <Icon type='export'/> 导入
            </Button>
          </Upload>
        </Col>
        <Button style={{ marginLeft: 8 }} onClick={this.save} type="primary" loading={this.state.dirtyClick}>
          <Icon type='save'/> 提交
        </Button>
      </Row>
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
        this.query({registGuid: this.props.registGuid})
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
          return <span>
                    <a onClick={this.edit.bind(this, record)}>编辑</a>
                    <span className="ant-divider" />
                    <Popconfirm 
                    title="是否确认删除" 
                    onConfirm={this.delete.bind(this, record)} 
                    okText="是" cancelText="否">
                      <a href="#">删除</a>
                    </Popconfirm>
                  </span>          
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
        <WrappedFormTwo 
          next={this.props.cb}
          visible={this.state.visible}
          cb={this.props.cb} 
          search={this.query} 
          registGuid={this.props.registGuid}
          rCertGuid={this.props.rCertGuid}
          initData={this.state.initData}
        />
        <Modal
          key={uuid()}
          title="编辑品规"
          visible={this.state.visible}
          footer={null}
          onCancel={() => this.setState({visible: false})}
        >
          <StepTwoAdd 
            url={tender.MATERIAL_UPDATE}
            initData={this.state.initData}
            reload={this.query.bind(this, {registGuid: this.props.registGuid})}
            cb={(status) => this.setState({visible: status})} 
            rCertGuid={this.props.rCertGuid}
          />
        </Modal>
        <FetchTable 
          query={{registGuid: this.props.registGuid}}
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
  add = () => {
    this.props.cb(0);
  }
  redirect = () => {
    hashHistory.push('/tender/apply');
  }
  render() {
    return (
      <Row>
        <Col span={24} style={{marginTop: 20}}>
          <Alert 
            message="添加成功" 
            type="success" 
            showIcon={true}
            description={
              <div style={{marginTop: 40}}>
                <Button type='primary' onClick={this.add}>继续添加</Button>
                <Button style={{marginLeft: 8}} onClick={this.redirect}>返回招标我的提交列表</Button>
              </div>
            }
          />
        </Col>
      </Row>
    )
  }
}


class ProductAdd extends React.Component {
  state = {
    current: 0,
    rCertGuid: '',
    registGuid: ''
  }
  goIndex = (index) => {
    this.setState({
      current: index
    })
  }
  render() {
    const steps = [
      { content: <StepOne 
        registGuid={this.state.registGuid} 
        cb={(index, rCertGuid, registGuid) => {
          this.setState({
            rCertGuid, registGuid
          })
          this.goIndex(index)
        }}
      />},
      { content: <StepTwo 
        cb={index => this.goIndex(index)}
        registGuid={this.state.registGuid}
        rCertGuid={this.state.rCertGuid}
      />},
      { content: <StepThree cb={index => {
        this.goIndex(index)
        this.setState({
          rCertGuid: '',
          registGuid: ''
        })
      }}/>}
    ]
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={'/tender/apply'}>我的提交</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            添加
          </Breadcrumb.Item>
        </Breadcrumb>
        <Steps current={this.state.current} style={{marginTop: 20}}>
          <Step title="证件信息"/>
          <Step title="品规信息"/>
          <Step title="操作完成" icon={<Icon type="smile-o" />} />
        </Steps>
        {steps[this.state.current].content}
      </div>
    )
  }
}

module.exports = ProductAdd;