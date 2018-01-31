/**
 * 查看二维码
 */ 
import React from 'react';
import { Row, Col, Input, Button,message ,Breadcrumb} from 'antd';
import FetchTable from 'component/FetchTable';
import { Link } from 'react-router';
import querystring from 'querystring';
import { sales } from 'api'
const Search = Input.Search;


class QrCode extends React.Component {
  state = {
    selected: [],
    query: {
        sendDetailGuid : this.props.location.state.sendDetailGuid
    }
  }
  /**table根据条件查询 */
  queryHandler = (query) => {
        query.sendDetailGuid = this.props.location.state.sendDetailGuid;
        this.refs.table.fetch(query);
  }
  /**
   * 打印
   */
  handlePrint = () => {
   const qrcodes = this.state.selected;
   if(qrcodes.length === 0 ){
       message.warning("请选择打印的二维码!")
   }else{
    console.log(qrcodes)
     window.open(sales.PRINTQRCODE+"?"+querystring.stringify({qrcodes: qrcodes}));
   }
  
  }
  render() {
    const columns = [{
      title: '二维码',
      dataIndex: 'qrcode',
    }];
    const query = this.state.query;
    const page = this.props.location.state.page;
    const record = this.props.location.state;
    return (
      <div>
        { this.props.children 
          || 
          <div>
            <Row>
                <Col className="ant-col-6">
                    <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                        <Breadcrumb.Item><Link to='/sales/salesMyDelivery'>我的送货单</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={{pathname: page,state: record}}>详情</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>二维码打印</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>
            <Row>
              <Col span={10}>
                <Search
                  ref='search'
                  placeholder="产品二维码"
                  style={{ width: 260 }}
                  onSearch={value =>  {this.queryHandler({'searchParams':value})}}
                />
              </Col>
              <Col span={14} style={{textAlign:"center"}}>
              <Button type="primary" onClick={this.handlePrint}>打印</Button>
              </Col>
            </Row>
           <FetchTable 
              query={query}
              ref='table'
              columns={columns}
              url={sales.SEARCHQRCODEBYSENDDETAIL}
              rowKey='qrcode'
              scroll={ { x: 900 }}
              rowSelection={{
                selectedRowKeys: this.state.selected,
                onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selected: selectedRowKeys})
                }
            }}
            />
          </div>   
        }  
      </div>
    )  
  }
}
module.exports = QrCode;