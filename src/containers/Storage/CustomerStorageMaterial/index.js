/**
 * @file 库房产品
 */
import React from 'react';
import { Row,Col,Button ,Form,message,Modal,Select} from 'antd';
import FetchTable from 'component/FetchTable';
import { actionHandler } from 'utils/tools';
import SearchForm from './searchForm';
import querystring from 'querystring';
import { fetchData } from 'utils/tools';
import { storage } from 'api';

const Option = Select.Option
/** 挂载查询表单 */
const SearchBox = Form.create()(SearchForm);
//路径
const MATERIAL_BASE_URL = '/storage/customerStorageMaterial/',
      MATERIAL_TITLES = {
        edit: '编辑',
        allEdit: '批量编辑',
        delete:'删除',
        choice:'选入产品'
      }
class storageMaterial extends React.Component{
    state = {
        query :this.props.location.search === "" ? {} :  this.props.location.query,
        selected: [],
        selectedRows: [],
        visible: false ,
        storageData:[]
    }
    handleError = (data) =>{
        Modal.error({
            title: '错误提示',
            content: data,
            okText: '确定'
          });
    }
    componentDidMount = () => {
        fetchData(storage.CUSTOMERSTORAGE_BYUSER,{},(data)=>{
            if(data.status){
                if(data.result.length > 0){
                  this.setState({
                      query:{'storageGuid':data.result[0].value },
                      storageData: data.result
                  });
                }
            }else{
                this.handleError(data.msg);
            }
        });
  }
    queryHandler = (query) => {
        this.refs.table.fetch(query);
        this.setState({ query })
    }
    showModal = () => {
        this.setState({
        visible: true,
        });
    }
    hideModal = () => {
        this.setState({
        visible: false,
        });
    }
    //库房变化
    onChange = (value) => {
        this.setState({
            query:{'storageGuid':value }
        })
        this.refs.table.fetch({'storageGuid':value });
    }
    handerDelete = () => {
        const values = this.state.selected;
        fetchData(storage.CUSTOMERSTORAGEDELETEMATERIAL,querystring.stringify({storageMaterialGuids:values}),(data)=>{
            if(data.status){
                this.refs.table.fetch();
                message.success('删除成功！');
            }else{
                this.handleError(data.msg);
            }
            this.setState({ visible : false });
        })
    }
    //删除
    deleteOnClick = () => {
        if(this.state.selected.length > 0){
           this.showModal();
        }
        else {
            message.warning('请选中需要删除的数据!');
        }
    }
    //选中批量编辑的行
    batchEditClick = (router, url, state) => {
        if(this.state.selected.length > 1){
            actionHandler(router, url, state)
         }
         else {
          message.warning('请选中超过一条以上数据');
         }
    }
    render(){
        const { storageData } = this.state;
        const columns = [{
            title : '操作',
            dataIndex: 'actions',
            width: 60,
            render: (text, record) => {
                return (
                <span>
                    <a onClick={
                    actionHandler.bind(
                        null, this.props.router, `${MATERIAL_BASE_URL}edit`, {...record, title: `${MATERIAL_TITLES.edit}`}
                    )}>
                    {`${MATERIAL_TITLES.edit}`}
                    </a>
                </span>
                )
        }},{
            title : '通用名称',
            dataIndex : 'geName',
            width: 200,
        },{
            title : '产品名称',
            dataIndex : 'materialName',
            width: 200,
        },{
            title : '采购单位',
            dataIndex : 'purchaseUnit'
        },{
            title : '证件号',
            dataIndex : 'registerNo',
        },{
            title : '型号',
            dataIndex : 'fmodel',
        },{
            title : '规格',
            dataIndex : 'spec',
        },{
            title : '结算方式',
            dataIndex : 'settleType',
            render : text => {
                if(text === "00"){
                    return "出库结算"
                }else if(text === "01"){
                    return "计费结算";
                }
            }
        },{
            title : '通用简码',
            dataIndex : 'geFqun',
        },{
            title : '条码',
            dataIndex : 'fbarcode'
        },{
            title : '上限',
            dataIndex : 'uLimit'
        },{
            title : '下限',
            dataIndex : 'lLimit'
        },{
            title : '配送方式',
            dataIndex : 'shfs',
            width:100,
            render : text => {
                if(text === "00"){
                    return "科室采购"
                }else if(text === "01"){
                    return "库房配送";
                }
            }
        }];
       
        const query =  this.state.query;
        return(
            <div>
                {this.props.children || 
                    <div>
                        {
                        query.storageGuid === undefined ? null :
                        <div>
                        <SearchBox query={this.queryHandler} defaultValue={query.storageGuid} />
                         <Row>
                            <Col span={5}>
                                <div className="ant-form-item-label">
                                    <label>库房</label>
                                </div>
                                <Select
                                style={{width:150}}
                                value={this.state.query.storageGuid}
                                onChange={this.onChange}
                                >
                                    {
                                        storageData.map((item,index) => { 
                                        return <Option key={index} value={item.value}>{item.text}</Option>
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col span={15}>
                                <Button 
                                    type="primary" 
                                    style={{marginRight:'8px'}}
                                    onClick={actionHandler.bind(
                                        null, this.props.router, `${MATERIAL_BASE_URL}choice`, {'storageGuid' : query.storageGuid}
                                    )}
                                >{`${MATERIAL_TITLES.choice}`}</Button>
                                <Button 
                                    type="primary" ghost
                                    style={{marginRight:'8px'}}
                                    onClick={this.batchEditClick.bind(
                                        null, this.props.router, `${MATERIAL_BASE_URL}allEdit`, { 'storageMaterialGuids': this.state.selected,'storageGuid' : query.storageGuid}
                                    )}
                                >{`${MATERIAL_TITLES.allEdit}`}</Button>
                                <Button 
                                    type="danger" ghost
                                    onClick={this.deleteOnClick}
                                >{`${MATERIAL_TITLES.delete}`}</Button>
                            </Col>
                        </Row>
                        <FetchTable 
                            query={query}
                            ref='table'
                            columns={columns}
                            url={storage.CUSTOMERSTORAGEMATERIAL_LIST}
                            rowKey='storageMaterialGuid'
                            scroll={{ x: '180%' }}
                            rowSelection={{
                                selectedRowKeys: this.state.selected,
                                onChange: (selectedRowKeys, selectedRows) => 
                                this.setState({selected: selectedRowKeys, selectedRows: selectedRows})
                            }}
                        />
                        <Modal
                        title="提示"
                        visible={this.state.visible}
                        onOk={this.handerDelete}
                        onCancel={this.hideModal}
                        okText="确认"
                        cancelText="取消"
                        >
                        <p>是否确认删除选中的产品?</p>
                        </Modal>
                        </div>
                        }
                    </div>

                    }
                </div>
           
          
        )
    }
}
module.exports = storageMaterial;