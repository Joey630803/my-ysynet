/**
 * @file 批量编辑
 */
import React from 'react';
import { Row,Col,Breadcrumb, Form, Input,Button,message,Select,Modal,Table} from 'antd';
import { Link,hashHistory } from 'react-router';
import { CommonData ,fetchData} from 'utils/tools';
import { productUrl } from 'api';

const FormItem = Form.Item;
const Option = Select.Option
class EditForm extends React.Component {
   state = {
    dirtyClick: false,
    unitData: [],
    gkData: [],
    selectData:[],
    variableValue:"",
    show: false
  }
  componentDidMount = () => {
      //单位
     CommonData('UNIT', (data) => {
       this.setState({unitData:data})
     })
      //骨科产品属性
      CommonData('GKATTRIBUTE', (data) => {
      this.setState({gkData:data})
    })
  }
  handleChange = (value) =>{
    if(value === "leastUnit"){
      const unitData = this.state.unitData;
      this.setState({show: true,selectData:unitData})
    }else if(value ==="attributeId"){
      const gkData = this.state.gkData;
      this.setState({show: true,selectData:gkData})
    }else{
      this.setState({show: false,variableValue:""})
    }
  }
  //处理错误信息
  handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: <div dangerouslySetInnerHTML={{__html:data}}></div>,
        okText: '确定'
      });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({dirtyClick: true});
        values.certGuid = this.props.data.certGuid;
        values.fitemids = this.props.data.fitemids;
        if(values.variableName === "leastUnit" || values.variableName === "attributeId"){
          values.variableValue = this.state.variableValue;
        }
        console.log(values,'批量更新的数据')
        fetchData(productUrl.UPDATEMODELBATCH,JSON.stringify(values),(data)=>{
          this.setState({dirtyClick: false});
          if(data.status){
            hashHistory.push({pathname:'/basicData/productCert/product',state:this.props.data});
            message.success("操作成功!");
          }else{
            this.handleError(data.msg)
          }
        },'application/json')
      }
    });
  }  
  render() {    
    const { getFieldDecorator } = this.props.form;
      const wrapStyle = {
      labelCol: {span: 12},
      wrapperCol: {span: 12}
    }
    const { selectData } = this.state;
    return (
       <Form
        onSubmit={this.handleSubmit}
        style={{marginTop: 16}}
      >
        <Row>
          <Col span={8}>
            <FormItem {...wrapStyle}  label={`编辑属性`}>
              {getFieldDecorator(`variableName`, {
                rules: [
                  { required: true, message: '请选择编辑属性' },
                ]
              })(
                <Select onChange={this.handleChange}>
                    <Option value="suitName">组件名称</Option>
                    <Option value="fmodel">型号</Option>
                    <Option value="spec">规格</Option>
                    <Option value="leastUnit">最小单位</Option>
                    <Option value="tfTexture">材质</Option>
                    <Option value="attributeId">骨科产品属性</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...wrapStyle}  label={`属性值`}>
            {getFieldDecorator(`variableValue`, {
            })(
              <div>
                {
                  !this.state.show ?<Input/>:
                  <Select 
                  placeholder={'请选择'}  
                  style={{width:200}}
                  onChange={(value) =>{
                    this.setState( {variableValue:value})
                  }}
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      selectData.map((item,index) => {
                        return <Option key={index} value={item.TF_CLO_CODE}>{item.TF_CLO_NAME}</Option>
                        })
                    }
                </Select>
                }
    
            </div>
            )}
         
          </FormItem>
       
          </Col>
          <Col span={6} style={{textAlign: 'center'}}>
            <Button type="primary" htmlType='submit' loading={this.state.dirtyClick}>保存</Button>
          </Col>
        </Row>  
      </Form>
    )
  }
}
const WrappedEditForm = Form.create()(EditForm);
class BatchEdit extends React.Component {
  render() {
        //列
        const columns = [{
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
        }];
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/basicData/productCert'>产品证件</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={{pathname:'/basicData/productCert/product',state:this.props.location.state}}>产品</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.location.state.title}</Breadcrumb.Item>
        </Breadcrumb>
        <WrappedEditForm data={this.props.location.state}/>
        <Table
        columns={columns}
        dataSource={this.props.location.state.productList}
        pagination={false}
        rowKey='fitemid'
        />
      </div>
    );
  }
}

module.exports = BatchEdit;