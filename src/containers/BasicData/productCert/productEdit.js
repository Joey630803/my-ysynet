/**
 * @file 产品编辑
 */
import React from 'react';
import { Breadcrumb, Form, Input,Button,message,Tabs,Table,Popconfirm,Modal,Select,Row,Col} from 'antd';
import { Link,hashHistory } from 'react-router';
import querystring from 'querystring';
import { fetchData,CommonData } from 'utils/tools';
import { productUrl } from 'api';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
class EditForm extends React.Component {
   state = {
    dirtyClick: false,
    unitData: [],
    gkData: []
  }
  componentDidMount = () => {
    //单位
    CommonData('UNIT', (data) => {
      this.setState({unitData:data})
    })
    //骨科产品属性
    CommonData('GKATTRIBUTE', (data) => {
      this.setState({gkData:data})
    })
  }
   //处理错误信息
  handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
      });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            this.setState({dirtyClick: true});
            values.certGuid = this.props.data.certGuid;
            values.fitemid = this.props.data.fitemid;
            fetchData(productUrl.MODELACTIONS_BYCERTID,querystring.stringify(values),(data)=>{
                this.setState({dirtyClick: false});
                if(data.status){
                  hashHistory.push({pathname:'/basicData/productCert/product',state:this.props.data});
                  message.success("操作成功!");
                }
                else{
                  this.handleError(data.msg);
                }
            })
       }
    });
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
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="组件名称"
          hasFeedback
        >
          {getFieldDecorator('suitName', {
            rules: [{ required: true, message: '请输入账号!' },
             {max: 50, message: '长度不能超过50'}],
             initialValue: data.suitName
          })(
            <Input />
          )}
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="型号"
        >
          {getFieldDecorator('fmodel',{
               rules: [{ required: true, message: '请输入型号!' },
               {max: 50, message: '长度不能超过50'}],
               initialValue:data.fmodel
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="规格"
        >
          {getFieldDecorator('spec',{
               rules: [{ required: true, message: '请输入规格!' },
               {max: 250, message: '长度不能超过250'}],
               initialValue: data.spec
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="最小单位"
        >
        {getFieldDecorator('leastUnit',{
               rules: [{ required: true, message: '请输入最小单位!' }],
               initialValue: data.leastUnit
          })(
            <Select 
            placeholder={'请选择'}  
            style={{width:200}}
            showSearch
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {
                this.state.unitData.map((item,index) => {
                  return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                  })
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="骨科产品属性"
        >
          {getFieldDecorator('attributeId',{
             initialValue: data.attributeId
          })(
            <Select 
            placeholder={'请选择'}  
            style={{width:200}}
            showSearch
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {
                this.state.gkData.map((item,index) => {
                  return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                  })
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="产品材质"
        >
          {getFieldDecorator('tfTexture',
          
          {
            rules: [
              {max: 50, message: '长度不能超过50'}],
              initialValue: data.tfTexture
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="条形码"
        >
          {getFieldDecorator('fbarcode',{
             rules: [
              {max: 50, message: '长度不能超过50'}],
            initialValue: data.fbarcode
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const ProductEditForm = Form.create()(EditForm);

//编辑的主信息
class ProductEdit extends React.Component {
  state = {
    packTextureList: this.props.location.state.packTextureList === null ? [] : this.props.location.state.packTextureList,
    packSpecList: this.props.location.state.packSpecList=== null ?[] : this.props.location.state.packSpecList,
    refList: this.props.location.state.refList=== null ? [] : this.props.location.state.refList,
    packTextureAddData:'',
    packSpecAddData:'',
    refAddData:''
  }
   //处理错误信息
  handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: <div dangerouslySetInnerHTML={{__html:data}}></div>,
        okText: '确定'
      });
  }
  onDelete = (key) => {
    let values ={};
    const guids = [];
    guids.push(key);
    values.guids = guids;
    fetchData(productUrl.DELETEMATERIALEXTENDS,querystring.stringify(values),(data) => {
      if(data.status){
        this.onReload();
        message.success("删除成功!")
      }else{
        this.handleError(data.msg)
      }
    })
    
  }
  //查询
  onReload = () => {
    fetchData(productUrl.MODELLIST_BYCERTID,querystring.stringify(
      {fitemid:this.props.location.state.fitemid,certGuid:this.props.location.state.certGuid}),(data) => {
        if(data.status){
          this.setState({
            packTextureList: data.result.rows[0].packTextureList === null ?  [] : data.result.rows[0].packTextureList,
            packSpecList: data.result.rows[0].packSpecList === null ?  [] : data.result.rows[0].packSpecList,
            refList: data.result.rows[0].refList === null ?  [] : data.result.rows[0].refList,
          })
        }
    })
  }
  /**
   * 包装材质
   */
  handlePackTextureAdd = () => {
    if(this.state.packTextureAddData.edit){
      return message.info("请先保存数据后添加数据!")
    }
    const { packTextureList } = this.state;
    const newData = {
      variableValue: `test`+(packTextureList.length+1),
      edit:true
    };
    this.setState({
      packTextureList: [...packTextureList, newData],
      packTextureAddData: newData
    });
  }
  handlePackTextureOnChange =  (record, index,e)  =>{
    record.variableValue = e.target.value;
    this.setState({ packTextureAddData: record})
  }

  handlePackTextureSave = (index) =>{
    const AddData = this.state.packTextureAddData;
    let values ={};
    values.fitemid = this.props.location.state.fitemid;
    values.variableName = "packTexture";
    values.variableValue = AddData.variableValue;
    console.log(values,"包装材质保存数据")
    fetchData(productUrl.ADDMATERIALEXEND,JSON.stringify(values),(data) => {
      if(data.status){
        this.onReload();
        this.setState({
          packTextureAddData:"",
          packSpecAddData : "",
          refAddData : ""
        });
        message.success("操作成功!")
      }else{
        this.handleError(data.msg)
      }
    },'application/json')
  }
  
  /**
   * 包装规格
   */
  handlepackSpecAdd = () => {
    console.log(this.state.packSpecAddData,"包装规格")
    if(this.state.packSpecAddData.edit){
      return message.info("请先保存数据后添加数据!")
    }
    const { packSpecList } = this.state;
    const newData = {
      variableValue: `test`+(packSpecList.length+1),
      edit:true
    };
    this.setState({
      packSpecList: [...packSpecList, newData],
      packSpecAddData: newData
    });
  }

  handlepackSpecOnChange =  (record, index,e)  =>{
    record.variableValue = e.target.value;
    this.setState({ packSpecAddData: record})
  }

  handlepackSpecSave = (index) =>{
    const AddData = this.state.packSpecAddData;
    let values ={};
    values.fitemid = this.props.location.state.fitemid;
    values.variableName = "packSpec";
    values.variableValue = AddData.variableValue;
    console.log(values,"包装规格保存数据")
    fetchData(productUrl.ADDMATERIALEXEND,JSON.stringify(values),(data) => {
      if(data.status){
        this.onReload();
        this.setState({
          packTextureAddData:"",
          packSpecAddData : "",
          refAddData : ""
        });
        message.success("操作成功!")
      }else{
        this.handleError(data.msg)
      }
    },'application/json')
  }

  /**
   * REF
   */
  handleRefAdd = () => {
    if(this.state.refAddData.edit){
      return message.info("请先保存数据后添加数据!")
    }
    const { refList } = this.state;
    const newData = {
      variableValue: `test`+(refList.length+1),
      edit:true
    };
    this.setState({
      refList: [...refList, newData],
      refAddData: newData
    });
  }
  handleRefOnChange =  (record, index,e)  =>{
    record.variableValue = e.target.value;
    this.setState({ refAddData: record})
  }
  handleRefSave = (index) =>{
    let refList = this.state.refList;
    refList[index].edit = false;
    const AddData = this.state.refAddData;
    let values ={};
    values.fitemid = this.props.location.state.fitemid;
    values.variableName = "ref";
    values.variableValue = AddData.variableValue;
    console.log(values,"Ref保存数据")
    fetchData(productUrl.ADDMATERIALEXEND,JSON.stringify(values),(data) => {
      if(data.status){
        this.onReload();
        this.setState({
          packTextureAddData:"",
          packSpecAddData : "",
          refAddData : ""
        });
        message.success("操作成功!")
      }else{
        this.handleError(data.msg)
      }
    },'application/json')
  }

  render() {
        const pColumns = [{
            title:'包装材质',
            width: 160,
            dataIndex:'variableValue',
            render: (text,record,index) =>{
              return (
                record.edit
                ? <Input style={{ margin: '-5px 0' }} defaultValue={text} onChange={this.handlePackTextureOnChange.bind(this, record,index)}/>
                : text
              )
            }
            
        },{
            title : '操作',
            width: 120,
            dataIndex:'actions',
            render: (text, record,index) => {
              return (
                record.edit
                ?
                <a onClick={() => this.handlePackTextureSave(index)}>保存</a>
                :
              <Popconfirm title="是否确认删除?" onConfirm={() => this.onDelete(record.materialExtendGuid)}>
              <a href="#">删除</a>
             </Popconfirm>
  
             )
            }
        }];
        const bColumns = [{
            title:'包装规格',
            width: 160,
            dataIndex:'variableValue',
            render: (text,record,index) =>{
              return (
                record.edit
                ? <Input style={{ margin: '-5px 0' }} defaultValue={text} onChange={this.handlepackSpecOnChange.bind(this, record,index)}/>
                : text
              )
            }
        },{
            title : '操作',
            width: 120,
            dataIndex:'actions',
            render: (text, record,index) => {
              return (
                record.edit
                ?
                <a onClick={() => this.handlepackSpecSave(index)}>保存</a>
                :
              <Popconfirm title="是否确认删除?" onConfirm={() => this.onDelete(record.materialExtendGuid)}>
              <a href="#">删除</a>
             </Popconfirm>
  
             )
            }
        }];

        const rColumns = [{
            title:'REF',
            width: 160,
            dataIndex:'variableValue',
            render: (text,record,index) =>{
              return (
                record.edit
                ? <Input style={{ margin: '-5px 0' }} defaultValue={text} onChange={this.handleRefOnChange.bind(this, record,index)}/>
                : text
              )
            }
        },{
            title : '操作',
            width: 120,
            dataIndex:'actions',
            render: (text, record,index) => {
              return (
                record.edit
                ?
                <a onClick={() => this.handleRefSave(index)}>保存</a>
                :
              <Popconfirm title="是否确认删除?" onConfirm={() => this.onDelete(record.materialExtendGuid)}>
              <a href="#">删除</a>
             </Popconfirm>
  
             )
            }
        }];

      return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/basicData/productCert'>产品证件</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={{pathname:'/basicData/productCert/product',state:this.props.location.state}}>产品</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
                <ProductEditForm data={this.props.location.state}/>
            </TabPane>
            <TabPane tab="包装材质" key="2">
                <Button type="primary" onClick={this.handlePackTextureAdd}>添加</Button>
                <Row style={{marginTop:16}}>
                  <Col span={12}>
                    <Table
                    columns={pColumns}
                    bordered
                    dataSource={this.state.packTextureList}
                    pagination={false}
                    rowKey={"materialExtendGuid"}
                    />
                  </Col>
                </Row>
            </TabPane>
            <TabPane tab="包装规格" key="3">
            <Button type="primary" onClick={this.handlepackSpecAdd}>添加</Button>
              <Row style={{marginTop:16}}>
                <Col span={12}>
                  <Table
                  columns={bColumns}
                  dataSource={this.state.packSpecList}
                  pagination={false}
                  bordered
                  rowKey={"materialExtendGuid"}
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="REF" key="4">
              <Button type="primary" onClick={this.handleRefAdd}>添加</Button>
              <Row style={{marginTop:16}}>
                <Col span={12}>
                  <Table
                  columns={rColumns}
                  dataSource={this.state.refList}
                  pagination={false}
                  rowKey={"materialExtendGuid"}
                  bordered
                  />
                </Col>
                </Row>
            </TabPane>
        </Tabs>
      </div>
    );
  }
}

module.exports = ProductEdit;