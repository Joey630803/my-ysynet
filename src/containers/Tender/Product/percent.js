/**
 * @file 比例
 */
import React from 'react';
import { Breadcrumb, Modal, Form, Row, Col, Button, InputNumber, 
          Select, message, Popconfirm } from 'antd';
import { Link } from 'react-router';
import FetchTable from 'component/FetchTable';
import { tender } from 'api';
import { CommonData } from 'utils/tools';
import querystring from 'querystring';
import uuid from 'uuid';
const FormItem = Form.Item;
const Option = Select.Option;


class PercentForm extends React.Component {
  componentDidMount = () => {
      CommonData('UNIT', (data) => {
        this.setState({unitOptions: data})
      })
      const postData = {
        tenderGuid: this.props.state.tenderGuid
      }
      fetch(tender.TENDER_SUPPLIER, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring.stringify(postData)
      })
      .then(res => res.json())
      .then(data => this.setState({supplyOptions: data.result.rows}))
      .catch(e => console.log("Oops, error", e))
  }
  state = {
    dirtyClick: false,
    unitOptions: [],
    supplyOptions: []
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      console.log(err, fieldsValue.conversion)
      if (err && fieldsValue.conversion) {
        return;
      } else {
        this.setState({dirtyClick: true})
        fieldsValue.fitemid = this.props.state.fitemid;
        fieldsValue.tenderGuid = this.props.state.tenderGuid;
        fieldsValue.sourceGuid = fieldsValue.fOrgName;
        fieldsValue.attributeGuid = this.props.data.attributeGuid;
        const url = typeof this.props.data.attributeGuid === 'undefined' ?
                      tender.TENDER_ADD_ORG : tender.PERCENT_UPDATE
        console.log('postData => ', fieldsValue);
        fetch(url, {
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
          if (data.status) {
            this.props.cb(false);
            message.success('保存成功!')
          } else {
            message.error(data.msg)
          }
        })
        .catch(e => console.log("Oops, error", e))
      }
    })
  }
  cancel = () => {
    this.props.cb(false, false);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const wrapStyle = {
      labelCol: {span: 4},
      wrapperCol: {span: 18}
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col span={24}>
            <FormItem {...wrapStyle}  label={`供应商`}>
              {getFieldDecorator(`fOrgName`, {
                rules: [
                  { required: true, message: '请输入供应商'},
                ],
                initialValue: this.props.data.fOrgName
              })(
                <Select
                  showSearch
                  disabled={this.props.data.fOrgName ? true : false}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    this.state.supplyOptions.map(
                      (item, index) => <Option key={index} value={item.value}>{item.text}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...wrapStyle} label={`采购比例`}>
              {getFieldDecorator(`purchaseRatio`, {
                rules: [
                  { required: true, message: '请输入采购比例'},
                  { type: 'number', message: '只允许输入数字'}
                ],
                initialValue: this.props.data.purchaseRatio
              })(
                <InputNumber style={{width: 300}} min={0} max={1} step={0.1} size={'large'}/>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...wrapStyle}  label={`价格`}>
              {getFieldDecorator(`tenderPrice`, {
                rules: [
                  { required: true, message: '请输入价格'},
                  { type: 'number', message: '只允许输入数字'}
                ],
                initialValue: this.props.data.tenderPrice
              })(
                <InputNumber style={{width: 300}} min={0} step={0.01} size={'large'}/>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...wrapStyle} label={`单位`}>
              {getFieldDecorator(`tenderUnit`, {
                rules: [
                  { required: true, message: '请输入单位'}
                ],
                initialValue: this.props.data.tenderUnit
              })(
                <Select
                  style={{width: 300}}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    this.state.unitOptions.map(
                      (item, index) => <Option key={index} value={item.TF_CLO_NAME}>{item.TF_CLO_NAME}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...wrapStyle} label={`转换率`}>
              {getFieldDecorator(`conversion`, {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: this.props.data.conversion,
                 rules: [
                  {pattern: /^[0-9]*[1-9][0-9]*$/,message:'只能是正整数'}
                 ]
              })(
                <InputNumber min={1} max={9999}  style={{width:250}}/>
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
const ModalForm = Form.create()(PercentForm);

class ProductPercent extends React.Component {
  state = {
    title: '',
    visible: false
  }
  cancel = () => {
    this.setState({visible: false})
  }
  modal = (title, record) => {
    this.setState({visible: true, title: title, initData: record})
  }
  query = (v=false, type=true) => {
    if (type) {
      this.refs.table.fetch()
    }
    this.setState({visible: v})
  }
  delete = (record) => {
    fetch(tender.PERCENT_DELETE, {
      method: 'post',
      mode:'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: querystring.stringify({attributeGuid: record.attributeGuid})
    })
    .then(res => res.json())
    .then(data => this.query())
    .catch(e => console.log("Oops, error", e))
  }
  render() {
    const columns = [{
        title : '操作',
        dataIndex : 'attributeGuid',
        render: (text, record) => {
          return <span>
                    <a onClick={this.modal.bind(this, '编辑', record)}>编辑</a>
                    <span className="ant-divider" />
                    <Popconfirm 
                    title="是否确认删除" 
                    onConfirm={this.delete.bind(this, record)} 
                    okText="是" cancelText="否">
                      <a href="#">删除</a>
                    </Popconfirm>
                  </span>
        }
    },{
        title : '供应商',
        dataIndex : 'fOrgName'
    },{
        title : '采购比例',
        dataIndex : 'purchaseRatio'
    },{
        title : '招标单位',
        dataIndex : 'tenderUnit'
    },{
        title : '价格',
        dataIndex : 'tenderPrice',
        className: 'column-number'
    },{
        title : '转换率',
        dataIndex : 'conversion'
    }]
    return (
      <div>
        <Breadcrumb ref={'aaaa'}>
          <Breadcrumb.Item>
            <Link to={'/tender/product'}>招标产品</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            采购比例
          </Breadcrumb.Item>
        </Breadcrumb>
        <Modal
          key={uuid()}
          title={this.state.title}
          visible={this.state.visible}
          footer={null}
          onCancel={this.cancel}
          okText="确认"
          cancelText="取消"
        >
          <ModalForm 
            cb={(v, type) => this.query(v, type)}
            data={this.state.initData}
            state={this.props.location.state}
          />
        </Modal>
        <Row style={{marginTop: 20}}>
          <Col span={24}>
            <Button type="primary" onClick={this.modal.bind(this, '新增', {})}>新增</Button>
          </Col>
        </Row>
        <FetchTable
          ref='table'
          query={{tenderGuid: this.props.location.state.tenderGuid}}
          columns={columns}
          rowKey={'attributeGuid'}
          url={tender.PERCENT_LIST}
          isPagination={false}
        />
      </div>
    )
  }
}

module.exports = ProductPercent;