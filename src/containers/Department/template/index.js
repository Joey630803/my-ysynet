/**
 * @file 
 */
import React from 'react';
import { Layout, Row, Col, Select, Button, Popconfirm,
        Tree, Form, Modal, Input, message } from 'antd';
import uuid from 'uuid';
import FetchTable from 'component/FetchTable';
import { throttle, objCompare, fetchData } from 'utils/tools';
import { department } from 'api';
import { hashHistory } from 'react-router';
import querystring from 'querystring';
const { Sider, Content } = Layout;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const Search = Input.Search;

class AddTemplateForm extends React.Component {
  state = {
    storageName: null
  }
  handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
      });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        console.log('新增模板 => ', values);
        const deptGuid = this.props.data.dept.value;
        values.deptGuid = deptGuid;
        fetchData(department.CREATE_EDIT_TEMPLATE, querystring.stringify(values),(data)=>{
          if (data) {
            let template = {};//是否更新数组
            template = { 
              templateName: values.templateName, 
              templateId: data,
              deptGuid: deptGuid,
              deptName: this.props.data.dept.text,
              storageGuid: values.storageGuid,
              storageName: this.state.storageName || this.props.data.storage.text
            };
            this.props.cb(true, template);
            message.success('模板添加成功!');
          } else {
            this.handleError('添加模板失败！');
          }
        });
      }
    });
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    const addrWrapper = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col span={24} key={2} >
            <FormItem {...addrWrapper} label={`备货库房`}>
              {getFieldDecorator(`storageGuid`, {
                rules: [
                  { required: true, message: '请选择备货库房'}
                ],
                initialValue: this.props.data.storage.value
              })(
                <Select
                  allowClear={true}
                  onSelect={(val, e) => this.setState({storageName: e.props.children})}
                >
                  { this.props.data.options.map( (item, index) => {
                    return <Option key={index} value={item.value}>{item.label}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col> 
          <Col span={24} key={1} >
            <FormItem {...addrWrapper} label={`模板名称`}>
              {getFieldDecorator(`templateName`, {
                rules: [
                  { required: true, message: '请输入模板名称' },
                  { max: 50, message: '长度不能超过50' }
                ]
              })(
                <Input/>
              )}
            </FormItem>
          </Col> 
         <Col span={24} key={8} style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button style={{marginLeft: 10}} onClick={this.props.cb.bind(this, false)}>取消</Button>
          </Col> 
        </Row> 
      </Form>  
    )
  }
}

const WrappedTemplateForm = Form.create()(AddTemplateForm);


/**
 * @desc 模板
 */
class Template extends React.Component {
  state = {
    gData: [],//模板列表
    total: 0,
    url: null,
    visible: false,
    deptAndStorage: [],//级联数据
    deptOptions: [],//科室下拉框
    storageOptions: [],//库房下拉
    infoForm: {
      storage: {

      }
    },
    dept: {
      text: '',
      value: ''
    },//选择科室
    storage: {
      text: '',
      value: ''
    },//选择库房
    template: {
      id: '',
      name: ''
    },//选择模板
    selectedNodes: [],//选中模板
    dataSource: [],//表格数据,用于清空
    query: {

    },
    searchName: '',
    selectedArr: [],
    selectedRows: [],
    isPagination: true//是否分页
  }
  handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
      });
  }
  componentDidMount() {
    //获取下拉框数据
    fetchData(department.DEPT_STORAGE_SELECT, {}, (data) => {
        let options = [], dept = {}, storageOptions = [];
        let flag = false;//库房是否存在
        const templateDept = JSON.parse(localStorage.getItem('templateDept'));
        data.map( item => {
          const opt = { value: item.value, text: item.label};
          options.push(opt);
          if (objCompare(opt, templateDept)) {
            flag = true;
          }
          return null;
        });
        if (templateDept && flag) {
          dept = templateDept;
          storageOptions = this.getStorage(dept.value, data)
          //获取下拉框数据
          fetchData(
            department.TEMPLATE_BY_DEPTANDSTORAGE, 
            querystring.stringify({deptGuid: dept.value}), 
            (data) => {
              this.setState({
                gData: data, 
              });
            })
        }
        this.setState({ dept, deptOptions: options, deptAndStorage: data, storageOptions: storageOptions});
    })
  }
  onDrop = (info) => {
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    //const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // const dragNodesKeys = info.dragNodesKeys;
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.templateId === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const gData = this.state.gData;
    let dragObj;
    loop(gData, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    gData.splice(Number(dropPos[dropPos.length - 1]), 0, dragObj);
    let templateIds = [];
    gData.map(item => templateIds.push(item.templateId));
    fetchData(department.SORT_TEMPLATE, querystring.stringify({templateIds: templateIds}),(data)=>{
      if (data.status) {
        this.setState({ gData: gData });
      }else{
        this.handleError(data.msg);
      }
    });
  }
  //树子节点点击
  treeSelectHandler = (selectedKeys, e) => {
    if (selectedKeys.length) {
      const template = {
        id: selectedKeys[0],
        name: e.node.props.title
      };
      this.setState({
        template, 
        infoForm: {
          storage: e.node.props.storage
        },
        selectedNodes: selectedKeys, 
        url: department.GET_TEMPLATE_DETAILS,
        isPagination: true,
        query: {templateId: selectedKeys[0]}
      })
    } else {
      this.setState({template: {}, selectedNodes: [], url: null, query: {}, isPagination: false, storage: {}, infoForm: {}})
    }
  }
  //明细删除
  detailsDel = () => {
    if (this.state.template.id) {
      const templateDetailGuids = this.state.selectedArr;
      fetchData(department.DELETE_DETAILS, querystring.stringify({templateDetailGuids: templateDetailGuids}),(data)=>{
        if (data.status) {
          message.success('删除成功!');
          this.refs.table.fetch({
            templateId: this.state.template.id,
            searchName: this.state.searchName
          })
          this.setState({selectedArr: []});
        } else {
          this.handleError(data.msg);
        }
      });
    } else {
      message.warn('请选择模板');
    }
  }
  //模板删除
  templateDel = () => {
    if (this.state.template.id) {
      //删除成功
      fetchData(department.DELETE_TEMPLATE, querystring.stringify({templateId: this.state.template.id}),(data)=>{
        if (data.status) {
          const { gData } = this.state;
          gData.map((item, index) => {
            if (item.templateId === this.state.template.id) {
              gData.splice(index, 1);
            }
            return null;
          }) 
          this.setState({gData, template: {}, url: null, isPagination: false})
        } else {
          message.warn(data.msg);
        }
      });
    } else {
      message.warn('请先选中一条记录!')
    }
  }
  /**
   * val deptId
   * data default options
   */
  getStorage = (val, data) => {
    let storageOptions = [];
    const options = data || this.state.deptAndStorage;
    options.map(item => {
      if (item.value === val) {
        return storageOptions = item.children;
      }
      return null;
    })
    return storageOptions;
  }
  //获取模板  key 类别
  getTemplate = (key, val, e) => {
    let state = {}, postData = {};
    if (key === 'dept') {
      //查询所有 
      console.log('科室id:' + val, '库房:全部')
      const storageOptions = this.getStorage(val);
      state = {dept: {text: e.props.children, value: val}, storageOptions, storage: {}};
      localStorage.setItem('templateDept', JSON.stringify({text: e.props.children, value: val}))
      postData.deptGuid = val;
    } else {
      console.log('科室id:' + this.state.dept.value, '库房id:' + val)
      state = {storage: {text: e.props.children, value: val}};
      postData.deptGuid = this.state.dept.value;
      postData.storageGuid = val;
    }
    //获取下拉框数据
    fetchData(department.TEMPLATE_BY_DEPTANDSTORAGE, querystring.stringify(postData),(data)=>{
      this.setState({
        ...state, 
        infoForm: {},
        gData: data, 
        selectedNodes: [], 
        template: {}, 
        url: null, 
        isPagination: false
      });
    });
  }
  /**
   * @desc 修改模板名
   */
  editTemplateName = (templateName) => {
    const { template, dept, storage } = this.state;
    template.name = templateName;
    fetchData(department.CREATE_EDIT_TEMPLATE, querystring.stringify({
      templateId: template.id,
      templateName: templateName,
      deptGuid: dept.value,
      storageGuid: storage.value
    }),(data)=>{
      if (data) {
        const { gData } = this.state;
        gData.map((item, index) => {
          if (item.templateId === template.id) {
            gData[index].templateName = template.name;
          }
          return null;
        })
        this.setState({gData});
      }
    });
  }
  render() {
    const loop = data => data.map((item) => {
      if (item.templateId) {
        return <TreeNode key={item.templateId} title={item.templateName} 
                storage={{text: item.storageName, value: item.storageGuid}}/>;
      }
      return null;
    });
    const columns = [{
      title: '通用名称',
      dataIndex: 'geName',
      fixed: 'left',
      width: 150
    }, {
      title: '产品名称',
      dataIndex: 'materialName',
    }, {
      title: '规格',
      dataIndex: 'spec',
    }, {
      title: '型号',
      dataIndex: 'fmodel',
    }, {
      title: '品牌',
      dataIndex: 'tfBrandName',
      width: 100
    }, {
      title: '采购单位',
      dataIndex: 'purchaseUnit',
      width: 75
    }, {
      title: '包装规格',
      dataIndex: 'tfPacking',
      width: 100
    }, {
      title: '生产商',
      dataIndex: 'produceName',
    }, {
      title: '采购价格',
      dataIndex: 'purchasePrice',
      width: 100,
      render: (text, record, index) => {
        return text === 'undefined' ? '0.00' : text.toFixed(2)
      }
    }, {
      title: '需求数量',
      dataIndex: 'amount',
      fixed: 'right',
      width: 80,
      render: (text, record, index) => {
        return <Input  defaultValue={ text || 1} onInput={ e => {
          if (e.target.value > 9999) {
            e.target.value = 9999;
            record.amount = 9999;
            return message.warn('输入数值过大, 不能超过10000')
          } else {
            record.amount = e.target.value;
            const templateId = this.state.template.id,
                  templateDetailGuid = record.templateDetailGuid,
                  purchasePrice = record.purchasePrice,
                  amount = e.target.value;
            throttle( () => {
              fetchData(department.EDIT_AMOUNT, querystring.stringify({
                templateId: templateId,
                templateDetailGuid: templateDetailGuid,
                purchasePrice: purchasePrice,
                amount: amount
              }),(data)=>{
                if(data.status){
                  document.querySelector('#total').innerHTML = data.result.totalPrice;
                }else{
                  this.handleError('请输入非0正整数');
                }
              })
            })
          }
        }}/>
      }
    }, {
      title: '金额',
      dataIndex: 'money',
      render: (text, record, index) => {
        const amount = isNaN(record.amount) ? 1 : record.amount;
        return (amount * record.purchasePrice).toFixed(2) 
      },
      fixed: 'right',
      width: 100
    }
  ];
    return (
      <div>
        { this.props.children || 
            <Layout>
              <Modal
                key={uuid()}
                title="新增模板"
                visible={this.state.visible}
                footer={null}
                onCancel={() => this.setState({visible: false})}
              >    
                <WrappedTemplateForm 
                  cb={(flag, template, storage) => {
                    const { gData } = this.state;
                    if (flag) {
                      gData.push(template);
                    }
                    this.setState({visible: false, gData})
                  }}
                  data={{ 
                    dept: this.state.dept,
                    storage: this.state.storage,
                    options: this.state.storageOptions
                  }}
                />
              </Modal>
            <Sider style={{backgroundColor: '#fff'}}>
              <Row>
                <Col>
                  科室
                  <Select
                    placeholder="请选择科室"  
                    value={this.state.dept.value}
                    onSelect={this.getTemplate.bind(this, 'dept')}
                    style={{ width: 150, marginLeft: 10 }}>
                    { this.state.deptOptions.map( (item, index) => {
                      return <Option key={index} value={item.value} children={item.children}>{item.text}</Option>
                    })}
                  </Select>
                </Col>
              </Row>
              <Row style={{marginTop: 2}}>
                <Col> 
                  库房
                  <Select
                    placeholder="请选择库房"
                    value={this.state.storage.value || '全部'}
                    style={{ width: 150, marginLeft: 10  }}
                    onSelect={this.getTemplate.bind(this, 'storage')}
                  >
                    { this.state.storageOptions.map( (item, index) => {
                      return <Option key={index} value={item.value}>{item.label}</Option>
                    })}
                  </Select>
                </Col>  
              </Row>
              <Row style={{marginTop: 6, marginLeft: 20}}>
                <Col>
                  <Button type="primary" onClick={() => {
                    if (this.state.dept.value) {
                      this.setState({visible: true})
                    } else {
                      message.warn('请先选择科室!');
                    }
                  }}>创建</Button>
                  <Popconfirm title="是否删除选中模板?" onConfirm={this.templateDel} okText="是" cancelText="否">
                    <Button style={{marginLeft: 8}}>删除</Button>
                  </Popconfirm>
                </Col>
              </Row>
              <Row style={{marginTop: 2}}>
                <Col>
                  <Tree
                    onSelect={this.treeSelectHandler}
                    selectedKeys={this.state.selectedNodes}
                    draggable={true}	
                    onDrop={this.onDrop}
                  >
                    {loop(this.state.gData)}
                  </Tree>
                </Col>
              </Row>
            </Sider>
            <Layout>
              <Content style={{ backgroundColor: '#fff' }}>
                <Row>
                  <Col className="ant-col-8">
                      <div className="ant-row">
                        <div className="ant-col-6 ant-form-item-label-left">
                          <label>模板名称</label>
                        </div>
                        <div className="ant-col-18">
                          <div className="ant-form-item-control">
                            <Input 
                              value={this.state.template.name}
                              onBlur={(e) => {
                                const { template } = this.state;
                                console.log(e.target.value)
                                if (template.id && !e.target.value) {
                                  this.editTemplateName('无标题模板');
                                }
                              }}
                              onInput={ (e) => {
                                const { template } = this.state;
                                const templateName = e.target.value;
                                template.name = templateName;
                                this.setState({template});
                                if (template.id) {
                                  throttle( () => {
                                    this.editTemplateName(templateName)
                                  })
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                  </Col>
                  <Col className="ant-col-8" style={{marginLeft: 16}}>
                    <div className="ant-row">
                      <div className="ant-col-6 ant-form-item-label-left">
                        <label>备货库房</label>
                      </div>
                      <div className="ant-col-18">
                        <div className="ant-form-item-control">
                          <Input readOnly value={ this.state.infoForm.storage ? this.state.infoForm.storage.text : ''}/>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>  
                <Row>
                  <Col span={16} style={{marginTop: 2}}>
                    <Search
                      placeholder="产品名称/通用名称/规格/型号/品牌"
                      style={{ width: 300 }}
                      onSearch={value => {
                        if (this.state.template.id) {
                          this.refs.table.fetch({
                            searchName: value,
                            templateId: this.state.template.id
                          })
                          this.setState({searchName: value})
                        } else {
                          message.warn('请选择模板');
                        }
                      }}
                    />
                  </Col>
                  <Col style={{textAlign: 'right'}}>
                    <Button 
                      style={{marginRight: 5}} 
                      type="primary"
                      onClick={() => {
                        const { template, dept } = this.state;
                        const { storage } = this.state.infoForm;
                        if (template.id) {
                            hashHistory.push({
                              pathname: '/department/template/add',
                              state: { template, dept, storage }
                            })
                        } else {
                          message.warn('请选择模板!');
                        }
                      }}
                    >添加</Button>
                    <Popconfirm title="是否删除选中产品?" onConfirm={this.detailsDel} okText="是" cancelText="否">
                      <Button style={{marginLeft: 8}}>删除</Button>
                    </Popconfirm>
                  </Col>
                </Row>  
                <FetchTable 
                  url={this.state.url}
                  query={this.state.query}  
                  rowKey={'templateDetailGuid'}
                  ref='table'
                  columns={columns} 
                  pageSize={10}
                  scroll={{ x: '150%' }}
                  isPagination={this.state.isPagination}
                  rowSelection={{
                    selectedRowKeys: this.state.selectedArr,
                    onChange: (selectedRowKeys, selectedRows) => 
                      this.setState({selectedArr: selectedRowKeys})
                  }}
                  footer={(currentPageData) => {
                    return (
                      <h3>总金额: 
                        <span style={{color: '#f46e65', fontSize: '1.2rem'}} id='total'>
                          { currentPageData.length ? currentPageData[0].total : this.state.total}
                        </span>
                      </h3>
                    )
                  }}  
                />
              </Content>
            </Layout>
          </Layout>
        }
      </div>  
    )
  }
}
module.exports = Template