export const centsToStr = (cents: number): string => {
  return (cents / 100).toFixed(2);
};

export const strToCents = (str: string): number => {
  return +str * 100;
};
