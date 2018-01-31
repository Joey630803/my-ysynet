/**
 * @file 编辑
 */
import React from 'react';
import { Breadcrumb, Form, Select,Button,message,InputNumber,Row,Col,Alert,Modal} from 'antd';
import { Link ,hashHistory} from 'react-router';
import querystring from 'querystring';
import { CommonData,PrivateData,jsonNull ,fetchData} from 'utils/tools';
import { storage } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
class EditForm extends React.Component {
  state = {
      shfsTypes: [],
      unitData: []
  }
  handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
      });
  }
   componentDidMount = () => {
    //配送方式
     PrivateData('SHFS', (data) => {
       this.setState({shfsTypes:data})
     })
      //单位
     CommonData('UNIT', (data) => {
       this.setState({unitData:data})
     })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      //编辑提交
      const storageMaterialGuids = [];
      storageMaterialGuids.push(this.props.data.storageMaterialGuid);
      values.storageMaterialGuids = storageMaterialGuids;
      console.log("postData",values)
       fetchData(storage.CUSTOMERSTORAGEUPDATEMATERIAL,querystring.stringify(values),(data)=>{
          if(data.status){
             hashHistory.push({pathname:'/storage/customerStorageMaterial',query:{storageGuid:this.props.data.storageGuid}});
             message.success('编辑成功！')
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
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 12,
      },
    };
     const data = this.props.data;
     const {unitData } = this.state;
     console.log(data,'editData')
    return (
      <Form  onSubmit={this.handleSubmit}>
          <Row>
            <Col span={12}>
                 <FormItem
              {...formItemLayout}
                  label="产品名称"
              >
                {data.materialName} 
              </FormItem>
              <FormItem
              {...formItemLayout}
                  label="证件"
              >
                {data.registerNo} 
              </FormItem>
              <FormItem
              {...formItemLayout}
                  label="型号"
              >
               {data.fmodel} 
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="规格"
                >
                {data.spec} 
              </FormItem>
              <FormItem
              {...formItemLayout}
                  label="采购价"
              >
                {data.purchasePrice} 
              </FormItem>
            <FormItem
              {...formItemLayout}
                  label="采购单位"
              >
                {data.purchaseUnit} 
            </FormItem>
            <FormItem
              {...formItemLayout}
                  label="最小单位"
              >
                {data.leastUnit} 
            </FormItem>
            <FormItem
              {...formItemLayout}
                  label="单位换算"
              >
                {"1招标单位="+data.pConversion+"*最小单位"} 
            </FormItem>
            <FormItem
              {...formItemLayout}
                  label="品牌"
              >
              {data.tfBrandName} 
            </FormItem>
            <FormItem
              {...formItemLayout}
                  label="生产商"
              >
              {data.produceName} 
            </FormItem>
            <FormItem
              {...formItemLayout}
                  label="供应商"
              >
              {data.fOrgName} 
            </FormItem>
            </Col>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                    label="通用名称"
                >
                {data.geName} 
              </FormItem>
               <FormItem
              {...formItemLayout}
                  label="条码"
              >
              {data.fbarcode} 
            </FormItem>
              <FormItem
              {...formItemLayout}
                  label="配送方式"
              >
                 {getFieldDecorator('shfs', {
                    initialValue:data.shfs,
                    })(
                    <Select  style={{ width: 120 }} placeholder="请选择">
                      <Option value="00">科室采购</Option>
                      <Option value="01">库房配送</Option>
                    </Select>
                 )}
              </FormItem>
              <FormItem
              {...formItemLayout}
                  label="结算方式"
              >
                 {getFieldDecorator('settleType', {
                    initialValue:data.settleType,
                    })(
                    <Select  style={{ width: 120 }} placeholder="请选择">
                      <Option value="00">出库结算</Option>
                      <Option value="01">计费结算</Option>
                    </Select>
                 )}
              </FormItem>
              <FormItem
              {...formItemLayout}
                  label="上限"
              >
                {getFieldDecorator('uLimit', {
                    initialValue:data.uLimit
                    })(
                        <InputNumber min={-999999999} max={9999999999} style={{width:200}}/>
                 )}
              </FormItem>
              <FormItem
              {...formItemLayout}
                  label="下限"
              >
                {getFieldDecorator('lLimit', {
                    
                    initialValue:data.lLimit
                    })(
                        <InputNumber min={-999999999} max={9999999999} style={{width:200}}/>
                 )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="一物一码"
                >
                {getFieldDecorator('qrflag',{
                    initialValue:data.qrflag
                    })(
                    <Select  style={{ width: 200 }}>
                        <Option value="01">是</Option>
                        <Option value="00">否</Option>
                    </Select>
                    )
                }
              </FormItem>
             <FormItem
              {...formItemLayout}
                  label="采购单位"
              >
                {getFieldDecorator('purchaseUnit', {
                    initialValue:data.purchaseUnit
                    })(
                        <Select 
                        placeholder={'请选择'}  
                        style={{width:200}}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                           {
                            unitData.map((item,index) => {
                              return <Option key={index} value={item.TF_CLO_NAME}>{item.TF_CLO_NAME}</Option>
                              })
                          }
                        </Select>
                 )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" size="large">保存</Button>
              </FormItem>
            </Col>
          </Row>
      </Form>
    )
  }
}
const WrappedForm = Form.create()(EditForm);
class CustomerStorageAllEdit extends React.Component {

  render() {
     const { state } = jsonNull(this.props.location);
    return (
       <div>
        {this.props.children || 
          <div>
            <Breadcrumb style={{fontSize: '1.1em'}}>
              <Breadcrumb.Item><Link  to={{pathname:'/storage/customerStorageMaterial',query:{storageGuid:this.props.location.state.storageGuid}}}>库房产品</Link></Breadcrumb.Item>
              <Breadcrumb.Item>编辑</Breadcrumb.Item>
            </Breadcrumb>
            <Alert 
            type={'warning'} 
            message="提示" 
            description={<div><p>1个领用单位 = 多少最小单位;</p></div>}
            showIcon={true}
            />
            <WrappedForm data={state}/>
          </div>
        }
      </div>
    );
  }
}

module.exports = CustomerStorageAllEdit