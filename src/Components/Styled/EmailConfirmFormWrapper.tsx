import styled from 'styled-components';
import { Form } from 'antd';

/** App Theme */
import { colors } from '../../Themes/Colors';

const EmailConfirmFormWrapper = styled(Form)`
  display: flex;
  flex-flow: wrap row;
  max-width: 50%;
  width: 100%;
  border: 1px solid ${colors.grey};
  margin: 7% auto !important;
  padding: 42px 24px 50px !important;
  background: ${colors.white};
  justify-content: space-around;

  input {
    text-align: center;
  }
`;

export default EmailConfirmFormWrapper;
