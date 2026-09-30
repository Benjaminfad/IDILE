import { useState } from 'react'
import { generateInstagramDmLink, generateWhatsAppLink } from '../../hooks/useWhatsAppShare'

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.84 9.84 0 0 0-8.46 14.86L2 22l5.28-1.54A9.97 9.97 0 1 0 12.04 2Zm0 17.98a8.02 8.02 0 0 1-4.09-1.12l-.29-.17-3.13.91.94-3.05-.19-.31a8.01 8.01 0 1 1 6.76 3.74Zm4.4-6c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2a7.29 7.29 0 0 1-1.35-1.68c-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.31-.75-1.8-.19-.47-.39-.4-.55-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function RequestQuoteButton({ product, sellerName, sellerPhone = '', instagramUrl = '', className = '' }) {
  const [open, setOpen] = useState(false)
  const phone = sellerPhone || product?.sellerPhone || ''
  const instagramDmUrl = generateInstagramDmLink(instagramUrl)
  const hasContactChannel = Boolean(phone || instagramDmUrl)
  const normalizedProduct = {
    ...product,
    seller: sellerName ?? product?.seller ?? 'Seller',
    name: product?.name ?? 'this product',
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!hasContactChannel}
        className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
          hasContactChannel
            ? 'bg-emerald-600 shadow-emerald-900/10 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md'
            : 'cursor-not-allowed bg-slate-400 shadow-none'
        } ${className}`}
      >
        {hasContactChannel ? 'Request Quote' : 'Seller contact unavailable'}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="quote-channel-title">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="quote-channel-title" className="text-xl font-bold text-slate-900">Request a quote</h2>
                <p className="mt-1 text-sm text-slate-600">Choose how you would like to contact {sellerName || 'the seller'}.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800" aria-label="Close request quote dialog">
                <CloseIcon />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href={phone ? generateWhatsAppLink(normalizedProduct, phone) : undefined}
                target={phone ? '_blank' : undefined}
                rel={phone ? 'noreferrer' : undefined}
                onClick={(event) => {
                  if (!phone) event.preventDefault()
                  else setOpen(false)
                }}
                className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm font-semibold transition ${phone ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100' : 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'}`}
                aria-disabled={!phone}
              >
                <WhatsAppIcon />
                WhatsApp
              </a>
              <a
                href={instagramDmUrl || undefined}
                target={instagramDmUrl ? '_blank' : undefined}
                rel={instagramDmUrl ? 'noreferrer' : undefined}
                onClick={(event) => {
                  if (!instagramDmUrl) event.preventDefault()
                  else setOpen(false)
                }}
                className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm font-semibold transition ${instagramDmUrl ? 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 hover:border-fuchsia-300 hover:bg-fuchsia-100' : 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'}`}
                aria-disabled={!instagramDmUrl}
              >
                <InstagramIcon />
                Instagram
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export { CloseIcon, InstagramIcon, WhatsAppIcon }
export default RequestQuoteButton
