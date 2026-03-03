function DimensionsBadge({ dimensions = {} }) {
  const entries = [
    { label: 'H', value: dimensions.height ?? '-' },
    { label: 'W', value: dimensions.width ?? '-' },
    { label: 'D', value: dimensions.depth ?? '-' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {entries.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
        >
          <span className="text-slate-500">{item.label}</span>
          <span>{item.value}</span>
        </span>
      ))}
    </div>
  )
}

export default DimensionsBadge
