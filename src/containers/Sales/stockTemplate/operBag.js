import React from 'react';
import { Row, Col,Button,Input,Table,Switch,message} from 'antd';
import { hashHistory } from 'react-router';
import { fetchData } from 'utils/tools';
import { sales } from 'api';
import querystring from 'querystring';
class OperBag extends  React.Component{
    state = {
        titleData:[],
        headerData:[],
        selected: [],
        selectedRows: [],
        operBagData:[],
    }
    componentWillReceiveProps = nextProps => {
        if(nextProps.data.dataSource.packages){
            const operBagData = nextProps.data.dataSource.packages;
            this.setState({operBagData:operBagData});
        }else{
            this.setState({operBagData:[]});
        }

       this.setState({ 
           titleData : nextProps.data.dataSource,
           headerData: nextProps.data.headerData,
        })
    }
    productReset = () => {

    }
    componentWillMount = () => { 
          //获取table的头
       fetchData(sales.QUERYPACCOLUMNS,querystring.stringify({rOrgId:this.props.data.rOrgId,gkTemplateGuid:this.props.data.template.id}),(data) => {
                this.setState({ headerData : data.result})
        })
        //点击会跳到此页面时获取的值
        fetchData(sales.SEARCHGKTEMPLATEPACKAGES,querystring.stringify({gkTemplateGuid:this.props.data.template.id,rOrgId:this.props.data.rOrgId}),(data) => {
            if(data.result){
                this.setState({ titleData : data.result})
            }
            if(data.result.packages){
            this.setState({operBagData:data.result.packages})
            }
        })

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
            record.isImplantFlag = "01";
        }
        else{
            record.isImplantFlag = "00";
        }

        this.setState({ operBagData : operBagData})
    
    }
  
    //input离开焦点的时候
    handleInputOnBlur = () => {
        this.props.callback({
            ...this.state.titleData,
            packages :  this.state.operBagData,
        });
    }

    //是否包含植入物判断
    handleIsImplantFlag = (record) =>{
        const data = [];
        for(var key in record){
            if(record.hasOwnProperty(key) && key !== 'packageId'&& key !== 'isImplantFlag'&& key !== 'isToolFlag'){
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

    //工具跳转
    redirect = (record) => {
        let postData = {};
        const BagData = this.state.operBagData.slice(1,this.state.operBagData.length-1);
        postData.packageList = BagData;
        postData.gkTemplateGuid = this.props.data.template.id;
        console.log(postData,"保存数据")
        fetchData(sales.UPDATEGKTEMPLATEPACS,JSON.stringify(postData),(data)=>{
            if(data.status){
                hashHistory.push({
                    pathname: '/sales/stockTemplate/choiceTool',
                    state : {
                      ...this.state.titleData,
                      packages : this.state.operBagData,
                      record : record,
                      ...this.props.data.template
                    }
                  
                  })
            }else{
                message.error(data.msg)
            }
        },'application/json')
    }
    //添加手术包
    addBag = ()=>{
        const BagData = this.state.operBagData;
        const headerData = this.state.headerData;
        let record ={}
        headerData.map((item,index) => {
           return record[item.TF_CLO_CODE] = "0"
        })
        record.isImplantFlag = "00";
        record.isToolFlag = "00";
        record.operTool = "0";
        record.packageId = BagData[BagData.length-2].packageId + 1;
        console.log(record,"record");
        BagData.splice(BagData.length-1,0,record);
        //调用清空工具包接口clearToolsByPackage
        const selected = [];
        selected.push(record.packageId);
        fetchData(sales.CLEARTOOLSBYPACKAGEGKTEP,querystring.stringify({gkTemplateGuid:this.props.data.template.id,packageIds:selected}),(data)=>{
            if(data.status){
              console.log("添加手术包成功")
              this.setState({operBagData: BagData});
            }else{
                message.error(data.msg);
            }
        })
    }
    //删除手术包
    deleteBag = () =>{
         let { selected, operBagData } = this.state;

        if (selected.length === 0) {
          message.warn('请至少选择一条数据')
        } else {
            let flag = false;
            selected.map((item,index)=>{
                if(item === -1){
                     flag = true;
                }else if(item === 0){
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
        
          //调用清空工具包接口clearToolsByPackage
          fetchData(sales.CLEARTOOLSBYPACKAGEGKTEP,querystring.stringify({gkTemplateGuid:this.props.data.template.id,packageIds:selected}),(data)=>{
              if(data.status){
                console.log("删除成功")
                this.setState({ operBagData: result,selected: []});
              }else{
                  message.error(data.msg);
              }
          })
        }
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
        totalArr.isImplantFlag = null;
        totalArr.isToolFlag = null;
        totalArr.packageId = -1;
        return totalArr;
    }
    //保存
    save = () => {
        let postData = {};
        const BagData = this.state.operBagData.slice(1,this.state.operBagData.length-1);
        postData.packageList = BagData;
        postData.gkTemplateGuid = this.props.data.template.id;
        console.log(postData,"保存数据")
        fetchData(sales.SAVEGKTEMPLATE,JSON.stringify(postData),(data)=>{
            if(data.status){
                message.success("保存成功!")
            }else{
                message.error(data.msg)
            }
        },'application/json')
    }
    render(){

   
        //头部手术包数量
        const dataNums = this.state.titleData;
        const titleData = [{"title":"手术包数量:","num":dataNums.packageAmount},{"title":"产品总数量:","num":dataNums.materailAmount},{"title":"外来植入物总数量:","num":dataNums.outerImpAmount},{"title":"灭菌总数量:","num":dataNums.sterilizeAmount},{"title":"工具总数量:","num":dataNums.toolAmount}];
   
            
        //table数据
            const { operBagData } = this.state; 
            const actions = (text, record, index) => {
                return (
                    <Switch defaultChecked={text==="01"?true:false} checkedChildren="开" unCheckedChildren="关" onChange={value => {
                        const val = value ? "01" : "00";
                        operBagData[index+1].isToolFlag = val;
                        if(val === "01"){
                            operBagData[index+1].operTool = 0; 
                        }
                        this.setState({
                            operBagData
                        })
                    }}/>
            )};
       
            const columns =[{
                title : '添加工具',
                dataIndex : 'isToolFlag',
                width :100,
                render : (text , record, index)=>{
                    return record.isToolFlag === null &&  record.isImplantFlag === null
                    ? "合计"
                    : actions(text, record ,index)
                    }
                },{
                    title : '包含植入物',
                    dataIndex : 'isImplantFlag',
                    width :120,
                    render : (text , record, index)=>{
                        if(index===this.state.operBagData.length-2){
                            return null
                        }else{
                            return text === "01" ? "是" :"否";
                        }
                    }  
                }];
            //Header
            const operBagHeader = this.state.headerData;
            operBagHeader.forEach((item,i)=>{
                return columns.push({
                    title : item.TF_CLO_NAME,
                    width :90,
                    dataIndex : item.TF_CLO_CODE,
                    render : (text,record,index) => {
                        if(index === this.state.operBagData.length-2){
                            return text
                        }else{
                            return <Input 
                                onBlur={this.handleInputOnBlur}
                                value={ text || 0}
                                min={0} onInput={this.handleInputChange.bind(this, record, index,item.TF_CLO_CODE)}/>
                        }
                    }
                })
            })
            columns.push({
                    title :"手术器械",
                    dataIndex : 'operTool',
                     width :120,
                     fixed: "right",
                    render : (text,record,index) => {
                        if(index === this.state.operBagData.length-2){
                                return text
                        }else{
                            return record.isToolFlag==="01"  ? <span style={{width:80}}>{`${text}`}<a onClick={() => this.redirect(record)}>选择工具</a></span> :
                            <Input 
                                onBlur={this.handleInputOnBlur}
                                defaultValue={ text || 0}
                                min={1} onInput={this.handleInputChange.bind(this, record, index,"operTool")}/>
                        }
                    }
            });
        
        return(
            <div>
            {this.props.children || 
                <div>
                    <Row>
                        <Col span={16}>
                            {
                                titleData.map((item,index)=>{
                                    return <span key={index} style={{marginRight:20}}>{item.title}<i style={{fontWeight:"bold",color:"#00ff00"}}>{item.num}</i></span>
                                })
                            }
                        </Col>
                        <Col span={8}>
                            <Button type="primary" onClick={this.addBag}>添加手术包</Button>
                            <Button type="danger" ghost style={{marginLeft:8}} onClick={this.deleteBag}>删除手术包</Button>
                            <Button type="primary" ghost style={{marginLeft:8}} onClick={this.save}>保存</Button>
                        </Col>
                    </Row>
                      { operBagData.length>0 ? 
                        <Table 
                            style={{marginTop:10}}
                            columns={columns}
                            dataSource={operBagData.slice(1,this.state.operBagData.length)}
                            rowKey={"packageId"}
                            size='small'
                            pagination={false}
                            scroll={{x: "200%"}}
                            rowSelection={{
                                selectedRowKeys: this.state.selected,
                                onChange: (selectedRowKeys, selectedRows) => {
                                this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                                },
                            }}
                        />
                        :null
                    }
        
                </div>
            }
            </div>
        )
    
    }
}
module.exports = OperBag