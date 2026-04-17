import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FurnitureCard from '../components/furniture/FurnitureCard'
import Loader from '../components/ui/Loader'
import { fetchStoreProducts, fetchStorefront } from '../services/publicApi'

function StorefrontPage() {
  const { slug = '' } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [storefront, setStorefront] = useState(null)
  const [seller, setSeller] = useState(null)
  const [products, setProducts] = useState([])

  useEffect(() => {
    let active = true
    const run = async () => {
      try {
        setLoading(true)
        setError('')
        const [storeInfo, storeProducts] = await Promise.all([
          fetchStorefront(slug),
          fetchStoreProducts(slug, { page: 1, limit: 50 }),
        ])
        if (!active) return
        setStorefront(storeInfo.storefront)
        setSeller(storeInfo.seller || storeProducts.seller || null)
        setProducts(storeProducts.items || [])
      } catch (requestError) {
        if (!active) return
        setError(requestError.message || 'Could not load storefront')
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [slug])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return products
    return products.filter((item) =>
      `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(query),
    )
  }, [products, search])

  const brandStyle = useMemo(() => {
    const primary = storefront?.primaryColor || '#0f766e'
    const accent = storefront?.accentColor || '#0f172a'
    return {
      background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
    }
  }, [storefront])

  if (loading) return <Loader text="Loading storefront..." />

  if (error || !storefront) {
    return (
      <section className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-5">
        <h1 className="text-xl font-bold text-red-700">Storefront Not Available</h1>
        <p className="text-sm text-red-600">{error || 'The store is unavailable right now.'}</p>
        <Link to="/" className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Back to Home
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative p-6 text-white sm:p-8" style={brandStyle}>
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -bottom-10 left-16 h-28 w-28 rounded-full bg-black/10 blur-xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Seller Storefront</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/10">
                {storefront.logoUrl || seller?.avatar ? (
                  <img
                    src={storefront.logoUrl || seller?.avatar}
                    alt={storefront.displayName || seller?.businessName || slug}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-white/90">
                    {(storefront.displayName || seller?.businessName || 'S').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold">{storefront.displayName || seller?.businessName || slug}</h1>
            </div>

            {storefront.tagline ? <p className="mt-2 text-sm text-white/90">{storefront.tagline}</p> : null}
            {storefront.description ? <p className="mt-4 max-w-3xl text-sm text-white/90">{storefront.description}</p> : null}

            <div className="mt-5 flex flex-wrap gap-2">
              {seller?.location ? <span className="presence-chip">{seller.location}</span> : null}
              <span className="presence-chip">{products.length} Product{products.length === 1 ? '' : 's'}</span>
              {storefront.whatsappPhone ? <span className="presence-chip">WhatsApp Ready</span> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr,auto]">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search this store..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2"
          />
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold">
              {filteredProducts.length} item{filteredProducts.length === 1 ? '' : 's'}
            </span>
            {seller?.location ? (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold">{seller.location}</span>
            ) : null}
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
          No products found in this storefront yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <FurnitureCard
              key={product.id}
              product={product}
              productLink={`/store/${encodeURIComponent(slug)}/product/${product.id}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default StorefrontPage
