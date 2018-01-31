/**
 * 选择工具
 */
import React from 'react';
import { Breadcrumb,Row,Col,Collapse,Table,Button,Input ,message} from 'antd';
import { Link } from 'react-router';
import { fetchData } from 'utils/tools';
import { sales } from 'api';
import querystring from 'querystring';
const Panel = Collapse.Panel;
const Search = Input.Search;

class ChoiceTool extends React.Component {
    state = {
        leftData: [],
        rightData: [],
        leftSelected: [],
        leftSelectedRows: [],
        rightSelected: [],
        rightSelectedRows: [],
        toolName:""
    }
    componentWillMount = () => {
      this.getData();
    }

    getData = () =>{
        const value={};
        value.orderId = this.props.location.state.orderId;
        value.packageId = this.props.location.state.record.packageId;
        value.submitFlag = 'D';
        fetchData(sales.PACKAGEFINDALLTOOLS,querystring.stringify(value),(data)=>{
            const dataSource = data.result;
            const leftData = [],rightData = [];
            //获取未选工具和已选工具
            if(dataSource.length > 0){
                dataSource.map((item,index) => {
                    if(item.isSelected){
                        rightData.push(item)
                    }else{
                        leftData.push(item)
                    }
                    return null;
                })
           }
            this.setState({leftData: leftData,rightData: rightData});
        })
    }
    //改变数量的保存临时数据
    onChange = (record, index, e) => {
        if (/^\d+$/.test(e.target.value) && e.target.value !== '0'){
            let postData = {},toolList = [];
            postData.orderId = this.props.location.state.orderId;
            postData.packageId = Number(record.packageId);
            toolList.push({
                toolCode: record.toolCode,
                tfAmount: Number(e.target.value)
            });
            postData.toolList = toolList;
            fetchData(sales.ADDTOOLFROMPACKAGE,JSON.stringify(postData),(data) => {
                if(data.status){
                    message.success("操作成功!")
                }else{
                    message.error(data.msg)
                }
            },"application/json")
        }else{
            return message.warn('请输入非0正整数');
        }       
        
    }
    //添加
    add = () =>{
        const leftSelectedRows = this.state.leftSelectedRows;
        if(leftSelectedRows.length === 0){
            message.warn('请至少勾选一项未选工具');
        }else{
            let postData = {};
            const toolList = [];
                leftSelectedRows.map((item,index)=>{
                return  toolList.push({ toolCode:item.toolCode,tfAmount:1 });
            })
            postData.orderId = this.props.location.state.orderId;
            postData.packageId = Number(this.props.location.state.record.packageId);
            postData.toolList = toolList;
            fetchData(sales.ADDTOOLFROMPACKAGE,JSON.stringify(postData),(data) => {
                if(data.status){
                    this.getData();
                    this.setState({leftSelectedRows : []})
                    message.success("添加成功!")
    
                }else{
                    message.error(data.msg)
                }
            },"application/json")
            }
    }
    //移除
    remove = () =>{
        const rightSelectedRows = this.state.rightSelectedRows;
        if(rightSelectedRows.length === 0){
            message.warn('请至少勾选一项已选工具');
        }else{
            let postData = {};
            postData.orderId = this.props.location.state.orderId;
            postData.packageId = Number(this.props.location.state.record.packageId);
            postData.toolCodes = this.state.rightSelected;
            fetchData(sales.DELETETOOLSFROMPACKAGE,querystring.stringify(postData),(data) => {
                if(data.status){
                    this.getData();
                    this.setState({rightSelectedRows : []}); 
                    message.success("移除成功!")
                }else{
                    message.error(data.msg)
                }
            })
        }
     }

    //搜索列表
    search = (dir,value) => {
        const postData = {};
        postData.orderId = this.props.location.state.orderId;
        postData.packageId = this.props.location.state.record.packageId;
        postData.submitFlag = 'D';
        postData.toolNameLike = value;
        fetchData(sales.PACKAGEFINDALLTOOLS,querystring.stringify(postData),(data)=>{
            //获取所有工具
            const dataSource = data.result; 
            const leftData = [],rightData = [];
            //获取未选工具和已选工具
            if(dataSource.length > 0){
                dataSource.map((item,index) => {
                    if(item.isSelected){
                        rightData.push(item)
                    }else{
                        leftData.push(item)
                    }
                    return null;
                })
           }
           if(dir ==='left'){
            this.setState({ leftData : leftData });           
           }else{
               this.setState({ rightData : rightData });
               
           }
           
        })
    }
    //左边搜索
    queryLeftHandler = (value) => {
        this.search('left',value);
    }
    //右边搜索
    queryRightHandler = (value) => {
        this.search('right',value);
    }
    render(){
       const leftColumns =[{
                    title : '工具名称',
                    dataIndex : 'toolName',
                }];
        const rightColumns =[{
            title : '工具名称',
            dataIndex : 'toolName',
        },{
            title : '数量',
            dataIndex : 'amount',
            render: (text, record, index) => {
              return <Input 
                      defaultValue={text || 1}
                      min={1} onChange={this.onChange.bind(this, record, index)}/>
            }
        }];
        const { rightData ,leftData} = this.state;
        return(
            <div>
                {
                    this.props.children ||
                    <div>
                        <Breadcrumb style={{fontSize: '1.1em',marginBottom:24}}>
                            <Breadcrumb.Item><Link to={{pathname:'/sales/myOrder'}}>我的订单</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to={{pathname:'/sales/myOrder/opStock',query:{activeKey:'tools'},state : this.props.location.state}}>手术包</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>选择工具</Breadcrumb.Item>
                        </Breadcrumb>
                        <Row>
                            <Col span={10}>
                            <Collapse defaultActiveKey={['1']}>
                                <Panel header="未选工具" key="1">
                                <Search
                                placeholder="请输入名称"
                                style={{ width: 260,marginBottom:10 }}
                                onSearch={this.queryLeftHandler}
                                />
                                <Table 
                                columns={leftColumns} 
                                rowKey={"toolCode"}
                                dataSource={leftData} 
                                pagination={true}
                                size="small"
                                rowSelection={{
                                    selectedRowKeys: this.state.leftSelected,
                                    onChange: (selectedRowKeys, selectedRows) => {
                                    this.setState({leftSelected: selectedRowKeys, leftSelectedRows: selectedRows})
                                    }
                                }}
                                />
                                </Panel>
                            </Collapse>
                            </Col>
                            <Col span={2} style={{textAlign:"center"}}>
                                <Button type="primary" onClick={this.add}>添加 》</Button>
                                <Button type="primary" style={{marginTop:16}} onClick={this.remove}>《 移除</Button>
                            </Col>
                            <Col span={10}>
                                <Collapse defaultActiveKey={['2']}>
                                    <Panel header="已选工具" key="2">
                                        <Search
                                        placeholder="请输入名称"
                                        style={{ width: 260,marginBottom:10 }}
                                        onSearch={this.queryRightHandler}
                                        />
                                        <Table 
                                        columns={rightColumns} 
                                        rowKey={"toolCode"}
                                        dataSource={rightData} 
                                        pagination={true}
                                        size="small"
                                        rowSelection={{
                                            selectedRowKeys: this.state.rightSelected,
                                            onChange: (selectedRowKeys, selectedRows) => {
                                            this.setState({rightSelected: selectedRowKeys, rightSelectedRows: selectedRows})
                                            }
                                        }}
                                        />
                                    </Panel>
                                </Collapse>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        )
    }

}
module.exports = ChoiceTool;
