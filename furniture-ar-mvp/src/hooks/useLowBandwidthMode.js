import { useEffect, useState } from 'react'

const STORAGE_KEY = 'lowBandwidthMode'
const EVENT_NAME = 'lowBandwidthModeChange'

function readLowBandwidthMode() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEY) === 'true'
}

export function setLowBandwidthMode(value) {
  if (typeof window === 'undefined') return
  const nextValue = Boolean(value)
  window.localStorage.setItem(STORAGE_KEY, String(nextValue))
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: nextValue }))
}

export default function useLowBandwidthMode() {
  const [enabled, setEnabled] = useState(readLowBandwidthMode)

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        setEnabled(readLowBandwidthMode())
      }
    }
    const onCustomChange = () => setEnabled(readLowBandwidthMode())

    window.addEventListener('storage', onStorage)
    window.addEventListener(EVENT_NAME, onCustomChange)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(EVENT_NAME, onCustomChange)
    }
  }, [])

  return {
    lowBandwidthMode: enabled,
    setLowBandwidthMode,
  }
}
