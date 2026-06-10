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
  const isDisabled = !phone

  return (
    <a
      href={isDisabled ? '#' : href}
      target={isDisabled ? undefined : '_blank'}
      rel={isDisabled ? undefined : 'noreferrer'}
      onClick={(event) => {
        if (isDisabled) event.preventDefault()
      }}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
        isDisabled
          ? 'cursor-not-allowed bg-slate-400 shadow-none'
          : 'bg-emerald-600 shadow-emerald-900/10 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md'
      } ${className}`}
    >
      {isDisabled ? 'Seller contact unavailable' : label}
    </a>
  )
}

export default WhatsAppButton
