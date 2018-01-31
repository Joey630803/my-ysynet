/**
 * 反馈弹出框
 */
import { Modal } from 'antd';

class BaseModal extends React.Component{
    state = {
        loading: false,
        visible: false,
    }
    showModal = () => {
        this.setState({
        visible: true,
        });
        handleOk = () => {
            this.setState({ loading: true });
            setTimeout(() => {
            this.setState({ loading: false, visible: false });
            }, 3000);
        }
        handleCancel = () => {
            this.setState({ visible: false });
        }
    }
  render() {
    return (
      <Modal
        visible={this.state.visible}
        title={this.props.title}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
        <Button key="back" size="large" onClick={this.handleCancel}>Return</Button>,
        <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
            Submit
        </Button>
        ]}
      >
        {this.props.content}
      </Modal>
    );
  }

}