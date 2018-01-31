import React from 'react';
import { Table,message } from 'antd';
import querystring from 'querystring';
import { objCompare } from 'utils/tools'


class FetchTable extends React.Component {
  state = {
    data: [],
    pagination: {

    },
    loading: false,
  };
  getData = () => this.state.data;
  handleTableChange = (pagination, filters, sorter) => {
    const pager = this.state.pagination;
    const querys = this.props.query;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sidx: sorter.field,
      sord: sorter.order,
      ...querys,
      ...filters,
    });
  }
  componentWillReceiveProps = (nextProps) => {
    // console.log(this.props.query === nextProps.query);
    // if ( (nextProps.url !== this.props.url) ||
    //       !objCompare(nextProps.query, this.props.query)
    //   ) {
    //   this.fetch(nextProps.query, nextProps.url)
    // }
    if ((nextProps.url !== this.props.url) || 
      (typeof nextProps.query === 'string' ? nextProps.query !== this.props.query : !objCompare(nextProps.query, this.props.query))) {
        this.fetch(nextProps.query, nextProps.url)
    }
  }
  fetch = (params = {...this.props.query}, url = this.props.url) => {
    this.setState({ loading: true });
    if(url){
      fetch(url,{
        method: 'post',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({
          pagesize: this.props.pageSize || 15,
          ...params,
        })
      }).then(res => res.json())
        .then((data) => {
        if(!data.status){
          message.error(data.msg);
        }
        let pagination = this.state.pagination;
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = data.result.records;
        pagination.pageSize = this.props.pageSize || 15;
        if(!params.page) {
          pagination.current = 1;
        }
        if (typeof this.props.cb === 'function') {
          this.props.cb(data.result.rows);
        }
        this.setState({
          loading: false,
          data: data.result.rows || data.result,
          pagination,
        });
      }).catch(err => {
        this.setState({
          loading: false,
        });
        //message.error(err);
      })
    }
    else{
      this.setState({
        loading: false,
        data: []
      })
    }
  }
  componentDidMount() {
    this.fetch();
  }
  render() {
    return (
      <Table 
        bordered={true}
        columns={this.props.columns}
        size={this.props.size || 'small'}
        style={{marginTop: '10px'}}
        rowKey={this.props.rowKey}
        dataSource={this.props.data || this.state.data}
        pagination={(this.props.isPagination || typeof this.props.isPagination === 'undefined') ? this.state.pagination : false}
        loading={this.props.loading || this.state.loading}
        onChange={this.handleTableChange}
        rowClassName={this.props.rowClassName}
        rowSelection={this.props.rowSelection || null}
        scroll={this.props.scroll || { x: 1300 }}
        footer={this.props.footer || null}
      />
    );
  }
}

// FetchTable.propTypes = {
//   columns: React.PropTypes.array.isRequired,
//   rowKey: React.PropTypes.string.isRequired,
//   url: React.PropTypes.string.isRequired
// }

export default FetchTable;
