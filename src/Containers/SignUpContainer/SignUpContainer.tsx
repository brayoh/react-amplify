import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';

// aws amplify
import { Auth } from 'aws-amplify';

// ant imports
import { Form, Input, Icon, Button, notification, Popover, Spin } from 'antd';

// stylesheet
import './SignUpContainer.css';

type Props = {
  form: any;
};

type State = {
  confirmDirty: boolean;
  redirect: boolean;
  loading: boolean;
  digits: boolean;
  uppercase: boolean;
  lowercase: boolean;
  symbols: boolean;
  min: boolean;
  email: string;
};

type UserFormData = {
  fname: string;
  lname: string;
  password: string;
  email: string;
  phoneNumber: number;
};

const passwordValidator = require('password-validator');

const FormItem = Form.Item;
// create a password schema
const schema = new passwordValidator();

schema
  .is()
  .min(8) // Minimum length 8
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits() // Must have digits
  .has()
  .symbols(); // Must have symbols

class SignUpContainer extends React.Component<Props, State> {
  state = {
    confirmDirty: false,
    redirect: false,
    loading: false,
    digits: false,
    uppercase: false,
    lowercase: false,
    symbols: false,
    min: false,
    email: '',
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

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    this.props.form.validateFieldsAndScroll((err: Error, values: UserFormData) => {
      if (!err) {
        let { fname, lname, password, email, phoneNumber } = values;

        // show loader
        this.setState({ loading: true });

        Auth.signUp({
          username: email,
          password,
          attributes: {
            email,
            name: `${fname} ${lname}`,
            phone_number: phoneNumber,
          },
        })
          .then(() => {
            this.handleOpenNotification(
              'success', // type
              'Succesfully signed up user!', // title
              'Account created successfully, Redirecting you in a few!'
            );
            this.setState({ email });
          })
          .catch(err => {
            this.handleOpenNotification(
              'error', // type
              'Error signing up user', // title
              err.message // message
            );
            this.setState({
              loading: false,
            });
          });
      }
    });
  };

  handleConfirmBlur = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule: object, value: string, callback: (message?: string) => void) => {
    const form = this.props.form;

    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule: object, value: string, callback: (message?: string) => void) => {
    const form = this.props.form;
    const validationRulesErrors = schema.validate(value, { list: true });

    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    if (validationRulesErrors.length > 0) {
      callback(this.formatPasswordValidateError(validationRulesErrors));
    } else {
      this.setState({
        min: true,
        lowercase: true,
        uppercase: true,
        symbols: true,
        digits: true,
      });
    }

    callback();
  };

  formatPasswordValidateError = (errors: Array<string>) => {
    let validationError = '';

    for (let i = 0; i < errors.length; i++) {
      if (errors[i] === 'min') {
        validationError = 'password length should be a at least 8 characters';

        this.setState({ min: false });

        break;
      } else if (errors[i] === 'lowercase') {
        validationError = 'password should contain lowercase letters';

        this.setState({ min: true, lowercase: false });

        break;
      } else if (errors[i] === 'uppercase') {
        validationError = 'password should contain uppercase letters';

        this.setState({ min: true, lowercase: true, uppercase: false });

        break;
      } else if (errors[i] === 'digits') {
        validationError = 'password should contain digits';

        this.setState({
          min: true,
          lowercase: true,
          uppercase: true,
          digits: false,
        });

        break;
      } else if (errors[i] === 'symbols') {
        validationError = 'password should contain symbols';

        this.setState({
          min: true,
          lowercase: true,
          uppercase: true,
          digits: true,
          symbols: false,
        });

        break;
      }
    }

    return validationError;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { redirect, loading, min, digits, uppercase, lowercase, symbols } = this.state;

    const title = 'Password Policy';
    const passwordPolicyContent = (
      <React.Fragment>
        <h4>Your password should contain: </h4>
        <ul>
          <li className={min ? 'strike-through' : ''}>Minimum length of 8 characters</li>
          <li className={digits ? 'strike-through' : ''}>Numerical characters (0-9)</li>
          <li className={symbols ? 'strike-through' : ''}>Special characters</li>
          <li className={uppercase ? 'strike-through' : ''}>Uppercase letter</li>
          <li className={lowercase ? 'strike-through' : ''}>Lowercase letter</li>
        </ul>
      </React.Fragment>
    );

    const circularIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} className="signup-form">
          <FormItem>
            {getFieldDecorator('fname', {
              rules: [
                {
                  required: true,
                  message: 'Please input your first name!',
                },
              ],
            })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="First Name" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('lname', {
              rules: [
                {
                  required: true,
                  message: 'Please input your last name!',
                },
              ],
            })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Last Name" />)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your email!' }],
            })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('phoneNumber', {
              rules: [
                {
                  required: true,
                  message: 'Please input your phone number!',
                },
              ],
            })(
              <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Phone Number" />
            )}
          </FormItem>

          <FormItem>
            <Popover placement="right" title={title} content={passwordPolicyContent} trigger="focus">
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your Password!' },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
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
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Confirm Password"
                onBlur={this.handleConfirmBlur}
              />
            )}
          </FormItem>

          <FormItem className="text-center">
            <React.Fragment>
              <Button type="primary" disabled={loading} htmlType="submit" className="signup-form-button">
                {loading ? <Spin indicator={circularIcon} /> : 'Register'}
              </Button>
              Or <Link to="/login">login to your account!</Link>
            </React.Fragment>
          </FormItem>
        </Form>
        {redirect && (
          <Redirect
            to={{
              pathname: '/verify-code',
              search: `?email=${this.state.email}`,
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Form.create()(SignUpContainer);
