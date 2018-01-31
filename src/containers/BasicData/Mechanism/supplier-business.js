/**
 * @file 供应商经营范围
 */
import React from 'react';
import { Breadcrumb, Row, Col, Table, Button, message } from 'antd';
import { Link ,hashHistory} from 'react-router';
import { fetchData ,pathConfig } from 'utils/tools';
import querystring from 'querystring'; 

const columns = [{
  title: '编号',
  dataIndex: 'TF_CLO_CODE',
  key: 'TF_CLO_CODE',
}, {
  title: '分类名称',
  dataIndex: 'TF_CLO_NAME'
}]

class SupplierBusiness extends React.Component{
	state = {
    bussinessData: [],
    gridOne: [],
    gridTwo: [],
    gridThree: []
	}
  //供应商经营范围
  componentDidMount = () =>{
    fetchData(pathConfig.SCOPEBUSINESSLIST_URL, 
              querystring.stringify({fOrgId: this.props.location.state.ORG_ID}), 
              data => {
                if (data.status) {
                  let gridOne = [], gridTwo = [], gridThree = [];
                  const result = data.result;
                  const bussinessData = result.map((item, index) => {
                    if (item.is_selected) {  
                      if (index <= (result.length/3)) {
                        gridOne.push(item.instrumentCode)
                      } else if (index > (result.length/3) && (index <= (result.length/3) * 2)) {
                        gridTwo.push(item.instrumentCode);
                      } else {
                        gridThree.push(item.instrumentCode);
                      }
                    }
                    return {
                      TF_CLO_NAME: item.instrumentName, 
                      TF_CLO_CODE: item.instrumentCode
                    }
                  })
                  this.setState({bussinessData: bussinessData, gridOne,gridTwo, gridThree})
                }
              });
  }

  math = () => Math.ceil(this.state.bussinessData.length/3);

  saveHandler = () => {
    const { gridOne, gridTwo, gridThree } = this.state;
    const postData = gridOne.concat(gridTwo, gridThree);
    fetchData(pathConfig.SAVESCOPEBUSINESS_URL,querystring.stringify({fOrgId: this.props.location.state.ORG_ID,instrumentCodes:postData}),
      data => {
        this.setState({dirtyClick: false});
        if(data.status)
        {
          hashHistory.push({pathname:'basicData/mechanism',query:{activeKey:'supplier'}});
          message.success('供应商经营范围编辑成功！');
        }
        else{
          message.error(data.msg);
        }
    })
  }
	render(){
    const { bussinessData } = this.state;
		return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to={{pathname:'basicData/mechanism',query:{activeKey:'supplier'}}}>机构管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>供应商经营范围</Breadcrumb.Item>
        </Breadcrumb>
        <Button onClick={this.saveHandler} style={{marginTop:10}}>保存</Button>
        <Row style={{marginTop: 10}}>
          <Col span={8}>
            <Table 
              pagination={false}
              size={'small'}
              dataSource={bussinessData.slice(0, this.math())} 
              columns={columns} 
              rowSelection={{
                selectedRowKeys: this.state.gridOne,
                onChange: (selectedRowKeys, selectedRows) => this.setState({gridOne: selectedRowKeys})
              }}
              rowKey={'TF_CLO_CODE'}
            />
          </Col>
          <Col span={8}>
            <Table 
              pagination={false}
              size={'small'}
              dataSource={bussinessData.slice(this.math(), this.math() * 2)} 
              columns={columns} 
              rowSelection={{
                selectedRowKeys: this.state.gridTwo,
                onChange: (selectedRowKeys, selectedRows) => this.setState({gridTwo: selectedRowKeys})
              }}
              rowKey={'TF_CLO_CODE'}
            />
          </Col>
          <Col span={8}>
            <Table 
              pagination={false}
              size={'small'}
              dataSource={bussinessData.slice(this.math() * 2)} 
              columns={columns} 
              rowSelection={{
                selectedRowKeys: this.state.gridThree,
                onChange: (selectedRowKeys, selectedRows) => this.setState({gridThree: selectedRowKeys})
              }}
              rowKey={'TF_CLO_CODE'}
            />
          </Col>
        </Row>
      </div>
    );
	}
}
module.exports = SupplierBusiness;