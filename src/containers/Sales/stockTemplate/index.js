/**
 * @file 
 */
import React from 'react';
import { Layout, Row, Col, Select, Button, Popconfirm,
        Tree, Form, Modal, Input, message,Tabs } from 'antd';
import uuid from 'uuid';
import { throttle, fetchData,cutString } from 'utils/tools';
import { sales } from 'api';
import moment from 'moment';
import querystring from 'querystring';
import Product from './product';
import OperBag from './operBag';
const { Sider, Content } = Layout;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class AddTemplateForm extends React.Component {
  state = {
    storageName: null
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        values.rOrgId = this.props.data.rOrgId;
        console.log('新增模板 => ', values);
        fetchData(sales.CREATEEDITGKTEMPLATE, querystring.stringify(values),(data)=>{
          if (data) {
            let template = {};//是否更新数组
            template = { 
              gkTemplateName: values.gkTemplateName, 
              gkTemplateGuid: data,
              rStorageGuid: values.rStorageGuid,
              rStorageName: this.state.storageName || this.props.data.rStorageName,
            };
            this.props.cb(true, template);
            message.success('模板添加成功!');
          } else {
            message.error('模板添加失败!');
          }
        })
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
            <FormItem {...addrWrapper} label={`需方库房`}>
              {getFieldDecorator(`rStorageGuid`, {
                rules: [
                  { required: true, message: '请选择需方库房'}
                ],
                initialValue: this.props.data.rStorageGuid
              })(
                <Select
                  allowClear={true}
                  onSelect={(val, e) => this.setState({storageName: e.props.children})}
                >
                  { this.props.data.options.map( (item, index) => {
                    return <Option key={index} value={item.value}>{item.text}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col> 
          <Col span={24} key={1} >
            <FormItem {...addrWrapper} label={`模板名称`}>
              {getFieldDecorator(`gkTemplateName`, {
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
    rStorageGuid:'',
    rStorageName:'',
    rOrgId:'',
    storageOptions: [],//库房下拉
    infoForm: {
      storage: {

      }
    },
    template: {
      id: '',
      name: ''
    },//选择模板
    selectedNodes: [],//选中模板
    dataSource: [],//产品数据
    operBagDataSource:[],//手术包数据
    headerData: [],//手术包table头
    query: {

    },
    searchName: '',
    selectedArr: [],
    selectedRows: [],
    isPagination: true,//是否分页
  }
  componentDidMount() {
    //获取库房下拉框数据
    fetchData(sales.SOURCESTORAGEFORSELECT, {}, (data) => {
        this.setState({  storageOptions: data});
    })
  }
  //树子节点点击
  treeSelectHandler = (selectedKeys, e) => {
    if (selectedKeys.length) {
      const template = {
        id: selectedKeys[0],
        name: e.node.props.dataTitle
      };
      //获取产品数据
      fetchData(sales.SEARCHGKTEMPLATEDETAILS,querystring.stringify({gkTemplateGuid:template.id}),(data) => {
        if(data.status){
          this.setState({dataSource:data.result.rows})
        }else{
          message.error("后台异常!")
        }
        
      })
       //获取手术包数据
       fetchData(sales.SEARCHGKTEMPLATEPACKAGES,querystring.stringify({gkTemplateGuid:template.id,rOrgId:this.state.rOrgId}),(data) => {
          if(data.status){
            this.setState({operBagDataSource:data.result})
          }else{
            message.error("后台异常!")
          }
      })
       //获取table的头
       fetchData(sales.QUERYPACCOLUMNS,querystring.stringify({rOrgId:this.state.rOrgId,gkTemplateGuid:template.id}),(data) => {
            if(data.status){
              this.setState({ headerData : data.result})
            }else{
              message.error("后台异常!")
            }
      })

      if(this.refs.reset){
        this.refs.reset.productReset();
      }
      

      this.setState({
        template, 
        infoForm: {
          storage: e.node.props.storage
        },
        selectedNodes: selectedKeys, 
        url: sales.SEARCHGKTEMPLATEDETAILS,
        isPagination: true,

      })
    } else {
      this.setState({ template:{}, selectedNodes: [], 
        url: null,
        dataSource:[],
        isPagination: false, storage: {}, infoForm: {}})
    }
  }
  //明细删除
  detailsDel = () => {
    if (this.state.template.id) {
      const templateDetailGuids = this.state.selectedArr;
      fetchData(sales.DELETE_DETAILS, querystring.stringify({templateDetailGuids: templateDetailGuids}),(data)=>{
        if (data.status) {
          message.success('删除成功!');
          this.refs.table.fetch({
            gkTemplateGuid: this.state.template.id,
            searchName: this.state.searchName
          })
          this.setState({selectedArr: []});
        } else {
          message.error(data.msg);
        }
      })
    } else {
      message.warn('请选择模板');
    }
  }
  //模板删除
  templateDel = () => {
    if (this.state.template.id) {
      //删除成功
      fetchData(sales.DELETEGKTEPMLATE,querystring.stringify({gkTemplateGuid:this.state.template.id}),(data)=>{
       
        if (data.status) {
          const { gData } = this.state;
          console.log(gData,'121')
          gData.map((item, index) => {
            if (item.gkTemplateGuid === this.state.template.id) {
              gData.splice(index, 1);
            }
            return null;
          }) 
          this.setState({gData, template: {},
            infoForm:{},
             url: null,
             dataSource:[],
              isPagination: false})
        } else {
          message.warn(data.msg);
        }
      })
    } else {
      message.warn('请先选中一条记录!')
    }
  }
 
  //获取模板  key 类别
  getTemplate = (val,options) => {
    let postData = {};
    console.log( '库房id:' + val)
    if(val){
      postData.rStorageGuid = val;
      const rOrgId = options.props.rOrgId;
      this.setState({rStorageGuid:val,rOrgId:rOrgId,rStorageName:options.props.children})
    }
    //获取模板数据
    fetchData(sales.SEARCHGKTEMPLATELIST, querystring.stringify(postData),(data) =>{
      console.log(data,"根据库房id获取模板")
         this.setState({
            infoForm: {},
            gData: data, 
            selectedNodes: [], 
            template: {}, 
            url: null, 
            dataSource:[],
            isPagination: false
          });
    })
  }
  /**
   * @desc 修改模板名
   */
  editTemplateName = (templateName) => {
    const { template, rStorageGuid } = this.state;
    template.name = templateName;
    fetchData(sales.CREATEEDITGKTEMPLATE, querystring.stringify({
      gkTemplateGuid: template.id,
      gkTemplateName: templateName,
      rStorageGuid: rStorageGuid
    }),(data)=>{
      if (data) {
        const { gData } = this.state;
        gData.map((item, index) => {
          if (item.gkTemplateGuid === template.id) {
            gData[index].gkTemplateName = template.name;
          }
          return null;
        })
        this.setState({gData});
      }
    })

  }

  //切换tabs的时候保存产品数据
  save = () => {

    //更新产品时需要最新的产品
    //fetchData(sales.SEARCHGKTEMPLATEDETAILS,querystring.stringify({gkTemplateGuid:this.state.template.id}),(data) => {
 
     // const dataSource = data.result.rows;
     const dataSource = this.state.dataSource;
      let postData = {};
      const gkTemplateGuid = this.state.template.id
      postData.gkTemplateGuid = gkTemplateGuid;
      if (dataSource.length > 0) {
        postData.attributeId = this.state.query.attributeId;
        postData.tfBrand = this.state.query.tfBrand;
        postData.searchName = this.state.query.searchName;
        let gkTemplateDetails = [];
        dataSource.map( (item, index) => {
          if(item.tfAmount!==0){
            return gkTemplateDetails.push({
              gkTemplateGuid:gkTemplateGuid,
              gkTemplateDetailGuid: item.gkTemplateDetailGuid,
              tenderMaterialGuid: item.tenderMaterialGuid,
              tfAmount: item.tfAmount,
              flot: item.flot,
              prodDate: item.prodDate ? moment(item.prodDate).format('YYYY-MM-DD') : '',
              usefulDate: item.usefulDate ? moment(item.usefulDate).format('YYYY-MM-DD') : '',
            })
          }
          return null;
        })
        postData.gkTemplateDetails = gkTemplateDetails;
      }
      console.log(postData,"postData")
      fetchData(sales.UPDATEGKTEMPLATEDETAILS,JSON.stringify(postData),(data)=>{
        if (data.status) {
          this.setState({dataSource:dataSource})
          console.log("保存成功")
        } else {
          message.error(data.msg)
        }
      },'application/json')
    //})
    
  }
  //切换tabs的时候保存手术包
  saveOperBag = () =>{
    if(this.state.operBagDataSource.packages){
      const operBagDataSource = this.state.operBagDataSource.packages;
      let postData = {};
      postData.gkTemplateGuid = this.state.template.id;
      postData.packageList = operBagDataSource.slice(1,operBagDataSource.length-1);
      fetchData(sales.UPDATEGKTEMPLATEPACS,JSON.stringify(postData),(data)=>{
        if (data.status) {
          console.log("保存成功")
        } else {
          message.error(data.msg)
        }
      },'application/json')
    }
  }
  render() {

    const loop = data => data.map((item) => {
      if (item.gkTemplateGuid) {
        return <TreeNode key={item.gkTemplateGuid} dataTitle={item.gkTemplateName} title={cutString(item.gkTemplateName,20)} 
                storage={{text: item.rStorageName, value: item.rStorageGuid}}/>;
      }
      return null;
    });
    const query = typeof this.props.location.query === 'undefined' ? {} : this.props.location.query
    const selectTab = typeof query.activeKey === 'undefined' ? 'product' : query.activeKey;
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
                      if(template.rStorageGuid === this.state.rStorageGuid)
                      {
                        gData.push(template);
                      }
                    }
                    this.setState({visible: false, gData})
                  }}
                  data={{ 
                    rStorageGuid: this.state.rStorageGuid,
                    rStorageName: this.state.rStorageName,
                    rOrgId: this.state.rOrgId,
                    options: this.state.storageOptions
                  }}
                />
              </Modal>
            <Sider style={{backgroundColor: '#fff'}}>
              <Row style={{marginTop: 2}}>
                <Col> 
                  库房
                  <Select
                    placeholder="请选择库房"
                    value={this.state.rStorageGuid|| '请选择'}
                    style={{ width: 150, marginLeft: 10  }}
                    onSelect={this.getTemplate}
                  >
                    { this.state.storageOptions.map( (item, index) => {
                      return <Option rOrgId={item.rOrgId} key={index} value={item.value}>{item.text}</Option>
                    })}
                  </Select>
                </Col>  
              </Row>
              <Row style={{marginTop: 6, marginLeft: 20}}>
                <Col>
                  <Button type="primary" onClick={() => {
                    if (this.state.rStorageGuid) {
                      this.setState({visible: true})
                    } else {
                      message.warn('请先选择库房');
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
                    draggable={false}	
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
                        <label>需求库房</label>
                      </div>
                      <div className="ant-col-18">
                        <div className="ant-form-item-control">
                          <Input disabled={true} value={ this.state.infoForm.storage ? this.state.infoForm.storage.text : ''}/>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>  
                <Tabs defaultActiveKey={selectTab} onTabClick={(key)=>{
                  if(key === "operBag"){
                    if(this.state.template.id){
                      //手术包和产品切换的时候保存产品 
                      this.save();
                      //获取手术包数据
                      fetchData(sales.SEARCHGKTEMPLATEPACKAGES,querystring.stringify({gkTemplateGuid:this.state.template.id,rOrgId:this.state.rOrgId}),(data) => {
                        this.setState({operBagDataSource:data.result})
                      })
                     
                    }else{
                      return message.error("请选择模板!")
                    }

                  }else if(key === "product"){
                    //保存手术包
                    this.saveOperBag();
                  }

                  }}>
                    <TabPane tab="产品" key="product">
                        <Product 
                        ref='reset'
                        router={this.props.router} 
                        search={(query)=>{this.setState({query:query})}}
                        cb={(data)=>{this.setState({dataSource:data})}}
                        data={{ template : this.state.template ,
                                rOrgId : this.state.rOrgId ,
                                storage:this.state.infoForm.storage, 
                                dataSource:this.state.dataSource,
                                url:this.state.url,
                                }}/>
                    </TabPane>
                    <TabPane tab="手术包" key="operBag">
                        <OperBag 
                        router={this.props.router} 
                        callback={(data)=>{this.setState({operBagDataSource:data})}}
                        data={{ template: this.state.template ,
                        rOrgId : this.state.rOrgId,
                        headerData: this.state.headerData,
                        dataSource: this.state.operBagDataSource,
                        }}/>
                    </TabPane>
                </Tabs>
          
              </Content>
            </Layout>
          </Layout>
        }
      </div>  
    )
  }
}
module.exports = Template