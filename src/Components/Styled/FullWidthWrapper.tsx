import styled from 'styled-components';

const FullWidthWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  text-align: ${(props: { align?: string }) => (props.align ? props.align : '')};
`;

export default FullWidthWrapper;
