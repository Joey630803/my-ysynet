/**
 * @file 手术备货
 */
import React from 'react';
import { Tabs , Breadcrumb ,message} from 'antd';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { purchase ,sales} from 'api';
import { Link } from 'react-router';
import Product from './product';
import ToolsBag from './toolsBag'
import moment from 'moment';
const TabPane = Tabs.TabPane;
class OperStack extends React.Component{
    state = {
        activeKey: 'product',
        productData: [],
        headerData: [],
        operBagTotal: '',
        operBagData : [],
        query:{

        }
    }
    componentDidMount = () =>{
            //获取产品数据
            fetchData(purchase.FINDDETAILIST4OPER,querystring.stringify({sendId:this.props.location.state.orderId,submitFlag:'D'}),(data)=>{
                let productData = data.result;
                console.log(productData,'查询数据')
                if(this.props.location.state.dataSource){
                    let dataSource = this.props.location.state.dataSource;
                    dataSource.map((item,index)=>{
                        return productData.push(item)
                    })
                    console.log(productData,'拼接数据')
                }
                this.setState({productData:productData});
            });
            //手术包头
            fetchData(sales.HEADERPACKAGELISTBYSENDID,querystring.stringify({orderId:this.props.location.state.orderId}),(data)=>{
                this.setState({headerData:data.result})
            });
            //手术包统计信息
            fetchData(purchase.GETPACKAGEBYORDERID,
                querystring.stringify({orderId:this.props.location.state.orderId,submitFlag:'D'}),(data)=>{
                    if(data.status){
                        let totalData = data.result;
                        if(this.props.location.state.operData){
                            let updataTotal = [];
                            let operData = this.props.location.state.operData;
                            for(let key in totalData){
                                if(totalData.hasOwnProperty(key)){
                                    updataTotal[key] =  Number(totalData[key]) + Number(operData[key]);
                                }
                            };
                            this.setState({operBagTotal: updataTotal});
                        }
                        else{
                            this.setState({ operBagTotal : totalData });
                        }
                    }else{
                        message.error(data.msg);
                    }
            });
            //手术包数据
            fetchData(purchase.FINDPACKAGE_LIST,
                querystring.stringify({orderId:this.props.location.state.orderId,headerStyle:'1',submitFlag:'D'}),(data)=>{
                    if(data.status && data.result!== null){
                        let operBagData = data.result;
                        let updataData = [];//手术包除去统计信息的数据
                        if(this.props.location.state.packageIds){
                            let lastUpdata = {};//更新后的统计信息
                            let lastTotal = operBagData[operBagData.length-1];
                            updataData = operBagData.slice(0,operBagData.length-1);
                            let newBagData = [], BagData = [],totalData = [];
                            BagData = this.props.location.state.operData.packages;
                            //newBagData : 模板手术包 除去手术包头尾统计信息的手术包信息
                            newBagData = BagData.slice(1,BagData.length-1);
                            //totalData : 手术包最后一行统计信息
                            totalData = BagData[BagData.length-1];
                            //获取包的最大packageId
                            let getMaxPackageId = [] ; var maxPackageId='';
                            operBagData.map((item,index)=>{
                                if(item.packageId !== null){
                                    getMaxPackageId.push(Number(item.packageId));
                                };
                                return null;
                            });
                            //包的最大Id
                            maxPackageId = Math.max.apply(null,getMaxPackageId);
                            //设置添加的手术包的packageId
                            newBagData.forEach((item,index)=>{
                                for( let key in item){
                                    if(item.hasOwnProperty(key) && key ==='packageId'){
                                        item['packageId'] = Number( maxPackageId || 0) + 1;
                                        maxPackageId = Number( maxPackageId )+1;
                                    }
                                };
                                updataData.push(item);
                            });
                            let sendData = {},arr = [];
                            let saveData = updataData.slice(1,updataData.length);
                            saveData.map((item,index)=>{
                                var obj = {};
                                arr.push(obj);
                                for( let key in item){
                                    if(key !== 'hasImplantFlag' && key !== 'sumOperTool'){
                                        arr[index][key] = item[key];
                                    }
                                  }
                                  return null;
                            });
                            sendData.orderId = this.props.location.state.orderId;
                            sendData.packageList = arr;
                            fetchData(sales.SAVEDRAFTDATA,JSON.stringify(sendData),(data)=>{
                                if(data.status){
                                    console.log('保存手术包')
                                }else{
                                    message.error(data.msg);
                                }
                            },'application/json')
                            // 手术包添加 工具
                            if(this.props.location.state.templateGuids.length && this.props.location.state.packageIds.length){
                                let fromPackageList = [], postData = {};
                                postData.orderId = this.props.location.state.orderId;
                                newBagData.map((item,index)=>{
                                    return fromPackageList.push({
                                        templateGuid : this.props.location.state.templateGuids[index],
                                        toPackageId : item.packageId,
                                        fromPackageId : this.props.location.state.packageIds[index]
                                    })
                                });
                                postData.fromPackageList = fromPackageList;
                                fetchData(sales.ADDTOOLSFROMTEMPLATEPACKAGES,JSON.stringify(postData),(data)=>{
                                    if(data.status){
                                        console.log('添加工具成功！');
                                    }else{
                                        message.error(data.msg);
                                    }
                                },'application/json')
                            }
                            
                            //统计信息相加
                            for( let key in lastTotal){
                                if(lastTotal.hasOwnProperty(key) && key !== 'packageId' && key!=='hasImplantFlag' && key!=='sumOperTool'){
                                    lastUpdata[key] = Number(lastTotal[key]) + Number(totalData[key]);
                                }
                            }
                            lastUpdata['packageId'] = '-1';
                            lastUpdata['sumOperTool'] = '0';
                            updataData.push(lastUpdata);
                            this.setState({ operBagData: updataData });
                        }
                        else{
                            this.setState({ operBagData: operBagData });
                        }
                    }else{
                        this.setState({ operBagData: [] });
                    }
            });
    }
    //保存产品数据查询手术包数据
    saveProduct = () =>{
        let postData = {};
        const dataSource = this.state.productData;
            let materialScope = {};let detailList = [];
            postData.orderId = this.props.location.state.orderId;
            materialScope.attributeId = this.state.query.attributeId;
            materialScope.tfBrand = this.state.query.tfBrand;
            materialScope.searchName = this.state.query.searchName;
            postData.materialScope = materialScope;
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
          postData.packageList = null;
          fetchData(sales.SAVEDRAFTDATA,JSON.stringify(postData),(data)=>{
            if(data.status){
              fetchData(purchase.GETPACKAGEBYORDERID,
                querystring.stringify({orderId:this.props.location.state.orderId,submitFlag:'D'}),(data)=>{
                    if(data.status){
                        this.setState({operBagTotal:data.result});
                    }else{
                        message.error(data.msg);
                    }
                });
                //手术包头
                fetchData(sales.HEADERPACKAGELISTBYSENDID,querystring.stringify({orderId:this.props.location.state.orderId}),(data)=>{
                    this.setState({headerData:data.result})
                });
                //手术包数据
                fetchData(purchase.FINDPACKAGE_LIST,
                    querystring.stringify({orderId:this.props.location.state.orderId,headerStyle:'1',submitFlag:'D'}),(data)=>{
                        if(data.status){
                            this.setState({ operBagData: data.result });
                        }else{
                            message.error(data.msg);
                        }
                });
            }
            else{
              message.error(data.msg);
            }
          },'application/json');
    }
    //保存手术包数据
    saveOperBag = () =>{
        if(this.state.operBagData){
            const operBagData = this.state.operBagData.slice(1,this.state.operBagData.length-1);
            operBagData.map((item,index)=>{
                for( let key in item){
                    if(key === 'hasImplantFlag' || key === 'sumOperTool'){
                        delete item[key]
                    }
                  }
                  return null;
            })
            let postData = {};
            postData.orderId = this.props.location.state.orderId;
            postData.packageList = operBagData;
            postData.detailList = null;
            fetchData(sales.SAVEDRAFTDATA,JSON.stringify(postData),(data)=>{
                if(data.status){
                  console.log('手术包切换保存了数据');
                }
                else{
                  message.error(data.msg);
                }
              },'application/json')
        }
        
    }
    render () {
		const query = typeof this.props.location.query === 'undefined' ? {} : this.props.location.query
        const selectTab = typeof query.activeKey === 'undefined' ? 'product' : query.activeKey;
        return (
            <div>
                <Breadcrumb style={{fontSize: '1.1em'}}>
                    <Breadcrumb.Item><Link to='/sales/myOrder'>我的订单</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>手术备货</Breadcrumb.Item>
                </Breadcrumb>
                <Tabs defaultActiveKey={selectTab} style={{marginTop:16}} onTabClick={(key)=>{
                    if(key === 'product'){
                        //保存手术包
                        this.saveOperBag();
                        fetchData(purchase.FINDDETAILIST4OPER,querystring.stringify({sendId:this.props.location.state.orderId,submitFlag:'D'}),(data)=>{
                            if(data.status){
                                let productData = data.result;
                                this.setState({productData:productData})
                            }else{
                                message.error(data.msg);
                            }
                            
                        });  
                    }else{
                        this.saveProduct();
                    }
                    }}>
                    <TabPane tab="产品" key="product">
                        <Product  router={this.props.router}
                            cb={(data)=>{this.setState({productData:data})}} 
                            search={(query)=>{this.setState({query:query})}}
                            data={{
                                productData: this.state.productData,
                                storageGuid: this.props.location.state.storageGuid,
                                orderId: this.props.location.state.orderId,
                                rOrgId: this.props.location.state.rOrgId,
                                rOrgName: this.props.location.state.rOrgName
                            }}
                        />
                    </TabPane>
                    <TabPane tab="手术包" key="tools">
                        <ToolsBag  router={this.props.router} 
                            callback={(data)=>{this.setState({operBagData:data.packages})}}
                            data={{
                                orderId: this.props.location.state.orderId,
                                rOrgId: this.props.location.state.rOrgId,
                                dataSource: this.state.operBagData,
                                operBagTotal: this.state.operBagTotal,
                                headerData: this.state.headerData
                            }}
                        />
                    </TabPane> 
                </Tabs>
            </div>
        )
    }
}
module.exports = OperStack;