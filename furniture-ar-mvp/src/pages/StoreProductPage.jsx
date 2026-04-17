import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MaterialSwitcher, { resolveColorToHex } from '../components/furniture/MaterialSwitcher'
import FurnitureViewer3D from '../components/furniture/FurnitureViewer3D'
import WhatsAppButton from '../components/furniture/WhatsAppButton'
import ARViewButton from '../components/furniture/ARViewButton'
import DimensionsBadge from '../components/ui/DimensionsBadge'
import Loader from '../components/ui/Loader'
import useLowBandwidthMode from '../hooks/useLowBandwidthMode'
import useThemeMode from '../hooks/useThemeMode'
import { fetchStoreProductById, trackProductView } from '../services/publicApi'
import { formatNaira } from '../utils/formatters'

function StoreProductPage() {
  const { slug = '', productId = '' } = useParams()
  const [product, setProduct] = useState(null)
  const [storefront, setStorefront] = useState(null)
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedColorHex, setSelectedColorHex] = useState(resolveColorToHex(''))
  const [materialProps, setMaterialProps] = useState({ roughness: 0.6, metalness: 0.2 })
  const trackedProductRef = useRef('')
  const { lowBandwidthMode } = useLowBandwidthMode()
  const { themeMode } = useThemeMode()
  const logoByTheme =
    themeMode === 'dark'
      ? '/branding/idile-logo-entity-seat-light.svg'
      : '/branding/idile-logo-entity-seat.svg'

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
    const nextDefaultColor = product?.colors?.[0] ?? ''
    setSelectedColor(nextDefaultColor)
    setSelectedColorHex(resolveColorToHex(nextDefaultColor))
    setMaterialProps({ roughness: 0.6, metalness: 0.2 })
  }, [product?.id])

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
    <section className="space-y-4">
      <div
        className="overflow-hidden rounded-2xl border border-slate-200 px-4 py-4 text-white shadow-sm sm:px-5"
        style={{
          background: `linear-gradient(120deg, ${storefront?.primaryColor || '#0f766e'} 0%, ${storefront?.accentColor || '#0f172a'} 100%)`,
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Now Viewing</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <p className="text-base font-bold">{storefront?.displayName || seller?.businessName || 'Seller Store'}</p>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-2.5 py-1">
            <img
              src="/branding/idile-logo-entity-seat-light.svg"
              alt="IDILE logo"
              className="h-5 w-5 object-contain"
            />
            <span className="text-xs font-semibold">3D Product Preview</span>
          </div>
        </div>
      </div>

      <Link
        to={`/store/${encodeURIComponent(slug)}`}
        className="inline-flex w-fit items-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Back to {storefront?.displayName || seller?.businessName || 'Store'}
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr),380px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-2">
          <FurnitureViewer3D
            modelPath={product.modelPath}
            materialColor={selectedColorHex}
            materialProps={materialProps}
            lowBandwidthMode={lowBandwidthMode}
            className="h-[70vh] min-h-[520px] lg:h-[calc(100vh-8.5rem)]"
          />
        </div>

        <aside className="space-y-4 lg:max-h-[calc(100vh-8.5rem)] lg:overflow-y-auto lg:pr-1">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Seller</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                {seller?.avatar || storefront?.logoUrl ? (
                  <img
                    src={seller?.avatar || storefront?.logoUrl}
                    alt={seller?.businessName || product.seller}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img src={logoByTheme} alt="IDILE logo" className="h-6 w-6 object-contain" />
                )}
              </div>
              <p className="text-sm font-medium text-slate-700">{seller?.businessName || product.seller}</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{formatNaira(product.price)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {seller?.location || product.location}
              </span>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {product.inStock ? 'In Stock' : 'Limited Stock'}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dimensions</p>
            <div className="mt-2">
              <DimensionsBadge dimensions={product.dimensions} />
            </div>
          </div>

          <MaterialSwitcher
            colors={product.colors}
            selectedColor={selectedColor}
            onColorChange={(name, hex) => {
              setSelectedColor(name)
              setSelectedColorHex(hex)
            }}
            materialProps={materialProps}
            onMaterialChange={setMaterialProps}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <WhatsAppButton
              product={product}
              sellerName={seller?.businessName || product.seller}
              sellerPhone={seller?.phone || product.sellerPhone}
              className="w-full"
              label="Inquire on WhatsApp"
            />
            <ARViewButton
              productId={product.id}
              modelPath={product.modelPath}
              productName={product.name}
              thumbnail={product.thumbnail}
              iosSrc={product.iosSrc}
            />
          </div>
        </aside>
      </div>
    </section>
  )
}

export default StoreProductPage
