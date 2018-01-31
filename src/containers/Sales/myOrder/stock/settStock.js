/**
 * @file 结算 备货
 */
import React from 'react';
import { Breadcrumb, Input , Row, Col, Button, message, Table} from 'antd';
import { Link ,hashHistory } from 'react-router';
import { sales } from 'api';
import querystring from 'querystring';
import { fetchData } from 'utils/tools'

class SettleStock extends React.Component{
	state = {
		settleData: [],
		dataSource: [],
		money: "0.00"
	}
	componentDidMount = () => {
		fetchData(sales.DETAILS_BY_ORDERID,querystring.stringify({orderId:this.props.location.state.orderId}),(data) => {
			if(data.status){
					let result = [];
					data.result.map((item,index)=>{
						if(item.allowAmount !== 0){
								item._amount = 0;
								result.push(item)
						}
						return null;
					})
					this.setState({dataSource: result})
			}else{
					message.error(data.msg);
			}
		})
	}

	onChange = (record, index, e) => {
			let dataSource = this.state.dataSource;
			let value = e.target.value;
		  if (/^\d+$/.test(value)) {
				 if(value > dataSource[index].allowAmount){
					dataSource[index]._amount = dataSource[index].allowAmount;
					e.target.value = dataSource[index].allowAmount
					 message.warn("发货数量不能大于待发货数量");
				 }else{
						dataSource[index]._amount = value;
				 }
			} else {
				message.warn("请输入数字");
				e.target.value = 0;
				dataSource[index]._amount = 0;
			}
			this.setState({dataSource: dataSource});
  }
	total = (record) => {
    let total = 0;
    record.map( (item, index) => {
      let amount = typeof item._amount === 'undefined' ? 1 : item._amount
      return total += amount * item.purchasePrice;
    })
    return total;
  }
	//生成送货单
	delivery = () => {
    const { dataSource } = this.state;
    let postData = {};
    if (dataSource.length > 0) {
      postData.orderId = dataSource[0].orderId;
      let detailList = [];
      dataSource.map( (item, index) => {
        if(item._amount>0){
          return detailList.push({
            orderDetailGuid: item.orderDetailGuid,
            amount: item._amount,
            flot: item.flot,
            prodDate: item.prodDate,
            usefulDate: item.usefulDate
          })
        }
        return null;
      })
			postData.detailList = detailList;
			if(postData.detailList.length === 0){
				return message.warn('请正确输入发货数量！')
			}else{
				console.log(postData,'postData');
				fetchData(sales.SETTLE_GOODS,JSON.stringify(postData),(data) => {
					if(data.status){
						hashHistory.push('/sales/myOrder');
						message.success('生成送货单成功!');
					} else {
						message.error(data.msg);
					}
				},'application/json')
			}
		}else{
			return message.warn('暂无产品，无法生成送货单！')
		}
		
		
	}
	render () {
		const money = this.total(this.state.dataSource).toFixed(2);
		const footer = () =>{
			return (<Row style={{fontSize:'1.1em'}}>
					<Col span={6}>
						<span>当前结算总金额 :</span><span style={{color:'red'}}>{money}</span>
					</Col>
				</Row>)
		}
		const columns = [
			  	{
		        title : '产品名称',
		        dataIndex : 'materialName',
		        width: 180,
		        fixed: 'left'
		      },  {
		        title : '通用名称',
		        dataIndex : 'geName'
		      },  {
		        title : '规格',
		        dataIndex : 'spec'
		      },  {
		        title : '型号',
		        dataIndex : 'fmodel'
		      },  {
		        title : '采购单位',
		        dataIndex : 'purchaseUnit'
		      },  {
		        title : '采购价格',
						dataIndex : 'purchasePrice',
						render : (text, record)=>{
							return text === 'undefined' || text === null ? '0.00' : text.toFixed(2)
						}
		      },  {
		        title : '包装规格',
		        dataIndex : 'tfPacking'
		      },  {
		        title : '待发货数量',
		        dataIndex : 'allowAmount',
		        width: 80,
		      },  {
		        title : '发货数量',
		        dataIndex : '_amount',
		        width: 100,
		        render: (text, record, index) => {
		          return <Input
		            min={0}
								defaultValue={0}
		            onChange={this.onChange.bind(this, record, index)}
		            />
		        }
		      },  {
		        title : '生产批号',
		        dataIndex : 'flot',
		        width: 120,
		      },  {
		        title : '生产日期',
		        dataIndex : 'prodDate',
		        width: 110,
		      },  {
		        title : '有效期至',
		        dataIndex : 'usefulDate',
		        width: 110,
      		}]
      	return(
      	<div>
      		<Breadcrumb style={{fontSize: '1.1em'}}>
	          <Breadcrumb.Item><Link to='/sales/myOrder'>我的订单</Link></Breadcrumb.Item>
	          <Breadcrumb.Item>结算备货</Breadcrumb.Item>
	        </Breadcrumb>
					<div style={{marginTop:16}}>
							<Button type="primary" onClick={this.delivery}>生成送货单</Button>
					</div>
	        <Table 
						style={{marginTop:10}}
						columns={columns}
						dataSource={this.state.dataSource}
						rowKey={'orderDetailGuid'}
						scroll={{ x: '120%' }}
						pagination={false}
						size={'small'}
						footer={footer}
	        />
      	</div>)
	}
}
module.exports = SettleStock;