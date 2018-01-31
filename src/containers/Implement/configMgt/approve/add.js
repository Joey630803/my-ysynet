/**
 * @file 添加审批
 */
import React from 'react';
import { Breadcrumb, Form, Input, Select,Button,message,Row,Col} from 'antd';
import { Link ,hashHistory} from 'react-router';
import { fetchData,CommonData} from 'utils/tools';
import FetchSelect from 'component/FetchSelect';
import { implement } from 'api'

const FormItem = Form.Item;
const Option = Select.Option;
class AddForm extends React.Component {
   state = {
    dirtyClick: false,
    flag : "",
    deptGuid: "",
    storageGuid: "",
    lastFstateData: [],
    typeData: [],

  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({dirtyClick: true});
        values.deptGuid = this.state.deptGuid;
        values.storageGuid = this.state.storageGuid;
        values.orgId = this.props.data.orgId;
        console.log(values,'提交的数据')
        fetchData(implement.ADD_CONFIGAPPROVE, values, data => {
          this.setState({dirtyClick: false});
          if(data.status){
            hashHistory.push({
              pathname: '/implement/ConfigMgt/approve',
              state : this.props.data
            });
            message.success('保存成功！')
          }
          else{
            message.error(data.msg || '操作失败')
          }
        }, "application/json")
      }
    });
  } 
  //根据科室或库房flag获取单据类型
  handlFlag = (value) => {
     CommonData(value, (data) => {
       this.props.form.setFieldsValue({type: ""})
       this.props.form.setFieldsValue({lastFstate: "" })
       this.props.form.setFieldsValue({nextFstate: "" })
       this.props.form.setFieldsValue({failReason: "" })
       this.setState({typeData: data})
     })
    this.setState({
      flag: value,
    })
  }
//根据单据类型获取单据状态
handlType = (value) =>{
  CommonData(value, (data) => {
    this.props.form.setFieldsValue({lastFstate: "" })
    this.props.form.setFieldsValue({nextFstate: "" })
    this.props.form.setFieldsValue({failReason: "" })
    this.setState({lastFstateData:data})
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
     const orgId = this.props.data.orgId;
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <Row>
          <Col offset={4}>
            <h2>基本信息</h2>
          </Col>
        </Row>
        <FormItem
          {...formItemLayout}
          label="名称"
          hasFeedback
        >
          {getFieldDecorator('approvalName', {
             rules: [{ required: true, message: '请输入名称!', whitespace: true },
             {pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
             {max:50,message:'字符长度不能超过50'}],
          })(
            <Input />
          )}
        </FormItem>
           <FormItem
          {...formItemLayout}
          label="编号"
        >
          {getFieldDecorator('approvalNo',{
            
          })(
            <Input/>
          )
          }

        </FormItem>
        <FormItem
          {...formItemLayout}
          label="状态"
        >
          {
            getFieldDecorator('fstate',{
               initialValue:'01',
            })(
              <Select  style={{ width: 120 }}>
                <Option value="01">启用</Option>
                <Option value="00">停用</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="备注"
        >
          {getFieldDecorator('tfRemark',{
          })(
             <Input type="textarea" rows={4}/>
          )}
        </FormItem>
        <Row>
          <Col offset={4}>
            <h2>配置信息</h2>
          </Col>
        </Row>
         <FormItem
          {...formItemLayout}
          label="库房或科室"
        >
          {
            getFieldDecorator('flag',{
              rules: [{ required: true, message: '请选择!', whitespace: true }],
            })(
              <Select placeholder="请选择" onChange={this.handlFlag}>
                <Option value="STORAGE_BTYPE">库房</Option>
                <Option value="DEPT_BTYPE">科室</Option>
              </Select>
            )
          }
        </FormItem>
       {
         this.state.flag === "STORAGE_BTYPE" ?
          <FormItem 
            {...formItemLayout}
            label=' '
            colon={false}
            >
              <FetchSelect  defaultValue="请选择库房" query={{orgId:orgId}}   ref='fetchs' url={implement.SELECTLOGINSTORAGE} 
                    cb={(value) => this.setState({storageGuid: value})}/>
          </FormItem>
          :
         null
       }
       {
         this.state.flag === "DEPT_BTYPE"?
          <FormItem 
            {...formItemLayout}
            label=' '
            colon={false}
            >
              <FetchSelect  defaultValue="请选择科室" query={{orgId:orgId}}  ref='fetchs' url={implement.SELECTLOGINDEPART} 
                    cb={(value) => this.setState({deptGuid: value})}/>
          </FormItem>
          :
          null
       }
        <FormItem
          {...formItemLayout}
          label="单据类型"
        >
          {
            getFieldDecorator('type',{
               rules: [{ required: true, message: '请选择!', whitespace: true }]
            })(
              <Select  onChange={this.handlType}>
                <Option key={-1} value="">请选择</Option>
                {
                this.state.typeData.map((item,index) => {
                  return <Option key={index} value={item.TF_CLO_CODE+"_FSTATE"}>{item.TF_CLO_NAME}</Option>
                })
              }
              </Select>
            )
          }
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="审批单据状态"
        >
          {
            getFieldDecorator('lastFstate',{

               rules: [{ required: true, message: '请选择!', whitespace: true }]
            })(
              <Select >
                <Option key={-1} value="">请选择</Option>
              {
                this.state.lastFstateData.map((item,index) => {
                  return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                })
              }
              </Select>
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="审批通过状态"
        >
          {
            getFieldDecorator('nextFstate',{
                rules: [{ required: true, message: '请选择!', whitespace: true }]
            })(
              <Select >
                <Option key={-1} value="">请选择</Option>
              {
                this.state.lastFstateData.map((item,index) => {
                  return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                })
              }
              </Select>
            )
          }
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="审批不通过状态"
        >
          {
            getFieldDecorator('failReason',{
                rules: [{ required: true, message: '请选择!', whitespace: true }]
            })(
             <Select >
                <Option key={-1} value="">请选择</Option>
              {
                this.state.lastFstateData.map((item,index) => {
                  return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                })
              }
              </Select>
            )
          }
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="通过条件"
        >
          {
            getFieldDecorator('condition',{
               rules: [{ required: true, message: '请选择!', whitespace: true }]
            })(
              <Select placeholder="请选择">
                <Option value="01">任一人</Option>
                <Option value="02">所有人</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedForm = Form.create()(AddForm);
class DeptAdd extends React.Component {

  render() {
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/implement/configMgt'>配置管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link  to={{pathname:'/implement/configMgt/approve',state:{orgId:this.props.location.state.orgId}}}>审批</Link></Breadcrumb.Item>
          <Breadcrumb.Item>添加</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedForm data={this.props.location.state}/>
      </div>
    );
  }
}

module.exports = DeptAdd