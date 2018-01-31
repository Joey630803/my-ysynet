/**
 * @file 审批管理 审批人
 */
import React from 'react';
import { message, Breadcrumb, Row, Col , Input , Table, Button} from 'antd';
import querystring from 'querystring';
import { Link } from 'react-router';
import { approve } from 'api';
import { FetchPost, fetchData } from 'utils/tools';

const Search = Input.Search;

class CheckUser extends React.Component{
	  state = {
  	    gridLeft: [],
        gridRight:[],
        selectedRowKeys:[],
        selected_left:[],
        selected_right:[],
        selectedRows:[],
        l_dirtyClick:false,
        r_dirtyClick:false,
        addToRight:true,
        addToLeft:true
	     };
  	componentDidMount() {
      this.getMock();
      }
        //获取审批人表中的数据
      getMock = () => {
          //已选审批人列表
        fetchData(approve.APPROVE_EXITUSER,querystring.stringify({approvalGuid:this.props.location.state.approvalGuid}),(data)=>{
          this.setState({gridRight:data.result})
        });
          //未选审批人列表
        fetchData(approve.APPROVE_NOEXITUSER, querystring.stringify({approvalGuid:this.props.location.state.approvalGuid}),(data)=>{
          this.setState({gridLeft:data.result})
        });
      } 
    //添加
    add = () =>{
      let gridLeftItem = [],gridLeftChanged =[];//左边改变后的数据
      const selectedRows = this.state.selectedRows;
      const gridRight = this.state.gridRight;
      gridLeftItem = this.state.gridLeft.map((item,index)=>{
          return item
      })
      let insertApprovalUserMap = [],parms = {};
      selectedRows.map((item,index)=>{
        return insertApprovalUserMap.push({
          approvalGuid:this.props.location.state.approvalGuid,
          approvalUserid:item.USER_ID,
          approvalUsername:item.USER_NAME
        });
      });
      parms.insertApprovalUserMap = insertApprovalUserMap;
      this.setState({l_dirtyClick:true})
      fetchData(approve.INSERT_APPROVEUSER,JSON.stringify(parms),(data)=>{
        this.setState({l_dirtyClick:false})
         if(data.result==='success')
            {
               message.success('操作成功');
              for( let i=0;i<gridLeftItem.length;i++)
              {
                let obj = gridLeftItem[i];
                let userId = obj.USER_ID;
                let flag = false;
                for(let j=0;j<selectedRows.length;j++)
                {
                  let selRow = selectedRows[j];
                  let n = selRow.USER_ID;
                  if(n===userId)
                    {
                      flag = true;
                      break;
                    }
                }
                if(!flag){
                  gridLeftChanged.push(obj)
                }
              }
              selectedRows.map((item,index)=>{
                return gridRight.push(item)
              });
              this.setState({gridRight:gridRight,gridLeft:gridLeftChanged,selectedRowKeys:[],addToRight:true})
            }
            else{
              message.error(data.msg);
            }
          },"application/json")
    }
    //移除
    remove = () =>{
      let gridRightItem = [],gridRightChanged=[];
      const selectedRowKeys = this.state.selectedRowKeys;
      const selectedRows = this.state.selectedRows;
      const gridLeft = this.state.gridLeft;
      gridRightItem = this.state.gridRight.map((item,index)=>{
        return item
      })
      let dataBody = {
             approvalGuid: this.props.location.state.approvalGuid,
             userId: selectedRowKeys
          };
          this.setState({r_dirtyClick:true})
         FetchPost(approve.DELETE_APPROVALUSER, querystring.stringify(dataBody))
        .then(response => {
                return response.json();
          })
        .then(data =>{
          this.setState({r_dirtyClick:false})
           if(data.result==='success'){
              message.success('操作成功');
              for( let i=0;i<gridRightItem.length;i++)
              {
                let obj = gridRightItem[i];
                let userId = obj.USER_ID;
                let flag = false;
                for(let j=0;j<selectedRows.length;j++)
                {
                  let selRow = selectedRows[j];
                  let n = selRow.USER_ID;
                  if(n===userId)
                    {
                      flag = true;
                      break;
                    }
                }
                if(!flag){
                  gridRightChanged.push(obj)
                }
              }
             selectedRows.map((item,index)=>{
                return gridLeft.push(item)
              });
              this.setState({gridRight:gridRightChanged,gridLeft:gridLeft,selectedRowKeys:[],addToLeft:true})
            }
            else{
              message.error(data.msg);
            }
        })
        .catch(e => console.log("Oops, error", e))
    }
    //左边勾选
    onSelectChangeLeft = (selectedRowKeys,selectedRows) => {
      let selected_left = [];
      const gridRight = this.state.gridRight;
      if(selectedRowKeys.length + gridRight.length>5)
      {
        message.error('审批人最多5人');
      }
      for(let i=0;i<selectedRowKeys.length;i++)
      {
        let selected = selectedRowKeys[i];
        let flag = false;
        for(let j=0;j<gridRight.length;j++)
        {
          let id = gridRight[j].USER_ID;
          if(selected===id)
          {
            flag = true;
            break;
          }
        }
        if(!flag){
          selected_left.push(selected);
        }
      }
      selected_left.length>0? this.setState({addToRight:false}):this.setState({addToRight:true});

      this.setState({ selectedRowKeys:selected_left, selectedRows,addToLeft:true});
    }
    //右边勾选
    onSelectChangeRight = (selectedRowKeys,selectedRows) => {
      let selected_right=[];
       const gridLeft = this.state.gridLeft;
       for(let i=0;i<selectedRowKeys.length;i++)
      {
        let selected = selectedRowKeys[i];
        let flag = false;
        for(let j=0;j<gridLeft.length;j++)
        {
          let id = gridLeft[j].USER_ID;
          if(selected===id)
          {
            flag = true;
            break;
          }
        }
        if(!flag){
          selected_right.push(selected);
        }
      }
      selected_right.length>0? this.setState({addToLeft:false}):this.setState({addToLeft:true})
      this.setState({ selectedRowKeys:selected_right, selectedRows,addToRight:true});
    }
    //左边搜索框 
    searchLeft = (value) =>{
       fetchData(approve.APPROVE_NOEXITUSER,querystring.stringify({approvalGuid:this.props.location.state.approvalGuid,userInfo:value}),(data)=>{
          this.setState({gridLeft:data.result})
       })
    }
    //右边搜索框 
    searchRight = (value)=>{
      fetchData(approve.APPROVE_EXITUSER,querystring.stringify({approvalGuid:this.props.location.state.approvalGuid,userInfo:value}),(data)=>{
          this.setState({gridRight:data.result})
       })
    }
  	render(){
      const { selectedRowKeys } = this.state;
      const rowSelectionLeft = {
          selectedRowKeys,
          onChange: this.onSelectChangeLeft,
        };
      const rowSelectionRight = {
         selectedRowKeys,
          onChange: this.onSelectChangeRight,
        };
      const columns = [{
        title:'账号',
        dataIndex:'USER_NO',
        width:'20%',
      },{
        title:'用户名',
        dataIndex:'USER_NAME',
        width:'20%'
      },{
        title:'工号',
        dataIndex:'JOB_NUM',
        width:'20%'
      },{
        title:'备注',
        dataIndex:'TF_REMARK',
        width:'40%'
      }]
  		return (
  			<div>
  				<Breadcrumb style={{fontSize: '1.1em'}}>
          	<Breadcrumb.Item><Link to='/approve/ApprovalMgt'>审批管理</Link></Breadcrumb.Item>
          	<Breadcrumb.Item>审批人</Breadcrumb.Item>
        	</Breadcrumb>
        	<div>
            <Row style={{marginTop:'10px'}}>
              <Col className='ant-col-11'>
                <div>
                    <span style={{marginRight:'20px'}}>未选用户:</span>
                    <Search
                      placeholder="请输入用户账号/用户名/工号"
                      style={{ width: 430 }}
                      onSearch={this.searchLeft}
                    />
                </div>
                <Table
                  style={{marginTop:'10px'}}
                  columns={columns}
                  size='small'
                  dataSource={this.state.gridLeft}
                  rowSelection={rowSelectionLeft}
                  rowKey={record => record.USER_ID}
                  scroll={{ y: 240 }}
                />
              </Col>
              <Col className='ant-col-2' style={{textAlign:'center',marginTop:'150px'}}>
                  <Button type="primary" disabled={this.state.addToRight} onClick={this.add} style={{marginBottom:'16px'}} loading={this.state.l_dirtyClick}>添加</Button>
                  <Button type="primary" disabled={this.state.addToLeft} onClick={this.remove} loading={this.state.r_dirtyClick}>移除</Button>
              </Col>
              <Col className='ant-col-11'>
                <div>
                    <span style={{marginRight:'20px'}}>已选用户:</span>
                    <Search
                      placeholder="请输入用户账号/用户名/工号"
                      style={{ width: 430 }}
                      onSearch={this.searchRight}
                    />
                  </div>
               <Table
                  style={{marginTop:'10px'}}
                  columns={columns}
                  size='small'
                  pagination={false} 
                  rowSelection={rowSelectionRight}
                  dataSource={this.state.gridRight}
                  rowKey={record => record.USER_ID}
                  scroll={{  y: 240 }}
                />
              </Col>
            </Row>
          </div>
  			</div>)
  	 }

}
module.exports = CheckUser;


