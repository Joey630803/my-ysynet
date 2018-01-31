import React from 'react';
import { Upload, Icon,message } from 'antd';
import {pathConfig } from 'utils/tools';

class PicturesList extends React.Component {
  state = {
    fileList: [{
      uid: '-1',
      name: this.props.picname,
      url: pathConfig.YSYPATH + this.props.url,
    }],
    defaultpicurl:this.props.url
  };

  handleChange = ({ fileList }) => {
    if(fileList.length>1){
      fileList = [fileList[fileList.length-1]];
    }
    this.setState({ fileList})
    this.props.file(fileList)

  }
   
   beforeUpload = (file) => {
      const type = file.type === 'image/jpeg'|| file.type === 'image/png'|| file.type === 'image/bmp';
      if (!type) {
        message.error('您只能上传image/jpeg、png、bmp!');
      }
      const isLt5M = file.size / 1024 / 1024  < 5;
      if (!isLt5M) {
        message.error('图片不能大于 5MB!');
      }
      this.setState({defaultpicurl:'111'});
      return type && isLt5M;
    }

  render() {

    const {fileList } = this.state.defaultpicurl=== "" ||this.state.defaultpicurl=== undefined ? "":this.state;
    const fileListLength = this.state.defaultpicurl==="" ||this.state.defaultpicurl=== undefined ? 0 :fileList.length;
   
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={this.props.action}
          listType="picture-card"
          fileList={fileList}
          defaultFileList={fileList}
          onChange={this.handleChange}
          onRemove={this.props.onRemove}
          beforeUpload={this.beforeUpload}
        >
          {fileListLength >= 1 ? null : uploadButton}
        </Upload>
      </div>
    );
  }
}

export default PicturesList;