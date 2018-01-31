/**
 * @file 我的产品--详情--证件信息
 */
import React from 'react';
import { Row, Col } from 'antd';
import { fetchData, pathConfig } from 'utils/tools';
import querystring from 'querystring';
import { purchase } from 'api';
class Certificate extends React.Component{
    state = {
        certData:''
    }
    componentDidMount = ()=>{
        console.log(this.props.data,'data')
        fetchData(purchase.SEARCHCERTLISTBYCERTID,querystring.stringify({specCertGuid:this.props.data.certGuid}),(data)=>{
            this.setState({ certData: data[0] });
        })
    }
    showForm = () => {
        const data= this.state.certData;
        console.log(data,'certData')
        return (
          <div>
            <Row>
              <Col span={4}></Col>
              <Col span={14}>
                 <div>
                    <h2 style={{textAlign:'center',marginBottom:12}}>中华人民共和国医疗器械注册证</h2>
                </div>
                <Row>
                  <Col span={12}>
                      <span>证件号:{data.registerNo}</span>
                  </Col>
                  <Col span={6} style={{textAlign:'right',}}>
                  {
                      data.tfAccessoryFile?
                      <span>证照图片:<a href={pathConfig.YSYPATH+data.tfAccessoryFile} target="_blank">查看</a>
                      </span>
                      :
                      <span>证照图片: <span>暂无</span></span>
                  }
                     
                  </Col>
                  <Col span={6} style={{textAlign:'right'}}>
                    {
                        data.tfAccessory &&
                        <span>附件: <a href={pathConfig.YSYPATH+data.tfAccessory}>点击下载</a></span>
                    }
                  </Col>
                </Row>
                <table className="certTable">
                  <tbody>
                    <tr>
                        <td width='25%'>生产者名称:</td>
                        <td width='75%'>{data.produceName}</td>
                    </tr>
                    <tr>
                        <td>生产者地址:</td>
                        <td>{data.enterpriseRegAddr}</td>
                    </tr>
                    <tr>
                        <td>生产地址:</td>
                        <td>{data.produceAddr}</td>
                    </tr>
                    <tr>
                        <td>代理人名称:</td>
                        <td>{data.agentName}</td>
                    </tr>
                    <tr>
                        <td>代理人地址:</td>
                        <td>{data.agentAddr}</td>
                    </tr>
                    <tr>
                        <td>产品名称:</td>
                        <td>{data.materialName}</td>
                    </tr>
                    <tr>
                        <td>型号、规格:</td>
                        <td>{data.productStandard}</td>
                    </tr>
                    <tr>
                        <td>产品标准:</td>
                        <td>{data.productStandard}</td>
                    </tr>
                    <tr>
                        <td>产品性能结构组成:</td>
                        <td>{data.productStructure}</td>
                    </tr>
                    <tr>
                        <td>产品适用范围:</td>
                        <td>{data.productScope}</td>
                    </tr>
                    <tr>
                        <td>其他内容:</td>
                        <td>{data.taboo}</td>
                    </tr>
                    <tr>
                        <td>备注</td>
                        <td>{data.tfRemark}</td>
                    </tr>
                  </tbody>
                  
                </table>
                <div style={{textAlign:'right'}}>
                  <p>批准有效期:<span style={{marginLeft:12}}>{data.firstTime}</span></p>
                  <p>有效期至:<span style={{marginLeft:12}}>{data.lastTime}</span></p>
                </div>
              </Col>
            </Row>
           
          </div>
        )
      }
    render(){
        return (
        <div>
            {
                this.props.children 
                ||
                <div>
                    {this.state.certData && this.showForm()}
                </div>
            }
        </div>)
    }
}
module.exports = Certificate;