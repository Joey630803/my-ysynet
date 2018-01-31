/**
 * @file 招标记录--招标详情--编辑
 */
import React from 'react';
import { Form, Row, Col, Breadcrumb,Input,Select, Button, Icon,message,Popover,Modal } from 'antd';
import { Link, hashHistory } from 'react-router';
import { fetchData, CommonData } from 'utils/tools';
import querystring from 'querystring';
import { tender } from 'api';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
class EditForm extends React.Component{
    state = {
        inputState: false,
        baseData: '',
        packTextureOpts: [],
        packSpecOpts: [],
        UnitOptions: [],
        packingTexture:'',
        tfPacking:''
    }
    componentDidMount = ()=>{
        fetchData(tender.TENDERDETAILEEDITLIST,
            querystring.stringify({tenderDetailGuid:this.props.data.tenderDetailGuid}),(data)=>{
                if(data.status){
                    this.setState({ baseData : data.result })
                }
        });
        //包装材质
        fetchData(tender.SEARCHMATERIALEXTEND,querystring.stringify({fitemid:this.props.data.fitemId,type:'packTexture'}),(data)=>{
            this.setState({packTextureOpts: data });
        });
        //包装规格
        fetchData(tender.SEARCHMATERIALEXTEND,querystring.stringify({fitemid:this.props.data.fitemId,type:'packSpec'}),(data)=>{
            this.setState({packSpecOpts: data });
        });
        //单位
        CommonData('UNIT',(data)=>{
            this.setState({ UnitOptions:data});
        })
    }

    tMaterialSelect = (value,option)=>{
        if(option.props.value !==''){
            this.setState({ packingTexture : option.props.children })
        }
        
    }
    pMaterialSelect = (value,option)=>{
        if(option.props.value !==''){
            this.setState({ tfPacking : option.props.children })
        }
    }
    save = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                const CheckData = {
                    'purchaseUnit' : values.purchaseUnit,
                    'pConversion' : values.pConversion,
                    'fitemid':this.props.data.fitemId,
                    'storageGuid':this.props.data.storageGuid
                };
                let conversion = values.conversion,pConversion = values.pConversion,tenderPrice = values.tenderPrice;
                let purchasePrice = ((pConversion*1) / (conversion*1))*Number(tenderPrice);
                purchasePrice = purchasePrice.toFixed(4);
                console.log(purchasePrice,'purchasePrice');
                let lastPrice = values.purchasePrice;//最后表单获取的值
                 if(this.state.inputState){
                    this.validateAndSave(values,CheckData);
                }else{
                    if(Number(purchasePrice)!==Number(lastPrice)){
                        const that = this;
                        confirm({
                            title: '提示',
                            okText:'确认',
                            cancelText:'取消' ,
                            content: (
                                <div>
                                    <p>采购价与招标价换算有出入，是否继续保存？</p>
                                    <p>继续请"确认"，停止请"取消"</p>
                                </div>
                            ),
                            onOk(){
                                that.validateAndSave(values,CheckData);
                            },
                            onCancel(){}
                        })
                    }else{
                        this.validateAndSave(values,CheckData);
                    }
                }
                this.setState({ inputState:false })
            }
        })
        
    }
    
    //验证单位并保存
    validateAndSave = (values,CheckData)=>{
        const postData = {
            'tenderDetailGuid':this.props.data.tenderDetailGuid,
            'materialName':this.state.baseData.materialName,
            'tenderUnit':values.tenderUnit,
            'tenderPrice':values.tenderPrice,
            'conversion':values.conversion,
            'purchaseUnit':values.purchaseUnit,
            'purchasePrice':values.purchasePrice,
            'pConversion':values.pConversion,
            'purchaseNo':values.purchaseNo,
            'packingTexture':this.state.packingTexture,
            'tMaterialExtendGuid':values.tMaterialExtendGuid,
            'tfPacking':this.state.tfPacking,
            'pMaterialExtendGuid':values.pMaterialExtendGuid,
        };
        fetchData(tender.FINDPURCHASEUNITEXIST,querystring.stringify(CheckData),(data)=>{
            if(data.status){
                this.EditSave(postData);
            }else{
                //验证不通过
                const that = this;
                confirm({
                    title:'提示',
                    okText:'确认',
                    cancelText:'取消' ,
                    content:(
                        <div>
                            <p style={{fontSize:'1.1em'}}>{data.msg}</p>
                            <p style={{marginTop:8}}>继续请"确认"，停止请"取消"</p>
                        </div>
                    ),
                    onOk(){
                        that.EditSave(postData);
                    },
                    onCancel(){}

                })
            }
        })
    }
    //编辑验证成功后保存
    EditSave = (postData)=>{
        fetchData(tender.MODIFYTENDERMATERIAL,querystring.stringify(postData),(data)=>{
            if(data.status){
                message.success('编辑成功！');
                hashHistory.push({
                    pathname:'/tender/tenderRecord/show',
                    state:{
                        tenderGuid:this.props.data.tenderGuid,
                        rStorageGuid:this.props.data.rStorageGuid,
                        releaseFlag:this.props.data.releaseFlag
                    }
                })
            }else{
                message.error(data.msg);
            }
        })
    }
    getPurchasePrice = (e)=>{
        e.preventDefault();
        const data =  this.props.form.getFieldsValue();
        let conversion = data.conversion,pConversion = data.pConversion,tenderPrice = data.tenderPrice;
        let purchasePrice = ((pConversion*1) / (conversion*1))*Number(tenderPrice);
        purchasePrice = purchasePrice.toFixed(4);
        console.log(purchasePrice,'purchasePrice');
        this.setState({ inputState: true })
        this.props.form.setFieldsValue({purchasePrice:purchasePrice});
    }
    render(){
        const baseData = this.state.baseData;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 14 },
          };
          const ButtonLayout = {
            wrapperCol: {
                span: 8,
                offset: 11,
              },
          }
          const content = (
              <div>
                  <p>产品的招标单位通常是医院的最</p>
                  <p>小使用单位，也是计算该产品库</p>
                  <p>存的计量单位，建议使用最小单位;</p>
              </div>
          )
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.save}>
                <Row>
                    <Col span={3}></Col>
                    <Col span={9}>
                        <Row>
                            <Col key={1}>
                                <FormItem {...formItemLayout} label={`产品名称`}>
                                    <Input value={baseData.materialName?baseData.materialName:''} disabled/>
                                </FormItem>
                            </Col>
                            <Col key={3}>
                                <FormItem {...formItemLayout} label={`品牌`}>
                                    <Input value={baseData.tfBrand?baseData.tfBrand:''} disabled/>
                                </FormItem>
                            </Col>
                            <Col key={4}>
                                <FormItem {...formItemLayout} label={`生产商`}>
                                    <Input value={baseData.tfBrand?baseData.tfBrand:''} disabled/>
                                </FormItem>
                            </Col>
                            <Col key={5}>
                                <FormItem {...formItemLayout} label={`证件号`}>
                                    <Input value={baseData.registerNo?baseData.registerNo:''} disabled/>
                                </FormItem>
                            </Col>
                            <Col key={6}>
                                <FormItem {...formItemLayout} label={`组件名称`}>
                                    <Input value={baseData.suitName?baseData.suitName:''} disabled/>
                                </FormItem>
                            </Col>
                            <Col key={7}>
                                <FormItem {...formItemLayout} label={`型号`}>
                                    <Input value={baseData.fmodel?baseData.fmodel:''} disabled/>
                                </FormItem>
                            </Col>
                            <Col key={8}>
                                <FormItem {...formItemLayout} label={`规格`}>
                                    <Input value={baseData.spec?baseData.spec:''} disabled/>
                                </FormItem>
                            </Col>
                            <Col key={9}>
                                <FormItem {...formItemLayout} label={`条形码`}>
                                    <Input value={baseData.fbarCode?baseData.fbarCode:''} disabled/>
                                </FormItem>
                            </Col>
                            <Col key={10}>
                                <FormItem {...formItemLayout} label={`最小单位`}>
                                    <Input value={baseData.leastUnit?baseData.leastUnit:''} disabled/>
                                </FormItem>
                            </Col>
                            <Col key={11}>
                                <FormItem {...formItemLayout} label={`骨科产品属性`}>
                                    <Input value={baseData.attributeId?baseData.attributeId:''} disabled/>
                                </FormItem>
                            </Col>
                            <Col key={12}>
                                <FormItem {...formItemLayout} label={`产品材质`}>
                                    <Input value={baseData.tfTexture?baseData.tfTexture:''} disabled/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={9}>
                        <Row>
                            <Col key={13}>
                                <FormItem {...formItemLayout} label={`包装材质`}>
                                    {
                                        getFieldDecorator(`tMaterialExtendGuid`,{
                                            initialValue:baseData.tMaterialExtendGuid?baseData.tMaterialExtendGuid:''
                                        })(
                                            <Select onSelect={this.tMaterialSelect}>
                                                <Option key={-1} value=''>请选择</Option>
                                                {
                                                    this.state.packTextureOpts.map((item,index)=>{
                                                        return <Option key={index} value={item.value}>{item.text}</Option>
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col key={14}>
                                <FormItem {...formItemLayout} label={`包装规格`}>
                                    {
                                        getFieldDecorator(`pMaterialExtendGuid`,{
                                            initialValue:baseData.pMaterialExtendGuid?baseData.pMaterialExtendGuid:''
                                        })(
                                            <Select onSelect={this.pMaterialSelect}>
                                                <Option key={-1} value=''>请选择</Option>
                                                {
                                                    this.state.packSpecOpts.map((item,index)=>{
                                                        return <Option key={index} value={item.value}>{item.text}</Option>
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col key={15}>
                                <FormItem {...formItemLayout} label={`招标单位`}>
                                    {
                                        getFieldDecorator(`tenderUnit`,{
                                            initialValue:baseData.tenderUnit?baseData.tenderUnit:'',
                                            rules:[{required:true,message:'请选择招标单位'}]
                                        })(
                                            <Select 
                                                style={{width:'85%'}}
                                                showSearch
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                <Option key={-1} value=''>请选择</Option>
                                                {
                                                    this.state.UnitOptions.map((item,index)=>{
                                                        return <Option key={index} value={item.TF_CLO_NAME}>{item.TF_CLO_NAME}</Option>
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                    {
                                        <Popover placement="right" content={content} trigger="click">
                                            <Icon type="exclamation-circle-o" style={{marginLeft:8,fontSize:16}}/>
                                        </Popover>
                                    }
                                </FormItem>
                            </Col>
                            <Col key={16}>
                                <FormItem wrapperCol={{span:14,offset:5}}>
                                    {
                                        getFieldDecorator(`conversion`,{
                                            initialValue:baseData.conversion?baseData.conversion:'',
                                            rules:[
                                                {pattern:/^[0-9]*[1-9][0-9]*$/,message:'只能是正整数'},
                                                {required:true,message:'请输入转换数'}]
                                        })(
                                            <Input addonBefore='1 招标单位 =' addonAfter='最小单位'/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col key={17}>
                                <FormItem {...formItemLayout} label={`招标价`}>
                                    {
                                        getFieldDecorator(`tenderPrice`,{
                                            initialValue:baseData.tenderPrice?baseData.tenderPrice:'',
                                            rules:[
                                                {pattern:/^[0-9]+(.[0-9]{1,4})?$/,message:'请注意格式,最多4位小数'},
                                                {required:true,message:'请输入招标价'}
                                            ]
                                        })(
                                            <Input addonBefore='人民币' addonAfter='元'/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col key={18}>
                                <FormItem {...formItemLayout} label={`采购单位`}>
                                    {
                                        getFieldDecorator(`purchaseUnit`,{
                                            initialValue:baseData.purchaseUnit?baseData.purchaseUnit:'',
                                            rules:[{required:true,message:'请输入采购单位'}]
                                        })(
                                            <Select 
                                                showSearch
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                <Option key={-1} value=''>请选择</Option>
                                                {
                                                    this.state.UnitOptions.map((item,index)=>{
                                                        return <Option key={index} value={item.TF_CLO_NAME}>{item.TF_CLO_NAME}</Option>
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col key={19}>
                                <FormItem wrapperCol={{span:14,offset:5}}>
                                    {
                                        getFieldDecorator(`pConversion`,{
                                            initialValue:baseData.pconversion?baseData.pconversion:'',
                                            rules:[
                                                {pattern:/^[0-9]*[1-9][0-9]*$/,message:'只能是正整数'},
                                                {required:true,message:'请输入采购转换系数'}]
                                        })(
                                            <Input  addonBefore='1 采购单位 =' addonAfter='最小单位' placeholder='输入完成请按回车' onPressEnter={this.getPurchasePrice}/>      
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col key={20}>
                                <FormItem {...formItemLayout} label={`采购价`}>
                                    {
                                        getFieldDecorator(`purchasePrice`,{
                                            initialValue:baseData.purchasePrice?baseData.purchasePrice:'',
                                            rules:[
                                                {pattern:/^[0-9]+(.[0-9]{1,4})?$/,message:'请注意格式,最多4位小数'},
                                                {required:true,message:'请输入采购价'}
                                            ]
                                        })(
                                            <Input addonBefore='人民币' addonAfter='元' onBlur={()=>this.setState({ inputState:false })}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col key={21}>
                                <FormItem {...formItemLayout} label={`采购网编码`}>
                                    {
                                        getFieldDecorator(`purchaseNo`,{
                                            initialValue:baseData.purchaseNo?baseData.purchaseNo:'',
                                        })(
                                            <Input placeholder='请输入'/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={3}></Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem {...ButtonLayout}>
                            <Button type='primary' htmlType='submit'>保存</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const WrapperEditForm = Form.create()(EditForm);
class Edit extends React.Component{
    render(){
        return (
            <div>
                {
                    this.props.children
                    ||
                    <div>
                        <Row>
                            <Col>
                                <Breadcrumb style={{fontSize: '1.1em',marginBottom : 24}}>
                                    <Breadcrumb.Item><Link to={{pathname:'/tender/tenderRecord',}}>招标记录</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to={{pathname:'/tender/tenderRecord/show',
                                            state:{
                                                tenderGuid:this.props.location.state.tenderGuid,
                                                rStorageGuid:this.props.location.state.rStorageGuid,
                                                releaseFlag:this.props.location.state.releaseFlag}}}
                                            >
                                            招标详情
                                        </Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>编辑</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <WrapperEditForm data={this.props.location.state}/>
                    </div>
                }
            </div>
        )
    }
}
module.exports = Edit;