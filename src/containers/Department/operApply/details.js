/**
 * @file 创建手术耗材申请
 */
import React, { Component } from 'react';
import { Breadcrumb, message } from 'antd';
import { apply } from 'component/Department';
import { Link, hashHistory } from 'react-router';
import { department } from 'api';//暂时用用
import { fetchData } from 'utils/tools';
import querystring from 'querystring';
import moment from 'moment';
const { ApplyForm, BrandForm, Toolbar } = apply;

const styles = {
  breadcrumb: {
    fontSize: '1.1em'
  }
}

class OperApplyDetails extends Component {
  state = {
    dataSource: this.props.location.state.rows || [],
    selected: [],
    otherInfo: {}
  }
  componentDidMount = () => {
    const { rows, applyId, otherInfo, isEdit } = this.props.location.state;
    if (!rows && !isEdit) {
      fetchData(department.SEARCH_OPER_DETAILS, querystring.stringify({applyId: applyId}), data => {
        this.setState({
          dataSource: data.result
        })
      })
    }
    if (otherInfo) {
      this.setState({ otherInfo });
    }
  }
  getPostData = type => {
    const { dataSource , otherInfo} = this.state;
    let operDetailList = [];
    if (dataSource) {
      dataSource.map(item => operDetailList.push({
        fOrgId: item.fOrgId,
        tfBrand: item.tfBrand,
        lxr: item.lxr,
        lxdh: item.lxdh,
        comboGuid: item.comboGuid
      }))
    }
    let postData = {};
    this.refs.applyForm.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formValues = values;
        postData = {
          applyId: this.props.location.state.applyId,
          deptGuid: formValues.deptGuid,
          storageGuid: formValues.storageGuid,
          addrGuid: formValues.addrGuid,
          fstate: type,
          expectDate: moment(formValues.expectDate).format('YYYY-MM-DD'),
          treatmentRecord: otherInfo.treatmentRecord,
          operRecord: otherInfo.operRecord,
          operDetailList: operDetailList,
          tfRemark: formValues.tfRemark
        }
        if (!postData.operRecord || !postData.treatmentRecord) {
          return message.error('手术信息不能为空!')
        }
        fetchData(department.SAVE_AND_UPDATE_OPER, JSON.stringify(postData), data => {
          if (data.status) {
            message.success('操作成功!')
            hashHistory.push({
              pathname: '/department/operApply'
            })
          } else {
            message.error(data.msg);
          }
        }, 'application/json')
      }
    });
  }
  //提交
  submit = () => {
    this.getPostData('10');
  }
  //保存
  save = () => {
    this.getPostData('00');
  }
  redirect = (url, values) => {
    const { dataSource , otherInfo} = this.state;
    const { state } = this.props.location;
    const detailList = dataSource || [];
    const comboGuids = detailList ? detailList.map(item => item.comboGuid) : [];
    hashHistory.push({
      pathname: url,
      state: {fromTo: {...state, back: '/department/operApply/addBrand'}, values, comboGuids, detailList, otherInfo}
    })
  }
   //删除
   deleteRows = () => {
    let { dataSource, selected } = this.state;
    let newData = [];
    dataSource.map((item, index) => {
      if (!selected.includes(item.comboGuid)) {
        newData.push(item)
      }
      return newData;
    });
    this.setState({
      dataSource: newData
    })
  }
  clear = (value) => {
    this.setState({
      dataSource: [],
      otherInfo: {}
    })
    this.props.location.state = Object.assign({}, this.props.location.state, { ...value });
  }
  render () {
    const { state } = this.props.location;
    const { dataSource } = this.state;
    const applyId = state.applyId;
    return (
      <div>
        <Breadcrumb style={styles.breadcrumb}>
          <Breadcrumb.Item><Link to='/department/operApply'>手术申请</Link></Breadcrumb.Item>
          <Breadcrumb.Item> { state.title } </Breadcrumb.Item>
        </Breadcrumb>
        <ApplyForm 
          dataSource={dataSource}
          ref={'applyForm'}
          data={state}
          readonly={state.readonly}
          type={'品牌'}
          getOtherInfo={other => this.setState({otherInfo: other})}
          addFunc={this.redirect.bind(this, '/department/operApply/addBrand')}
          delFunc={this.deleteRows}
          clearFunc={this.clear}
        />
        <BrandForm 
          rowKey={'comboGuid'}
          dataSource={this.state.dataSource}
          getSelection={rows => this.setState({selected: rows})}
        />  
        <Toolbar 
          url={department.EXPORT_APPLY_DETAIL}
          readonly={state.readonly} 
          save={this.save} 
          params={querystring.stringify({applyId: applyId})}
          submit={this.submit}/>
      </div>
    )
  }
} 

module.exports = OperApplyDetails;