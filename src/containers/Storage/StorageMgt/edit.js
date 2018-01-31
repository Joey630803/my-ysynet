/**
 * @file 运营中心编辑库房
 */
import React from 'react';
import { Breadcrumb, Form, Input, Select,Button,message} from 'antd';
import { Link ,hashHistory} from 'react-router';
import querystring from 'querystring';
import { CommonData,jsonNull,FetchPost } from 'utils/tools';
import FetchSelect from 'component/FetchSelect';
import { storage } from '../../../api';

const FormItem = Form.Item;
const Option = Select.Option;
class EditForm extends React.Component {
  state = {
      show: this.props.data.storageSourceTpye,
      storageTypes: [],
      productSource: [],
      orgId: this.props.data.orgId,
      sourceStorageGuid:this.props.data.sourceStorageGuid
  }
  TypeChange = (value) => {
    if(value==="01"){
      this.setState({show:"01"})
    }
    else{
      this.setState({show:"00"})
    }
  }
  componentDidMount = () => {
    //库房类型
     CommonData('STORAGE_FTYPE_CODE', (data) => {
       this.setState({storageTypes:data})
     })
     //货物来源
     CommonData('STORAGE_SOURCE_TPYE_OPERATION', (data) => {
       this.setState({productSource:data})
     })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.storageGuid = this.props.data.storageGuid;
        values.sourceStorageGuid = this.state.sourceStorageGuid;
        values.orgId = this.state.orgId;
        console.log("运营中心库房修改数据:",values)
        FetchPost(storage.UPDATESTORAGE_LIST,querystring.stringify(values))
        .then(response => {
          return response.json();
        })
        .then(data => {
          if(data.status){
             hashHistory.push('/storage/storageMgt');
             message.success('编辑库房成功！')
          }
          else{
            message.error(data.msg)
          }
        })
        .catch(e => console.log("Oops, error", e))
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
    const { storageTypes ,productSource} = this.state;
    const data = this.props.data;
    console.log(data)
    return (
      <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="库房名称"
          hasFeedback
        >
          {getFieldDecorator('storageName', {
             validateTrigger: ['onChange', 'onBlur'],
             initialValue:data.storageName,
             rules: [{ required: true, message: '请输入库房名称!', whitespace: true },
             //{pattern:/[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,message:'只能是中文、英文、数字、下划线(_)、中横线(-)'},
             {max:50,message:'字符长度不能超过50'}],
          })(
            <Input />
          )}
        </FormItem>
         <FormItem
          {...formItemLayout}
          label="所属机构"
          hasFeedback
        >
          <FetchSelect disabled="true" defaultValue={data.orgName}  refd='fetchs' url={storage.ORG_LIST} 
                  cb={(value) => this.setState({orgId: value})}/>
        </FormItem>
        <FormItem 
          {...formItemLayout}
          label='库房编号'
          >
           {getFieldDecorator('storageCode',{
              initialValue:data.storageCode,
              validateTrigger: ['onChange', 'onBlur'],
              rules:[
                    {required: true, message: '请输入库房编码', whitespace: true },
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
               initialValue:data.fstate,
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
          label="货物来源"
        >
          {
            getFieldDecorator('storageSourceTpye',{
               initialValue:data.storageSourceTpye,
               validateTrigger: ['onChange', 'onBlur'],
               rules: [{ required: true, message: '请输入选择货物来源!' }]
            })(
              <Select placeholder={'请选择'} onChange={this.TypeChange}>
                {
                  productSource.map((item,index) => {
                    return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                  })
                }
              </Select>
            )
          }
        </FormItem>
        {
          this.state.show === "01" ? 
          <FormItem 
            {...formItemLayout}
            label=' '
            colon={false}
            >
              <FetchSelect query={{orgId:this.state.orgId,excludeStorageGuid:data.storageGuid}} defaultValue={data.sourceStorageName}   ref='fetchs' url={storage.FIRSTSTORAGE_LIST} 
                    cb={(value) => this.setState({sourceStorageGuid: value})}/>
          </FormItem>
          :
          null
        }
       
        <FormItem
          {...formItemLayout}
          label="库房类型"
        >
          {getFieldDecorator('storageFtypeCode',{
             validateTrigger: ['onChange', 'onBlur'],
             initialValue:data.storageFtypeCode,
             rules: [{ required: true, message: '请输入选择库房类型!', whitespace: true }]
          })(
             <Select placeholder={'请选择'}>
              {
                storageTypes.map((item,index) => {
                  return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                })
              }
             </Select>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">保存</Button>
        </FormItem>
      </Form>
    )
  }
}
const WrappedForm = Form.create()(EditForm);
class StorageEidt extends React.Component {

  render() {
    const { state } = jsonNull(this.props.location);

    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/storage/storageMgt'>库房管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedForm data={state}/>
      </div>
    );
  }
}

module.exports =StorageEidt