import styled from 'styled-components';
import { Form } from 'antd';

const EmailConfirmFormWrapper = styled(Form)`
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

export default EmailConfirmFormWrapper;
