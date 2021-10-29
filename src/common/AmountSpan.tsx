import React from 'react';
import styled from '@emotion/styled';
import { colors } from '@mui/material';

interface SpanProps {
  amount: string;
  noColor?: boolean;
}
const Span = styled.span(({ amount, noColor = false }: SpanProps) => ({
  fontWeight: 'bolder',
  fontStyle: 'italic',
  color: noColor ? 'inherit' : amount.includes('-') ? colors.red[500] : colors.green[500],
}));

interface AmountSpanProps extends SpanProps {
  className?: string;
}

export const AmountSpan = ({ amount, noColor, ...rest }: AmountSpanProps) => {
  return (
    <Span amount={amount} noColor={noColor} {...rest}>
      {amount}
    </Span>
  );
};
