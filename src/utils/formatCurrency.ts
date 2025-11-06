
export const formatCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount);
  
  // For amounts less than 1, show up to 3 decimals
  if (absAmount < 1 && absAmount > 0) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3
    }).format(amount);
  }
  
  // For regular amounts, show no decimals
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
