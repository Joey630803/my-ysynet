/**
 * @file 财务-财务分类
 */
import React from 'react';
import {  Row, Col, Button, Breadcrumb, message,Table,TreeSelect,Modal } from 'antd';
import { Link, hashHistory } from 'react-router';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { finance } from 'api';
const TreeNode = TreeSelect.TreeNode;
class FinanceClassify extends React.Component{
    state = {
        styleId: undefined,
        treeData: []
    }
    componentWillMount = ()=>{
        fetchData(finance.SEARCHTREETYPE,querystring.stringify({ storageGuid:this.props.location.state.storageGuid }),(data)=>{
            if(data.status){
                this.setState({ treeData: data.result })
            }
        })
    }
    onChange = (value,label,extra) => {
        console.log(extra.triggerNode,'extra')
        const isLeaf = extra.triggerNode ? extra.triggerNode.props.isLeaf : true;
        if(!isLeaf){
            this.setState({ styleId: value });
        }else{
            this.setState({ styleId: undefined });
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
    handleWarning = (values) =>{
        const that = this;
        Modal.confirm({
            title: '提示',
            content: (
                <p>
                    有产品存在分类，继续操作将会影响财务报表。
                    请谨慎操作，是否继续保存？
                </p>
                ),
            okText: '确定',
            cancelText: '取消',
            onOk(){
                that.updateType(values); 
            },
            onCancel(){}
          });
    }
    save = () =>{
        if(this.state.styleId){
            let postData = {},data = '';
            let dataSource = this.props.location.state.dataSource;
            console.log(dataSource,'dataSource')
            dataSource.map((item,index)=>{
                return data+=item.tenderMaterialGuid+",";
            });
            data = data.substring(0,data.length-1);
            postData.tenderMaterialGuid = data;
            postData.searchName = this.state.styleId;
            console.log(postData,'postData')
            fetchData(finance.FINDFINANCETYPE,querystring.stringify(postData),(data)=>{
                console.log(typeof data.result,'result');
                if(data.status){
                    if(data.result === 1){
                        //有财务大类
                        this.handleWarning(postData);
                    }else{
                        this.updateType(postData)
                    }
                }else{
                    this.handleError(data.msg);
                }
            })
        }else{
            message.warn('请选择财务分类');
        }
    }
    updateType = (values)=>{
        fetchData(finance.UPDATEFINANCETYPE,querystring.stringify(values),(data)=>{
            if(data.status){
                message.success('操作成功！');
                hashHistory.push({ pathname: this.props.location.state.from })
            }else{
                this.handleError(data.msg)
            }
        })
    }
    render(){
        console.log(this.props,'porps')
        const loop = data => data.map((item) => {
            if (item.children.length>0) {
              return <TreeNode  title={item.styleName} key={item.styleId} value={item.styleId}  isLeaf={item.children.length === 0 ? false:true}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode title={item.styleName} key={item.styleId} value={item.styleId} isLeaf={item.children.length === 0 ? false:true}/>;
          });
        const treeNodes = loop(this.state.treeData);
        const columns = [{
            title: '产品名称',
            dataIndex: 'materialName'
        },{
            title:'组件名称',
            dataIndex: 'suitName'
        },{
            title:'型号',
            dataIndex: 'fmodel'
        },{
            title:'规格',
            dataIndex: 'spec'
        },{
            title:'采购价格',
            dataIndex: 'purchasePrice',
            render:(text,record)=>{
              return text === 'undefined'? '0':text.toFixed(2)
            }
        },{
            title:'采购单位',
            dataIndex: 'purchaseUnit'
        },{
            title: '财务分类',
            dataIndex: 'styleName',
        }];
        return (
            <div>
                {
                    this.props.children ||
                    <div>
                        <Row>
                            <Col className="ant-col-6">
                                <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                                    <Breadcrumb.Item><Link to='/finance/myProduct'>财务产品</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item>{this.props.location.state.title || ''}</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="ant-col-9">
                                <div className="ant-row">
                                    <div className="ant-col-4 ant-form-item-label-left">
                                        <label>财务分类</label>
                                    </div>
                                    <div className="ant-col-16">
                                        <div className="ant-form-item-control">
                                            <TreeSelect
                                                showSearch
                                                style={{ width: 400 }}
                                                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                                placeholder="请选择"
                                                allowClear
                                                value={this.state.styleId}
                                                treeDefaultExpandAll
                                                treeNodeFilterProp="title"
                                                onChange={this.onChange}
                                                notFoundContent={"未找到"}
                                            >
                                                {treeNodes}
                                            </TreeSelect>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col className="ant-col-2" style={{textAlign:'right'}}>
                                <Button type='primary' onClick={this.save}>保存</Button>
                            </Col>
                        </Row>
                        <Table 
                            style={{marginTop:12}}
                            columns={columns}
                            pagination={false}
                            size={'small'}
                            rowKey={'tenderMaterialGuid'}
                            dataSource={this.props.location.state.dataSource}
                        />
                    </div>
                }
            </div>
        )
    }
}
module.exports = FinanceClassify;