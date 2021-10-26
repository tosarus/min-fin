import currency from 'currency.js';

export const centsToStr = (cents: number): string => {
  return currency(cents, { fromCents: true }).format();
};

export const strToCents = (str: string): number => {
  return currency(str).intValue;
};

export function dateOrderCompare<T extends { date: string; order: number }>(a: T, b: T) {
  const diff = Date.parse(b.date) - Date.parse(a.date);
  return diff !== 0 ? diff : b.order - a.order;
}

export function getMinDate(a: string, b: string) {
  return Date.parse(a) < Date.parse(b) ? a : b;
}
