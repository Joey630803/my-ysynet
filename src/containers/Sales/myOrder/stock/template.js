/**
 * 添加模板
 */
import React  from 'react';
import { Form, Input, Button, Row, Col,Table, Breadcrumb,message} from 'antd';
import { hashHistory, Link } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { sales } from 'api';
import uuid from 'uuid';
const FormItem = Form.Item;

class SearchForm extends React.Component{
    search = (e) =>{
        e.preventDefault();
        this.props.form.validateFields( (err,values ) => {
            if(!err){
                console.log('查询条件: ', values)
                this.props.query(values);
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          }
          return (
            <Form className="ant-advanced-search-form" onSubmit={this.search}>
                <Row>
                    <Col span={7} key={1}>
                        <FormItem {...formItemLayout} label={`需方库房`}>
                            <Input disabled={true} value={this.props.rOrgName}/>
                        </FormItem>
                    </Col>
                    <Col span={7} key={2} style={{marginLeft:24}}>
                        <FormItem>
                        { getFieldDecorator(`searchName`,{
                            rules: [
                                { max: 25, message: '长度不能超过25' }
                            ]
                            })(
                                <Input placeholder='模板名称' />
                            )
                        }
                        </FormItem>
                    </Col>
                    <Col span={2} key={3} style={{marginLeft:24}}>
                        <Button type="primary" htmlType="submit">搜索</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const WrappedSearchForm = Form.create()(SearchForm);
class AddTemplate extends React.Component{
    state={
        query: {
            rStorageGuid:this.props.location.state.storageGuid
        },
        selected: [],
        selectedRows: [],
        dataSource: [],
        productData:[],
        operBagData : {},
        headerData: []
      }
    componentDidMount = () =>{
        this.getData();
    }
    getData = () =>{
        fetchData(sales.SEARCHGKTEMPLATELIST,querystring.stringify({rStorageGuid:this.props.location.state.storageGuid}),(data)=>{
            this.setState({ dataSource:data })
        })
    }
    handSearch = (query) => {
        query.rStorageGuid = this.state.query.rStorageGuid;
        fetchData(sales.SEARCHGKTEMPLATELIST,querystring.stringify(query),(data)=>{
            this.setState({dataSource:data})
        })
    }
    add = () =>{
        //查询勾选的模板产品
        const selectedRows = this.state.selectedRows;
        if(selectedRows.length === 0){
            return message.warn('请至少选择一项!')
        }
        //模板产品
        const postData = {};let productData = [],newProductData = [];
        let gkTemplateGuids = [],newBagData = [];
            selectedRows.forEach((item,index)=>{
                gkTemplateGuids.push(item.gkTemplateGuid);
            })
        postData.gkTemplateGuids = gkTemplateGuids;
        fetchData(sales.SEARCHGKTEMPLATEDETAILS,querystring.stringify(postData),(data)=>{
            if(data.status){
                productData = data.result.rows;
                newProductData = this.handleProductData(productData);
                console.log(newProductData,'处理后的产品数据');
            }else{
                message.error(data.msg);
            }
        });
        //模板对应的手术包
        postData.rOrgId = this.props.location.state.rOrgId;
        fetchData(sales.SEARCHGKTEMPLATEPACKAGES,querystring.stringify(postData),(data)=>{ 
            if(data.status){
                let headerData = data.result;
                let guid = [],templateGuids = [],packageIds = [],result =[];
                if(data.result.packages){
                    selectedRows.forEach((item,index)=>{
                        guid.push( item.gkTemplateGuid );
                    });                
                    let operBagData = data.result.packages;
                    let operBag = operBagData.slice(1,operBagData.length-1);
                    //packageIds
                    operBag.map((item,index)=>{
                        if(Number(item.packageId) === 1){
                            result.push(index);
                        }
                        packageIds.push( item.packageId );
                        return null;
                    });
                    //templateGuids
                    for(let i=0; i<result.length; i++){
                        var ids = packageIds.slice(result[i],result[i+1]);
                        for(let j=0; j<ids.length; j++){
                            templateGuids.push(guid[i]);
                        }
                    };
                    newBagData =  this.handleData(operBagData);
                    headerData.packages = newBagData;
                }
                hashHistory.push({
                    pathname: '/sales/myOrder/opStock',
                    state : {
                        dataSource : newProductData,
                        operData: headerData,
                        templateGuids:templateGuids,
                        packageIds:packageIds,
                        storageGuid:this.props.location.state.storageGuid,
                        rOrgId :this.props.location.state.rOrgId,
                        rOrgName: this.props.location.state.rOrgName,
                        orderId:this.props.location.state.orderId
                    },
                    query : {activeKey : 'product'}
                })
            }else{
                message.error(data.msg)
            }
        });
    }
    //产品字段
    handleProductData = (value)=>{
        for(let i =0;i<value.length;i++){
            let item = value[i];
            for(let key in item){
                if(key === 'tfAmount'){
                    item["amount"] = item[key]
                    delete item[key];
                }
            }
            item['sendDetailGuid'] = uuid();
        }
        return value;
    }
    //手术包字段
    handleData = (value) =>{
        let operBagData = value;
         for(let i =0;i<operBagData.length;i++){
             let item = operBagData[i];
             for(let key in item){
                 if(key === 'isImplantFlag'){
                     item[key] === '01'? item['hasImplantFlag'] = '是': item['hasImplantFlag'] = '否';
                     delete item['isImplantFlag'];
                 }
                 if(key === 'isToolFlag' && item['isToolFlag'] !== null){
                     item['sumOperTool'] = item['isToolFlag'] ==='01'?'1':'0';
                     delete item['isToolFlag'];
                 }
             }
         }
         return operBagData;
    }
    render(){
        const columns = [
            {
                title : '模板名称',
                dataIndex : 'gkTemplateName'
            },{
                title: '需方库房',
                dataIndex :'rStorageName'
            }
        ]
        //const query = this.state.query;
        return (
        <div>
            {
                this.props.children ||
                <div>
                    <Row>
                        <Col className="ant-col-6">
                            <Breadcrumb style={{fontSize: '1.1em'}}>
                                <Breadcrumb.Item><Link to='/sales/myOrder'>我的订单</Link></Breadcrumb.Item>
                                <Breadcrumb.Item><Link to={{pathname:'/sales/myOrder/opStock',query:{activeKey:'product'},state : this.props.location.state}}>手术备货</Link></Breadcrumb.Item>
                                <Breadcrumb.Item>我的模板</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col className='ant-col-18' style={{textAlign:'right'}}>
                            <Button type="primary" style={{marginRight:8}} onClick={this.add}>添加</Button>
                        </Col>
                    </Row>
                    <WrappedSearchForm query={this.handSearch} rOrgName={this.props.location.state.rOrgName}/>
                    <Table 
                        style={{marginTop:10}}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        rowKey={record => record.gkTemplateGuid}
                        size='small'
                        rowSelection={{
                            selectedRowKeys: this.state.selected,
                            onChange: (selectedRowKeys, selectedRows) => {
                            this.setState({ selected:selectedRowKeys, selectedRows: selectedRows});
                            }
                        }}
                    />
                </div>
            }
        </div>
        )
    }
}
module.exports = AddTemplate;