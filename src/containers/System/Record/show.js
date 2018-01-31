/**
 * @file 操作记录详情
 */
import React from 'react';
import { Breadcrumb,Row,Col,Form } from 'antd';
import { Link } from 'react-router';
import { jsonNull } from 'utils/tools';

const FormItem = Form.Item;
class RecordShow extends React.Component{
    showForm = () => {
        const formItemLayout = {
            labelCol: { span : 10 },
            wrapperCol: { span : 10 }
        }
        const { state } = jsonNull(this.props.location);
        return (
            <Form className='show-from' style={{marginTop:'32px'}}>
                <Row>
                    <Col span={12} key={1}>
                         <FormItem {...formItemLayout} label='操作人'>
                            {`${state.loginUsername}`}
                        </FormItem>
                    </Col>
                    <Col span={12} key={2}>
                        <FormItem {...formItemLayout} label='机构名称'>
                            {`${state.orgName}`}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12} key={3}>
                        <FormItem {...formItemLayout} label='IP地址'>
                            {`${state.loginIp}`}
                        </FormItem>
                    </Col>
                 
                    <Col span={12} key={5}>
                        <FormItem {...formItemLayout} label='操作时间'>
                            {`${state.operationDate}`}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12} key={6}>
                        <FormItem {...formItemLayout} label='操作模块'>
                            {`${state.moduleName}`}
                        </FormItem>
                    </Col>
                    <Col span={12} key={7}>
                        <FormItem {...formItemLayout} label='操作名称'>
                            {`${state.operationName}`}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12} key={9}>
                        <FormItem {...formItemLayout} label='操作结果'>
                            {`${state.operationRes}`}
                        </FormItem>
                    </Col>
                    <Col span={12} key={10}>
                        <FormItem {...formItemLayout} label='失败原因'>
                            {`${state.errorReason}`}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12} key={4}>
                        <FormItem {...formItemLayout} label='浏览器类型'>
                            {`${state.loginBrowser}`}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12} key={8}>
                        <FormItem {...formItemLayout} label='操作参数'>
                            {`${state.operationArgs}`}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
    render(){
        return (
            <div>
                <Breadcrumb style={{fontSize:'1.1em'}}>
                    <Breadcrumb.Item><Link to='/system/record'>操作记录</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>详情</Breadcrumb.Item>
                </Breadcrumb>
                {this.showForm()}
            </div>
        )
    }
}
module.exports = RecordShow;

