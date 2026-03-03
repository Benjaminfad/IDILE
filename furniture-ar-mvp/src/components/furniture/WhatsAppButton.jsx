import { generateWhatsAppLink } from '../../hooks/useWhatsAppShare'

function WhatsAppButton({
  product,
  sellerName,
  sellerPhone = '',
  className = '',
  label = 'Inquire on WhatsApp',
}) {
  const phone = sellerPhone || product?.sellerPhone || ''
  const normalizedProduct = {
    ...product,
    seller: sellerName ?? product?.seller ?? 'Seller',
    name: product?.name ?? 'this product',
    price: product?.price ?? '\u20A60',
    location: product?.location ?? 'your location',
  }

  const href = generateWhatsAppLink(normalizedProduct, phone)

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 ${className}`}
    >
      {label}
    </a>
  )
}

export default WhatsAppButton
