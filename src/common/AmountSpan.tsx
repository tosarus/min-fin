import React from 'react';
import styled from '@emotion/styled';
import { colors } from '@mui/material';

const Span = styled.span(({ amount }: { amount: string }) => ({
  fontWeight: 'bolder',
  fontStyle: 'italic',
  color: amount.includes('-') ? colors.red[500] : colors.green[500],
}));

interface AmountSpanProps {
  amount: string;
  className?: string;
}

export const AmountSpan = ({ amount, ...rest }: AmountSpanProps) => {
  return (
    <Span amount={amount} {...rest}>
      {amount}
    </Span>
  );
};
