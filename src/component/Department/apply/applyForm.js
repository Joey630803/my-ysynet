/**
 * @file 高值/手术申请 信息展示表单
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker, Card, message, Modal } from 'antd';
import { department } from 'api';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const styles = {
  row: {
    marginTop: 10
  },
  card: {
    marginTop: 5
  },
  button: {
    marginRight: 5
  }
}

class InfoForm extends Component {
  state = {
    dept: {
      options: [],
      defaultValue: '',
    },
    storage: {
      options: [],
      defaultValue: ''
    }, 
    address: {
      options: []
    },
    apply: {
      options: []
    },
    tfAddress: '',
    storageName: '',
    operInfo: ''
  }
  getData = () => {
    const { form } = this.props;
    return form.getFieldsValue();
  }
  componentDidMount = () => {
    const { data, form, readonly } = this.props;
    let { storage, apply, tfAddress, storageName, operInfo } = this.state;//apply
    const getData = {values: data};
    fetchData(department.FINDDEPTSTORAGEBYUSER, {}, result => {
      if (getData.values) {
        if (getData.values.deptGuid) {
          const opts = result.filter(item => getData.values.deptGuid === item.value);
          storage.options = (opts.length && opts[0].children) ? opts[0].children : [];
          this.fetchAddr(getData.values.deptGuid);
        }
        if (getData.values.storageGuid) {
          //storage.options = [{value: getData.values.storageGuid, label: getData.values.storageName}];
          storage.defaultValue = getData.values.storageGuid;
          storageName = getData.values.storageName;
        }
        if (getData.values.addrGuid) {
          //address.options = [{value: getData.values.addrGuid, text: getData.values.tfAddress}];
          tfAddress = getData.values.tfAddress;
        }  
        if (getData.values.operNo) {
          apply.options = [{value: getData.values.operNo, 
                            label: getData.values.operInfo || getData.values.operNo}];
          operInfo = getData.values.operInfo;
        }
        if (getData.values.expectDate) {
          getData.values.expectDate = moment(getData.values.expectDate);
        }
        if (!readonly) {
          form.setFieldsValue({
            deptGuid: getData.values.deptGuid,
            storageGuid: getData.values.storageGuid,
            addrGuid: getData.values.addrGuid,
            expectDate: getData.values.expectDate,
            name: getData.values.name,
            gender: getData.values.gender,
            age: getData.values.age,
            operNo: getData.values.operNo,
            treatmentNo: getData.values.treatmentNo,
            operName: getData.values.operName,
            operDoctor: getData.values.operDoctor,
            operDate: getData.values.operDate,
            mzff: getData.values.mzff,
            operRoom: getData.values.operRoom,
            circuitNurse: getData.values.circuitNurse,
            bedNum: getData.values.bedNum,
            tfRemark: getData.values.tfRemark
          })
        }
      }

      this.setState({
        dept: {options: result, defaultValue: getData.values ? getData.values.deptGuid : ''},
        // storage: storage,
        // address: address,
        apply: apply,
        storageName: storageName,
        tfAddress: tfAddress,
        operInfo: operInfo
      })
    })
    
  }
  clearForm = () => {
    const { form } = this.props;
    let resetData = {
      name: '', gender: '', 
      age: '', operName: '', operDoctor: '', operDate: '',
      mzff: '', operRoom: '', circuitNurse: '', bedNum: '',
      tfRemark: '', treatmentNo: '', operNo: ''
    }
    form.setFieldsValue(resetData)
    this.props.clearFunc(form.getFieldsValue());
  }
  deptChangeAction = (value) => {
    const { options } = this.state.dept;
    const opts = options.filter(item => value === item.value);
    const storageOptions = (opts.length && opts[0].children) ? opts[0].children : [];
    this.setState({
      dept: {
        options: this.state.dept.options,
        defaultValue: value
      },  
      storage: {
        options: storageOptions,
        defaultValue: ''
      },
      apply: {
        options: []
      },
      tfAddress: '',
      storageName: '',
      operInfo: ''
    })
    this.fetchAddr(value);
  }
  //科室切换
  deptChangeHandler = (value) => {
    const defaultValue = this.state.dept.defaultValue;
    if (value !== defaultValue) {
      const { form, dataSource } = this.props;
      if (form.getFieldValue('name') || form.getFieldValue('treatmentNo') 
      || (dataSource ? dataSource.length : dataSource)) {
        confirm({
          title: '是否切换科室?',
          content: '切换科室会清空当前录入数据,是否确定切换',
          okText: '是',
          okType: 'danger',
          cancelText: '否',
          onOk: () => {
            form.setFieldsValue({storageGuid: '', addrGuid: ''});
            this.clearForm(value, true)
            this.deptChangeAction(value)
          },
          onCancel: () => {
            form.setFieldsValue({
              deptGuid: defaultValue
            })
          },
        });
      } else {
        form.setFieldsValue({storageGuid: '', addrGuid: ''});
        this.deptChangeAction(value);
      }
    }
  }
  //库房切换回调
  stoargeChangeAction = (value, option) => {
    this.setState({
      storageName: option.props.children,
      storage: {
        options: this.state.storage.options,
        defaultValue: value
      },
      apply: {
        options: []
      }
    })
  }
  //库房切换
  storageChangeHandler = (value, option) => {
    const { form, dataSource } = this.props;
    const defaultValue = this.state.storage.defaultValue;
    if (value !== defaultValue) { 
      if (form.getFieldValue('name') || form.getFieldValue('treatmentNo')
      || (dataSource ? dataSource.length : dataSource)) {
        confirm({
          title: '是否切换库房?',
          content: '切换库房会清空当前录入数据,是否确定切换',
          okText: '是',
          okType: 'danger',
          cancelText: '否',
          onOk: () => {
            this.clearForm(value)
            this.stoargeChangeAction(value, option)
          },
          onCancel: () => {
            form.setFieldsValue({
              storageGuid: defaultValue
            })
          },
        });
      } else {
        this.stoargeChangeAction(value, option)
      }
    }
  }
  //获取手术单信息
  getOperNo = (e) => {
    const value = e.target.value;
    if (value) {
      fetchData(department.QUERY_OPER, querystring.stringify({treatmentNo: value}), data => {
        const { result } = data;
        let options = [];
        result.map(item => (
          options.push(
          { value: item.operRecord.operNo, label: item.operInfo , info: item})
        ))
        const { apply } = this.state;
        apply.options = options;
        this.setState({ apply })
      })
    }
  }
  //获取地址
  fetchAddr = (val) => {
    const { form } = this.props;
    fetchData(department.FINDDEPTADDRESS, querystring.stringify({deptGuid: val}), data => {
      const options = data.result;
      let tfAddress = '';
      options.map(item => {
        tfAddress = item.text;
        return item.isDefault ? form.setFieldsValue({addrGuid: item.value}) : null;
      })
      this.setState({
        tfAddress: tfAddress,
        address: { options },
      })
    })
  }
  //根据手术申请单回填表单
  backfill = (value, e) => {
    const { form } = this.props;
    const data = e.props.info;
    const { treatmentRecord, operRecord } = data;
    this.setState({operInfo: e.props.children})
    if ( this.props.getOtherInfo ) {
      this.props.getOtherInfo({treatmentRecord, operRecord})
    }
    form.setFieldsValue({
      name: treatmentRecord.name,
      gender: treatmentRecord.gender,
      age: treatmentRecord.age,
      operName: operRecord.operName,
      operDoctor: operRecord.operDoctor,
      operDate: operRecord.operDate,
      mzff: operRecord.mzff,
      operRoom: operRecord.operRoom,
      circuitNurse: operRecord.circuitNurse,
      bedNum: operRecord.bedNum,
      tfRemark: operRecord.tfRemark
    });
  }
  //选择模板
  chose = () => {
    const { form, choseTemple } = this.props;
    form.validateFields(['deptGuid', 'storageGuid'], (error, values) => {
      if (error) {
        return message.warning('请选择科室以及库房!');
      }
      const { tfAddress, storageName, operInfo } = this.state;
      choseTemple({...form.getFieldsValue(), tfAddress, storageName, operInfo});
    })
  }
  add = () => {
    const { form, addFunc } = this.props;
    form.validateFields(['deptGuid', 'storageGuid'], (error, values) => {
      if (error) {
        return message.warning('请选择科室以及库房!');
      }
      const { tfAddress, storageName, operInfo } = this.state;
      addFunc({...form.getFieldsValue(), tfAddress, storageName, operInfo});
    })
  }
  render () {
    const { form, readonly, choseTemple, type, data, delFunc } = this.props;
    const { dept, storage, address, apply } = this.state;
    return (
      <Card style={styles.card}>
        <Form>
          <Row>
            <Col span={6} key={1}>
              <FormItem {...formItemLayout} label={`申请科室`}>
                { 
                  readonly && data ? <span> { data.deptName }</span>:
                  form.getFieldDecorator(`deptGuid`, {
                    rules: [{ required: true, message: '请选择科室!' }]
                  })(<Select onSelect={this.deptChangeHandler}>
                    {
                      dept.options.map((item, index) => (
                        <Option value={item.value} key={index}>{item.label}</Option>
                      ))
                    }
                    </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6} key={2}>
              <FormItem {...formItemLayout} label={`备货库房`}>
                { 
                  readonly && data ? <span> { data.storageName }</span>:
                  form.getFieldDecorator(`storageGuid`, {
                    rules: [{ required: true, message: '请选择库房!' }]
                  })(
                  <Select
                    onSelect={this.storageChangeHandler}
                  >
                    {
                      storage.options.map((item, index) => (
                        <Option value={item.value} key={index}>{item.label}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6} key={3}>
              <FormItem {...formItemLayout} label={`收货地址`}>
                {
                  readonly && data ? <span>{ data.tfAddress } </span> :
                  form.getFieldDecorator(`addrGuid`, {
                    rules: [{ required: true, message: '请选择地址!' }]
                  })(
                  <Select 
                    allowClear={true}
                    onSelect={(value, option) => this.setState({tfAddress: option.props.children})}
                  >
                  {
                    address.options.map((item, index) => (
                      <Option value={item.value} key={index}>{item.text}</Option>
                    ))
                  }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6} key={4}>
              <FormItem {...formItemLayout} label={`到货时间`}>
                {
                  (readonly && data) ? <span>{ moment(data.expectDate).format('YYYY-MM-DD') } </span> :
                  form.getFieldDecorator(`expectDate`, {
                    rules: [{ required: true, message: '请选择到货时间!' }]
                  })(
                    <DatePicker/>
                )}
              </FormItem>
            </Col>
          </Row>
          <hr/>
          <Row style={styles.row}>
            <Col span={6} key={5}>
              <FormItem {...formItemLayout} label={`就诊号`}>
                {
                  readonly && data ? <span>{ data.treatmentNo} </span> :
                  form.getFieldDecorator(`treatmentNo`, {
                    rules: [{ required: true, message: '请输入就诊号!' }]
                  })(
                  <Input
                    placeholder='输入完成请按回车'
                    onPressEnter={this.getOperNo}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={16} key={6}>
              <FormItem  labelCol={{ span: 3 }} wrapperCol={{ span: 15 }} label={`手术申请单`}>
                {
                  readonly && data ? <span>{ data.operNo} </span> :
                  form.getFieldDecorator(`operNo`)(
                    <Select
                      onSelect={this.backfill}
                    >
                    {
                      apply.options.map((item, index) => {
                        return <Option value={item.value} key={'i'+index} info={item.info}>{item.label}</Option>
                      })
                    }
                    </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6} key={7}>
              <FormItem {...formItemLayout} label={`患者姓名`}>
                {
                  readonly && data ? <span>{ data.name} </span> :
                  form.getFieldDecorator(`name`)(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={6} key={8}>
              <FormItem {...formItemLayout} label={`性别`}>
                {
                  readonly && data ? <span>{ data.gender } </span>:
                  form.getFieldDecorator(`gender`)(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={6} key={9}>
              <FormItem {...formItemLayout} label={`年龄`}>
                {
                  readonly && data ?  <span>{ data.age } </span>:
                  form.getFieldDecorator(`age`)(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <hr/>
          <Row style={styles.row}>
            <Col span={6} key={10}>
              <FormItem {...formItemLayout} label={`手术名称`}>
                {
                  readonly && data ? <span>{ data.operName } </span> :
                  form.getFieldDecorator(`operName`)(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={6} key={11}>
              <FormItem {...formItemLayout} label={`手术医生`}>
                {
                  readonly && data ? <span>{ data.operDoctor } </span>:
                  form.getFieldDecorator(`operDoctor`)(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={6} key={12}>
              <FormItem {...formItemLayout} label={`手术日期`}>
                {
                  readonly && data ? <span>{ data.operDate } </span> :
                  form.getFieldDecorator(`operDate`)(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={6} key={13}>
              <FormItem {...formItemLayout} label={`麻醉方式`}>
                {
                  readonly && data ? <span>{ data.mzff } </span>:
                  form.getFieldDecorator(`mzff`)(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={6} key={14}>
            <FormItem {...formItemLayout} label={`手术间`}>
                {
                  readonly && data ? <span>{ data.operRoom } </span>:
                  form.getFieldDecorator(`operRoom`)(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={6} key={15}>
              <FormItem {...formItemLayout} label={`巡回护士`}>
                {
                  readonly && data ? <span>{ data.circuitNurse } </span>:
                  form.getFieldDecorator(`circuitNurse`)(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={6} key={16}>
              <FormItem {...formItemLayout} label={`床位号`}>
                {
                  readonly && data ? <span>{ data.bedNum } </span> :
                  form.getFieldDecorator(`bedNum`)(
                  <Input disabled={true}/>
                )}
              </FormItem>
            </Col>
            <Col span={12} key={17} pull={2}>
              <FormItem {...formItemLayout} label={`备注`}>
                {
                  readonly && data ? <span>{ data.tfRemark } </span>:
                  form.getFieldDecorator(`tfRemark`)(
                  <Input/>
                )}
              </FormItem>
            </Col>
            {
              readonly ? null :
              <Col span={8} key={18} push={6}>
                {
                  choseTemple ? 
                  <Button type='primary' style={styles.button} onClick={this.chose}>选择模板</Button>
                  : null
                }
                <Button style={styles.button} onClick={this.add}>{`添加${type}`}</Button>
                <Button type='primary' ghost onClick={ delFunc }>{`删除${type}`}</Button>
              </Col>
            }
          </Row>
        </Form>
      </Card>
    )
  }
}
const ApplyForm = Form.create()(InfoForm);

export default ApplyForm; 