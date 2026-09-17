import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductMediaTabs from './ProductMediaTabs'
import WhatsAppButton from './WhatsAppButton'
import DimensionsBadge from '../ui/DimensionsBadge'
import { generateCustomQuoteWhatsAppLink } from '../../hooks/useWhatsAppShare'
import {
  formatProductPrice,
  getAvailabilityLabel,
  getMaterialNote,
} from '../../utils/productDisplay'

const MAX_CUSTOM_REFERENCE_SIZE = 10 * 1024 * 1024

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
}) {
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const hasSellerPhone = Boolean(sellerPhone)

  if (!open) return null

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0)

    if (totalSize > MAX_CUSTOM_REFERENCE_SIZE) {
      setFiles([])
      setError('Design reference uploads are limited to 10 MB total.')
      event.target.value = ''
      return
    }

    setFiles(selectedFiles)
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!hasSellerPhone) {
      setError('Seller contact is unavailable for this product.')
      return
    }

    const href = generateCustomQuoteWhatsAppLink({
      product: {
        ...product,
        seller: sellerName ?? product?.seller ?? 'Seller',
        name: product?.name ?? 'this product',
      },
      sellerPhone,
      description,
      files,
    })

    window.open(href, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Customize
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Share your preferred design
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close customization modal"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Reference pictures
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mt-2 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-emerald-700"
            />
          </label>

          {files.length > 0 ? (
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
              {files.length} image{files.length === 1 ? '' : 's'} selected: {files.map((file) => file.name).join(', ')}
            </div>
          ) : null}

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Description
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="Describe your space, preferred finish, measurements, color, or any special request."
              className="mt-2 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <p className="text-xs leading-relaxed text-slate-500">
            WhatsApp will open with your notes. Attach the selected images in the chat if the seller requests them.
          </p>

          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hasSellerPhone}
              className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                hasSellerPhone
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'cursor-not-allowed bg-slate-400'
              }`}
            >
              Send on WhatsApp
            </button>
          </div>
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
  headerLabel = 'Now Viewing',
  headerTitle = '',
  backLabel = 'Back',
  onShareProduct,
  shareFeedback = '',
}) {
  const [customModalOpen, setCustomModalOpen] = useState(false)
  const sellerName = seller?.businessName || product.seller
  const sellerPhone = seller?.phone || product.sellerPhone
  const sellerLocation = seller?.location || product.location
  const gradientStart = storefront?.primaryColor || '#0f766e'
  const gradientEnd = storefront?.accentColor || '#0f172a'
  const availabilityLabel = getAvailabilityLabel(product)
  const isMadeToOrder = product?.availabilityType === 'made-to-order'
  const materials = Array.isArray(product?.materials) ? product.materials : []
  const hasCustomMaterials = product?.materialMode === 'custom'

  return (
    <section className="space-y-4">
      <div
        className="overflow-hidden rounded-2xl border border-slate-200 px-4 py-4 text-white shadow-sm sm:px-5"
        style={{
          background: `linear-gradient(120deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{headerLabel}</p>
        <p className="mt-1 text-base font-bold">
          {headerTitle || storefront?.displayName || sellerName || 'Product Details'}
        </p>
      </div>

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
            <p className="mt-2 text-2xl font-bold text-emerald-700">{formatProductPrice(product)}</p>
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
              <WhatsAppButton
                product={product}
                sellerName={sellerName}
                sellerPhone={sellerPhone}
                className="w-full"
                label="Inquire on WhatsApp"
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
      />
    </section>
  )
}

export default ProductDetailView
