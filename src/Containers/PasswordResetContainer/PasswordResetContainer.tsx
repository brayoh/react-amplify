import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

// aws amplify
import { Auth } from 'aws-amplify';

// ant imports
import { Form, Input, Icon, Button, notification, Popover, Spin } from 'antd';

type Props = RouteComponentProps & {
  form: any;
};

const FormItem = Form.Item;

class PasswordResetContainer extends React.Component<Props> {
  state = {
    confirmDirty: false,
    redirect: false,
    loading: false,
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

  handleConfirmBlur = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (
    rule: object,
    value: string,
    callback: (message?: string) => void
  ) => {
    const form = this.props.form;

    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (
    rule: object,
    value: string,
    callback: (message?: string) => void
  ) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    this.props.form.validateFieldsAndScroll(
      (err: Error, values: { password: string; code: string }) => {
        if (!err) {
          let { password, code } = values;
          let username = this.props.location.search.split('=')[1];

          Auth.forgotPasswordSubmit(
            username.trim(),
            code.trim(),
            password.trim()
          )
            .then(() => {
              this.handleOpenNotification(
                'success', // type
                'Success!', // title
                'Password reset successful, Redirecting you in a few!'
              );
            })
            .catch(err => {
              this.handleOpenNotification(
                'error', // type
                'Error reseting password', // title
                err.message // message
              );
              this.setState({ loading: false });
            });

          // show loader
          this.setState({ loading: true });
        }
      }
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { redirect } = this.state;

    const title = 'Password Policy';
    const passwordPolicyContent = (
      <React.Fragment>
        <h4>Your password should contain: </h4>
        <ul>
          <li>Minimum length of 8 characters</li>
          <li>Numerical characters (0-9)</li>
          <li>Special characters</li>
          <li>Uppercase letter</li>
          <li>Lowercase letter</li>
        </ul>
      </React.Fragment>
    );

    const circularIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} className="signup-form">
          <div className="text-center">
            <p>Check your email for the confirmation code</p>
          </div>
          <FormItem>
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: 'Please input your confirmation code!',
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Enter your verification code"
              />
            )}
          </FormItem>

          <FormItem>
            <Popover
              placement="right"
              title={title}
              content={passwordPolicyContent}
              trigger="focus"
            >
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your Password!' },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="New Password"
                />
              )}
            </Popover>
          </FormItem>

          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="Confirm Password"
                onBlur={this.handleConfirmBlur}
              />
            )}
          </FormItem>

          <FormItem className="text-center">
            {this.state.loading ? (
              <Spin indicator={circularIcon} />
            ) : (
              <React.Fragment>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="signup-form-button"
                >
                  Reset password
                </Button>
              </React.Fragment>
            )}
          </FormItem>
        </Form>
        {redirect && <Redirect to={{ pathname: '/login' }} />}
      </React.Fragment>
    );
  }
}

export default Form.create()(PasswordResetContainer);
