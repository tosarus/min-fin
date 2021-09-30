import React from 'react';
import { useLocation } from 'wouter';
import { Title } from '../common';

export const NotFound = () => {
  const [loc] = useLocation();
  return <Title>{`Page at ${loc} not ready yet!`}</Title>;
};
