export const formatCurrency = (amount: number, maxDecimals: number = 3): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals
  }).format(amount);
};
