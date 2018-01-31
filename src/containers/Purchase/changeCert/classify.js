/**
 * @file 证件分类
 */
import React from 'react';
import { Breadcrumb, Form,Button,message,TreeSelect,Modal} from 'antd';
import querystring from 'querystring';
import { jsonNull,fetchData } from 'utils/tools';
import { Link,hashHistory } from 'react-router';
import { purchase } from 'api';

const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
class CertClassify extends React.Component {
    state = {
        typeId: undefined,
        data:[]
    }
    componentWillMount = () =>{
        if(!this.props.location.state.typeIdName){
            fetchData(purchase.SEARCHTREELISTBYORGID,querystring.stringify({storageGuid:this.props.location.state.storageGuid}),(data) => {
                if(data.status){
                    this.setState({ data: data.result})
                }else{
                    message.error("后台异常!")
                }
            })
        }
    }
      //处理错误信息
  handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
      });
  }
    onChange = (value,label,extra) => {
        console.log(extra.triggerNode,'extra')
        const isLeaf = extra.triggerNode ? extra.triggerNode.props.isLeaf : true;
        if(!isLeaf){
            this.setState({ typeId: value });
        }else{
            this.setState({ typeId: undefined });
        }
   
    }
    handleSubmit = () => {
        fetchData(purchase.SAVETMTYPEINFO,querystring.stringify({
            certGuid:this.props.location.state.certGuid,
            typeId:this.state.typeId,
            storageGuid:this.props.location.state.storageGuid
        }),(data) => {
            if(data.status){
                hashHistory.push({pathname:'/purchase/changeCert'});
               message.success("操作成功!")
            }else{
                this.handleError(data.msg)
            }
        })
    }
    render() {
        const data = jsonNull(this.props.location.state);

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
        
        const loop = data => data.map((item) => {
            if (item.children.length>0) {
              return <TreeNode  title={item.typeName} key={item.typeId} value={item.typeId}  isLeaf={item.children.length === 0 ? false:true}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode title={item.typeName} key={item.typeId} value={item.typeId} isLeaf={item.children.length === 0 ? false:true}/>;
          });
        const treeNodes = loop(this.state.data);
       
    
          
        return (
            <div>
            <Breadcrumb style={{fontSize: '1.1em'}}>
              <Breadcrumb.Item><Link to='/purchase/changeCert'>我的证件</Link></Breadcrumb.Item>
              <Breadcrumb.Item>分类</Breadcrumb.Item>
            </Breadcrumb>
            <Form style={{marginTop: '16px'}} onSubmit={this.handleSubmit}>
                <FormItem
                {...formItemLayout}
                label="注册证号"
                >
                    {data.registerNo}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="产品名称"
                >
                    {data.materialName}
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
                label="物资分类"
                >
               { data.typeIdName === "" ?
                <TreeSelect
                    showSearch
                    style={{ width: 300 }}
                    dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                    placeholder="请选择"
                    allowClear
                    value={this.state.typeId}
                    treeDefaultExpandAll
                    treeNodeFilterProp="title"
                    onChange={this.onChange}
                    notFoundContent={"未找到"}
                >
                {treeNodes}
                </TreeSelect>
                :
                data.typeIdName 
                }
                </FormItem>
                {
                    !data.typeIdName &&
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" size="large" loading={this.state.dirtyClick}>保存</Button>
                    </FormItem>
                }
            </Form>
            </div>
        )
    }
}
module.exports = CertClassify;