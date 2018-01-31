/**
 * @file 编辑
 */
import React from 'react';
import { Breadcrumb, Form, Select,Button,message,InputNumber,Row,Col,Alert,Modal} from 'antd';
import { Link ,hashHistory} from 'react-router';
import querystring from 'querystring';
import { CommonData,jsonNull ,fetchData} from 'utils/tools';
import { storage } from 'api';

const FormItem = Form.Item;
const Option = Select.Option;
class EditForm extends React.Component {
  state = {
      dirtyClick: false,
      shfsTypes: []
  }
  componentDidMount = () => {
    //配送方式
     CommonData('shfs', (data) => {
       this.setState({shfsTypes:data})
     });
  }
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
      //编辑提交
      const storageMaterialGuids = [];
      values.storageMaterialGuids = storageMaterialGuids.concat(this.props.data.storageMaterialGuids);
       fetchData(storage.CUSTOMERSTORAGEUPDATEMATERIAL,querystring.stringify(values),(data)=>{
          this.setState({dirtyClick: false});
          if(data.status){
             hashHistory.push({pathname:'/storage/customerStorageMaterial',query:{storageGuid:this.props.data.storageGuid}});
             message.success('编辑成功！')
          }
          else{
            this.handleError(data.msg);
          }
       });
      }
    });
  } 

  render() {    
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 9 },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 12,
      },
    };
    return (
      <Form  onSubmit={this.handleSubmit}>
             <FormItem
              {...formItemLayout}
                  label="配送方式"
              >
                 {getFieldDecorator('shfs', {
                    })(
                    <Select  style={{ width: 200 }} placeholder="请选择">
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
                    })(
                    <Select  style={{ width: 200 }} placeholder="请选择">
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
                    })(
                        <InputNumber min={-999999999} max={9999999999} style={{width:200}}/>
                 )}
              </FormItem>
              <FormItem
              {...formItemLayout}
                  label="下限"
              >
                {getFieldDecorator('lLimit', {
                    })(
                        <InputNumber min={-999999999} max={9999999999} style={{width:200}}/>
                 )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="一物一码"
                >
                {getFieldDecorator('qrflag',{
                    })(
                    <Select  style={{ width: 200 }}>
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
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
const WrappedForm = Form.create()(EditForm);
class CustomerStorageAllEdit extends React.Component {

  render() {
     const  { state } = jsonNull(this.props.location);
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link  to={{pathname:'/storage/customerStorageMaterial',query:{storageGuid:this.props.location.state.storageGuid}}}>库房产品</Link></Breadcrumb.Item>
          <Breadcrumb.Item>批量编辑</Breadcrumb.Item>
        </Breadcrumb>
         <Row>
          <Col span={14} >
              <WrappedForm data={ state }/>
         </Col>
            <Col span={8}>
           
              <Alert 
              type={'warning'} 
              message="提示" 
              description={<div><p>1个领用单位 = 多少最小单位;</p></div>}
              showIcon={true}
              />
            </Col>
           </Row>
       
      </div>
    );
  }
}

module.exports = CustomerStorageAllEdit