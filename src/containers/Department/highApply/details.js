/**
 * @file 创建高值耗材申请
 */
import React, { Component } from 'react';
import { Breadcrumb, message } from 'antd';
import { apply } from 'component/Department';
import { Link, hashHistory } from 'react-router';
import { fetchData } from 'utils/tools';
import { department } from 'api';
import moment from 'moment';
import querystring from 'querystring';

const { ApplyForm, Toolbar , ApplyDetailForm} = apply;

const styles = {
  breadcrumb: {
    fontSize: '1.1em'
  }
}

class HighApplyDetails extends Component {
  state = {
    dataSource: this.props.location.state.rows || [],
    selected: [],
    otherInfo: {}
  }
  componentDidMount = () => {
    const { rows, applyId, otherInfo, isEdit } = this.props.location.state;
    if (!rows && !isEdit) {
      fetchData(department.SEARCHAPPLYDETAILS, querystring.stringify({applyId: applyId}), data => {
        this.setState({
          dataSource: data.result
        })
      })
    }
    if (otherInfo) {
      this.setState({ otherInfo });
    }
  }
  redirect = (url, values) => {
    const { dataSource, otherInfo } = this.state;
    const { state } = this.props.location;
    const detailList = dataSource || [];
    const tenderMaterialGuids = detailList ? detailList.map(item => item.tenderMaterialGuid) : [];
    hashHistory.push({
      pathname: url,
      state: {fromTo: {...state, back: '/department/highApply/details'},
       values, tenderMaterialGuids, detailList, otherInfo}
    })
  }
  getPostData = type => {
    const { dataSource, otherInfo } = this.state;
    let detailList = [];
    dataSource && dataSource.map(item => detailList.push({
      tenderMaterialGuid: item.tenderMaterialGuid,
      amount: Number(item.amount)
    }));
    const formValues = this.refs.applyForm.getFieldsValue();
    const postData = {
      applyId: this.props.location.state.applyId,
      deptGuid: formValues.deptGuid,
      storageGuid: formValues.storageGuid,
      addrGuid: formValues.addrGuid,
      fstate: type,
      expectDate: moment(formValues.expectDate).format('YYYY-MM-DD'),
      treatmentRecord: otherInfo.treatmentRecord,
      operRecord: otherInfo.operRecord,
      detailList: detailList,
      tfRemark: formValues.tfRemark
    }
    return postData;
  }
  //保存
  save = () => {
    const postData = this.getPostData('00');

    if (!postData.operRecord || !postData.treatmentRecord) {
      return message.error('手术信息不能为空!')
    }
    fetchData(department.SAVE_AND_UPDATE_HIGHAPPLY, JSON.stringify(postData), data => {
      if (data.status) {
        message.success('操作成功!')
        hashHistory.push({
          pathname: '/department/highApply'
        })
      } else {
        message.error(data.msg);
      }
    }, 'application/json')
  }
  //提交
  submit = () => {
    const postData = this.getPostData('10');
    if (!postData.operRecord || !postData.treatmentRecord) {
      return message.error('手术信息不能为空!')
    }
    fetchData(department.SAVE_AND_UPDATE_HIGHAPPLY, JSON.stringify(postData), data => {
      if (data.status) {
        message.success('操作成功!')
        hashHistory.push({
          pathname: '/department/highApply'
        })
      } else {
        message.error(data.msg);
      }
    }, 'application/json')
  }
  //删除
  deleteRows = () => {
    const { dataSource, selected } = this.state;
    let newData = [];
    dataSource.map((item, index) => {
      if (!selected.includes(item.tenderMaterialGuid)) {
        return newData.push(item)
      } 
      return null;
    });
    let total = 0;
    newData.map(item => {
      let amount = typeof item.amount === 'undefined' ? 1 : item.amount
      return total += amount * item.purchasePrice;
    });
    document.querySelector('#total').innerHTML = total.toFixed(2);
    this.setState({
      dataSource: newData
    })
  }
  clear = (value) => {
    this.setState({
      dataSource: [],
      otherInfo: {}
    })
    this.props.location.state = Object.assign({}, this.props.location.state, { ...value, totalPrice: 0});
    document.querySelector('#total').innerHTML = 0;
  }
  render () {
    const { state } = this.props.location;
    const { dataSource } = this.state;
    const applyId = state.applyId;
    return (
      <div>
        <Breadcrumb style={styles.breadcrumb}>
          <Breadcrumb.Item><Link to='/department/highApply'>高值申请</Link></Breadcrumb.Item>
          <Breadcrumb.Item> { state.title } </Breadcrumb.Item>
        </Breadcrumb>
        <ApplyForm 
          ref='applyForm'
          data={state}
          type={'产品'}
          dataSource={dataSource}
          getOtherInfo={other => this.setState({otherInfo: other})}
          readonly={state.readonly}
          choseTemple={this.redirect.bind(this, '/department/highApply/template')}
          addFunc={this.redirect.bind(this, '/department/highApply/add')}
          delFunc={this.deleteRows}
          clearFunc={this.clear}
        />
        <ApplyDetailForm 
          getSelection={rows => this.setState({selected: rows})}
          totalPrice={state.totalPrice}
          dataSource={dataSource} 
          readonly={state.readonly} 
          rowKey={'tenderMaterialGuid'}
        />
        <Toolbar 
          readonly={state.readonly} 
          save={this.save} 
          submit={this.submit}
          url={department.EXPORT_HIGH_DETAILS}
          params={querystring.stringify({applyId: applyId})}
        />
      </div>
    )
  }
} 

module.exports = HighApplyDetails;