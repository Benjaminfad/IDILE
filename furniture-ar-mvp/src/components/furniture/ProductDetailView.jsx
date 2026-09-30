import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductMediaTabs from './ProductMediaTabs'
import RequestQuoteButton, { CloseIcon, InstagramIcon, WhatsAppIcon } from './RequestQuoteButton'
import DimensionsBadge from '../ui/DimensionsBadge'
import {
  generateCustomQuoteMessage,
  generateCustomQuoteWhatsAppLink,
  generateInstagramDmLink,
} from '../../hooks/useWhatsAppShare'
import {
  formatProductPrice,
  getAvailabilityLabel,
  getMaterialNote,
  isQuoteProduct,
} from '../../utils/productDisplay'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  )
}

function CustomizationModal({
  open,
  onClose,
  product,
  sellerName,
  sellerPhone,
  instagramUrl,
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const hasSellerPhone = Boolean(sellerPhone)
  const instagramDmUrl = generateInstagramDmLink(instagramUrl)
  const hasContactChannel = hasSellerPhone || Boolean(instagramDmUrl)

  if (!open) return null

  const handleSubmit = async (event, channel) => {
    event.preventDefault()
    if (!title.trim() || !description.trim()) {
      setError('Add a title and description for your request.')
      return
    }

    const normalizedProduct = {
      ...product,
      seller: sellerName ?? product?.seller ?? 'Seller',
      name: product?.name ?? 'this product',
    }

    if (channel === 'whatsapp' && hasSellerPhone) {
      const href = generateCustomQuoteWhatsAppLink({
        product: normalizedProduct,
        sellerPhone,
        title,
        description,
      })
      window.open(href, '_blank', 'noopener,noreferrer')
      onClose()
      return
    }

    if (channel === 'instagram' && instagramDmUrl) {
      const message = generateCustomQuoteMessage({
        product: normalizedProduct,
        title,
        description,
      })

      window.open(instagramDmUrl, '_blank', 'noopener,noreferrer')
      try {
        await navigator.clipboard.writeText(message)
      } catch {
        setError('Instagram opened, but the notes could not be copied. Please copy them manually.')
        return
      }
      onClose()
      return
    }

    setError('That contact channel is unavailable for this seller.')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="custom-request-title">
      <div className="max-h-[calc(100dvh-3rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Customize
            </p>
            <h2 id="custom-request-title" className="mt-1 text-xl font-bold text-slate-900">
              Share your preferred design
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close customization modal"
          >
            <CloseIcon />
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={(event) => event.preventDefault()}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Custom dining table for six"
              className="mt-2 block w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="Describe your space, preferred finish, measurements, color, or any special request."
              className="mt-2 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </label>

          <p className="text-xs leading-relaxed text-slate-500">
            Your notes will be prepared for your preferred contact channel. You can share specific design images in the conversation once you connect with the seller.
          </p>

          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={(event) => handleSubmit(event, 'whatsapp')}
              disabled={!hasSellerPhone}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${hasSellerPhone ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'cursor-not-allowed bg-slate-200 text-slate-400'}`}
            >
              <WhatsAppIcon />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={(event) => handleSubmit(event, 'instagram')}
              disabled={!instagramDmUrl}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${instagramDmUrl ? 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100' : 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'}`}
            >
              <InstagramIcon />
              Instagram
            </button>
          </div>

          {!hasContactChannel ? (
            <p className="text-center text-xs text-slate-500">Seller contact is unavailable for this product.</p>
          ) : null}
        </form>
      </div>
    </div>
  )
}

function ProductDetailView({
  product,
  seller = null,
  storefront = null,
  backTo = '/',
  backLabel = 'Back',
  onShareProduct,
  shareFeedback = '',
}) {
  const [customModalOpen, setCustomModalOpen] = useState(false)
  const sellerName = seller?.businessName || product.seller
  const sellerPhone = storefront?.whatsappPhone || seller?.phone || product.sellerPhone
  const instagramUrl = storefront?.instagramUrl || seller?.instagramUrl || ''
  const sellerLocation = seller?.location || product.location
  const availabilityLabel = getAvailabilityLabel(product)
  const isMadeToOrder = product?.availabilityType === 'made-to-order'
  const materials = Array.isArray(product?.materials) ? product.materials : []
  const hasCustomMaterials = product?.materialMode === 'custom'
  const showPrice = !isQuoteProduct(product)

  return (
    <section className="space-y-4">
      <Link
        to={backTo}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        <BackIcon />
        {backLabel}
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr),380px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <ProductMediaTabs product={product} />
        </div>

        <aside className="space-y-4 lg:max-h-[calc(100vh-8.5rem)] lg:overflow-y-auto lg:pr-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Seller</p>
            <h1 className="mt-1 text-2xl font-extrabold leading-tight text-slate-900">{product.name}</h1>
            <p className="mt-1 text-sm font-medium text-slate-700">{sellerName}</p>
            {showPrice ? <p className="mt-2 text-2xl font-bold text-emerald-700">{formatProductPrice(product)}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {sellerLocation}
              </span>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isMadeToOrder ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {availabilityLabel}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {product.description || 'No description provided for this product.'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dimensions</p>
            <div className="mt-2">
              <DimensionsBadge dimensions={product.dimensions} product={product} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Materials</p>
            {hasCustomMaterials ? (
              <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-700">
                {getMaterialNote(product)}
              </p>
            ) : materials.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {materials.map((material) => (
                  <span
                    key={material}
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {material}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Material details not specified.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3">
              <RequestQuoteButton
                product={product}
                sellerName={sellerName}
                sellerPhone={sellerPhone}
                instagramUrl={instagramUrl}
                className="w-full"
              />
              <button
                type="button"
                onClick={() => setCustomModalOpen(true)}
                className="inline-flex w-full items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
              >
                Customize
              </button>
              {onShareProduct ? (
                <button
                  type="button"
                  onClick={onShareProduct}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Share Product
                </button>
              ) : null}
            </div>
          </div>
          {shareFeedback ? <p className="text-xs text-slate-500">{shareFeedback}</p> : null}
        </aside>
      </div>

      <CustomizationModal
        open={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        product={product}
        sellerName={sellerName}
        sellerPhone={sellerPhone}
        instagramUrl={instagramUrl}
      />
    </section>
  )
}

export default ProductDetailView
