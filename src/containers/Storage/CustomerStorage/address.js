import React from 'react';
import { Table, Input, Icon, Button, Popconfirm,Breadcrumb,Checkbox,message} from 'antd';
import { Link ,hashHistory} from 'react-router';
import querystring from 'querystring';
import { FetchPost } from 'utils/tools';
import { storage } from '../../../api';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../actions';
class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
    max:this.props.max
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    if(this.state.value.length>this.state.max){
        return  message.warning('字符长度不能超过'+this.state.max);
    }
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { max, value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                max={max}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}

   class CustomerStorageAddress extends React.Component{
       state = {
           dataSource: [{
               key:'0',
               linkman:'联系人0',
               linktel:'131********',
               tfAddress:'湖北武汉',
               isDefault:0
           }],
           count: 1
       }
        componentDidMount = () => {
            this.getAddress();
        }
        getAddress = () => {
            FetchPost(storage.CUSTOMERSTORAGE_BYSIDADDRESS,querystring.stringify({storageGuid:this.props.location.state.storageGuid}))
            .then(response => {
            return response.json();
            })
            .then(data => {
            if(data.status){
                const addressData = data.result;

                if(data.result.length>0){
                    addressData.map((item,index) =>{
                       return addressData[index]['key'] = item.addrGuid;
                    })
                    this.setState({dataSource:addressData})
                    this.setState({count: data.result.length})
                }
             }
            })
            .catch(e => console.log("Oops, error", e))
            
        }
       onCellChange = (index,key) => {
            return (value) => {
                const dataSource = [ ...this.state.dataSource ];
                dataSource[index][key] = value;
                this.setState({dataSource})
            }
        }

        onCheckChanage = (e) => {
            var index = e.target.dataIndex;
            const dataSource = [ ...this.state.dataSource ];
            dataSource.map(item => {
                item.isDefault = 0;
                return null;
            });
            dataSource[index]['isDefault'] = e.target.checked === true ? 1 : 0;
            this.setState({dataSource})
        }

        onDelete = (index) => {
            const dataSource =[ ...this.state.dataSource];
            dataSource.splice(index,1);
            this.setState({dataSource});
        }
        handleAdd = () => {
            const { count ,dataSource} = this.state;
            if(count>=10){
                return message.info('地址只能添加10条记录');
            }
           else{
                const newData = {
                key:count,
                linkman:`联系人 ${count}`,
                linktel:'131********',
                tfAddress:'湖北武汉',
                isDefault:0
                };
                this.setState({
                    dataSource: [...dataSource,newData],
                    count: count + 1
                })
           }
        }
     
        handleSave = () => {
             //判断是否有数据处于编辑状态
            if(document.querySelectorAll('.editable-cell-icon-check').length>0){
                return message.warning('存在处于编辑状态的数据,请先关闭状态');
            }
            //处理交互数据
            let values = {};
            values.storageGuid = this.props.location.state.storageGuid;
            values.addresses = this.state.dataSource;
            let addressData = this.state.dataSource;
            let len = 0, isDelete = true ;//是否删除选中
            addressData.map((item,index) => {
                if (this.props.actionState.Order.addressId === item.addrGuid) {
                    isDelete = false;
                }
                if(item.isDefault === 0) {
                 return len++
                }
                return len;
            })
            if(addressData.length === len){
                return message.warning("您没有设置默认地址,请设置默认地址？")
            }
            if (isDelete) {
                this.props.actions.createOrder({
                    addressId: ''
                })
            }
            console.log(values,'所有地址')
            fetch(storage.CUSTOMERSTORAGE_ADDRESS, {
                method: 'post',
                mode:'cors',
                credentials: 'include',
                headers: {
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(values)
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
            if(data.status){
                hashHistory.push('/storage/customerStorage');
                message.success('地址保存成功！')
            }
            else{
                message.error(data.msg)
            }
            })
            .catch(e => console.log("Oops, error", e))
        }

        render(){
            const columns = [{
                title: '联系人',
                dataIndex: 'linkman',
                width:'10%',
                render: (text, record, index) => (
                    <EditableCell
                        value={text}
                        max='25'
                        onChange={this.onCellChange(index, 'linkman')}
                    />
                )
            },{
                title: '联系电话',
                dataIndex: 'linktel',
                width:'20%',
                render: (text, record, index) => (
                    <EditableCell
                        value={text}
                        max='25'
                        onChange={this.onCellChange(index, 'linktel')}
                    />
                )
            },{
                title: '地址',
                dataIndex: 'tfAddress',
                width:'30%',
                render: (text, record, index) => (
                    <EditableCell
                        value={text}
                        max='50'
                        onChange={this.onCellChange(index, 'tfAddress')}
                    />
                )
            },{
                title: '是否默认地址',
                dataIndex: 'isDefault',
                render: (text, row, index) => <Checkbox
                dataIndex={index}
                checked={text}
                onChange={this.onCheckChanage}
                />,
             },{
                title: '操作',
                dataIndex: 'actions',
                width:'20%',
                render: (text,record,index) => {
                    return (
                        this.state.count > 1 ? 
                        (
                            <Popconfirm title={record.isDefault===1 ? "该项是默认地址，是否删除？" : "是否删除？"}  onConfirm={() => this.onDelete(index)}>
                                <a href="#">删除</a>
                            </Popconfirm>
                        ) : null
                    )
                }
            }];

            const { dataSource } = this.state;
            return(
                <div>
                   <Breadcrumb style={{fontSize: '1.1em'}}>
                    <Breadcrumb.Item><Link to='/storage/customerStorage'>库房管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>地址</Breadcrumb.Item>
                   </Breadcrumb>
                   <div style={{marginTop:16,marginBottom:16}}>
                        <Button className="editable-add-btn" onClick={this.handleAdd}>添加</Button>
                        <Button className="editable-add-btn" style={{marginLeft:16}} onClick={this.handleSave}>保存</Button>
                   </div>
                    <Table
                        rowKey={'addrGuid'} 
                        bordered 
                        dataSource={dataSource} 
                        columns={columns}
                        pagination={false}
                        ></Table>
                </div>
            )
        }
   }
export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})
export const mapStateToProps = state => ({
  actionState: state
})
module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerStorageAddress);