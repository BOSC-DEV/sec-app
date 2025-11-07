
export const formatCurrency = (amount: number): string => {
  // Always show up to 3 decimal places universally
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(amount);
};
