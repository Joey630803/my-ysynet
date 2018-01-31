/**
 * @file 手术包工具
 */
import React from 'react';
import { Breadcrumb, Table } from 'antd';
import { Link } from 'react-router';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { purchase } from 'api';

class OperBagTool extends React.Component{
	state = {
		dataSource : []
	}
	componentDidMount = () => {
		 fetchData(purchase.FINDSELECTEDTOOLPACKAGE,
			querystring.stringify({orderId:this.props.location.state.orderId,packageId:this.props.location.state.packageId,submitFlag:'S'}),(data)=>{
				if(data.status){
					this.setState({dataSource:data.result})
				}
			}) 
	} 

	total = () =>{
		let totalNum = 0;
		let packageData = this.state.dataSource;
		packageData.map((item , index) =>{
			return totalNum += Number(item.amount || 0)
		 })
		 return totalNum;
	}
	
	render () {
		const columns = [
			{
				title : '工具名称',
				dataIndex : 'toolName',
				width:200
			},{
				title: '数量',
				dataIndex :'amount'
			}
		]
		return (
	
			<div>
			{
				this.props.children ||
				<div>
					<Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
					<Breadcrumb.Item><Link to='/purchase/myOrder'>我的订单</Link></Breadcrumb.Item>
					<Breadcrumb.Item><Link to={{pathname:'/purchase/myOrder/operDetails',query:{activeKey:'tools'},state : this.props.location.state}}>手术订单详情</Link></Breadcrumb.Item>
					<Breadcrumb.Item>手术包工具</Breadcrumb.Item>
					</Breadcrumb>
					<Table 
						columns={columns}
						dataSource={this.state.dataSource}
						style={{marginTop:10}}
						rowKey='toolCode'
						pagination={false}
						size={'small'}
						footer={ this.state.dataSource.length === 0 ?
						null : () => <span>
										<span style={{paddingLeft:10}}>合计</span>
										<span style={{marginLeft:175}}>{this.total()}</span>
									</span>}
					/>
				</div>
			}
		</div>
		)
	}
}
module.exports = OperBagTool