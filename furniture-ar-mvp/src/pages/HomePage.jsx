import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFeaturedProducts } from '../services/publicApi'
import { formatNaira } from '../utils/formatters'
import SellerContactCardModal from '../components/ui/SellerContactCardModal'

const howItWorks = [
  {
    title: 'Browse furniture',
    description:
      'Discover curated living, dining, and office pieces from local sellers.',
    icon: 'search',
  },
  {
    title: 'Preview photos or 3D',
    description:
      'Review product photos first, then open 3D/AR when a seller has it enabled.',
    icon: 'cube',
  },
  {
    title: 'Chat on WhatsApp',
    description:
      'Send product details instantly to the seller and confirm availability.',
    icon: 'chat',
  },
]

const featuredCategories = [
  {
    name: 'Living',
    description: 'Sofas, accent chairs, TV consoles, and coffee tables.',
    image:
      'https://images.pexels.com/photos/2343466/pexels-photo-2343466.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    name: 'Dining',
    description: 'Dining sets, marble tops, and statement pieces.',
    image:
      'https://images.pexels.com/photos/14598479/pexels-photo-14598479.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    name: 'Office',
    description: 'Ergonomic chairs, desks, and workspace essentials.',
    image:
      'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
]

const presenceStats = [
  { label: 'Photo-first listings', value: '20+' },
  { label: 'Local sellers', value: '12+' },
  { label: 'WhatsApp inquiries', value: '< 1 min' },
]

const heroSlides = [
  {
    image: 'https://unsplash.com/photos/RpJIm5Lojyw/download?force=true',
    alt: 'Furniture maker shaping wood in a workshop',
  },
  {
    image:
      'https://images.pexels.com/photos/6827338/pexels-photo-6827338.jpeg?auto=compress&cs=tinysrgb&w=1800',
    alt: 'Customers browsing wooden furniture in a showroom',
  },
  {
    image:
      'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=1800',
    alt: 'Warm furniture showroom with sofas and tables',
  },
  {
    image: 'https://unsplash.com/photos/c0JoR_-2x3E/download?force=true',
    alt: 'Furniture assembly work on a wooden panel',
  },
]

function StepIcon({ type }) {
  if (type === 'search') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    )
  }
  if (type === 'cube') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m12 2 8 4.5v9L12 20l-8-4.5v-9Z" />
        <path d="m12 20v-9.5" />
        <path d="m20 6.5-8 4.5-8-4.5" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 5h16v10H8l-4 4z" />
      <path d="M8 9h8M8 12h6" />
    </svg>
  )
}

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [contactCardOpen, setContactCardOpen] = useState(false)

  useEffect(() => {
    let active = true
    const loadFeatured = async () => {
      try {
        const items = await fetchFeaturedProducts(3)
        if (active) setFeaturedProducts(items)
      } catch {
        if (active) setFeaturedProducts([])
      }
    }

    loadFeatured()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-12">
      <section className="relative left-1/2 isolate w-screen -translate-x-1/2 overflow-hidden bg-slate-950 text-white shadow-sm">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.image}
              src={slide.image}
              alt={slide.alt}
              className="hero-slideshow-image"
              style={{ animationDelay: `${index * 6}s` }}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/72 to-slate-950/35" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[520px] w-full max-w-6xl items-end gap-8 px-4 py-10 sm:min-h-[620px] sm:py-14 lg:grid-cols-[minmax(0,1fr),280px] lg:py-16">
          <div className="fade-rise max-w-3xl pb-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
              Furniture Visualization Marketplace
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-6xl">
              Software for furniture makers and confident buyers.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-100 sm:text-lg">
              IDILE helps makers present their catalog beautifully, while customers inspect real product photos, open 3D/AR where available, and move straight into WhatsApp when a piece feels right.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Explore Seller Stores
              </Link>
              <span className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur">
                Real listings from local sellers
              </span>
            </div>
          </div>

          <div className="float-soft hidden flex-col gap-3 self-end lg:flex">
            {presenceStats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/20 bg-white/12 p-4 shadow-sm backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">{item.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <article key={step.title} className="presence-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Step {index + 1}
                </p>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <StepIcon type={step.icon} />
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Featured categories</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featuredCategories.map((category) => (
            <article key={category.name} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={category.image}
                  alt={`${category.name} furniture`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-slate-900">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{category.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Featured Products</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{product.category.replace('-', ' ')}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-emerald-700">{product.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{product.seller}</p>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-lg font-bold text-emerald-700">{formatNaira(product.price)}</p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {product.has3DDisplay ? 'Photos + 3D' : 'Photos'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Sell furniture on IDILE
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Own a furniture business? Reach out to get your branded storefront, photo catalog, optional 3D upgrade, and WhatsApp lead flow.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setContactCardOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Contact Us to Join
          </button>
        </div>
      </section>

      <SellerContactCardModal open={contactCardOpen} onClose={() => setContactCardOpen(false)} />
    </div>
  )
}

export default HomePage
