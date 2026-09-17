import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductDetailView from '../components/furniture/ProductDetailView'
import Loader from '../components/ui/Loader'
import { fetchProductById, trackProductView } from '../services/publicApi'
import { formatProductPrice } from '../utils/productDisplay'

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
      text: `Check out ${product.name} listed at ${formatProductPrice(product)}.`,
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
    <ProductDetailView
      product={product}
      backTo="/"
      headerTitle={product.seller}
      backLabel="Back"
      onShareProduct={handleShareProduct}
      shareFeedback={shareFeedback}
    />
  )
}

export default ProductPage
