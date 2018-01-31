/**
 * @file 证件变更
 */
import React from 'react';
import { Row,Col,Breadcrumb,Button,Modal,message} from 'antd';
import { Link,hashHistory } from 'react-router';
import { pathConfig ,fetchData,jsonNull} from 'utils/tools';
import FetchSelect from 'component/FetchSelect';
import { productUrl } from 'api';
import querystring from 'querystring';
class ChangeCert extends React.Component {
  state = {
    newData:[],
    newCertGuid:""
  }
  handleSelect = (value) => {

      //获取新证件的信息 需要接口
      fetchData(productUrl.SEARCHCERTLIST_PRODUCT,querystring.stringify({specCertGuid:value}),(data)=>{
        if(data.length > 0){
          this.setState({newData : data[0],newCertGuid:value})
        }
      })
  
  }
  //处理错误信息
  handleError = (data) =>{
    Modal.error({
        title: '错误提示',
        content: data,
        okText: '确定'
      });
  }
  //确认变更
  handleSumbit = () =>{
    if(this.state.newCertGuid){
      const getData = this.props.location.state;
      if(getData.title === "变更证件"){
        fetchData(productUrl.CHANGEPRODUCTCERT,querystring.stringify({certGuid:getData.certGuid,fitemids:getData.fitemids,newCertGuid:this.state.newCertGuid}),(data) => {
          if(data.status){
            hashHistory.push({pathname:'/basicData/productCert/product',state:this.props.location.state});
            message.success("操作成功!");
          }else{
            this.handleError(data.msg)
          }
        })
      }else if(getData.title === "全部变更"){
        fetchData(productUrl.CHANGECERTBYCERTGUID,querystring.stringify({certGuid:getData.certGuid,newCertGuid:this.state.newCertGuid}),(data) => {
          if(data.status){
            hashHistory.push({pathname:'/basicData/productCert/product',state:this.props.location.state});
            message.success("操作成功!");
          }else{
            this.handleError(data.msg)
          }
        })
      }
    }else{
      this.handleError("请指定新证件!")
    }
  }

  render() {
    const data = jsonNull(this.props.location.state);
    const newData = jsonNull(this.state.newData);
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/basicData/productCert'>产品证件</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={{pathname:'/basicData/productCert/product',state:this.props.location.state}}>产品</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{data.title}</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col span={2} offset={20}>
            <Button type="primary" onClick={this.handleSumbit}>确认变更</Button>
          </Col>
        </Row>
        <Row>
          <Col span={1}></Col>
          <Col span={22}>
            <table className="certTable">
              <tr>
                <td width='20%'>证件号:</td>
                <td width='40%'>{data.registerNo}</td>
                <td width='40%'>
                <FetchSelect style={{width:300}} query={{excludeCertGuid:data.certGuid}}  ref='fetchs' url={productUrl.SEARCHCERTLIST_PRODUCT} 
                  cb={this.handleSelect}/>
                </td>
              </tr>
              <tr>
                <td>证件图片:</td>
                <td>
                  {data.tfAccessoryFile === "" ? "无" : <a href={pathConfig.YSYPATH+data.tfAccessoryFile} target="_blank">预览</a>}
                </td>
                <td>
                  {newData.tfAccessoryFile === "" ||  newData.tfAccessoryFile === undefined ? "无" : <a href={pathConfig.YSYPATH+newData.tfAccessoryFile} target="_blank">预览</a>}
                </td>
              </tr>
              <tr>
                <td>附件:</td>
                <td>
                  { data.tfAccessory === "" ? "无":<a href={pathConfig.YSYPATH+data.tfAccessory+"?isPreview=false"}>下载</a>}
                </td>
                <td>
                  { newData.tfAccessory === "" ||  newData.tfAccessoryFile === undefined ? "无":<a href={pathConfig.YSYPATH+newData.tfAccessory+"?isPreview=false"}>下载</a>}
                </td>
              </tr>
              <tr className="cert-trable-tr-bg">
                <td>证件效期:</td>
                <td>{data.firstTime + '~' +data.lastTime}</td>
                <td>{newData.firstTime ? newData.firstTime + '~' +newData.lastTime : null}</td>
              </tr>
              <tr className="cert-trable-tr-bg">
                <td>分类目录:</td>
                <td>{data.instrumentName}</td>
                <td>{newData.instrumentName ? newData.instrumentName : null}</td>
              </tr>
              <tr className="cert-trable-tr-bg">
                <td>产品名称:</td>
                <td>{data.materialName}</td>
                <td>{newData.materialName ? newData.materialName : null}</td>
              </tr>
              <tr className="cert-trable-tr-bg">
                <td>品牌:</td>
                <td>{data.tfBrandName}</td>
                <td>{newData.tfBrandName ? newData.tfBrandName : null}</td>
              </tr>
              <tr className="cert-trable-tr-bg">
                <td>生产者名称:</td>
                <td>{data.produceName}</td>
                <td>{newData.produceName ? newData.produceName : null}</td>
              </tr>
              <tr>
                <td>生产者地址:</td>
                <td>{data.enterpriseRegAddr}</td>
                <td>{newData.enterpriseRegAddr ? newData.enterpriseRegAddr : null}</td>
              </tr>
              <tr>
                <td>生产地址:</td>
                <td>{data.produceAddr}</td>
                <td>{newData.produceAddr ? newData.produceAddr : null}</td>
              </tr>
              <tr>
                <td>产品标准:</td>
                <td>{data.productStandard}</td>
                <td>{newData.productStandard ? newData.productStandard : null}</td>
              </tr>
              <tr>
                <td>产品性能结构组成:</td>
                <td>{data.productStructure}</td>
                <td>{newData.productStructure ? newData.productStructure : null}</td>
              </tr>
              <tr>
                <td>产品适用范围</td>
                <td>{data.productScope}</td>
                <td>{newData.productScope ? newData.productScope : null}</td>
              </tr>
              <tr>
                <td>产品禁忌</td>
                <td>{data.taboo}</td>
                <td>{newData.taboo ? newData.taboo : null}</td>
              </tr>
              <tr>
                <td>代理人名称</td>
                <td>{data.agentName}</td>
                <td>{newData.agentName ? newData.agentName : null}</td>
              </tr>
              <tr>
                <td>代理人地址</td>
                <td>{data.agentAddr}</td>
                <td>{newData.agentAddr ? newData.agentAddr : null}</td>
              </tr>
              <tr>
                <td>售后服务机构</td>
                <td>{data.afterService}</td>
                <td>{newData.afterService ? newData.afterService : null}</td>
              </tr>
              <tr>
                <td>备注</td>
                <td>{data.tfRemark}</td>
                <td>{newData.tfRemark ? newData.tfRemark : null}</td>
              </tr>
            </table>
          </Col>
          <Col span={2}></Col>
        </Row>
      </div>
    );
  }
}

module.exports = ChangeCert;