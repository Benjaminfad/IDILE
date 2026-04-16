import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Loader from './components/ui/Loader'

const HomePage = lazy(() => import('./pages/HomePage'))
const CatalogPage = lazy(() => import('./pages/CatalogPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const StorefrontPage = lazy(() => import('./pages/StorefrontPage'))
const StoreProductPage = lazy(() => import('./pages/StoreProductPage'))
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader text="Loading page..." />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/store/:slug" element={<StorefrontPage />} />
            <Route path="/store/:slug/product/:productId" element={<StoreProductPage />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
