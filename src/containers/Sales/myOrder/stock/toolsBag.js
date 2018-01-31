import React from 'react';
import { Row, Col,Button,Input,Table,Switch,message,Modal} from 'antd';
import { hashHistory } from 'react-router';
import { fetchData } from 'utils/tools';
import { sales, purchase } from 'api';
import querystring from 'querystring';
import moment from 'moment';
const confirm = Modal.confirm;
class OperBag extends React.Component{
    state = {
        selected: [],
        selectedRows: [],
        operBagTotal: "",
        operBagData: [],
        headerData:[]
    }
    componentWillReceiveProps = nextProps => {
        console.log(nextProps,'nextProps');
        if(nextProps.data.dataSource){
           this.setState({operBagData: nextProps.data.dataSource});
        }
        else{
            this.setState({operBagData:[]});
        }
        if(nextProps.data.operBagTotal){
            this.setState({ operBagTotal: nextProps.data.operBagTotal,});
        }else{
            this.setState({operBagTotal:''});
        }
        this.setState({headerData:nextProps.data.headerData})
      }
    //工具跳转
    redirect = (record) => {
        const operBagData = this.state.operBagData.slice(1,this.state.operBagData.length-1);
        let postData = {};
        postData.orderId = this.props.data.orderId;
        operBagData.map((item,index)=>{
            for(let key in item){
                if(key === 'hasImplantFlag' || key === 'sumOperTool'){
                    delete item[key]
                  }
            }
            return null;
        })
        postData.packageList = operBagData;
        fetchData(sales.SAVEDRAFTDATA,JSON.stringify(postData),(data)=>{
            if(data.status){
                hashHistory.push({
                    pathname: '/sales/myOrder/choiceTool',
                    state : {
                      packages :  this.state.operBagData,
                      orderId : this.props.data.orderId,
                      rOrgId: this.props.data.rOrgId,
                      record,
                    }
                  })
              console.log('手术包操作保存了数据');
            }
            else{
              message.error(data.msg);
            }
          },'application/json')
       
    }
     //是否包含植入物判断
    handleIsImplantFlag = (record) =>{
        const data = [];
        for(var key in record){
            if(record.hasOwnProperty(key) && key !== 'packageId'&& key !== 'hasImplantFlag'&& key !== 'sumOperTool'&& key!=='operTool'){
                if(Number(record[key])>0){
                    data.push(record[key]);//存在>0的数字
                }
            }
        }
        if(data.length === 0){
            return false; //没有大于0的数字
        }else{
            return true;//有大于1的数字
        }
    }
    //计算对象的个数
    handleCount = (obj) =>{
        var t = typeof obj;
        if(t === 'string'){
                return obj.length;
        }else if(t === 'object'){
                var n = 0;
                for(let i in obj){
                    if(obj.hasOwnProperty(i)){
                        n++;
                    }
                        
                }
                return n;
        }
        return false;
    }
    //input改变的时候操作
    handleInputChange = (record,index,item,e) =>{
        if (/^\d+$/.test(e.target.value)) {
        }else {
            return message.warn('请输入非0正整数')
        }
        const operBagData = this.state.operBagData;
        let oldTotal =  Number(operBagData[operBagData.length - 1][item])|| 0;
        let beforeChangeTotal = Number(operBagData[index+1][item]);
        let newTotal = oldTotal - beforeChangeTotal;
        operBagData[operBagData.length - 1][item] = newTotal + Number(e.target.value);
        operBagData[index + 1][item] = Number(e.target.value);
        
           record[item] = e.target.value;
        //改变当前行
        if(this.handleIsImplantFlag(record)){
            record.hasImplantFlag = "是";
        }else{
            record.hasImplantFlag = "否";
        }
        this.setState({ operBagData : operBagData})
    
    }
  
    //input离开焦点的时候
    handleInputOnBlur = () => {
        this.props.callback({
            packages :  this.state.operBagData,
        });
    }
    //添加手术包
    addBag = ()=>{
        const BagData = this.state.operBagData;
        const headerData = this.state.headerData;
        let record ={}
        headerData.map((item,index) => {
           return record[item.TF_CLO_CODE] = "0"
        })
        record.hasImplantFlag = "否";
        record.sumOperTool = "0";
        record.operTool = "0";
        record.packageId = Number(BagData[BagData.length-2].packageId) + 1;
        BagData.splice(BagData.length-1,0,record);
        const selected = [];
        selected.push(record.packageId);
        //调用清空工具包接口clearToolsByPackage
         fetchData(sales.CLEARTOOLSBYPACKAGE,querystring.stringify({orderId:this.props.data.orderId,packageId:selected}),(data)=>{
              if(data.status){
                console.log("添加成功");
                this.props.callback({packages : BagData })
                this.setState({ operBagData: BagData});
              }else{
                  message.error(data.msg);
              }
          });
    }
   //删除手术包
    deleteBag = () =>{
        let { selected, operBagData } = this.state;
        if (selected.length === 0) {
          message.warn('请至少选择一条数据')
        } else {
            let flag = false;
            selected.map((item,index)=>{
                if(item === "-1"){
                     flag = true;
                }else if(item === null){
                    flag = true;
                }
                return flag;
            })
            if(flag){
                return message.error("初始数据不能删除!")
            }
            let result = [];
            operBagData.map( (item, index) => {
            const a = selected.find( (value, index, arr) => {
              return value === item.packageId;
            })
            if (typeof a === 'undefined') {
              result.push(item)
            }
            return null;
          })
          //算最后一行的值
          let lastData = this.handleTotal(result);
          result[result.length-1] = lastData;
          let postData = {},packageId = [];
          postData.orderId = this.props.data.orderId;
          selected.map((item,index)=>{
              packageId.push(Number(item));
              return null;
          });
          postData.packageId = packageId;
          //调用清空工具包接口clearToolsByPackage
          fetchData(sales.CLEARTOOLSBYPACKAGE,querystring.stringify(postData),(data)=>{
              if(data.status){
                console.log("删除成功");
                this.props.callback({packages : result });
                this.setState({ operBagData: result,selected: []});
              }else{
                  message.error(data.msg);
              }
          });
        }
    }
    //保存
    save = () =>{
        const operBagData = this.state.operBagData.slice(1,this.state.operBagData.length-1);
        let postData = {};
        postData.orderId = this.props.data.orderId;
        operBagData.map((item,index)=>{
            delete item.hasImplantFlag;
            return null;
        })
        postData.packageList = operBagData
        fetchData(sales.SAVEDRAFTDATA,JSON.stringify(postData),(data)=>{
            if(data.status){
              console.log('手术包操作保存了数据');
            }
            else{
              message.error(data.msg);
            }
          },'application/json')
    }
    handleTotal = (data) =>{
        let totalArr = {};
        for (let i=1; i < data.length - 1; i++) {
            let d = data[i];
            for(let j in d){
                if(d.hasOwnProperty(j)){
                    totalArr[j] = (Number(totalArr[j]) || 0) + Number(d[j]);
                }
            }
        }
        totalArr.hasImplantFlag = null;
        totalArr.packageId = "-1";
        totalArr.sumOperTool ='0';
        return totalArr;
    }
     //生成送货单
    createDelivery = () =>{
        const that = this;
        confirm({
          title: '提示',
          okText:'确认',
          cancelText:'取消' ,
          content: '是否确认生成送货单？',
          onOk() {
            let postData = {};
            const operBagData = that.state.operBagData.slice(1,that.state.operBagData.length-1);
            postData.orderId = that.props.data.orderId;
            operBagData.map((item,index)=>{
                for( let key in item){
                    if(key === 'hasImplantFlag' || key === 'sumOperTool'){
                        delete item[key]
                    }
                  }
                  return null;
            });
            postData.packageList = operBagData;
            //获取产品数据
            fetchData(purchase.FINDDETAILIST4OPER,querystring.stringify({sendId:that.props.data.orderId,submitFlag:'D'}),(data)=>{
                if(data.status){
                    let detailList = [];
                    const dataSource = data.result;
                    if(dataSource.length){
                        dataSource.map((item,index)=>{
                          return detailList.push({
                            sendDetailGuid:item.sendDetailGuid,
                            tenderMaterialGuid:item.tenderMaterialGuid,
                            amount:item.amount,
                            flot:item.flot,
                            prodDate: item.prodDate ? moment(item.prodDate).format('YYYY-MM-DD') : '',
                            usefulDate: item.usefulDate ? moment(item.usefulDate).format('YYYY-MM-DD') : '',
                          })
                        });
                        postData.detailList = detailList;
                        //保存数据
                        console.log(postData,'postData')
                        fetchData(sales.SAVEDRAFTDATA,JSON.stringify(postData),(data)=>{
                            if(data.status){
                              console.log('手术包生成送货单保存了数据');
                              fetchData(sales.SETTLEGOODSPLAN,querystring.stringify({orderId:that.props.data.orderId}),(data)=>{
                                if(data.status){
                                  console.log('生成送货单了');
                                  message.success('生成送货单成功');
                                  hashHistory.push({
                                    pathname: '/sales/myOrder'
                                  })
                                }
                                else{
                                  message.error(data.msg);
                                }
                            });
                            }
                            else{
                              message.error(data.msg);
                            }
                          },'application/json')
                      }else{
                          message.warn('请添加产品！')
                      }
                }else{
                    message.error(data.msg);
                }
            });  
            
            
          
        }
      })
    }
    render(){
        const { operBagData,operBagTotal } = this.state; 
        const actions = (text, record, index) => {
                return (
                    <Switch defaultChecked={Number(text)> 0 ? true:false} checkedChildren="开" unCheckedChildren="关" onChange={value => {                       
                        const val = value ? "0" : "1";
                        if(val === "1"){
                            //切换为否 清空包内的工具
                            let postData = {};
                            postData.orderId = this.props.data.orderId;
                            postData.packageId = record.packageId;
                            fetchData(sales.CLEARTOOLSBYPACKAGE,querystring.stringify(postData),(data)=>{
                                if(data.status){
                                    operBagData[index+1].operTool = "0";
                                    operBagData[index+1].sumOperTool = "0";
                                    let lastData = this.handleTotal(operBagData);
                                    console.log(lastData,'lastData');
                                    operBagData[operBagData.length-1] = lastData;
                                    this.setState({ operBagData })
                                }else{
                                    message.error(data.msg);
                                }
                            })
                        }else{
                            operBagData[index+1].sumOperTool = '1';
                            this.setState({ operBagData });
                        }
                    }}/>
            )};
           let columns = [];
           console.log(this.state.headerData,'headerData')
            if(this.state.headerData){
                columns =[{
                    title : '添加工具',
                    dataIndex : 'sumOperTool',
                    width :100,
                    fixed :'left',
                    render : (text , record, index)=>{
                        return  record.packageId === "-1"
                        ? "合计"
                        : actions(text, record ,index)
                        }
                    },{
                        title : '包含植入物',
                        dataIndex : 'hasImplantFlag',
                        width :120,
                        render : (text , record, index)=>{
                            if(record.packageId==='-1'){
                                return null
                            }else{
                                return text
                            }
                        }  
                    }];
                //Header
                const operBagHeader = this.state.headerData.slice(0,this.state.headerData.length-1);
                operBagHeader.forEach((item,i)=>{
                    return columns.push({
                        title : item.TF_CLO_NAME,
                        width :95,
                        dataIndex : item.TF_CLO_CODE,
                        render : (text,record,index) => {
                            if(index === this.state.operBagData.length-2){
                                return text
                            }else{
                                return <Input 
                                    onBlur={this.handleInputOnBlur}
                                    defaultValue={ text || 0}
                                    min={0} onInput={this.handleInputChange.bind(this, record, index,item.TF_CLO_CODE)}/>
                            }
                        }
                    })
                })
                columns.push({
                        title :"手术器械",
                        dataIndex : 'operTool',
                        width :110,
                        fixed: "right",
                        render : (text,record,index) => {
                            if(index === this.state.operBagData.length-2){
                                    return text
                            }else{
                                return Number(record.sumOperTool) > 0  ? <span style={{width:80}}>{`${text}`}<a onClick={() => this.redirect(record)}>选择工具</a></span> :
                                <Input 
                                    onBlur={this.handleInputOnBlur}
                                    defaultValue={ text  || 0}
                                    min={1} onInput={this.handleInputChange.bind(this, record, index,"operTool")}/>
                            }
                        }
                });
            }
            console.log(columns,'columns')
        return (
        <div>
            {this.props.children || 
                <div>
                    {
                        this.state.operBagData.length>0 ?
                        <div>
                            <Row>
                                <Col span={12} style={{fontSize:'1.1em'}}>
                                    <span>手术包总数量 : <span style={{color:'green',fontWeight:'bold'}}>{operBagTotal.packageAmount || 0}</span>
                                                                                <span className="ant-divider" />
                                            </span>
                                            <span>产品总数量 : <span style={{color:'green',fontWeight:'bold'}}>{operBagTotal.materailAmount||0}</span>
                                                                                <span className="ant-divider" />
                                            </span>
                                            <span>外来植入物总数量 : <span style={{color:'green',fontWeight:'bold'}}>{operBagTotal.outerImpAmount||0}</span>
                                                                                        <span className="ant-divider" />
                                            </span>
                                            <span>灭菌总数量 : <span style={{color:'green',fontWeight:'bold'}}>{operBagTotal.sterilizeAmount||0}</span>
                                                                                <span className="ant-divider" />
                                            </span>
                                            <span>工具总数量 : <span style={{color:'green',fontWeight:'bold'}}>{operBagTotal.toolAmount||0}</span>																			
                                        </span>
                                </Col>
                                <Col span={6}>
                                    <Button type="primary" onClick={this.addBag}>添加手术包</Button>
                                    <Button type="danger" ghost style={{marginLeft:8}} onClick={this.deleteBag}>删除手术包</Button>                           
                                </Col>
                                <Col span={6} style={{textAlign : "right"}}>
                                    <Button type="primary" onClick={this.createDelivery}>生成送货单</Button>
                                </Col>
                            </Row>
                            <Table 
                                style={{marginTop:10}}
                                columns={columns}
                                dataSource={operBagData.slice(1,operBagData.length)}
                                rowKey={"packageId"}
                                size='small'
                                pagination={false}
                                scroll={{ x: '150%' }}
                                rowSelection={{
                                    selectedRowKeys: this.state.selected,
                                    onChange: (selectedRowKeys, selectedRows) => {
                                    this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                                    },
                                    getCheckboxProps: record => ({
                                        disabled: record.packageId === '-1'
                                        }),
                                }}
                            />
                        </div>
                        : 
                        <h2 style={{marginTop:10}}>暂无手术包信息</h2>
                    }
                </div>
            }
        </div>
            )
        
    }
}
module.exports = OperBag