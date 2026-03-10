const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888/api'

function toArray(value) {
  return Array.isArray(value) ? value : []
}

function unwrapResponse(payload) {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data
  }
  return payload
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = payload?.message || 'Request failed'
    throw new Error(message)
  }

  return unwrapResponse(payload)
}

export function mapApiProduct(product) {
  const vendor = product?.vendorId || {}
  return {
    id: product?._id || product?.id || '',
    name: product?.name || 'Unnamed Product',
    seller: vendor?.businessName || 'Unknown Seller',
    sellerPhone: vendor?.phone || '',
    category: product?.category || 'uncategorized',
    price: Number(product?.price || 0),
    dimensions: product?.dimensions || { height: '-', width: '-', depth: '-' },
    materials: toArray(product?.materials),
    colors: toArray(product?.colors),
    modelPath: product?.modelPath || '',
    thumbnail: toArray(product?.images)[0] || product?.thumbnail || '',
    images: toArray(product?.images),
    inStock: product?.inStock !== false,
    location: vendor?.location || 'Nigeria',
    description: product?.description || '',
    createdAt: product?.createdAt || null,
    isActive: product?.isActive !== false,
  }
}

export async function fetchCatalogProducts(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const data = await request(`/products?${searchParams.toString()}`)
  const items = toArray(data?.items).map(mapApiProduct)

  return {
    items,
    pagination: data?.pagination || null,
    filters: data?.filters || null,
  }
}

export async function fetchProductById(productId) {
  const data = await request(`/products/${encodeURIComponent(productId)}`)
  return mapApiProduct(data)
}

export async function fetchFeaturedProducts(limit = 10) {
  const data = await request('/products/public')
  const featured = toArray(data).slice(0, limit).map((item) => ({
    id: item?.id || '',
    name: item?.name || 'Unnamed Product',
    price: Number(item?.price || 0),
    category: item?.category || 'uncategorized',
    thumbnail: item?.thumbnail || '',
    modelPath: item?.modelPath || '',
    seller: item?.vendor?.businessName || 'Unknown Seller',
    sellerPhone: item?.vendor?.phone || '',
    location: item?.vendor?.location || 'Nigeria',
  }))

  return featured
}

export { API_BASE_URL }
