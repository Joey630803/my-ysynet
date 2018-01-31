/**
 * @file 手术订单明细产品
 */
import React from 'react';
import { Table } from 'antd';
import { purchase } from 'api';
import { actionHandler } from 'utils/tools';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';

class OperProduct extends React.Component{
  state = {
    productData: []
  }

	componentWillMount = () =>{
    //获取产品数据
    fetchData(purchase.FINDDETAILIST4OPER,querystring.stringify({sendId:this.props.data.orderId,submitFlag:'S'}),(data)=>{
      this.setState({productData:data.result})
    });
	}
	render () {
    const baseData= this.props.data;

    const productColumns = baseData.qrFlag === "01" ?
                  [{
                    title: '操作',
                    key: 'action',
                    fixed: 'left',
                    width: 120,
                    render: (text,record,index) => {
                        return (
                            <span>
                                <a onClick={
                                actionHandler.bind(
                                null, this.props.router, `/sales/salesMyDelivery/operDetails` , {...baseData, page:'/sales/salesMyDelivery/show', sendDetailGuid : record.sendDetailGuid}
                                )}>
                                {`查看二维码`}
                                </a>
                            </span>
                        )
                    }},{
                    title : '产品类型',
                    dataIndex : 'attributeName'
                    },{
                    title: '产品名称',
                    dataIndex: 'materialName',
                    }, {
                    title: '通用名称',
                    dataIndex: 'geName',
                    }, {
                    title: '规格',
                    dataIndex: 'spec',
                    }, {
                    title: '型号',
                    dataIndex: 'fmodel',
                    }, {
                    title: '采购单位',
                    dataIndex: 'purchaseUnit',
                    }, {
                    title: '价格',
                    dataIndex: 'purchasePrice',
                    render : (text, record)=>{
                      return text === 'undefined' || text === null ? '0.00' : text.toFixed(2)
                    }
                    }, {
                    title: '包装规格',
                    dataIndex: 'tfPacking',
                    }, {
                    title: '发货数量',
                    dataIndex: 'amount',
                    },  {
                    title: '金额',
                    dataIndex: 'amountMoney',
                    render: (text,record,index) => {
                        return (record.amount * record.purchasePrice).toFixed(2)
                      }
                    }, {
                      title: '生产批号',
                      dataIndex : 'flot'
                    },{
                    title: '生产日期',
                    dataIndex: 'prodDate',
                    }, {
                      title : '有效期至',
                      dataIndex: 'usefulDate'
                    }
                ]
                :
                [{
								title : '产品类型',
								dataIndex : 'attributeName'
								},{
                title: '产品名称',
                dataIndex: 'materialName',
                }, {
                title: '通用名称',
                dataIndex: 'geName',
                }, {
                title: '规格',
                dataIndex: 'spec',
                }, {
                title: '型号',
                dataIndex: 'fmodel',
                }, {
                title: '采购单位',
                dataIndex: 'purchaseUnit',
                }, {
                title: '采购价格',
                dataIndex: 'purchasePrice',
                render : (text, record)=>{
                  return text === 'undefined' || text === null ? '0.00' : text.toFixed(2)
                }
                }, {
                title: '包装规格',
                dataIndex: 'tfPacking',
                }, {
                title: '发货数量',
                dataIndex: 'amount',
                },  {
                title: '金额',
                dataIndex: 'amountMoney',
                render: (text,record,index) => {
                    return (record.amount * record.purchasePrice).toFixed(2)
                  }
                }, {
                	title: '生产批号',
                	dataIndex : 'flot'
                },{
                title: '生产日期',
                dataIndex: 'prodDate',
                }, {
                  title : '有效期至',
                  dataIndex: 'usefulDate'
                }
            ];
		return (
			<Table 
					columns={productColumns}
          rowKey='sendDetailGuid'
          dataSource={this.state.productData}
          size='small'
					scroll={{ x: '150%' }}
			/>
			)
	}
}
module.exports = OperProduct