import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductDetailView from '../components/furniture/ProductDetailView'
import Loader from '../components/ui/Loader'
import { fetchStoreProductById, trackProductView } from '../services/publicApi'

function StoreProductPage() {
  const { slug = '', productId = '' } = useParams()
  const [product, setProduct] = useState(null)
  const [storefront, setStorefront] = useState(null)
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const trackedProductRef = useRef('')

  useEffect(() => {
    let isMounted = true
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchStoreProductById(slug, productId)
        if (!isMounted) return
        setProduct(data.product)
        setStorefront(data.storefront)
        setSeller(data.seller)
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
  }, [slug, productId])

  useEffect(() => {
    if (!product?.id || trackedProductRef.current === product.id) return
    trackedProductRef.current = product.id
    trackProductView(product.id, 'view', 'storefront').catch(() => {})
  }, [product?.id])

  if (loading) return <Loader text="Loading product..." />

  if (error || !product) {
    return (
      <section className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-5">
        <h1 className="text-xl font-bold text-red-700">Product Not Available</h1>
        <p className="text-sm text-red-600">{error || 'The product is unavailable right now.'}</p>
        <Link to={`/store/${encodeURIComponent(slug)}`} className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Back to Store
        </Link>
      </section>
    )
  }

  return (
    <ProductDetailView
      product={product}
      seller={seller}
      storefront={storefront}
      backTo={`/store/${encodeURIComponent(slug)}`}
      headerTitle={storefront?.displayName || seller?.businessName || 'Seller Store'}
      backLabel="Back"
    />
  )
}

export default StoreProductPage
