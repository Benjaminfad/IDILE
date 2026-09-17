import { useEffect, useState } from 'react'

const STORAGE_KEY = 'themeMode'

function resolveInitialTheme() {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyThemeClass(theme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export default function useThemeMode() {
  const [themeMode, setThemeMode] = useState(resolveInitialTheme)

  useEffect(() => {
    applyThemeClass(themeMode)
    window.localStorage.setItem(STORAGE_KEY, themeMode)
  }, [themeMode])

  const toggleThemeMode = () => {
    setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return { themeMode, setThemeMode, toggleThemeMode }
}
