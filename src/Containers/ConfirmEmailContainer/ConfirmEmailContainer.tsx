import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { Spin, Icon, Button, Form, notification, Input, Row, Col } from 'antd';

// amplify
import { Auth } from 'aws-amplify';

/** Presentational */
import FullWidthWrapper from '../../Components/Styled/FullWidthWrapper';

const FormWrapper = styled(Form)`
  display: flex;
  flex-flow: wrap row;
  max-width: 50%;
  width: 100%;
  border: 1px solid #ebedf0;
  margin: 7% auto !important;
  padding: 42px 24px 50px !important;
  background: #ffffff;
  justify-content: space-around;

  input {
    text-align: center;
  }
`;

type State = {
  username: string;
  loading: boolean;
  redirect: boolean;
  confirmationCode: string;
  error: string;
};

class ConfirmEmailContainer extends React.Component<RouteComponentProps, State> {
  state = {
    username: '',
    loading: false,
    redirect: false,
    confirmationCode: '',
    error: '',
  };

  componentDidMount() {
    if (this.props.location.search) {
      // get username from url params
      let username = this.props.location.search.split('=')[1];

      this.setState({ username });
    }
  }

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const { confirmationCode } = this.state;

    // show progress spinner
    this.setState({ loading: true });

    Auth.confirmSignUp(this.state.username, confirmationCode)
      .then(() => {
        this.handleOpenNotification('success', 'Succesfully confirmed!', 'You will be redirected to login in a few!');
      })
      .catch(err => {
        this.handleOpenNotification('error', 'Invalid code', err.message);
        this.setState({
          loading: false,
        });
      });
  };

  /**
   * @param  {string} - type
   * @param  {string} - title
   * @param  {string} - message
   *
   * @returns {void} - no value returned
   */
  handleOpenNotification = (type: string, title: string, message: string): void => {
    switch (type) {
      case 'success':
        notification['success']({
          message: title,
          description: message,
          placement: 'topRight',
          duration: 1.5,
          onClose: () => {
            if (type === 'success') {
              this.setState({ redirect: true });
            }
          },
        });
        break;

      case 'error':
        notification['error']({
          message: title,
          description: message,
          placement: 'topRight',
          duration: 1.5,
        });
        break;
    }
  };

  handleOnPaste = (event: React.ClipboardEvent) => {
    event.preventDefault();

    let code = event.clipboardData.getData('Text').trim();

    /** Update input */
    this.setState({ confirmationCode: code });
    // regex to check if string is numbers only
    const reg = new RegExp('^[0-9]+$');

    if (reg.test(code) && code.length === 6) {
      // code is a valid number
      console.log(code);
    }
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ confirmationCode: event.currentTarget.value });
  };

  validateCode = (code: string) => {
    const pattern = new RegExp('^[0-9]+$');

    if (code.length === 6) {
      const check = pattern.test(code);
      console.log(code, check);
    }
  };

  redirectAfterConfirmation = () => {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to={{ pathname: '/login' }} />;
    }

    return null;
  };

  render() {
    const { loading, error, confirmationCode } = this.state;
    const circularIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <FullWidthWrapper align="center">
        <FormWrapper onSubmit={this.handleSubmit}>
          <Col md={24} lg={18}>
            <div className="full-width">
              <h2>Check your email</h2>
              <p>We've sent a six­ digit confirmation code</p>
            </div>
            <Form.Item validateStatus={error && 'error'} help={error} label="Confirmation Code">
              <Input
                size="large"
                type="number"
                placeholder="Enter confirmation code"
                onChange={this.handleChange}
                onPaste={this.handleOnPaste}
                value={confirmationCode}
              />
            </Form.Item>
          </Col>
          <Col md={24} lg={12}>
            <Button type="primary" disabled={loading} htmlType="submit" size="large" className="signup-form-button">
              {loading ? <Spin indicator={circularIcon} /> : 'Confirm Email'}
            </Button>
          </Col>
        </FormWrapper>
        {this.redirectAfterConfirmation()}
      </FullWidthWrapper>
    );
  }
}

export default ConfirmEmailContainer;
