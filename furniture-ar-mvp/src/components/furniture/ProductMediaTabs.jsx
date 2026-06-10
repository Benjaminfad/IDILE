import { useMemo, useState } from 'react'
import ARViewButton from './ARViewButton'
import ProductImageCarousel from './ProductImageCarousel'

function ProductMediaTabs({ product, className = '' }) {
  const has3DDisplay = Boolean(product?.has3DDisplay && product?.modelPath)
  const mediaFrameClassName =
    'h-[min(70vh,680px)] min-h-[340px] sm:min-h-[420px] lg:h-[calc(100vh-13rem)] lg:min-h-[460px] lg:max-h-[760px]'
  const tabs = useMemo(() => (
    has3DDisplay
      ? [
          { id: 'photos', label: 'Photos' },
          { id: '3d', label: '3D/AR' },
        ]
      : [{ id: 'photos', label: 'Photos' }]
  ), [has3DDisplay])
  const [activeTab, setActiveTab] = useState('photos')
  const visibleActiveTab = has3DDisplay ? activeTab : 'photos'

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              visibleActiveTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visibleActiveTab === '3d' && has3DDisplay ? (
        <ARViewButton
          variant="inline"
          productId={product.id}
          modelPath={product.modelPath}
          productName={product.name}
          thumbnail={product.thumbnail}
          iosSrc={product.iosSrc}
          className={mediaFrameClassName}
        />
      ) : (
        <ProductImageCarousel
          images={product?.images}
          thumbnail={product?.thumbnail}
          productName={product?.name}
          className={mediaFrameClassName}
        />
      )}
    </div>
  )
}

export default ProductMediaTabs
