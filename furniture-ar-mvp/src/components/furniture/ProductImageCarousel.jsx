import { useMemo, useState } from 'react'
import { getOptimizedImageUrl } from '../../utils/cloudinaryImage'

const FALLBACK_IMAGE =
  'https://placehold.co/960x720/e2e8f0/334155?text=Furniture+Photo'

function ChevronIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 6 6 6-6 6'} />
    </svg>
  )
}

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
  const activeBackdrop = getOptimizedImageUrl(activeImage, { width: 1200, height: 900, crop: 'fill' })
  const activeDetailImage = getOptimizedImageUrl(activeImage, { width: 1800, height: 1400 })
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
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">{productName}</p>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-slate-950">
        <img
          src={activeBackdrop}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-2xl"
          loading="eager"
          decoding="async"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/45 via-slate-900/18 to-slate-950/45" />
        <img
          src={activeDetailImage}
          alt={`${productName} photo ${activeIndex + 1}`}
          className="relative z-10 h-full w-full object-contain"
          loading="eager"
          decoding="async"
        />

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
              aria-label="Previous photo"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
              aria-label="Next photo"
            >
              <ChevronIcon direction="right" />
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
                src={getOptimizedImageUrl(image, { width: 240, height: 180, crop: 'fill' })}
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
