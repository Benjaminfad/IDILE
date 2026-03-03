function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-slate-700">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
          <span>{text}</span>
        </div>
      </div>
    </div>
  )
}

export default Loader
