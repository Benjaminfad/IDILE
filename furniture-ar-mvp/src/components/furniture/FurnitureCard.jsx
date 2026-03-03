import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const FALLBACK_THUMBNAIL =
  'https://placehold.co/640x480/e2e8f0/334155?text=Furniture+Image'

function FurnitureCard({ product }) {
  const [hasImageError, setHasImageError] = useState(false)

  const productId = product?.id ?? ''
  const thumbnailSrc = useMemo(() => {
    if (!product?.thumbnail || hasImageError) {
      return FALLBACK_THUMBNAIL
    }
    return product.thumbnail
  }, [product?.thumbnail, hasImageError])

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={thumbnailSrc}
          alt={product?.name ?? 'Furniture product'}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setHasImageError(true)}
        />
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
            {product?.name ?? 'Untitled Product'}
          </h3>
          <p className="text-lg font-bold text-emerald-700">
            {product?.price ?? '\u20A60'}
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

        <Link
          to={`/product/${productId}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          View in 3D
        </Link>
      </div>
    </article>
  )
}

export default FurnitureCard

