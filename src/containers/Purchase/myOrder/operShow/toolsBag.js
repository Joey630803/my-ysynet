/**
 * @file 手术订单明细 工具包
 */
import React from 'react';
import { Table ,Row, Col} from 'antd';
import { actionHandler } from 'utils/tools';
import { fetchData } from 'utils/tools';
import { purchase ,sales} from 'api';
import querystring from 'querystring';

const OPERBAG_BASE_URL = '/purchase/myOrder/',
      OPERBAG_TITLES = {
        show: '查看工具',
      }
class ToolsBag extends React.Component{
	state = {
		operBagData : [],
    operBagTotal : '',
    headerData:[]
  }

 componentWillMount = () => {
   //表头
   fetchData(sales.HEADERPACKAGELISTBYSENDID,querystring.stringify({orderId:this.props.data.orderId}),(data)=>{
            this.setState({headerData:data.result})
        })
     //orderId 查询手术包统计信息
     fetchData(purchase.GETPACKAGEBYORDERID,
      querystring.stringify({orderId:this.props.data.orderId,submitFlag:'S'}),(data)=>{
      this.setState({ operBagTotal : data.result });
    })
    //  //orderId 查询手术包数据
     fetchData(purchase.FINDPACKAGE_LIST,
      querystring.stringify({orderId:this.props.data.orderId,headerStyle:'1',submitFlag:'S'}),(data)=>{
        if(data.result){
          this.setState({ operBagData: data.result });
        }
      
    });
 }
	render () {
		const actions = (text, record, index) => {
			return (
        record.sumOperTool === '0'? null
        :
        <span>
				  <a onClick={
            actionHandler.bind(
              null, this.props.router, `${OPERBAG_BASE_URL}bagShow`, {packageId:record.packageId,...this.props.data}
            )}>
            {`${OPERBAG_TITLES.show}`}
          </a>
				</span>)
		}
    const operBagTotal = this.state.operBagTotal;
    const columns =[{
                title : '添加工具',
                dataIndex : 'sumOperTool',
                width : 70,
                render : (text , record, index)=>{
                    return  record.packageId ==='-1' 
                    ?
                    '合计'
                    :
                    actions(text, record ,index)
                    }
                },{
                    title : '包含植入物',
                    dataIndex : 'hasImplantFlag',
                    width : 60,
                    render:( text, record, index )=>{
                      if(index === this.state.operBagData.length-2 ){
                        return null;
                      }else{
                        return text;
                      }
                    }
                }];
            //Header
            const operBagHeader = this.state.headerData.slice(0,this.state.headerData.length-1);
            operBagHeader.forEach((item,i)=>{
                return columns.push({
                    title : item.TF_CLO_NAME,
                    dataIndex : item.TF_CLO_CODE
                })
            })
            columns.push({
                    title :"手术器械",
                    dataIndex : 'operTool',
            });
		return (
    <div>
      { this.props.children ||
        <div>
						<Row>
							<Col style={{fontSize:'1.1em'}}>
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
						</Row>
            {
              this.state.operBagData.length > 2 ?
              <Table 
                style={{marginTop:10}}
                columns={columns}
                dataSource={this.state.operBagData.slice(1,this.state.operBagData.length)}
                rowKey={record => record.packageId}
                size='small'
                pagination={false}
              />
              : 
              <h2 style={{marginTop:10}}>暂无手术包信息</h2>
            }
				</div>
      }
    </div>)
				}
	}

module.exports = ToolsBag