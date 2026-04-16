import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import { Link } from 'react-router-dom'
import { fetchFeaturedProducts } from '../services/publicApi'
import { formatNaira } from '../utils/formatters'

const howItWorks = [
  {
    title: 'Browse furniture',
    description:
      'Discover curated living, dining, and office pieces from local sellers.',
  },
  {
    title: 'Preview in 3D/AR',
    description:
      'Rotate, zoom, and customize materials before making a buying decision.',
  },
  {
    title: 'Chat on WhatsApp',
    description:
      'Send product details instantly to the seller and confirm availability.',
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

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])

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
      <section className="relative isolate overflow-hidden rounded-3xl border border-slate-200">
        <Hero3DBackground />
        <div className="relative z-10 bg-gradient-to-r from-white/90 via-white/80 to-white/50 p-6 backdrop-blur-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Furniture Visualization MVP
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">
            See furniture in 3D before you chat with sellers on WhatsApp.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-700 sm:text-lg">
            Built for the Nigerian market, this app helps customers visualize
            furniture in context before making purchase decisions.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Explore Stores
            </Link>
            <span className="rounded-lg border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-700">
              20+ products from local sellers
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <article
              key={step.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Step {index + 1}
              </p>
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
            <article
              key={category.name}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className={`h-2 bg-gradient-to-r ${category.gradient}`} />
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
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm text-slate-500">{product.category.replace('-', ' ')}</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{product.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{product.seller}</p>
                <p className="mt-3 text-lg font-bold text-emerald-700">{formatNaira(product.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Ready to open a seller storefront?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Use a seller store link shared with you to view their products in 3D.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
