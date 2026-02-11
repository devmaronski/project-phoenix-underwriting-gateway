/**
 * Formatting utilities for display values.
 */

/**
 * Formats a date string to readable format.
 * @example formatDate("2025-01-15T10:30:00Z") → "Jan 15, 2025"
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Formats a number as USD currency.
 * @example formatCurrency(250000) → "$250,000.00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Formats a percentage with optional decimal places.
 * @example formatPercent(6.5) → "6.5%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
