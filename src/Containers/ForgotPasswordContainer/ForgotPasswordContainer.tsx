import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';

import { Auth } from 'aws-amplify';

// ant imports
import { Form, Icon, Spin, Input, Button, notification } from 'antd';

const FormItem = Form.Item;

type Props = {
  form: any;
};

type State = {
  username: string;
  redirect: boolean;
  loading: boolean;
};

class ForgotPasswordContainer extends React.Component<Props, State> {
  state = {
    username: '',
    redirect: false,
    loading: false
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    this.props.form.validateFields(
      (
        err: {
          message: string;
        },
        values: { username: string }
      ) => {
        if (!err) {
          let { username } = values;

          this.setState({
            loading: true,
            username
          });

          Auth.forgotPassword(username)
            .then(data => {
              this.handleOpenNotification(
                'success', // type
                'Account confirmed successfully!', // title
                'Redirecting you in a few!'
              );
            })
            .catch(err => {
              this.handleOpenNotification(
                'error', // type
                'User confirmation failed', // title
                err.message // message
              );

              this.setState({ loading: false });
            });
        }
      }
    );
  };

  /**
   * @param  {string} - type
   * @param  {string} - title
   * @param  {string} - message
   *
   * @returns {void} - no value returned
   */
  handleOpenNotification = (
    type: string,
    title: string,
    message: string
  ): void => {
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
          }
        });
        break;

      case 'error':
        notification['error']({
          message: title,
          description: message,
          placement: 'topRight',
          duration: 1.5
        });
        break;
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, redirect, username } = this.state;
    const circularIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: 'Please input your username!'
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Username"
              />
            )}
          </FormItem>
          <FormItem className="text-center">
            {loading ? (
              <Spin indicator={circularIcon} />
            ) : (
              <React.Fragment>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Confirm username
                </Button>
                <Link to="/login">Ooh! Wait! I've remembered!</Link>
              </React.Fragment>
            )}
          </FormItem>
        </Form>
        {redirect && (
          <Redirect
            to={{
              pathname: '/reset-password',
              search: `?username=${username}`
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Form.create()(ForgotPasswordContainer);
