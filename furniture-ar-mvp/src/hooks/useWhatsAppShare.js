import { formatNaira } from '../utils/formatters'

export const generateWhatsAppLink = (product, sellerPhone) => {
  const safeProduct = product ?? {}
  const safePhone = String(sellerPhone ?? '').replace(/\D/g, '')
  const formattedPrice = formatNaira(safeProduct.price ?? 0)

  const message = encodeURIComponent(
    `Hello ${safeProduct.seller}, I'm interested in the ${safeProduct.name} (${formattedPrice}) I viewed on your app. Is it available? I'd love to know more about delivery to ${safeProduct.location}.`,
  )

  return `https://wa.me/${safePhone}?text=${message}`
}

export default generateWhatsAppLink
