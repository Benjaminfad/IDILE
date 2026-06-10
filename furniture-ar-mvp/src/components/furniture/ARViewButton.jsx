import { useEffect, useMemo, useRef, useState } from 'react'
import '@google/model-viewer/dist/model-viewer.min.js'
import { trackProductView } from '../../services/publicApi'

function ARViewButton({
  productId,
  modelPath,
  productName,
  thumbnail,
  iosSrc = '',
  className = '',
  variant = 'button',
}) {
  const modelViewerRef = useRef(null)
  const [isChecking, setIsChecking] = useState(true)
  const [openViewer, setOpenViewer] = useState(false)
  const [arFeedback, setArFeedback] = useState('')
  const [isModelViewerReady, setIsModelViewerReady] = useState(false)
  const isIOS = useMemo(() => {
    const ua = navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod/.test(ua)
  }, [])

  const hasIosSrc = Boolean(iosSrc)
  const arModes = isIOS
    ? 'quick-look webxr scene-viewer'
    : 'webxr scene-viewer quick-look'

  useEffect(() => {
    let mounted = true

    async function checkWebXR() {
      if (!navigator?.xr) {
        if (mounted) {
          setIsChecking(false)
        }
        return
      }

      try {
        await navigator.xr.isSessionSupported('immersive-ar')
        if (mounted) {
          setIsChecking(false)
        }
      } catch {
        if (mounted) {
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

  const handleActivateAR = async () => {
    const viewer = modelViewerRef.current
    if (!viewer) {
      setArFeedback('AR view is not ready yet.')
      return
    }

    if (isIOS && !hasIosSrc) {
      setArFeedback(
        'iPhone AR works best with a USDZ file. Add iosSrc on this product for reliable placement.',
      )
      return
    }

    try {
      await viewer.activateAR()
      if (productId) {
        trackProductView(productId, 'ar-view', 'ar-viewer').catch(() => {})
      }
      setArFeedback('')
    } catch {
      setArFeedback('AR launch failed on this device. You can still inspect the product in the AR viewer.')
    }
  }

  useEffect(() => {
    if (!openViewer || !modelViewerRef.current) return undefined

    const viewer = modelViewerRef.current
    const onArStatus = (event) => {
      const status = event.detail?.status
      if (status === 'failed') {
        setArFeedback(
          'AR failed to initialize. Move to a well-lit textured surface and try again.',
        )
      }
    }

    viewer.addEventListener('ar-status', onArStatus)
    return () => viewer.removeEventListener('ar-status', onArStatus)
  }, [openViewer])

  if (!modelPath) {
    return (
      <div className={`flex h-full items-center justify-center rounded-xl border border-amber-200 bg-amber-50 p-6 text-center ${className}`}>
        <p className="text-sm font-medium text-amber-700">
          AR view is not available yet for this product.
        </p>
      </div>
    )
  }

  const modelViewer = (
    <model-viewer
      ref={modelViewerRef}
      src={modelPath}
      ios-src={iosSrc}
      poster={thumbnail}
      ar
      ar-modes={arModes}
      ar-placement="floor"
      ar-scale="fixed"
      camera-controls
      auto-rotate
      shadow-intensity="1"
      style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0' }}
    />
  )

  if (variant === 'inline') {
    return (
      <div className={`flex h-[420px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${className}`}>
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{productName}</p>
            <p className="text-xs text-slate-500">Primary AR view</p>
          </div>
          <button
            type="button"
            onClick={handleActivateAR}
            disabled={isChecking || !isModelViewerReady}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isChecking ? 'Checking AR...' : 'Launch AR'}
          </button>
        </div>

        <div className="min-h-0 flex-1">
          {modelViewer}
        </div>

        {arFeedback ? (
          <div className="border-t border-slate-200 bg-white px-4 py-3">
            <p className="text-xs text-slate-500">{arFeedback}</p>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenViewer(true)}
        disabled={isChecking}
        className={`inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {isChecking ? 'Checking AR support...' : 'View in AR'}
      </button>

      {openViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{productName}</p>
                <p className="text-xs text-slate-500">Primary AR view</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenViewer(false)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div style={{ width: '100%', height: '70vh' }}>
              {modelViewer}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
              <button
                type="button"
                onClick={handleActivateAR}
                disabled={!isModelViewerReady}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Launch AR
              </button>
              {arFeedback ? (
                <p className="text-xs text-slate-500">{arFeedback}</p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ARViewButton
