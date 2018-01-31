import React, { PropTypes } from 'react';
import { Button, Col } from 'antd';

const Toolbar = ({ readonly, params, save, submit, url }) => (
  <Col style={{textAlign: 'center', marginTop: 10}}>
    {
      readonly ? 
      <a href={`${url}?${params}`}><Button type="primary" icon='export'>导出</Button></a> :
      <span><Button onClick={save} type="primary">保存</Button><Button style={{marginLeft: 10}} onClick={submit}>提交</Button> </span>
    }
  </Col>
)

Toolbar.propTypes = {
  readonly: PropTypes.bool.isRequired,
  params: PropTypes.string,
  save: PropTypes.func,
  submit: PropTypes.func
}

export default Toolbar;