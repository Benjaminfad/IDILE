import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MaterialSwitcher, {
  resolveColorToHex,
} from '../components/furniture/MaterialSwitcher'
import FurnitureViewer3D from '../components/furniture/FurnitureViewer3D'
import WhatsAppButton from '../components/furniture/WhatsAppButton'
import ARViewButton from '../components/furniture/ARViewButton'
import DimensionsBadge from '../components/ui/DimensionsBadge'
import { products } from '../data/products'

function ProductPage() {
  const { productId } = useParams()
  const product = products.find((item) => String(item.id) === String(productId))
  const defaultColor = product?.colors?.[0] ?? ''
  const [selectedColor, setSelectedColor] = useState(defaultColor)
  const [selectedColorHex, setSelectedColorHex] = useState(
    resolveColorToHex(defaultColor),
  )
  const [materialProps, setMaterialProps] = useState({
    roughness: 0.6,
    metalness: 0.2,
  })
  const [shareFeedback, setShareFeedback] = useState('')

  useEffect(() => {
    const nextDefaultColor = product?.colors?.[0] ?? ''
    setSelectedColor(nextDefaultColor)
    setSelectedColorHex(resolveColorToHex(nextDefaultColor))
    setMaterialProps({ roughness: 0.6, metalness: 0.2 })
  }, [product?.id])

  if (!product) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Product Not Found</h1>
        <p className="text-slate-600">
          We could not find a product with ID {productId}.
        </p>
        <Link
          to="/catalog"
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Back to Catalog
        </Link>
      </section>
    )
  }

  const handleShareProduct = async () => {
    const shareUrl = window.location.href
    const shareData = {
      title: `${product.name} | FurnitureAR NG`,
      text: `Check out ${product.name} listed at ${product.price}.`,
      url: shareUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        setShareFeedback('Product link shared.')
        return
      }

      await navigator.clipboard.writeText(shareUrl)
      setShareFeedback('Product link copied to clipboard.')
    } catch {
      setShareFeedback('Could not share this product right now.')
    }
  }

  return (
    <section className="space-y-4">
      <Link
        to="/catalog"
        className="inline-flex w-fit items-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr),380px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-2">
          <FurnitureViewer3D
            modelPath={product.modelPath}
            materialColor={selectedColorHex}
            materialProps={materialProps}
            className="h-[70vh] min-h-[520px] lg:h-[calc(100vh-8.5rem)]"
          />
        </div>

        <aside className="space-y-4 lg:max-h-[calc(100vh-8.5rem)] lg:overflow-y-auto lg:pr-1">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Seller
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{product.name}</h1>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {product.seller}
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">
              {product.price}
            </p>
            <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {product.location}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Dimensions
            </p>
            <div className="mt-2">
              <DimensionsBadge dimensions={product.dimensions} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Materials
            </p>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {product.materials.map((material) => (
                <li key={material} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>{material}</span>
                </li>
              ))}
            </ul>
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
              sellerName={product.seller}
              className="w-full"
              label="Inquire on WhatsApp"
            />
            <ARViewButton
              modelPath={product.modelPath}
              productName={product.name}
              thumbnail={product.thumbnail}
            />
            <button
              type="button"
              onClick={handleShareProduct}
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Share Product
            </button>
          </div>
          <p className="text-xs text-slate-500">{shareFeedback}</p>
        </aside>
      </div>
    </section>
  )
}

export default ProductPage
