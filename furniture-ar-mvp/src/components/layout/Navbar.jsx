import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import useLowBandwidthMode from '../../hooks/useLowBandwidthMode'
import useThemeMode from '../../hooks/useThemeMode'

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function NavItems({ navItems, onItemClick }) {
  return (
    <>
      {navItems.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            onClick={onItemClick}
            className={({ isActive }) =>
              isActive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </>
  )
}

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { lowBandwidthMode, setLowBandwidthMode } = useLowBandwidthMode()
  const { themeMode, toggleThemeMode } = useThemeMode()
  const isDark = themeMode === 'dark'

  const storeSlugMatch = location.pathname.match(/^\/store\/([^/]+)/i)
  const activeStorePath = storeSlugMatch?.[1]
    ? `/store/${decodeURIComponent(storeSlugMatch[1])}`
    : '/'

  const navItems = [
    { to: '/', label: 'Home' },
    { to: activeStorePath, label: 'Store' },
    { to: '/seller', label: 'Seller Dashboard' },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink
          to="/"
          className="text-lg font-semibold text-slate-900 dark:text-white"
        >
          FurnitureAR NG
        </NavLink>

        <div className="hidden items-center gap-4 lg:flex">
          <ul className="flex items-center gap-4 text-sm font-medium">
            <NavItems navItems={navItems} />
          </ul>

          <button
            type="button"
            onClick={toggleThemeMode}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            {isDark ? 'Light' : 'Dark'}
          </button>

          <button
            type="button"
            onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
              lowBandwidthMode
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {lowBandwidthMode ? 'Low Data: On' : 'Low Data: Off'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200 lg:hidden"
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          <ul className="space-y-3 text-sm font-medium">
            <NavItems navItems={navItems} onItemClick={() => setMobileMenuOpen(false)} />
          </ul>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={toggleThemeMode}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
              {isDark ? 'Light' : 'Dark'}
            </button>
            <button
              type="button"
              onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                lowBandwidthMode
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {lowBandwidthMode ? 'Low Data On' : 'Low Data Off'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
