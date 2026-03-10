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
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${
        isDisabled
          ? 'cursor-not-allowed bg-slate-400'
          : 'bg-emerald-600 hover:bg-emerald-700'
      } ${className}`}
    >
      {isDisabled ? 'Seller contact unavailable' : label}
    </a>
  )
}

export default WhatsAppButton
