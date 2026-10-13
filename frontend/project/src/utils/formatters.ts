/**
 * Utility functions for ship naming and currency formatting across PortLink
 */

export const formatShipName = (
  rawName?: string,
  source?: string,
  destination?: string
): string => {
  if (!rawName || rawName.trim() === '') {
    if (source && destination) {
      return `M/V Ship-${source}-${destination}`;
    }
    return 'M/V Ocean Vessel';
  }

  let clean = rawName.trim();
  
  // If name doesn't start with M/V, MV, or Vessel, prefix with M/V for clean maritime display
  if (!/^(M\/V|MV|SS|MT|MS)\s+/i.test(clean)) {
    clean = `M/V ${clean}`;
  }
  
  return clean;
};

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'SGD', symbol: 'S$', label: 'SGD (S$)' },
  { code: 'AED', symbol: 'AED', label: 'AED (د.إ)' },
] as const;

export type CurrencyCode = typeof SUPPORTED_CURRENCIES[number]['code'];

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return '$0';
  const curr = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  return `${curr.symbol}${amount.toLocaleString()}`;
};
