
export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', options).format(date);
};

export const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat('es-ES', options).format(number);
};

export const truncateString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};
