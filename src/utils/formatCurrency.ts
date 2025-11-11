
export const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    // Format as millions
    const millions = amount / 1000000;
    const rounded = Math.round(millions * 10) / 10;
    return rounded % 1 === 0 ? `${rounded.toFixed(0)}m` : `${rounded.toFixed(1)}m`;
  } else if (amount >= 1000) {
    // Format as thousands
    const thousands = amount / 1000;
    const rounded = Math.round(thousands * 10) / 10;
    return rounded % 1 === 0 ? `${rounded.toFixed(0)}k` : `${rounded.toFixed(1)}k`;
  } else {
    // Format as is with 1 decimal place
    const rounded = Math.round(amount * 10) / 10;
    return rounded % 1 === 0 ? `${rounded.toFixed(0)}` : `${rounded.toFixed(1)}`;
  }
};
