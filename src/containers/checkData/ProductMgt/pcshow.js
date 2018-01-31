/**
 * @file 变更产品审核详情
 */
import React from 'react';
import { Breadcrumb, Row, Col, Form,Button,Select,Modal,message,Input,Upload } from 'antd';
import { Link ,hashHistory} from 'react-router';
import { actionHandler, jsonNull,FetchPost ,pathConfig} from 'utils/tools';
import querystring from 'querystring';
import { productUrl } from 'api';

const FormItem = Form.Item;
const Option = Select.Option
class ProductMgtDetails extends React.Component {
  state ={
    newData: "",
    beforeData: "",
    loading: false,
    visible: false,
    disabled:false,
    selectReason:'',
    dirtyClick: false,//通过
  }
 componentDidMount = () => {
        FetchPost(productUrl.CHANGEPRODUCTDETAILS,querystring.stringify({registGuid: this.props.location.state.registGuid}))
        .then(res => {
          return res.json()
        })
        .then(data => {
          if(data.status){
              this.setState({
                beforeData: data.result.oldRegister,
                newData: data.result.newRegister
              })
          }
          else{
              message.error(data.msg);
              hashHistory.push('/checkdata/productMgt');
          }
        })
        .catch(e => console.log("Oops, error", e))
 }
  handerPass = ()=>{
    this.setState({dirtyClick: true});
    const values = {registGuid:this.props.location.state.registGuid,auditFstate:'02'}
    console.log('审核通过postData',values)
    //审核交互
    FetchPost(productUrl.CHECKCHANGEPRODUCT,querystring.stringify(values))
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
    console.log(failreason, failreason,length,'1111')
    if(failreason.length>200){
        return message.error('长度不能超过200')
      }
      else if(failreason.length <=0 && selectReason.length<=0){
        return message.error('请输入反馈理由')
      }

    const values = {registGuid:this.props.location.state.registGuid,auditFstate:'03',failReason:selectReason}
    this.setState({ loading: true });
    console.log('审核不通过postData',values)
    //审核交互
    FetchPost(productUrl.CHECKCHANGEPRODUCT,querystring.stringify(values))
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
 handUserlevel = (value) => {
        if(value==="01"){
          return "启用"
        }
        else if(value==="00"){
          return "停用"
        }
    }
 
  render() {
    const beforeData= jsonNull(this.state.beforeData);
    const newData= jsonNull(this.state.newData);
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    return (
      <div>
        {
          this.props.children ||
          <div>
          {
              this.state.beforeData === "" ? null :
         
          <div>
            <Breadcrumb style={{fontSize: '1.1em'}}>
              <Breadcrumb.Item><Link to='/checkdata/productMgt'>产品审核</Link></Breadcrumb.Item>
              <Breadcrumb.Item>变更产品审核</Breadcrumb.Item>
            </Breadcrumb>
            <Form style={{marginTop: 12}} className='show-form'>
            <Row>
                <Col span={10}>
                  <div className="ant-alert ant-alert-info" style={{paddingLeft:16,paddingRight:16}}>
                      <Row>
                          <Col span={18}>
                              <span style={{fontWeight: 'bold'}}>变更前信息</span>
                          </Col>
                          <Col span={6} style={{textAlign:'right'}}>
                              <a onClick={actionHandler.bind(
                              null, this.props.router, "/checkdata/productMgt/model", {registGuid:this.props.location.state.registGuid}
                              )}>
                              更多品规信息</a>
                          </Col>
                      </Row>
                  </div>
                  <FormItem {...formItemLayout} label={`产品名称`}>
                      {beforeData.materialName}
                  </FormItem>
                    <FormItem {...formItemLayout} label={`简码`}>
                      {beforeData.fqun}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`产品类型`}>
                      {beforeData.fstate ==="00" ? "医疗器械" : "办公耗材"}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`证件号`}>
                      {beforeData.registerNo}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`耗材分类`}>
                      {beforeData.instrumentName}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`品牌`}>
                      {beforeData.tfBrandName}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`状态`}>
                      {this.handUserlevel(beforeData.fstate)}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`资质有效期`}>
                      {beforeData.lastTime}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`生产企业名称`}>
                      {beforeData.produceName}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`企业注册地址`}>
                      {beforeData.enterpriseRegAddr}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`生产地址`}>
                      {beforeData.produceAddr}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`代理人名称`}>
                      {beforeData.agentName}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`代理人地址`}>
                      {beforeData.agentAddr}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`产品结构描述及组成`}>
                      {beforeData.productStructure}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`适用范围及用途`}>
                      {beforeData.productScope}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`产品标准`}>
                      {beforeData.productStandard}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`证件附件`}>
                      {
                        beforeData.tfAccessoryFile === "" ? "" 
                        :
                       <Upload 
                        action={pathConfig.YSYPATH} 
                        defaultFileList={[{
                            uid: 1,
                            name: beforeData.tfAccessoryFile,
                            status: 'done',
                            thumbUrl: pathConfig.YSYPATH + beforeData.tfAccessoryFile,
                            url: pathConfig.YSYPATH + beforeData.tfAccessoryFile
                        }]}
                        listType="picture-card"
                        showUploadList={{showPreviewIcon:true,showRemoveIcon:false}}
                        > 
                        
                        </Upload>
                    }
                  </FormItem>
              </Col>
              <Col span={12} offset={2}>
                    <div className="ant-alert ant-alert-info" style={{paddingLeft:16,paddingRight:16}}>
                      <Row>
                          <Col span={18}>
                              <span style={{fontWeight: 'bold'}}>变更后信息</span>
                          </Col>
                      </Row>
                      
                    </div>
                       <FormItem {...formItemLayout} label={`产品名称`}>
                      {newData.materialName}
                  </FormItem>
                    <FormItem {...formItemLayout} label={`简码`}>
                      {newData.fqun}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`产品类型`}>
                      {newData.fstate ==="00" ? "医疗器械" : "办公耗材"}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`证件号`}>
                      {newData.registerNo}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`耗材分类`}>
                      {newData.instrumentName}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`品牌`}>
                      {newData.tfBrandName}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`状态`}>
                      {this.handUserlevel(newData.fstate)}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`资质有效期`}>
                      {newData.lastTime}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`生产企业名称`}>
                      {newData.produceName}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`企业注册地址`}>
                      {newData.enterpriseRegAddr}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`生产地址`}>
                      {newData.produceAddr}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`代理人名称`}>
                      {newData.agentName}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`代理人地址`}>
                      {newData.agentAddr}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`产品结构描述及组成`}>
                      {newData.productStructure}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`适用范围及用途`}>
                      {newData.productScope}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`产品标准`}>
                      {newData.productStandard}
                  </FormItem>
                  <FormItem {...formItemLayout} label={`证件附件`}>
                        {
                        beforeData.tfAccessoryFile === "" ? "" 
                        :
                      <Upload 
                        action={pathConfig.YSYPATH} 
                        defaultFileList={[{
                            uid: 2,
                            name: newData.tfAccessoryFile,
                            status: 'done',
                            thumbUrl: pathConfig.YSYPATH + newData.tfAccessoryFile,
                            url: pathConfig.YSYPATH + newData.tfAccessoryFile
                        }]}
                        listType="picture-card"
                        showUploadList={{showPreviewIcon:true,showRemoveIcon:false}}
                        > 
                        </Upload>
                        }
                  </FormItem>
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
          {
              this.props.location.state.auditFstate === "warning" ? 
              <div style={{textAlign:'center',marginTop:16,marginBottom:16}}>
                <Button type="primary" size="large" style={{ marginLeft: 8 }} onClick={this.handerPass}>审核通过</Button>
                <Button type="danger" size="large" style={{ marginLeft: 8 }} ghost onClick={this.handerNotPass}>审核不通过</Button>
              </div>
              :
              null
          }

        </Form>
          </div>
        }
        </div>
        }
       
      </div>
    )
  }
}

module.exports = ProductMgtDetails;