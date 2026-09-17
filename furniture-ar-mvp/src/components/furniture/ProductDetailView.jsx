import { Link } from 'react-router-dom'
import ProductMediaTabs from './ProductMediaTabs'
import WhatsAppButton from './WhatsAppButton'
import DimensionsBadge from '../ui/DimensionsBadge'
import { formatNaira } from '../../utils/formatters'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
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
  const sellerName = seller?.businessName || product.seller
  const sellerPhone = seller?.phone || product.sellerPhone
  const sellerLocation = seller?.location || product.location
  const gradientStart = storefront?.primaryColor || '#0f766e'
  const gradientEnd = storefront?.accentColor || '#0f172a'

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
            <p className="mt-2 text-2xl font-bold text-emerald-700">{formatNaira(product.price)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {sellerLocation}
              </span>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {product.inStock ? 'In Stock' : 'Limited Stock'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dimensions</p>
            <div className="mt-2">
              <DimensionsBadge dimensions={product.dimensions} />
            </div>
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
                disabled
                className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400"
              >
                Customize coming soon
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
    </section>
  )
}

export default ProductDetailView
