import { useMemo, useState } from 'react'

const FALLBACK_IMAGE =
  'https://placehold.co/960x720/e2e8f0/334155?text=Furniture+Photo'

function ProductImageCarousel({
  images = [],
  thumbnail = '',
  productName = 'Furniture product',
  className = '',
}) {
  const slides = useMemo(() => {
    const uniqueImages = [...new Set([...(Array.isArray(images) ? images : []), thumbnail].filter(Boolean))]
    return uniqueImages.slice(0, 4)
  }, [images, thumbnail])
  const displayImages = slides.length > 0 ? slides : [FALLBACK_IMAGE]
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = displayImages[activeIndex] || displayImages[0]
  const hasMultipleImages = displayImages.length > 1

  const showPrevious = () => {
    setActiveIndex((current) => (
      current === 0 ? displayImages.length - 1 : current - 1
    ))
  }

  const showNext = () => {
    setActiveIndex((current) => (
      current === displayImages.length - 1 ? 0 : current + 1
    ))
  }

  return (
    <div className={`flex h-[420px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{productName}</p>
          <p className="text-xs text-slate-500">
            {displayImages.length} photo{displayImages.length === 1 ? '' : 's'}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Photos
        </span>
      </div>

      <div className="relative min-h-0 flex-1 bg-slate-200">
        <img
          src={activeImage}
          alt={`${productName} photo ${activeIndex + 1}`}
          className="h-full w-full object-contain"
          loading="eager"
          decoding="async"
        />

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-slate-800 shadow transition hover:bg-white"
              aria-label="Previous photo"
            >
              {'<'}
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-slate-800 shadow transition hover:bg-white"
              aria-label="Next photo"
            >
              {'>'}
            </button>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="flex gap-2 overflow-x-auto border-t border-slate-200 bg-white p-3">
          {displayImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-14 w-16 shrink-0 overflow-hidden rounded-lg border transition ${
                activeIndex === index
                  ? 'border-emerald-600 ring-2 ring-emerald-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              aria-label={`Show photo ${index + 1}`}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default ProductImageCarousel
