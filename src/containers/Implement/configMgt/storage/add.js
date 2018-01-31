/**
 * @file 运营中心库房添加／配置
 */
import React from 'react';
import { Breadcrumb, Form, Input, Select,Button,message,Row,Col} from 'antd';
import { Link ,hashHistory} from 'react-router';
import { CommonData,fetchData } from 'utils/tools';
import FetchSelect from 'component/FetchSelect';
import { implement,storage } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
class AddForm extends React.Component {
  state = {
      showStorage: "00",
      sourceType: "00",
      sourceStorageGuid:'',
      parentStorageGuid:'',
      deptGuid:'',
      storageLevel: [],
      productSource: []
  }
  componentDidMount = () => {
     //库房级别
     CommonData('STORAGE_LEVEL_CODE_OPERATION', (data) => {
       this.setState({storageLevel:data})
     })
     //货物来源
     CommonData('STORAGE_SOURCE_TPYE_OPERATION', (data) => {
       this.setState({productSource:data})
     })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.deptGuid = this.state.deptGuid;
      values.sourceStorageGuid = this.state.sourceStorageGuid;
      if (!err) {
        let postData = {};
        //拼configinfo数据
        let configInfoData = {};
        const configInfos =[];
        configInfoData.storageLevelCode = values.storageLevelCode;
        configInfoData.storageSourceType = values.storageSourceType;
        configInfoData.deptGuid = values.deptGuid;
        configInfoData.sourceStorageGuid = this.state.sourceStorageGuid; //一级库房库房来源
        configInfoData.openFlag = values.openFlag;
        configInfoData.shfs = values.shfs;
        configInfoData.jsfs = values.jsfs;
        configInfoData.qrFlag = values.qrFlag;
        configInfoData.parentStorageGuid = this.state.parentStorageGuid;//二级库房上级库房id
        for (let key in configInfoData) {
          if(configInfoData.hasOwnProperty(key)){
               configInfos.push({"configCode":key,"configValue":configInfoData[key]})
          }
        }
        //拼postData数据
        console.log(this.props.data)
        postData.fstate = values.fstate;
        postData.storageCode = values.storageCode;
        postData.storageName = values.storageName;
        postData.tfRemark = values.tfRemark;
        postData.configInfos = configInfos;
        postData.orgId = this.props.data.orgId;
        console.log(postData,'添加库房配置提交的数据');
        fetchData(implement.SAVE_CONFIG_STORAGE, JSON.stringify(postData), (data) => {
          if (data.status) {
            hashHistory.push({
              pathname:'/implement/configMgt/storage',
              state : this.props.data
            });
            message.success('保存成功')
          } else {
            message.error(data.msg || '操作失败')
          }
        },"application/json")
      
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
    const { storageLevel ,productSource} = this.state;
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
          {getFieldDecorator('storageName', {
             rules: [{ required: true, message: '请输入库房名称!', whitespace: true },
             {max:50,message:'字符长度不能超过50'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem 
          {...formItemLayout}
          label='编号'
          >
           {getFieldDecorator('storageCode',{
             rules:[
               {required: true, message: '请输入库房编码' },
               {max:50,message:'字符长度不能超过50'},
               {pattern:/^[A-Za-z0-9_\-]+$/,message:'只能是英文、数字、下划线(_)、中横线(-)'}
             ]
           })(
                <Input />
               )
           }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="状态"
        >
          {getFieldDecorator('fstate',{
               initialValue:'01',
            })(
              <Select  style={{ width: 120 }}>
                <Option value="01">正常</Option>
                <Option value="00">停用</Option>
              </Select>
            )
          }
        </FormItem>
         <FormItem
            {...formItemLayout}
            label="备注"
            hasFeedback
          >
            {getFieldDecorator('tfRemark')(
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
          label="库房级别"
        >
        {getFieldDecorator('storageLevelCode',{
             rules: [{ required: true, message: '请输入选择库房级别!', whitespace: true }]
          })(
            <Select placeholder={'请选择'} onChange={(value) => {
                  this.setState({
                    sourceType : value
                  })
            }}>
              {
                storageLevel.map((item,index) => {
                  return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                })
              }
             </Select>
          )}
        </FormItem>
        {
          this.state.sourceType === "01" ?
          <FormItem 
            {...formItemLayout}
            label=' '
            colon={false}
            >
            {getFieldDecorator('storageSourceType')(
             <Select placeholder="请选择库房产品的来源" onChange={(value) => {
               this.setState({
                 showStorage:value
               })
               }}>
                {
                  productSource.map((item,index) => {
                    return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                  })
                }
      
              </Select>
               )
            }
          </FormItem>
          :
          null
        }
        {
          this.state.sourceType === "02" ?
          <FormItem 
            {...formItemLayout}
            label=' '
            colon={false}
            >
            <FetchSelect  query={{orgId:orgId}} ref='fetchs' url={storage.CUSTOMERSEARCHSTORAGE_LIST} 
                    cb={(value) => this.setState({parentStorageGuid: value})}/>
          </FormItem>
           :
          null
        }
        {
          this.state.showStorage === "01" && this.state.sourceType === "01" ?
          <FormItem 
            {...formItemLayout}
            label=' '
            colon={false}
            >
              <FetchSelect  defaultValue="请选择"  query={{orgId:orgId}}  ref='fetchs' url={storage.FIRSTSTORAGE_LIST} 
                    cb={(value) => this.setState({sourceStorageGuid: value})}/>
          </FormItem>
          :
          null
        }
     
        <FormItem
          {...formItemLayout}
          label="所属科室"
          hasFeedback
        >
           <FetchSelect  refd='fetchs' query={{orgId:orgId}} url={storage.CUSTOMERSEARCHDEPT_LIST} 
                  cb={(value) => this.setState({deptGuid: value})}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="开放申请"
        >
          {getFieldDecorator('openFlag',{
               initialValue:'01',
            })(
              <Select  style={{ width: 120 }}>
                <Option value="00">不开放</Option>
                <Option value="01">开放</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="采购/派送"
        >
          {getFieldDecorator('shfs',{
               initialValue:'01',
            })(
              <Select  style={{ width: 120 }} placeholder="请选择">
                <Option value="00">科室采购</Option>
                <Option value="01">库房配送</Option>
              </Select>
            )
          }
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="结算方式"
        >
          {getFieldDecorator('jsfs',{
            })(
              <Select  style={{ width: 120 }} placeholder="请选择">
                <Option value="00">出库结算</Option>
                <Option value="01">计费结算</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="一物一码"
        >
          {getFieldDecorator('qrFlag',{
            })(
              <Select  style={{ width: 120 }} placeholder="请选择">
                <Option value="00">否</Option>
                <Option value="01">是</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedForm = Form.create()(AddForm);
class StorageAdd extends React.Component {
  render() {
    console.log(this.props.location,"从库房列表过来的数据")
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/implement/configMgt'>配置管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link  to={{pathname:'/implement/configMgt/storage',state:{orgId:this.props.location.state.orgId}}}>库房列表</Link></Breadcrumb.Item>
          <Breadcrumb.Item>添加</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedForm data={this.props.location.state}/>
      </div>
    );
  }
}

module.exports = StorageAdd