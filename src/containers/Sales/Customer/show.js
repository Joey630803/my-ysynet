/**
 * @file 医疗机构客户详情
 */
import React from 'react';
import { Breadcrumb, Row, Col, Upload, Form } from 'antd';
import { Link } from 'react-router';
import { pathConfig, jsonNull } from 'utils/tools';
import querystring from 'querystring';

const FormItem = Form.Item;

class CustomerDetails extends React.Component {
  state ={
    data:{}
  }
  componentWillMount = () => {

       fetch(pathConfig.MYHOSIPITALDETAILS_URL, {
            method: 'post',
            mode:'cors',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:querystring.stringify({orgId:this.props.location.state.orgId})
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
          if(data.status){
            this.setState({data:data.result.rows[0]})
          }
        })
        .catch(e => console.log("Oops, error", e))
  }
  showForm = () => {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    const data= jsonNull(this.state.data);
   
    return (
      <Form style={{marginTop: 32}} className='show-form'>
        <Row>
          <Col span={10} key={1} push={2}>
            <FormItem {...formItemLayout} label={`医疗机构名称`}>
              {data.ORG_NAME}
            </FormItem>
          </Col>
          <Col span={10} key={2} push={2}>
            <FormItem {...formItemLayout} label={`机构代码`}>
               {data.ORG_CODE}
            </FormItem>
          </Col>
          <Col span={10} key={3} push={2}>
            <FormItem {...formItemLayout} label={`简称`}>
               {data.ORG_ALIAS}
            </FormItem>
          </Col>
          <Col span={10} key={5} push={2}>
            <FormItem {...formItemLayout} label={`省市区`}>
                {data.TF_PROVINCE+data.TF_CITY+data.TF_DISTRICT}
            </FormItem>
          </Col>
          <Col span={10} key={6} push={2}>
            <FormItem {...formItemLayout} label={`上级单位`}>
              {data.PARENT_ORGNAME}
            </FormItem>
          </Col>
            <Col span={10} key={7} push={2}>
            <FormItem {...formItemLayout} label={`类别`}>
              {data.HOSPITAL_PROPERTYNAME}
            </FormItem>
          </Col>
          <Col span={10} key={8} push={2}>
            <FormItem {...formItemLayout} label={`法人代表`}>
               {data.LEGAL_MAN}
            </FormItem>
          </Col>
          <Col span={10} key={9} push={2}>
            <FormItem {...formItemLayout} label={`等级`}>
               {data.HOSPITAL_LEVELNAME}
            </FormItem>
          </Col>
          <Col span={10} key={10} push={2}>
            <FormItem {...formItemLayout} label={`联系人`}>
               {data.LXR}
            </FormItem>
          </Col>
          <Col span={10} key={11} push={2}>
            <FormItem {...formItemLayout} label={`联系电话`}>
              {data.LXDH}
            </FormItem>
          </Col>
          <Col span={10} key={12} push={2}>
            <FormItem {...formItemLayout} label={`详细地址`}>
               {data.TF_ADDRESS}
            </FormItem>
          </Col>
            <Col span={10} key={13} push={2}>
            <FormItem {...formItemLayout} label={`开户银行`}>
               {data.TF_BANK}
            </FormItem>
          </Col>
          <Col span={10} key={14} push={2}>
            <FormItem {...formItemLayout} label={`纳税人识别号`}>
               {data.TAX_NO}
            </FormItem>
          </Col>
          <Col span={10} key={15} push={2}>
            <FormItem {...formItemLayout} label={`银行账号`}>
               {data.BANK_ACCOUNT}
            </FormItem>
          </Col>
          <Col span={10} key={16} push={2}>
            <FormItem {...formItemLayout} label={`备注`}>
               {data.TF_REMARK}
            </FormItem>
          </Col>
          <Col span={10} key={17} push={2}>
            <FormItem {...formItemLayout} label={`营业执照`}>
              {
                data.yyzzPath===""||data.yyzzPath===undefined?"":
                (
                    <Upload name="yyYyzzFile" 
                            action={pathConfig.PICUPLAOD_URL} 
                            listType="picture-card"
                            showUploadList={{showPreviewIcon:true,showRemoveIcon:false}}
                            defaultFileList={[{
                              uid: '-1',
                              name: 'yyYyzzFile',
                              status: 'done',
                              url: pathConfig.YSYPATH+data.yyzzPath,
                            }
                          ]}
                          >
                  </Upload>
                )
              }
            </FormItem>
          </Col>
          <Col span={10} key={18} push={2}>
            <FormItem {...formItemLayout} label={`医疗机构执业许可证`}>
              {
                data.zyxkPath===""||data.zyxkPath===undefined?"":
                (
                    <Upload name="zyxkPath" 
                            action={pathConfig.PICUPLAOD_URL} 
                            listType="picture-card"
                            showUploadList={{showPreviewIcon:true,showRemoveIcon:false}}
                            defaultFileList={[{
                              uid: '-1',
                              name: 'zyxkPath',
                              status: 'done',
                              url: pathConfig.YSYPATH+data.zyxkPath,
                            }
                          ]}
                          >
                  </Upload>
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
  render() {
    const title = typeof this.props.location.state === 'undefined' 
        ? '全部供应商' : this.props.location.state.title;
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/sales/customer'>客户管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{title || ''}</Breadcrumb.Item>
        </Breadcrumb>
        {this.showForm()}
      </div>
    )
  }
}

module.exports = CustomerDetails;