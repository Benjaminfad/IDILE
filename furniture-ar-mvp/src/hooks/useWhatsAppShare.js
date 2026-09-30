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
  title,
  description,
}) => {
  const safePhone = String(sellerPhone ?? '').replace(/\D/g, '')
  const message = encodeURIComponent(generateCustomQuoteMessage({
    product,
    title,
    description,
  }))

  return `https://wa.me/${safePhone}?text=${message}`
}

export const generateCustomQuoteMessage = ({ product, title, description }) => {
  const safeProduct = product ?? {}
  const requestTitle = String(title || '').trim()
  const details = String(description || '').trim()

  return `Hello ${safeProduct.seller}, I'd like to request a custom quote for ${safeProduct.name}.\n\nRequest: ${requestTitle}\n\nDetails: ${details}\n\nPlease let me know what information you need from me to proceed.`
}

export const generateInstagramDmLink = (profileValue = '') => {
  const value = String(profileValue).trim()
  if (!value) return ''

  let username = ''
  try {
    const parsed = new URL(value.startsWith('http') ? value : `https://${value}`)
    const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase()
    if (hostname === 'instagram.com') {
      username = parsed.pathname.split('/').filter(Boolean)[0] || ''
    } else if (hostname === 'ig.me') {
      const pathParts = parsed.pathname.split('/').filter(Boolean)
      username = pathParts[0] === 'm' ? pathParts[1] || '' : ''
    }
  } catch {
    username = value.replace(/^@/, '')
  }

  username = username.replace(/^@/, '').split(/[/?#]/)[0]
  return username ? `https://ig.me/m/${encodeURIComponent(username)}` : ''
}

export default generateWhatsAppLink
