import React from 'react';
import { Col ,Row} from 'antd';
class Welcome extends React.Component {

  render() {

    return (
      
      <div>
          <Row>
            <Col style={{textAlign:'center',marginTop:40}}>
            <h2>医商云医用物资管理与服务平台</h2>
            <p style={{marginBottom:30,marginTop:30}}>以云平台为中心，建立行业标准化信息，打通需求、供应、监管、使用、生产全流程的生态链。</p>

            <img src={require("../assets/home2.png")} alt=""/>
            </Col>
          </Row>
      </div>
    );
  }
  }

module.exports = Welcome;