/**
 * @file 变更产品审核详情
 */
import React from 'react';
import { Breadcrumb, Row, Col, Form, Upload, Tag } from 'antd';
import { Link } from 'react-router';
import { jsonNull } from 'utils/tools';
import querystring from 'querystring';
import { productUrl, tender } from 'api';
import moment from 'moment';
const FormItem = Form.Item;

class ApplyPCShow extends React.Component {
  state ={
    newData: {},
    beforeData: {}
  }
  componentWillMount = () => {
    fetch(productUrl.CHANGEPRODUCTDETAILS, {
        method: 'post',
        mode:'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:querystring.stringify({registGuid: this.props.location.state.registGuid})
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if(data.status){
          this.setState({beforeData: data.result.oldRegister})
          this.setState({newData: data.result.newRegister})
        }
    })
    .catch(e => console.log("Oops, error", e))
 }
 fstate = (key) => {
  switch (key) {
    case '00':
      return <span style={{color: '#f56a00'}}>到期</span>
    case '01':
      return <span style={{color: '#00a854'}}>正常</span>
    default:
      return <span style={{color: '#f04134'}}>异常</span>
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
  showForm = () => {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    const beforeData= jsonNull(this.state.beforeData);
    const newData= jsonNull(this.state.newData);
    return (
      <Form style={{marginTop: 12}} className='show-form'>
        <Row>
            <Col span={10}>
                 <div className="ant-alert ant-alert-info" style={{paddingLeft:16,paddingRight:16}}>
                     <Row>
                         <Col span={18}>
                            <span style={{fontWeight: 'bold'}}>变更前信息</span>
                         </Col>
                     </Row>
                 </div>
                 <FormItem {...formItemLayout} label={`产品名称`}>
                    {beforeData.materialName}
                 </FormItem>
                 <FormItem {...formItemLayout} label={`产品类型`}>
                    {beforeData.type === '00' ? '医疗器材' : '办公耗材'}
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
                    {this.fstate(beforeData.fstate)}
                 </FormItem>
                 <FormItem {...formItemLayout} label={`资质有效期`}>
                  {
                    moment(beforeData.firstTime).format('YYYY/MM/DD')
                    + '  ~  ' + moment(beforeData.lastTime).format('YYYY/MM/DD')
                  }
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
                    beforeData.tfAccessoryFile ? 
                    <Upload
                      action=""
                      showUploadList={{showPreviewIcon: true, showRemoveIcon: false}}
                      listType="picture-card"
                      fileList={[{
                        uid: -1,
                        name: '证件附件',
                        status: 'done',
                        url: tender.FTP + beforeData.tfAccessoryFile,
                      }]}
                    >
                    </Upload> : null
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
                    {
                      beforeData.materialName !== newData.materialName 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`产品类型`}>
                    {newData.type === '00' ? '医疗器材' : '办公耗材' }
                    {
                      beforeData.type !== newData.type 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`证件号`}>
                    {newData.registerNo}
                    {
                      beforeData.registerNo !== newData.registerNo 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`耗材分类`}>
                    {newData.instrumentName}
                    {
                      beforeData.instrumentName !== newData.instrumentName
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`品牌`}>
                    {newData.tfBrandName}
                    {
                      beforeData.tfBrand !== newData.tfBrand 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`状态`}>
                    {this.fstate(newData.fstate)}
                    {
                      beforeData.fstate !== newData.fstate 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`资质有效期`}>
                  {
                    moment(newData.firstTime).format('YYYY/MM/DD')
                    + '  ~  ' + moment(newData.lastTime).format('YYYY/MM/DD')
                  }
                  {
                    (beforeData.firstTime !== newData.firstTime || beforeData.lastTime !== newData.lastTime )
                    ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                    : null
                  }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`生产企业名称`}>
                    {newData.produceName}
                    {
                      beforeData.produceName !== newData.produceName 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`企业注册地址`}>
                    {newData.enterpriseRegAddr}
                    {
                      beforeData.enterpriseRegAddr !== newData.enterpriseRegAddr 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`生产地址`}>
                    {newData.produceAddr}
                    {
                      beforeData.produceAddr !== newData.produceAddr 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`代理人名称`}>
                    {newData.agentName}
                    {
                      beforeData.agentName !== newData.agentName 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`代理人地址`}>
                    {newData.agentAddr}
                    {
                      beforeData.agentAddr !== newData.agentAddr 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`产品结构描述及组成`}>
                    {newData.productStructure}
                    {
                      beforeData.productStructure !== newData.productStructure 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`适用范围及用途`}>
                    {newData.productScope}
                    {
                      beforeData.productScope !== newData.productScope 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`产品标准`}>
                    {newData.productStandard}
                    {
                      beforeData.productStandard !== newData.productStandard 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>变更</Tag>
                      : null
                    }
                 </FormItem>
                 <FormItem {...formItemLayout} label={`证件附件`}>
                  {
                    newData.tfAccessoryFile ? 
                    <Upload
                      action=""
                      showUploadList={{showPreviewIcon: true, showRemoveIcon: false}}
                      listType="picture-card"
                      fileList={[{
                        uid: -1,
                        name: '证件附件',
                        status: 'done',
                        url: tender.FTP + newData.tfAccessoryFile,
                      }]}
                    >
                    </Upload> : null
                  }
                    {
                      beforeData.tfAccessoryFile !== newData.tfAccessoryFile 
                      ? <Tag color="#f50" style={{marginLeft: 5}}>已变更</Tag>
                      : null
                    }
                 </FormItem>
            </Col>
        </Row>
      </Form>
    )
  }
  render() {
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item><Link to='/tender/apply'>我的申请</Link></Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb>
        {this.showForm()}
      </div>
    )
  }
}

module.exports = ApplyPCShow;