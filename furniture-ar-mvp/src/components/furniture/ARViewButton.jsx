import { useEffect, useState } from 'react'
import '@google/model-viewer'

function ARViewButton({ modelPath, productName, thumbnail, className = '' }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isWebXRSupported, setIsWebXRSupported] = useState(false)
  const [openViewer, setOpenViewer] = useState(false)

  useEffect(() => {
    let mounted = true

    async function checkWebXR() {
      if (!navigator?.xr) {
        if (mounted) {
          setIsWebXRSupported(false)
          setIsChecking(false)
        }
        return
      }

      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar')
        if (mounted) {
          setIsWebXRSupported(Boolean(supported))
          setIsChecking(false)
        }
      } catch {
        if (mounted) {
          setIsWebXRSupported(false)
          setIsChecking(false)
        }
      }
    }

    checkWebXR()
    return () => {
      mounted = false
    }
  }, [])

  if (!modelPath) {
    return null
  }

  const buttonLabel = isWebXRSupported ? 'View in AR' : 'Open AR Fallback'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenViewer(true)}
        disabled={isChecking}
        className={`inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {isChecking ? 'Checking AR support...' : buttonLabel}
      </button>

      {openViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{productName}</p>
                <p className="text-xs text-slate-500">
                  {isWebXRSupported
                    ? 'AR supported on this device.'
                    : 'Using fallback mode (Scene Viewer / Quick Look when available).'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenViewer(false)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <model-viewer
              src={modelPath}
              poster={thumbnail}
              ar
              ar-modes="webxr scene-viewer quick-look"
              camera-controls
              auto-rotate
              shadow-intensity="1"
              style={{ width: '100%', height: '70vh', backgroundColor: '#e2e8f0' }}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ARViewButton
