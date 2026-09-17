import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className={`mx-auto w-full max-w-6xl flex-1 px-4 ${isHome ? 'pb-8 pt-0' : 'py-8'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
