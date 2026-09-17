import { formatNaira } from './formatters'

export const DEFAULT_DIMENSION_NOTE =
  'Final dimensions and measurements will be confirmed before production.'

export const DEFAULT_MATERIAL_NOTE =
  "Material selection depends on the customer's preferred specification and budget. Available options may include different grades of board/wood, countertop materials, hardware, hinges, handles and other fittings."

export function isQuoteProduct(product = {}) {
  return product?.priceMode === 'quote'
}

export function formatProductPrice(product = {}) {
  return isQuoteProduct(product) ? 'Request a quote' : formatNaira(product?.price ?? 0)
}

export function getAvailabilityLabel(product = {}) {
  return product?.availabilityType === 'made-to-order' ? 'Made to order' : 'In stock'
}

export function getDimensionNote(product = {}) {
  return product?.dimensionNote || DEFAULT_DIMENSION_NOTE
}

export function getMaterialNote(product = {}) {
  return product?.materialNote || DEFAULT_MATERIAL_NOTE
}
