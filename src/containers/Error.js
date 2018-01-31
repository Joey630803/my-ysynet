import React from 'react'
import { Button } from 'antd';
class PageNotFound extends React.Component {
  render() {
    return (
      <div style={{marginLeft:'20%',marginRight:0,marginTop:'10%', height: '100%'}}>
        <div>
          <div style={{minHeight: '500px', height: '80%',backgroundRepeat:'no-repeat',backgroundImage:'url(https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg)'}}>
   

            <div style={{marginLeft:'50%'}}>
              <h1 style={{color: '#434e59',fontSize: '72px',fontWeight: '600',lineHeight: '72px',marginBottom: '24px'}}>404</h1>
              <div style={{color: 'rgba(0, 0, 0, 0.45)',fontSize: '20px',fontWeight: '600',lineHeight: '28px',marginBottom: '16px'}}>抱歉，你访问的页面不存在</div>
              <div>
                <a href="#/home">
                <Button type="primary"><span>返回首页</span></Button></a>
                <Button type="primary" onClick={()=>history.go(-1)} style={{marginLeft:8}}><span>返回上一页</span></Button>
              </div>
            </div>
            </div>
            </div>
         </div>
    )
  }
}

module.exports = PageNotFound;