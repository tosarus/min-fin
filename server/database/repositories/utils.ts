import currency from 'currency.js';

export const centsToStr = (cents: number): string => {
  return currency(cents, { fromCents: true }).format();
};

export const strToCents = (str: string): number => {
  return currency(str).intValue;
};
