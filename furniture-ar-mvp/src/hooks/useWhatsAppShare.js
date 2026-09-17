import { formatNaira } from '../utils/formatters'
import { isQuoteProduct } from '../utils/productDisplay'

export const generateWhatsAppLink = (product, sellerPhone) => {
  const safeProduct = product ?? {}
  const safePhone = String(sellerPhone ?? '').replace(/\D/g, '')
  const formattedPrice = formatNaira(safeProduct.price ?? 0)

  const text = isQuoteProduct(safeProduct)
    ? `Hello ${safeProduct.seller}, I'm interested in the ${safeProduct.name} I viewed on your app. I'd like to request a quote based on my space and specifications. Please let me know what information you need from me to proceed.`
    : `Hello ${safeProduct.seller}, I'm interested in the ${safeProduct.name} (${formattedPrice}) I viewed on your app. Is it available? I'd love to know more about delivery to ${safeProduct.location}.`

  const message = encodeURIComponent(
    text,
  )

  return `https://wa.me/${safePhone}?text=${message}`
}

export const generateCustomQuoteWhatsAppLink = ({
  product,
  sellerPhone,
  description,
  files = [],
}) => {
  const safeProduct = product ?? {}
  const safePhone = String(sellerPhone ?? '').replace(/\D/g, '')
  const fileList = files.length > 0
    ? `\n\nReference files selected: ${files.map((file) => file.name).join(', ')}`
    : ''
  const details = String(description || '').trim()
  const descriptionText = details ? `\n\nDesign notes: ${details}` : ''

  const message = encodeURIComponent(
    `Hello ${safeProduct.seller}, I'm interested in customizing the ${safeProduct.name} I viewed on your app. I'd like to share my preferred design references and specifications.${descriptionText}${fileList}\n\nPlease let me know what information you need from me to proceed.`,
  )

  return `https://wa.me/${safePhone}?text=${message}`
}

export default generateWhatsAppLink
