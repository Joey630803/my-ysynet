/**
 * 拒绝接收
 */
import React from 'react';
import {Input ,Modal,message,Form} from 'antd'
import { fetchData } from 'utils/tools'
import { hashHistory} from 'react-router';

import { storage } from 'api'
import querystring from 'querystring'
import './refuse.css'
const FormItem=Form.Item

class Refuse extends React.Component{
    state = {
    }
handleSubmit=()=>{

    const { baseData } = this.props;

    this.props.form.validateFields((error, values) => {
        let vals=values.reason
        if(vals===undefined){
            message.info("您还没有填写呢!")
        }else if(vals.length>200){
            message.error('长度不能超过200')
        }else{
            fetchData(
                storage.REFUSE,
                querystring.stringify({
                sendIds:baseData.sendId,
                storageGuid:baseData.storageGuid,
                rejectReason:vals
            }),
            (data)=>{
                if(data.status){
                    message.success('操作成功');
                        this.setState({ loading: false });
                    hashHistory.push({pathname:'/storage/wareHouse',query:{activeKey:'1'}});
                }else{
                    this.handleError(data.msg);
                }
            }
        )

        }

})
}

render(){

const { getFieldDecorator } = this.props.form;

    return (
    
        <Modal 
        title="确认" 
        wrapClassName="vertical-center-modal" 
        visible={this.props.modalVisible}
        onOk={this.handleSubmit}
        onCancel={()=>this.props.setModalVisible(false)} 
        width={350}>

                <Form onSubmit={this.handleSubmit} className="refuse">

                    <FormItem label="是否拒收？">
                        {getFieldDecorator('reason', {
                            rules: [{message: '' }],
                        })(
                            <Input.TextArea type="text" placeholder="请写下拒收理由!" rows={4}/>
                        )}
                    </FormItem>
                </Form>
        </Modal>
    )}
}

export default Refuse=Form.create()(Refuse)