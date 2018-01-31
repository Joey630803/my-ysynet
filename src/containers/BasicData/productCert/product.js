/**
 * 产品管理---产品
 */
import React from 'react';
import {Form,Breadcrumb,Row,Col ,Button,Popconfirm,message,Upload,Icon,Alert,Modal} from 'antd';
import { Link,hashHistory } from 'react-router';
import SearchForm from './searchForm';
import { jsonNull,actionHandler,fetchData,pathConfig } from 'utils/tools';
import querystring from 'querystring';
import FetchTable from 'component/FetchTable';
import { productUrl } from 'api';

/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
const FormItem = Form.Item;

class Product extends React.Component{
    state = {
        query: {
            certGuid:this.props.location.state.certGuid
        },
        selectedRowKeys:[],
        selectedRows:[],
        loading:false,
        messageError:""
    }
     //处理错误信息
     handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
     //删除
     deleteHandler = (record) => {
        fetchData(productUrl.DELETEMODEL, querystring.stringify({fitemid:record.fitemid}),(data)=>{
            if(data.status){
                this.refs.table.fetch();
                message.success('删除成功！')
            }else{
                this.handleError(data.msg)
            }
        })
    }
    //查询
    queryHandler = (query) => {
        query.certGuid = this.props.location.state.certGuid;
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    onSelectChange = (selectedRowKeys,selectedRows) => {
        console.log('选中数据selectedRows: ', selectedRows);
        this.setState({ selectedRowKeys,selectedRows });
    }
    //选中批量编辑的行
    batchEditClick = () => {
        let data = this.props.location.state;
        data.productList = this.state.selectedRows;
        data.fitemids =  this.state.selectedRowKeys;
        data.title = "批量编辑";
        if(this.state.selectedRowKeys.length>1){
            hashHistory.push({pathname:'/basicData/productCert/batchEdit',state: data});
         }
         else {
          message.warning('请选中超过一条以上数据');
         }
    }
    //全部编辑
    allEditClick = () => {
        let data = this.props.location.state;
        data.title = "全部编辑";
        hashHistory.push({pathname:'/basicData/productCert/productAllEdit',state: data});
         
    }
    //变更证件
    handleChangeCert = () => {
        let data = this.props.location.state;
        data.fitemids =  this.state.selectedRowKeys;
        data.title = "变更证件";
        if(this.state.selectedRowKeys.length>0){
            hashHistory.push({pathname:'/basicData/productCert/changeCert',state: data});
         }
         else {
          message.warning('请选中数据');
         }
    }
    //全部变更
    handleChangeAllCert = () =>{
        let data = this.props.location.state;
        data.title = "全部变更";
        hashHistory.push({pathname:'/basicData/productCert/changeCert',state: data});
    }
    render(){
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
          };
        const baseData = jsonNull(this.props.location.state);
        //列
        const columns = [{
            title : '操作',
            width: 80,
            dataIndex:'actions',
            render:(text,record) => {
                return (
                    <span>
                        <a onClick={actionHandler.bind(null,this.props.router,`/basicData/productCert/productEdit`,{...record,certGuid:baseData.certGuid,registerNo:baseData.registerNo,produceName:baseData.produceName})}>
                            编辑
                        </a>
                        <span className="ant-divider" />
                        <Popconfirm title="是否确认删除此条记录?" onConfirm={this.deleteHandler.bind(null, record)} okText="是" cancelText="否">
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        },{
            title:'组件名称',
            width: 160,
            dataIndex:'suitName'
        },{
            title:'型号',
            width: 80,
            dataIndex:'fmodel',
        },{
            title:'规格',
            width: 120,
            dataIndex:'spec'
        },{
            title:'最小单位',
            width: 120,
            dataIndex:'leastUnitName'
        },{
            title:'产品材质',
            width: 120,
            dataIndex:'tfTexture'
        },{
            title:'骨科产品属性',
            width: 120,
            dataIndex:'attributeName',
        },{
            title:'条形码',
            width: 120,
            dataIndex:'fbarcode',
        }];
        const query = this.state.query;
        const messageInfo = "添加大量的信息，建议使用导入功能。导入前请先下载品规信息Excel格式模版文件。(>=2条数据即可使用)";
        return(
            <div>
                <Breadcrumb style={{fontSize: '1.1em',marginBottom:16}}>
                    <Breadcrumb.Item><Link to='/basicData/productCert'>产品证件</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>产品</Breadcrumb.Item>
                </Breadcrumb>
                <Alert message={messageInfo} type="warning" showIcon closeText="关闭" />
                     {
                         this.state.messageError === "" ? null
                         :
                         <Alert message="错误提示"  type="error" description={<div dangerouslySetInnerHTML={{__html:this.state.messageError}}></div>} showIcon closeText="关闭" />
                     }
                <Row style={{marginTop:'8px'}}>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="产品名称:">
                            {baseData.materialName}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="证件号:">
                            {baseData.registerNo}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="生产商:">
                            {baseData.produceName}
                        </FormItem>
                    </Col>
                </Row>
                <SearchBox  query={this.queryHandler}/>
                <div>
                    <Button type="primary">
                        <Link to={{pathname:'/basicData/productCert/productAdd',state:this.props.location.state}}>添加</Link>
                    </Button>
                    <Button 
                        style={{ marginLeft: 8 }}
                        type="danger" ghost
                        onClick={this.batchEditClick}
                    >批量编辑</Button>
                    <Button 
                    style={{ marginLeft: 8 }}
                    type="danger" ghost
                    onClick={this.allEditClick}
                    >
                        全部编辑
                    </Button>
                    <Button 
                    type="primary" 
                    style={{ marginLeft: 8 }}
                    onClick={this.handleChangeCert}
                    >变更证件</Button>
                    <Button 
                    type="primary" 
                    style={{ marginLeft: 8,marginRight: 8 }}
                    onClick={this.handleChangeAllCert}
                    >全部变更</Button>
                    <Upload
                    data={{"certGuid":this.state.query.certGuid}}
                    action={productUrl.IMPORTMODEL}
                    showUploadList={false}
                    withCredentials={true}
                    beforeUpload={()=>this.setState({loading: true})}
                    onError={(error)=>{
                        this.setState({loading: false})
                        console.log(error)
                    }}
                    onSuccess={(result)=>{
                        this.setState({loading: false})
                        if(result.status){
                            this.refs.table.fetch();
                            this.setState({
                                messageError:""
                            })
                            message.success("导入成功")
                        }
                        else{
                            this.setState({
                                messageError:result.msg
                            })
                        }
                    }}
                    >
                    <Button style={{ marginRight: 8 }}>
                    <Icon type='export'/> 导入
                    </Button>
                    </Upload>
                    <a  style={{ marginLeft: 8 }} target="_self" href={pathConfig.TEMPLATEPATH+"/template/MaterialTemplate.xls"}>
                            <Icon type='cloud-download'/> 下载模板
                    </a>
                </div>
                <FetchTable 
                loading={ this.state.loading}
                query={query}
                ref='table'
                columns={columns}
                url={productUrl.MODELLIST_BYCERTID}
                rowKey='fitemid'
                rowSelection={{
                     onChange: this.onSelectChange
                }}
                />
            </div>
        )
    }
}
module.exports = Product;