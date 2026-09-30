function ArrowIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 6 6 6-6 6'} />
    </svg>
  )
}

function Pagination({ page = 1, totalPages = 1, onPageChange, disabled = false }) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-3" aria-label="Store products pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ArrowIcon direction="left" />
      </button>
      <p className="min-w-28 text-center text-sm font-semibold text-slate-700">
        Page {page} of {totalPages}
      </p>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ArrowIcon direction="right" />
      </button>
    </nav>
  )
}

export default Pagination
