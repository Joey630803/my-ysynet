/**
 * @file 供应商详情--许可证
 */
import React from 'react';
import { Row, Col } from 'antd';
import { pathConfig } from 'utils/tools';
class Permit extends React.Component{
    render(){
        return (
            <div>
                {
                    this.props.children
                    ||
                    <div>
                        <Row>
                            <Col span={3}></Col>
                            <Col span={18}>
                                <div>
                                    {
                                        this.props.src === 'undefined'?
                                        <p style={{textAlign:'center'}}>暂无图片</p>
                                        :
                                        <img src={pathConfig.YSYPATH+this.props.src} 
                                            title='许可证' alt='许可证'
                                        />
                                    }
                                </div>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        )
    }
}
module.exports = Permit;