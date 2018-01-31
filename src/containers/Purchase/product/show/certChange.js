/**
 * @file 我的产品--详情--证件变更记录
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker} from 'antd';
import FetchTable from 'component/FetchTable';
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import { purchase } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SearchForm extends React.Component{
    state = {
        createUserOptions:[]
    }
    componentDidMount = ()=>{
        fetchData(purchase.FINDCREATEUSER,
            querystring.stringify({tenderMaterialGuid:this.props.data.tenderMaterialGuid}),(data)=>{
                this.setState({ createUserOptions: data.result })
        })
    }
    handleSearch = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const changeTime = values.changeTime === undefined ? "" : values.changeTime;
            if(changeTime.length>0){
                values.changeTimeStart = changeTime[0].format('YYYY-MM-DD');
                values.changeTimeEnd = changeTime[1].format('YYYY-MM-DD');
            }
           values.tenderMaterialGuid = this.props.data.tenderMaterialGuid;
          console.log('查询条件: ', values)
          this.props.query(values);
       });
    }
    render(){
        const baseData = this.props.data;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 }
			}
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row>
                    <Col span={7} key={1}>
                        <FormItem {...formItemLayout} label={`组件名称`}>
                            <Input disabled  defaultValue={baseData.suitName}/>
                        </FormItem>
                    </Col>
                    <Col span={7} key={2}>
                        <FormItem {...formItemLayout} label={`型号`}>
                            <Input disabled defaultValue={baseData.fmodel}/>
                        </FormItem>
                    </Col>
                    <Col span={7} key={3}>
                        <FormItem {...formItemLayout} label={`规格`}>
                            <Input disabled defaultValue={baseData.spec}/>
                        </FormItem>
                    </Col>
                    <Col span={7} key={4}>
                        <FormItem {...formItemLayout} label={`最小单位`}>
                            <Input disabled defaultValue={baseData.leastUnit}/>
                        </FormItem>
                    </Col>
                    <Col span={7} key={5}>
                        <FormItem {...formItemLayout} label={`操作时间`}>
                            {
                                getFieldDecorator(`changeTime`)(
                                    <RangePicker />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={7} key={6}>
                        <FormItem {...formItemLayout} label={`操作员`}>
                            {
                                getFieldDecorator(`createUser`,{
                                    initialValue:''
                                }
                            )(
                                    <Select>
                                        <Option key={-1} value=''>请选择</Option>
                                        {
                                            this.state.createUserOptions.map((item,index)=>{
                                                return <Option key={index} value={item.createUser}>{item.createUserName}</Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={3} key={7} style={{textAlign:'right'}}>
                        <Button type="primary" htmlType="submit">搜索</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const SearchBox = Form.create()(SearchForm);
class CertChange extends React.Component{
    state = {
        query:{
            tenderMaterialGuid: this.props.data.tenderMaterialGuid
        }
    }
    queryHandler = (query)=>{
        this.refs.table.fetch(query);
        this.setState({ query: query })
    }
    render(){
        const columns = [{
            title: '证件号(变更前)',
            dataIndex: 'oldValue'
        },{
            title: '有效期',
            dataIndex: 'oldLastDate'
        },{
            title: '证件号(变更后)',
            dataIndex: 'newValue'
        },{
            title: '有效期',
            dataIndex: 'newLastDate'
        },{
            title: '操作员',
            dataIndex: 'createUserName'
        },{
            title: '操作时间',
            dataIndex: 'createTime'
        }]
        return (
        <div>
            {
                this.props.children
                ||
                <div>
                    <SearchBox query={(query)=>this.queryHandler(query)} data={this.props.data}/>
                    <FetchTable 
                        ref='table'
                        columns={columns}
                        query={this.state.query}
                        rowKey={'tenderChangeGuid'}
                        url={purchase.FINDCERTCHANGELIST}
                    />
                </div>
            }
        </div>
        )
    }
}
module.exports = CertChange;