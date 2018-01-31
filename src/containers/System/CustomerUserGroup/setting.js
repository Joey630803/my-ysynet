import React from 'react';
import { Breadcrumb, TreeSelect, message } from 'antd';
import { Link } from 'react-router';
import { pathConfig,FetchPost } from 'utils/tools';
import querystring from 'querystring';

class UserSetting extends React.Component {
  state = {
    value:''
  };
  fetchList=(url,url2)=> {
      FetchPost(url)
      .then(response => {
        return response.json();
      })
      .then(d => {
        let result = d.result;
          const fdata = [],sdata=[];
          result.forEach((r) => {
            if(r.tfRemark==="客户中心"){
              fdata.push({
                key:r.menuId,
                value: r.menuId,
                label: r.menuName,
              });
            }else{
              sdata.push({
                key:r.menuId,
                value: r.menuId,
                label: r.menuName,
              });
            }
          })
            const data = [{
              label: '客户中心',
              value: '0-0',
              key: '0-0',
              children: fdata,
            }, {
              label: '运营中心',
              value: '0-1',
              key: '0-1',
              children: sdata
            }];
            this.setState({data:data})
           
          })
         
     
      .catch(e => console.log("Oops, error", e))

      FetchPost(url2, querystring.stringify({groupId:this.props.location.state.groupId}))
      .then(response => {
        return response.json();
      })
      .then(d => {
        let result = d.result;
          const data = [];
          result.forEach((r) => {
            data.push(r.menuId);
          });
          this.setState({value:data})
      })
      .catch(e => console.log("Oops, error", e))
}

  componentDidMount() {
    this.fetchList(pathConfig.MENULIST_URL,pathConfig.MENULISTBYGROUPID_URL)
  }
  onChange = (value) => {
    this.setState({ value });
     FetchPost(pathConfig.MENUUSERGROPSAVE_URL, querystring.stringify({groupId:this.props.location.state.groupId,menuIds:value}))
      .then(response => {
        return response.json();
      })
      .then(data => {
        if(data.status){
           this.setState({ value });
        }
        else{
          message.error(data.msg);
        }

      })
      .catch(e => console.log("Oops, error", e))
  }
  render() {
    const treeData = this.state.data;
    const tProps = {
      treeData,
      value: this.state.value,
      onChange: this.onChange,
      multiple: true,
      treeCheckable: true,
      searchPlaceholder: '请选择',
      style: {
        width: '100%',
        marginTop:'16px'
      },
    };
    return (
      <div>
        <Breadcrumb style={{fontSize: '1.1em'}}>
          <Breadcrumb.Item><Link to='/system/customerUserGroup'>用户组管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>配置权限</Breadcrumb.Item>
        </Breadcrumb>
        <TreeSelect {...tProps} />
      </div>
    )  
  }
}
module.exports = UserSetting;