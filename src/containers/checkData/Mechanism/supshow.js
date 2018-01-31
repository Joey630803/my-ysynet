import React from 'react';
import { Breadcrumb, Form,Row,Col, Input,Button,Upload, BackTop,message,Modal,Select} from 'antd';
import { Link,hashHistory } from 'react-router';
import querystring from 'querystring';
import { jsonNull,pathConfig } from 'utils/tools';
const FormItem = Form.Item;
const Option = Select.Option;

class SupplierDetails extends React.Component {
  state = {
    loading: false,
    visible: false,
    data: this.props.location.state,
    disabled:false,
    selectReason:'',
    dirtyClick: false,//通过
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
  handerPass = ()=>{
     this.setState({dirtyClick: true});
    const values = {registGuid:this.state.data.REGIST_GUID,auditFstate:'01'}
    //审核交互
     fetch(pathConfig.CHECKHOSPITAL_URL, {
            method: 'post',
            mode:'cors',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:querystring.stringify(values)
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.setState({dirtyClick: false});
          if(data.status){       
            message.success('该医疗机构您审核通过');
            hashHistory.push('/checkdata/mechanism');
          }
          else{
            message.error("操作失败!");
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
    const selectReason = failreason === ""? this.state.selectReason:failreason;
    if(failreason.length>200){
      return message.error('长度不能超过200')
    }
    else if(failreason.length <=0 && selectReason.length<=0){
      return message.error('请输入反馈理由')
    }

    const values = {registGuid:this.state.data.REGIST_GUID,auditFstate:'02',failReason:selectReason}
    this.setState({ loading: true });
    //审核交互
     fetch(pathConfig.CHECKHOSPITAL_URL, {
            method: 'post',
            mode:'cors',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:querystring.stringify(values)
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.setState({ loading: false, visible: false });
          if(data.status){
            message.success("操作成功!");
            hashHistory.push('/checkdata/mechanism');
          }
          else{
            message.error("操作失败!");
          }
        })
        .catch(e => console.log("Oops, error", e))

  
  }
   handleCancel = () => {
    this.setState({ visible: false });
  }
  render() {
   const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 10 },
    };
  const title ="反馈";
  const {state} = jsonNull(this.props.location);
   let used;
   
  if(state.AUDIT_FSTATE==="00"){
    
     used =false;
  }
  else{
     used = true;
  }
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/checkdata/mechanism'>机构审核</Link></Breadcrumb.Item>
          <Breadcrumb.Item>供应商详情</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col span={3}><h3 style={{textAlign:'right',marginTop:'10px'}}>基本信息:</h3></Col>
        </Row>
         <Form style={{marginTop: '16px'}}>
          <BackTop>
            <div className="ant-back-top-inner">TOP</div>
          </BackTop>
          <FormItem
            {...formItemLayout}
            label="账号:"
            >
            {`${state.USER_NO}`}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户名:"
            >
            {`${state.USER_NAME}`}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号:"
            >
            {`${state.MOBILE_PHONE}`}
          </FormItem>
          <FormItem
          {...formItemLayout}
            label="邮箱:"
            >
            {`${state.E_MAIL}`}
          </FormItem>
          <FormItem
          {...formItemLayout}
            label="QQ:"
            >
            {`${state.QQ}`}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注:"
            >
            {`${state.USER_REMARK}`}
          </FormItem>

          <Row>
          <Col span={3}><h3 style={{textAlign:'right',marginTop:'10px'}}>机构信息:</h3></Col>
          </Row>
          <FormItem
            {...formItemLayout}
            label="供应商名称:"
            >
            {`${state.ORG_NAME}`}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="简称:"
            >
            {`${state.ORG_ALIAS}`}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="企业类型:"
            >
            {`${state.CORPORATION_TYPENAME}`}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="注册资本:"
            >
            {`${state.RMB_AMOUNT}`}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="省市区:"
            >
            {`${state.HOSPITAL_LEVEL}`}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系人:"
            >
            {`${state.LXR}`}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系电话:"
            >
            {`${state.LXDH}`}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="详细地址:"
            >
            {`${state.TF_ADDRESS}`}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注:"
            >
            {`${state.TF_REMARK}`}
          </FormItem>
          <FormItem
          {...formItemLayout}
          label="营业执照:"
          >
          {
              state.yyzzPath===""||state.yyzzPath===undefined?"":
              (
                  <Upload name="yyYyzzFile" 
                          action={pathConfig.PICUPLAOD_URL} 
                          listType="picture-card"
                          showUploadList={{showPreviewIcon:true,showRemoveIcon:false}}
                          defaultFileList={[{
                            uid: '-1',
                            name: 'yyYyzzFile',
                            status: 'done',
                            url: pathConfig.YSYPATH+state.yyzzPath,
                          }
                        ]}
                        >
                </Upload>
              )
            }
          </FormItem>
          <FormItem
          {...formItemLayout}
          label="组织机构代码证:"
          >
           {
              state.jgdmzPath===""||state.jgdmzPath===undefined?"":
              (
                  <Upload name="jgdmzPath" 
                          action={pathConfig.PICUPLAOD_URL} 
                          listType="picture-card"
                          showUploadList={{showPreviewIcon:true,showRemoveIcon:false}}
                          defaultFileList={[{
                            uid: '-1',
                            name: 'jgdmzPath',
                            status: 'done',
                            url: pathConfig.YSYPATH+state.jgdmzPath,
                          }
                        ]}
                        >
                </Upload>
              )
            }
          </FormItem>
           <FormItem
          {...formItemLayout}
          label="税务登记证:"
          >
           {
              state.swdjPath===""||state.swdjPath===undefined?"":
              (
                  <Upload name="swdjPath" 
                          action={pathConfig.PICUPLAOD_URL} 
                          listType="picture-card"
                          showUploadList={{showPreviewIcon:true,showRemoveIcon:false}}
                          defaultFileList={[{
                            uid: '-1',
                            name: 'swdjPath',
                            status: 'done',
                            url: pathConfig.YSYPATH+state.swdjPath,
                          }
                        ]}
                        >
                </Upload>
              )
            }
          </FormItem>
           <FormItem
          {...formItemLayout}
          label="医疗器械经营企业许可证:"
          >
           {
              state.jyxkPath===""||state.jyxkPath===undefined?"":
              (
                  <Upload name="jyxkPath" 
                          action={pathConfig.PICUPLAOD_URL} 
                          listType="picture-card"
                          showUploadList={{showPreviewIcon:true,showRemoveIcon:false}}
                          defaultFileList={[{
                            uid: '-1',
                            name: 'jyxkPath',
                            status: 'done',
                            url: pathConfig.YSYPATH+state.jyxkPath,
                          }
                        ]}
                        >
                </Upload>
              )
            }
          </FormItem>
          </Form>
          <Row>
          <Col span={5} push={5}>
              <Button type="primary" size="large" disabled={used} onClick={this.handerPass} loading={this.state.dirtyClick}>通过</Button>
              <Button type="primary" size="large" disabled={used} onClick={this.handerNotPass} style={{marginLeft:'30px'}} >不通过</Button>
          </Col>
        </Row>
      <Modal
        visible={this.state.visible}
        title={title}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
        <Button key="back" size="large" onClick={this.handleCancel}>关闭</Button>,
        <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
            提交
        </Button>
        ]}
      >
        <Select  placeholder="请选择反馈理由" style={{ width: 120 }} onChange={this.onChange}>
            <Option value="申请信息不完整">申请信息不完整</Option>
            <Option value="申请信息不真实">申请信息不真实</Option>
            <Option value="其他">其他</Option>
        </Select>
       <Input style={{marginTop:'16px'}} disabled={this.state.disabled} ref='failReason' type="textarea" rows={4}/>
      </Modal>
      </div>
    );
  }
}

module.exports = SupplierDetails;