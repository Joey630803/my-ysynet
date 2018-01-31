import React from 'react';;
import { Form, Row, Col } from 'antd';
const FormItem = Form.Item;



class ShowForm extends React.Component{
  render() {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 10 },
    };

    const children = [];
    for (let i = 0; i < 10; i++) {
      children.push(
        <Col span={10} key={i} push={2}>
          <FormItem {...formItemLayout} label={`Field ${i}`}>
            i
          </FormItem>
        </Col>
      );
    }
    return (
      <Form
        style={this.props.style || null}
      >
        <Row gutter={0}>
          {children}
        </Row>
      </Form>
    )
  }
}

export default ShowForm;