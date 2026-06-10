import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatNaira } from '../../utils/formatters'

const FALLBACK_THUMBNAIL =
  'https://placehold.co/640x480/e2e8f0/334155?text=Furniture+Image'
const TABLE_FALLBACK_THUMBNAIL = '/images/round-table.png'
const CHAIR_FALLBACK_THUMBNAIL = '/images/chair.png'
const DEFAULT_FALLBACK_IMAGE_SCALE = 0.6
const TABLE_FALLBACK_IMAGE_SCALE = 0.6
const CHAIR_FALLBACK_IMAGE_SCALE = 0.6

function FurnitureCard({ product, productLink }) {
  const [hasImageError, setHasImageError] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const productId = product?.id ?? ''
  const isTableProduct = useMemo(() => {
    const name = product?.name ?? ''
    const category = product?.category ?? ''
    return /table/i.test(`${name} ${category}`)
  }, [product?.category, product?.name])
  const isChairProduct = useMemo(() => {
    const name = product?.name ?? ''
    const category = product?.category ?? ''
    return /chair/i.test(`${name} ${category}`)
  }, [product?.category, product?.name])

  const thumbnailSrc = useMemo(() => {
    if (!product?.thumbnail || hasImageError) {
      if (isTableProduct) {
        return TABLE_FALLBACK_THUMBNAIL
      }
      if (isChairProduct) {
        return CHAIR_FALLBACK_THUMBNAIL
      }
      return FALLBACK_THUMBNAIL
    }
    return product.thumbnail
  }, [product?.thumbnail, hasImageError, isTableProduct, isChairProduct])
  const isUsingFallback = !product?.thumbnail || hasImageError
  const fallbackImageScale = useMemo(() => {
    if (isTableProduct) return TABLE_FALLBACK_IMAGE_SCALE
    if (isChairProduct) return CHAIR_FALLBACK_IMAGE_SCALE
    return DEFAULT_FALLBACK_IMAGE_SCALE
  }, [isTableProduct, isChairProduct])

  const productPath = productLink || `/product/${productId}`
  const has3DDisplay = Boolean(product?.has3DDisplay)

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <div
          className={`absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 transition-opacity duration-300 ${
            isImageLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <img
          src={thumbnailSrc}
          alt={product?.name ?? 'Furniture product'}
          className={`h-full w-full transition duration-500 ${
            isUsingFallback ? 'object-contain p-4' : 'object-cover'
          } ${
            isImageLoaded ? 'blur-0' : 'blur-sm'
          }`}
          style={
            isUsingFallback
              ? { transform: `scale(${fallbackImageScale})` }
              : undefined
          }
          loading="lazy"
          decoding="async"
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setHasImageError(true)}
        />
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-emerald-700">
            {product?.name ?? 'Untitled Product'}
          </h3>
          <p className="text-lg font-bold text-emerald-700">
            {formatNaira(product?.price ?? 0)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="line-clamp-1 text-sm text-slate-600">
            {product?.seller ?? 'Unknown Seller'}
          </p>
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {product?.location ?? 'Location N/A'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            Photos
          </span>
          {has3DDisplay ? (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              3D/AR
            </span>
          ) : null}
        </div>

        <Link
          to={productPath}
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {has3DDisplay ? 'View Photos + 3D' : 'View Product'}
        </Link>
      </div>
    </article>
  )
}

export default FurnitureCard
