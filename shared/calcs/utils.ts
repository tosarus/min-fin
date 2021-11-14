import currency from 'currency.js';
import dayjs from 'dayjs';

export const sanitizeDate = (month: string) => dayjs(month).format('YYYY-MM-DD');

export const centsToStr = (cents: number): string => {
  return currency(cents, { fromCents: true }).format();
};

export const strToCents = (str: string): number => {
  return currency(str).intValue;
};

export const amountToValue = (amount: string): number => {
  return currency(amount).value;
};

export const valueToAmount = (value: number): string => {
  return currency(value).format();
};

export function dateOrderCompare<T extends { date: string; order: number }>(a: T, b: T) {
  const diff = Date.parse(b.date) - Date.parse(a.date);
  return diff !== 0 ? diff : b.order - a.order;
}

export function dateOrderPendingCompare<T extends { date: string; order: number; pending: boolean }>(a: T, b: T) {
  const diff = Number(b.pending) - Number(a.pending);
  return diff !== 0 ? diff : dateOrderCompare(a, b);
}

export function getMinDate(a: string, b: string) {
  return Date.parse(a) < Date.parse(b) ? a : b;
}

export function isValidMonth(month: string) {
  return dayjs(month).startOf('month').isSame(month);
}

export function previuosMonth(month: string) {
  return dayjs(month).subtract(1, 'month').format('YYYY-MM-DD');
}
