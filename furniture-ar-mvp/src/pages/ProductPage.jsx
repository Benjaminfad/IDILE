import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductMediaTabs from '../components/furniture/ProductMediaTabs'
import WhatsAppButton from '../components/furniture/WhatsAppButton'
import DimensionsBadge from '../components/ui/DimensionsBadge'
import Loader from '../components/ui/Loader'
import { fetchProductById, trackProductView } from '../services/publicApi'
import { formatNaira } from '../utils/formatters'

function ProductPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [shareFeedback, setShareFeedback] = useState('')
  const trackedProductRef = useRef('')

  useEffect(() => {
    let isMounted = true
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError('')
        const item = await fetchProductById(productId)
        if (!isMounted) return
        setProduct(item)
      } catch (requestError) {
        if (!isMounted) return
        setError(requestError.message || 'Failed to load product')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadProduct()
    return () => {
      isMounted = false
    }
  }, [productId])

  useEffect(() => {
    if (!product?.id || trackedProductRef.current === product.id) return
    trackedProductRef.current = product.id
    trackProductView(product.id, 'view', 'catalog-page').catch(() => {})
  }, [product?.id])

  if (loading) {
    return <Loader text="Loading product..." />
  }

  if (error || !product) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Product Not Found</h1>
        <p className="text-slate-600">{error || `We could not find a product with ID ${productId}.`}</p>
        <Link
          to="/"
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Back to Home
        </Link>
      </section>
    )
  }

  const handleShareProduct = async () => {
    const shareUrl = window.location.href
    const shareData = {
      title: `${product.name} | FurnitureAR NG`,
      text: `Check out ${product.name} listed at ${formatNaira(product.price)}.`,
      url: shareUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        setShareFeedback('Product link shared.')
        return
      }

      await navigator.clipboard.writeText(shareUrl)
      setShareFeedback('Product link copied to clipboard.')
    } catch {
      setShareFeedback('Could not share this product right now.')
    }
  }

  return (
    <section className="space-y-4">
      <Link
        to="/"
        className="inline-flex w-fit items-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Back to Home
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr),380px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <ProductMediaTabs product={product} />
        </div>

        <aside className="space-y-4 lg:max-h-[calc(100vh-8.5rem)] lg:overflow-y-auto lg:pr-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Seller</p>
            <h1 className="mt-1 text-2xl font-extrabold leading-tight text-slate-900">{product.name}</h1>
            <p className="mt-1 text-sm font-medium text-slate-700">{product.seller}</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{formatNaira(product.price)}</p>
            <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {product.location}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dimensions</p>
            <div className="mt-2">
              <DimensionsBadge dimensions={product.dimensions} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Materials</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {product.materials.map((material) => (
                <li key={material} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>{material}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3">
              <WhatsAppButton
                product={product}
                sellerName={product.seller}
                sellerPhone={product.sellerPhone}
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
              <button
                type="button"
                onClick={handleShareProduct}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Share Product
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500">{shareFeedback}</p>
        </aside>
      </div>
    </section>
  )
}

export default ProductPage
