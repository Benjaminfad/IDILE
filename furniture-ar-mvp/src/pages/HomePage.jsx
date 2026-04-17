import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
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
    title: 'Preview in 3D/AR',
    description:
      'Rotate, zoom, and customize materials before making a buying decision.',
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
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Dining',
    description: 'Dining sets, marble tops, and statement pieces.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Office',
    description: 'Ergonomic chairs, desks, and workspace essentials.',
    gradient: 'from-sky-500 to-blue-700',
  },
]

const presenceStats = [
  { label: '3D-ready products', value: '20+' },
  { label: 'Local sellers', value: '12+' },
  { label: 'WhatsApp inquiries', value: '< 1 min' },
]

function FloatingFurnitureSet() {
  const groupRef = useRef(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.12
  })

  return (
    <group ref={groupRef}>
      <Float speed={2.5} rotationIntensity={0.35} floatIntensity={0.55}>
        <mesh position={[-1.6, 0.35, -0.6]} castShadow>
          <boxGeometry args={[1.25, 0.45, 0.85]} />
          <meshStandardMaterial color="#14532d" metalness={0.1} roughness={0.65} />
        </mesh>
      </Float>

      <Float speed={2.1} rotationIntensity={0.45} floatIntensity={0.45}>
        <mesh position={[1.15, -0.05, 0.25]} castShadow>
          <cylinderGeometry args={[0.5, 0.6, 0.08, 48]} />
          <meshStandardMaterial color="#78350f" metalness={0.2} roughness={0.45} />
        </mesh>
      </Float>

      <Float speed={2.8} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh position={[0.3, 0.6, -1.1]} castShadow>
          <boxGeometry args={[0.52, 0.9, 0.52]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.25} roughness={0.5} />
        </mesh>
      </Float>
    </group>
  )
}

function Hero3DBackground() {
  return (
    <div className="absolute inset-0 -z-0 overflow-hidden rounded-3xl">
      <Canvas camera={{ position: [0, 1.2, 4], fov: 42 }} shadows>
        <color attach="background" args={['#dbeafe']} />
        <fog attach="fog" args={['#dbeafe', 5, 11]} />

        <ambientLight intensity={0.55} />
        <directionalLight
          intensity={1.1}
          position={[3, 5, 3]}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <FloatingFurnitureSet />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.65, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.85} metalness={0.08} />
        </mesh>

        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={1.7} minPolarAngle={1.1} />
      </Canvas>
    </div>
  )
}

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
      <section className="relative isolate overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
        <Hero3DBackground />
        <div className="relative z-10 grid gap-6 bg-gradient-to-r from-white/92 via-white/84 to-white/55 p-6 backdrop-blur-sm sm:p-10 lg:grid-cols-[1fr,280px]">
          <div className="fade-rise">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Furniture Visualization Marketplace
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              Feel each furniture piece before buying.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-700 sm:text-lg">
              Discover seller storefronts, inspect products in 3D/AR, and chat instantly on WhatsApp.
              Built for Nigerian buyers who want confidence before payment.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Explore Seller Stores
              </Link>
              <span className="rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700">
                Real listings from local sellers
              </span>
            </div>
          </div>

          <div className="float-soft flex flex-col gap-3">
            {presenceStats.map((item) => (
              <div key={item.label} className="presence-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">{item.value}</p>
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
            <article key={category.name} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className={`h-2.5 bg-gradient-to-r ${category.gradient}`} />
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
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">3D View</span>
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
              Own a furniture business? Reach out to get your branded storefront, 3D-ready catalog, and WhatsApp lead flow.
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
