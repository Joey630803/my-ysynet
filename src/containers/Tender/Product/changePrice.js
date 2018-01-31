/**
 * @file 编辑
 */
import React from 'react';
import { Breadcrumb, Form,Button,message,InputNumber,Row,Col} from 'antd';
import { Link,hashHistory } from 'react-router';
import { jsonNull ,fetchData} from 'utils/tools';
import { tender } from 'api';

const FormItem = Form.Item;
class EditForm extends React.Component {
  state = {
      dirtyClick: false,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      this.setState({dirtyClick: true});
      //编辑提交
      const tenderUpdate  = [];
        this.props.data.map((item,idnex) => {
            return tenderUpdate.push({tenderDetailGuid:item.tenderDetailGuid})
        })
        values.tenderUpdate = tenderUpdate;
        fetchData(tender.CHANGEPRICETENDERMATERIAL,JSON.stringify(values),(data)=>{
          this.setState({dirtyClick: false});
          if(data.status){
             hashHistory.push({pathname:'/tender/product'});
             message.success('编辑成功！')
          }
          else{
            message.error(data.msg)
          }
        },'application/json')
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
                  label="招标价格"
            >
                 {getFieldDecorator('afterTenderPrice', {
                    rules: [
                        { required: true, message: '请输入价格'},
                        { type: 'number', message: '只允许输入数字'}
                        ],
                    })(
                      <InputNumber/>
                 )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
            </FormItem>
      </Form>
    )
  }
}
const WrappedForm = Form.create()(EditForm);
class ChangePriceEdit extends React.Component {

  render() {
     const  { state } = jsonNull(this.props.location);
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
           <Breadcrumb.Item>
            <Link to={'/tender/product'}>招标产品</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>调价</Breadcrumb.Item>
        </Breadcrumb>
         <Row>
          <Col span={14} >
              <WrappedForm data={ state }/>
         </Col>
           </Row>
       
      </div>
    );
  }
}

module.exports = ChangePriceEdit