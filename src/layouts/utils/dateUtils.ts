import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const yearAgo = dayjs().subtract(1, 'year');

export function withinMonthFilter(month: string) {
  const from = dayjs(month);
  const to = from.add(1, 'month');
  return ({ date }: { date: string }) => dayjs(date).isBetween(from, to, 'day', '[)');
}

export function sameYearFilter() {
  const y = dayjs();
  return ({ date }: { date: string }) => dayjs(date).isSame(y, 'year');
}

export function sameMonthFilter(month?: string) {
  const m = dayjs(month);
  return (v: { month: string }) => m.isSame(v.month, 'month');
}

export function getPreviousMonth(month: string) {
  return dayjs(month).subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
}

export function getNextMonth(month: string) {
  const now = dayjs().startOf('month');
  if (now.isBefore(month, 'month')) {
    return '';
  }
  return dayjs(month).add(1, 'month').startOf('month').format('YYYY-MM-DD');
}

export function getCurrentMonth() {
  return dayjs().startOf('month').format('YYYY-MM-DD');
}

export function fractionOfMonth(month: string) {
  const now = dayjs();
  if (now.isSame(month, 'month')) {
    return now.date() / dayjs(month).endOf('month').date();
  } else {
    return 0;
  }
}

export function formatMonth(month?: string) {
  return dayjs(month).format('MMMM, YYYY');
}

export function formatShortMonth(month: string) {
  return dayjs(month).format('MMM, YY');
}

export function formatDate(date?: string) {
  return dayjs(date).format('YYYY-MM-DD');
}

export function formatShortDate(date?: string) {
  const dd = dayjs(date);
  return dd.isAfter(yearAgo) ? dd.format('MMM D') : dd.format('MMM D (YYYY)');
}

export function calculateMonthRange(count: number, month?: string) {
  return [...Array(count).keys()].map((i) =>
    dayjs(month)
      .startOf('month')
      .subtract(count - i - 1, 'month')
      .format('YYYY-MM-DD')
  );
}
