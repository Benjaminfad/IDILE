import { useState } from 'react'
import SellerContactCardModal from '../ui/SellerContactCardModal'

function Footer() {
  const [contactCardOpen, setContactCardOpen] = useState(false)

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p>All right reserved 2026</p>
          <button
            type="button"
            onClick={() => setContactCardOpen(true)}
            className="font-semibold text-slate-600 transition hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300"
          >
            Contact Us
          </button>
        </div>
        <p>Powered By Agaar</p>
      </div>

      <SellerContactCardModal open={contactCardOpen} onClose={() => setContactCardOpen(false)} />
    </footer>
  )
}

export default Footer
