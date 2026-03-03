import { useEffect, useMemo, useRef, useState } from 'react'
import '@google/model-viewer/dist/model-viewer.min.js'

function ARViewButton({
  modelPath,
  productName,
  thumbnail,
  iosSrc = '',
  className = '',
}) {
  const modelViewerRef = useRef(null)
  const [isChecking, setIsChecking] = useState(true)
  const [isWebXRSupported, setIsWebXRSupported] = useState(false)
  const [openViewer, setOpenViewer] = useState(false)
  const [arFeedback, setArFeedback] = useState('')
  const [isModelViewerReady, setIsModelViewerReady] = useState(false)

  const isMobileDevice = useMemo(() => {
    const ua = navigator.userAgent.toLowerCase()
    return /android|iphone|ipad|ipod/.test(ua)
  }, [])

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

    if (customElements.get('model-viewer')) {
      setIsModelViewerReady(true)
    } else {
      customElements.whenDefined('model-viewer').then(() => {
        if (mounted) setIsModelViewerReady(true)
      })
    }

    return () => {
      mounted = false
    }
  }, [])

  if (!modelPath) {
    return null
  }

  const canAttemptAR = isWebXRSupported || isMobileDevice
  const buttonLabel = canAttemptAR ? 'View in AR' : 'Open 3D Fallback'

  const handleActivateAR = async () => {
    const viewer = modelViewerRef.current
    if (!viewer) {
      setArFeedback('AR view is not ready yet.')
      return
    }

    try {
      await viewer.activateAR()
      setArFeedback('')
    } catch {
      setArFeedback('AR launch failed on this device. Use 3D preview instead.')
    }
  }

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
                <p className="text-xs text-slate-500">AR + 3D preview mode</p>
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
              ref={modelViewerRef}
              src={modelPath}
              ios-src={iosSrc}
              poster={thumbnail}
              ar
              ar-modes="webxr scene-viewer quick-look"
              ar-placement="floor"
              camera-controls
              auto-rotate
              shadow-intensity="1"
              style={{ width: '100%', height: '70vh', backgroundColor: '#e2e8f0' }}
            />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
              <button
                type="button"
                onClick={handleActivateAR}
                disabled={!isModelViewerReady}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Launch AR
              </button>
              <p className="text-xs text-slate-500">
                {arFeedback ||
                  'If AR is unavailable, keep exploring this model in 3D.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ARViewButton
