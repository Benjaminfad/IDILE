import { useEffect, useMemo, useState } from 'react'
import FurnitureCard from '../components/furniture/FurnitureCard'
import Loader from '../components/ui/Loader'
import { fetchCatalogProducts } from '../services/publicApi'
import { formatNaira } from '../utils/formatters'

const HOTSPOT_LOCATIONS = [
  { key: 'Ikeja', matches: ['Ikeja'] },
  { key: 'VI', matches: ['Victoria Island', 'VI'] },
  { key: 'Lekki', matches: ['Lekki'] },
  { key: 'Abuja', matches: ['Abuja', 'Wuse', 'Maitama'] },
]

function FilterPanel({
  categories,
  locations,
  searchQuery,
  selectedCategories,
  selectedLocations,
  selectedHotspot,
  priceMin,
  priceMax,
  minDatasetPrice,
  maxDatasetPrice,
  sortBy,
  onSearchChange,
  onToggleCategory,
  onHotspotSelect,
  onPriceMinChange,
  onPriceMaxChange,
  onToggleLocation,
  onSortChange,
  onClearFilters,
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="product-search" className="text-sm font-semibold text-slate-800">
          Search
        </label>
        <input
          id="product-search"
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, seller, category"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Popular Areas</p>
        <div className="flex flex-wrap gap-2">
          {HOTSPOT_LOCATIONS.map((hotspot) => (
            <button
              key={hotspot.key}
              type="button"
              onClick={() => onHotspotSelect(hotspot.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                selectedHotspot === hotspot.key
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {hotspot.key}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Category</p>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => onToggleCategory(category)}
                className="accent-emerald-600"
              />
              <span className="capitalize text-slate-700">{category.replace('-', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Price Range (NGN)</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            type="number"
            value={priceMin}
            min={minDatasetPrice}
            max={priceMax}
            onChange={(event) => onPriceMinChange(Number(event.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2"
          />
          <input
            type="number"
            value={priceMax}
            min={priceMin}
            max={maxDatasetPrice}
            onChange={(event) => onPriceMaxChange(Number(event.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2"
          />
        </div>
        <p className="text-xs text-slate-500">
          {formatNaira(priceMin)} - {formatNaira(priceMax)}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Location</p>
        <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
          {locations.map((location) => (
            <label key={location} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedLocations.includes(location)}
                onChange={() => onToggleLocation(location)}
                className="accent-emerald-600"
              />
              <span className="text-slate-700">{location}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="sort-by" className="text-sm font-semibold text-slate-800">
          Sort By
        </label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onClearFilters}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Clear Filters
      </button>
    </div>
  )
}

function CatalogPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedLocations, setSelectedLocations] = useState([])
  const [selectedHotspot, setSelectedHotspot] = useState('')
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(0)
  const [sortBy, setSortBy] = useState('newest')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  useEffect(() => {
    if (!isMobileFilterOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileFilterOpen])

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true)
        setError('')
        const { items } = await fetchCatalogProducts({
          page: 1,
          limit: 100,
          search: searchQuery || undefined,
          sort: sortBy,
          minPrice: priceMin > 0 ? priceMin : undefined,
          maxPrice: priceMax > 0 ? priceMax : undefined,
        })
        setProducts(items)
      } catch (requestError) {
        setError(requestError.message || 'Failed to load catalog')
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, sortBy, priceMin, priceMax])

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].filter(Boolean),
    [products],
  )
  const locations = useMemo(
    () => [...new Set(products.map((product) => product.location))].filter(Boolean),
    [products],
  )

  const prices = useMemo(() => products.map((product) => Number(product.price || 0)), [products])
  const minDatasetPrice = prices.length > 0 ? Math.min(...prices) : 0
  const maxDatasetPrice = prices.length > 0 ? Math.max(...prices) : 0

  useEffect(() => {
    if (products.length === 0) return
    if (priceMin === 0 && priceMax === 0) {
      setPriceMin(minDatasetPrice)
      setPriceMax(maxDatasetPrice)
    }
  }, [products, minDatasetPrice, maxDatasetPrice, priceMin, priceMax])

  const toggleSelection = (value, setSelectedValues) => {
    setSelectedValues((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
  }

  const applyHotspot = (hotspotKey) => {
    if (selectedHotspot === hotspotKey) {
      setSelectedHotspot('')
      setSelectedLocations([])
      return
    }

    const hotspot = HOTSPOT_LOCATIONS.find((item) => item.key === hotspotKey)
    if (!hotspot) return

    const matchedLocations = locations.filter((location) =>
      hotspot.matches.some((token) => location.toLowerCase().includes(token.toLowerCase())),
    )

    setSelectedHotspot(hotspotKey)
    setSelectedLocations(matchedLocations)
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const matchesLocation =
        selectedLocations.length === 0 || selectedLocations.includes(product.location)
      return matchesCategory && matchesLocation
    })
  }, [products, selectedCategories, selectedLocations])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setSelectedLocations([])
    setSelectedHotspot('')
    setPriceMin(minDatasetPrice)
    setPriceMax(maxDatasetPrice)
    setSortBy('newest')
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Catalog</h1>
          <p className="text-slate-600">
            Explore furniture items from sellers across Nigeria.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px,1fr]">
        <aside className="hidden rounded-xl border border-slate-200 bg-white p-4 lg:sticky lg:top-24 lg:block lg:h-fit">
          <FilterPanel
            categories={categories}
            locations={locations}
            searchQuery={searchQuery}
            selectedCategories={selectedCategories}
            selectedLocations={selectedLocations}
            selectedHotspot={selectedHotspot}
            priceMin={priceMin}
            priceMax={priceMax}
            minDatasetPrice={minDatasetPrice}
            maxDatasetPrice={maxDatasetPrice}
            sortBy={sortBy}
            onSearchChange={setSearchQuery}
            onToggleCategory={(value) => toggleSelection(value, setSelectedCategories)}
            onHotspotSelect={applyHotspot}
            onPriceMinChange={setPriceMin}
            onPriceMaxChange={setPriceMax}
            onToggleLocation={(value) => toggleSelection(value, setSelectedLocations)}
            onSortChange={setSortBy}
            onClearFilters={clearFilters}
          />
        </aside>

        <div className="space-y-4">
          {loading ? (
            <Loader text="Loading catalog..." />
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-600">
                Showing {filteredProducts.length} result{filteredProducts.length === 1 ? '' : 's'}
              </p>

              {filteredProducts.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                  <p className="font-medium text-slate-900">No products found.</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Try widening your price range or removing some filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <FurnitureCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 lg:hidden">
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <FilterPanel
              categories={categories}
              locations={locations}
              searchQuery={searchQuery}
              selectedCategories={selectedCategories}
              selectedLocations={selectedLocations}
              selectedHotspot={selectedHotspot}
              priceMin={priceMin}
              priceMax={priceMax}
              minDatasetPrice={minDatasetPrice}
              maxDatasetPrice={maxDatasetPrice}
              sortBy={sortBy}
              onSearchChange={setSearchQuery}
              onToggleCategory={(value) => toggleSelection(value, setSelectedCategories)}
              onHotspotSelect={applyHotspot}
              onPriceMinChange={setPriceMin}
              onPriceMaxChange={setPriceMax}
              onToggleLocation={(value) => toggleSelection(value, setSelectedLocations)}
              onSortChange={setSortBy}
              onClearFilters={clearFilters}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default CatalogPage
