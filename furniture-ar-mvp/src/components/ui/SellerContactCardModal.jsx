import { useMemo, useState } from 'react'

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.2 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.7.7 2.5a2 2 0 0 1-.4 2L8.2 9.5a16 16 0 0 0 6.3 6.3l1.3-1.3a2 2 0 0 1 2-.4c.8.3 1.6.5 2.5.7A2 2 0 0 1 22 16.9z" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4L20 20" />
      <path d="M20 4L4 20" />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </svg>
  )
}

export default function SellerContactCardModal({ open, onClose }) {
  const [flipped, setFlipped] = useState(false)
  const [logoBroken, setLogoBroken] = useState(false)

  const whatsappNumber = import.meta.env.VITE_CONTACT_WHATSAPP || '2348012345678'
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'hello@idile.ng'
  const contactPhone = import.meta.env.VITE_CONTACT_PHONE || '+234 801 234 5678'
  const instagram = import.meta.env.VITE_CONTACT_INSTAGRAM || 'https://instagram.com'
  const xLink = import.meta.env.VITE_CONTACT_X || 'https://x.com'
  const website = import.meta.env.VITE_CONTACT_WEBSITE || 'https://agaar.netlify.app'

  const whatsappLink = useMemo(
    () =>
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        "Hi IDILE, I'd like to onboard my furniture store.",
      )}`,
    [whatsappNumber],
  )

  const qrSrc = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encodeURIComponent(
        whatsappLink,
      )}`,
    [whatsappLink],
  )
  const logoSrc = '/branding/idile-logo-entity-seat-light.svg'

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-950/55 px-4 pb-4 pt-6 sm:pt-10">
      <div className="w-full max-w-md">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
          >
            Close
          </button>
        </div>

        <div className="mx-auto w-full [perspective:1600px]">
          <div
            className={`relative h-[560px] w-full rounded-3xl transition-transform duration-700 sm:h-[520px] [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
          >
            <div className="absolute inset-0 overflow-y-auto rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-4 text-white shadow-2xl sm:p-5 [backface-visibility:hidden]">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 overflow-hidden rounded-lg sm:h-16 sm:w-16">
                  {!logoBroken ? (
                    <img
                      src={logoSrc}
                      alt="IDILE logo"
                      className="h-full w-full object-contain"
                      onError={() => setLogoBroken(true)}
                    />
                  ) : (
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-900">IDILE</p>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[1fr,0.9fr]">
                <div className="rounded-2xl border border-white/20 bg-white p-2.5 text-slate-900 sm:p-3">
                  <img src={qrSrc} alt="Scan to WhatsApp IDILE" className="mx-auto w-full rounded-xl" />
                  <p className="mt-3 text-center text-xs font-semibold text-slate-700">
                    Scan QR to chat instantly on WhatsApp
                  </p>

                  <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm lg:hidden">
                    <p className="flex items-center gap-2 text-slate-700">
                      <IconPhone />
                      <span>{contactPhone}</span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-700">
                      <IconMail />
                      <span>{contactEmail}</span>
                    </p>
                  </div>
                </div>

                <div className="hidden lg:flex lg:flex-col lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Scan & Connect</p>
                    <p className="mt-1 text-xs text-white/80">
                      Scan the QR code to start onboarding with our team on WhatsApp.
                    </p>

                    <div className="mt-4 space-y-2 rounded-2xl border border-white/20 bg-white/10 p-3 text-sm">
                      <p className="flex items-center gap-2">
                        <IconPhone />
                        <span>{contactPhone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <IconMail />
                        <span>{contactEmail}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFlipped(true)}
                    className="mt-4 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold"
                  >
                    Flip for More Info
                  </button>
                </div>
              </div>

              <div className="mt-3 flex justify-center lg:hidden">
                <button
                  type="button"
                  onClick={() => setFlipped(true)}
                  className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold"
                >
                  Flip for More Info
                </button>
              </div>
            </div>

            <div className="absolute inset-0 overflow-y-auto rounded-3xl border border-white/20 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-800 p-5 text-white shadow-2xl sm:p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">IDILE CONTACTS</p>
                <div className="h-10 w-10 overflow-hidden rounded-lg sm:h-14 sm:w-14">
                  {!logoBroken ? (
                    <img
                      src={logoSrc}
                      alt="IDILE logo"
                      className="h-full w-full object-contain"
                      onError={() => setLogoBroken(true)}
                    />
                  ) : (
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">IDILE</p>
                  )}
                </div>
              </div>
              <h3 className="mt-2 text-2xl font-extrabold">Let's build your storefront</h3>
              <p className="mt-2 text-sm text-white/80">
                We help furniture sellers launch branded 3D-ready storefronts with WhatsApp lead flow.
              </p>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Website"
                    title="Website"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <IconGlobe />
                  </a>
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <IconInstagram />
                  </a>
                  <a
                    href={xLink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="X"
                    title="X"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <IconX />
                  </a>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setFlipped(false)}
                  className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold"
                >
                  Flip to Front
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

