import styled, {css} from 'styled-components';
import {color, space, buttonStyle} from 'styled-system';

export const Button = styled.button`
  background: transparent;
  border-radius: 14px;
  border: 3.8px solid #76a5af;
  color: #fff;
  margin: centered;
  padding: 0.25em 1em;

  ${props =>
    props.primary &&
    css`
      background: blue;
      color: #76a5af;
    `}
`;
export const Box = styled.div`
  margin-bottom: 14px;

  ${color}
  ${space}
  ${buttonStyle}
`;
