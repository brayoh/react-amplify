import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';

// aws amplify
import { Auth } from 'aws-amplify';

// ant imports
import { Form, Icon, Spin, Input, Button, Checkbox, notification } from 'antd';

// stylesheet
import './LoginContainer.css';

type Props = {
  form: any;
};

type State = {
  redirect: boolean;
  loading: boolean;
};

const FormItem = Form.Item;

class LoginContainer extends React.Component<Props, State> {
  state = {
    redirect: false,
    loading: false,
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    this.props.form.validateFields((err: Error, values: { username: string; password: string }) => {
      if (!err) {
        let { username, password } = values;

        this.setState({ loading: true });

        Auth.signIn(username, password)
          .then(user => {
            // this.setState({ user })
            this.handleOpenNotification(
              'success', // type
              'Succesfully logged in!', // title
              'Logged in successfully, Redirecting you in a few!'
            );

            console.log(user);
          })
          .catch(err => {
            console.log(err);
            this.handleOpenNotification(
              'error', // type
              'Login failed', // title
              err.message // message
            );

            this.setState({ loading: false });
          });
      }
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, redirect } = this.state;
    const circularIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ],
            })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
              />
            )}
          </FormItem>
          <FormItem className="text-center">
            <React.Fragment>
              <Link className="login-form-forgot" to="/forgot-password">
                Forgot password
              </Link>
              <Button type="primary" disabled={loading} htmlType="submit" className="login-form-button">
                {loading ? <Spin indicator={circularIcon} /> : 'Log in'}
              </Button>
              Or <Link to="/signup">register now!</Link>
            </React.Fragment>
          </FormItem>
        </Form>
        {redirect && (
          <Redirect
            to={{
              pathname: '/home',
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Form.create()(LoginContainer);
