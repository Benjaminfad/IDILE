import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FurnitureCard from '../components/furniture/FurnitureCard'
import Loader from '../components/ui/Loader'
import Pagination from '../components/ui/Pagination'
import { fetchStoreProducts, fetchStorefront } from '../services/publicApi'
import useThemeMode from '../hooks/useThemeMode'
import { getOptimizedImageUrl } from '../utils/cloudinaryImage'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <div key={item} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="aspect-[4/3] animate-pulse bg-slate-200" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="flex items-center justify-between gap-3">
              <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

function StorefrontPage() {
  const { slug = '' } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [productsError, setProductsError] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [productsLoading, setProductsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 })
  const [storefront, setStorefront] = useState(null)
  const [seller, setSeller] = useState(null)
  const [products, setProducts] = useState([])
  const { themeMode } = useThemeMode()

  useEffect(() => {
    let active = true
    const run = async () => {
      try {
        setLoading(true)
        setError('')
        const storeInfo = await fetchStorefront(slug)
        if (!active) return
        setStorefront(storeInfo.storefront)
        setSeller(storeInfo.seller || null)
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

  useEffect(() => {
    let active = true
    const run = async () => {
      try {
        setProductsLoading(true)
        setProductsError('')
        const storeProducts = await fetchStoreProducts(slug, {
          page,
          limit: 12,
          search: debouncedSearch,
        })
        if (!active) return
        setSeller((current) => current || storeProducts.seller || null)
        setProducts(storeProducts.items || [])
        setPagination(storeProducts.pagination || { page: 1, totalPages: 1, totalItems: 0 })
      } catch (requestError) {
        if (!active) return
        setProductsError(requestError.message || 'Could not load products')
        setProducts([])
      } finally {
        if (active) setProductsLoading(false)
      }
    }

    run()
    return () => {
      active = false
    }
  }, [slug, debouncedSearch, page])

  useEffect(() => {
    const nextSearch = search.trim()
    const timer = window.setTimeout(() => {
      setDebouncedSearch(nextSearch)
      setPage(1)
    }, 260)

    return () => window.clearTimeout(timer)
  }, [search])

  const searching = search.trim() !== debouncedSearch || productsLoading

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    window.requestAnimationFrame(() => {
      document.getElementById('store-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const brandStyle = useMemo(() => {
    const primary = storefront?.primaryColor || '#0f766e'
    const accent = storefront?.accentColor || '#0f172a'
    const heroImage = getOptimizedImageUrl(storefront?.heroImageUrl, { width: 1800, height: 720, crop: 'fill' })
    return {
      backgroundColor: primary,
      backgroundImage: heroImage
        ? `linear-gradient(135deg, ${primary}e6 0%, ${accent}d9 100%), url("${heroImage}")`
        : `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }
  }, [storefront])

  const logoByTheme =
    themeMode === 'dark'
      ? '/branding/idile-logo-entity-seat-light.svg'
      : '/branding/idile-logo-entity-seat.svg'

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
        <div className="relative min-h-52 p-6 text-white sm:min-h-60 sm:p-8" style={brandStyle}>
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -bottom-10 left-16 h-28 w-28 rounded-full bg-black/10 blur-xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Seller Storefront</p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/10">
                {storefront.logoUrl || seller?.avatar ? (
                  <img
                    src={getOptimizedImageUrl(storefront.logoUrl || seller?.avatar, { width: 160, height: 160, crop: 'fill' })}
                    alt={storefront.displayName || seller?.businessName || slug}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img src={logoByTheme} alt="IDILE logo" className="h-8 w-8 object-contain" />
                )}
              </div>
              <h1 className="text-3xl font-extrabold">{storefront.displayName || seller?.businessName || slug}</h1>
            </div>

            {storefront.tagline ? <p className="mt-2 text-sm text-white/90">{storefront.tagline}</p> : null}
            {storefront.description ? <p className="mt-4 max-w-3xl text-sm text-white/90">{storefront.description}</p> : null}

          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="space-y-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 inline-flex -translate-y-1/2 text-slate-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search this store..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none ring-emerald-500 transition focus:ring-2"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold">
              {searching ? 'Searching...' : `${pagination.totalItems || 0} item${pagination.totalItems === 1 ? '' : 's'}`}
            </span>
            {seller?.location ? (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold">{seller.location}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div id="store-products" className="scroll-mt-24">
        {searching ? (
          <SearchResultsSkeleton />
        ) : productsError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
            {productsError}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
            {debouncedSearch ? 'No products match your search.' : 'No products found in this storefront yet.'}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <FurnitureCard
                  key={product.id}
                  product={product}
                  productLink={`/store/${encodeURIComponent(slug)}/product/${product.id}`}
                />
              ))}
            </div>
            <Pagination
              page={pagination.page || page}
              totalPages={pagination.totalPages || 1}
              onPageChange={handlePageChange}
              disabled={productsLoading}
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default StorefrontPage
