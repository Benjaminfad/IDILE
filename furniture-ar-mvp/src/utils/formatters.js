export function parsePriceToNumber(price) {
  const numeric = String(price ?? '')
    .replace(/[^\d]/g, '')
    .trim()
  return Number(numeric || 0)
}

export function formatNaira(value, locale = 'en-NG') {
  const amount =
    typeof value === 'number' ? value : parsePriceToNumber(String(value ?? ''))

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}
