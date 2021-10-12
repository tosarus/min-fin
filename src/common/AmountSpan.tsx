import React from 'react';
import styled, { CSSObject } from '@emotion/styled';
import { colors } from '@mui/material';

export const amountSpanStyle = (amount: string): CSSObject => ({
  fontWeight: 'bolder',
  fontStyle: 'italic',
  color: amount.includes('-') ? colors.red[500] : colors.green[500],
});

const Span = styled.span(({ amount }: { amount: string }) => amountSpanStyle(amount));

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
