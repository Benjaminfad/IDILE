const COLOR_HEX_MAP = {
  "Emerald Green": "#10B981",
  Burgundy: "#800020",
  "Navy Blue": "#1E3A8A",
  "Walnut Brown": "#6B4423",
  Espresso: "#4A2C2A",
  "Natural Oak": "#C2A878",
  Black: "#111827",
  Grey: "#6B7280",
  Blue: "#2563EB",
  Beige: "#D6C3A5",
  Charcoal: "#374151",
  Taupe: "#8B7D6B",
  Oak: "#C19A6B",
  White: "#F8FAFC",
  "Matte Black": "#0F172A",
  Natural: "#D6B88A",
  Walnut: "#5C3A21",
  Sand: "#D8C3A5",
  "Slate Grey": "#64748B",
  "Forest Green": "#14532D",
  "White Marble": "#E5E7EB",
  "Grey Marble": "#9CA3AF",
  "Black Marble": "#1F2937",
  Mustard: "#D4A017",
  Teal: "#0F766E",
  Wine: "#7F1D1D",
  "Smoked Oak": "#7C5A3D",
  Maple: "#D7B899",
  "Dark Walnut": "#4E342E",
  "White Oak": "#D6BE9B",
  "Rustic Brown": "#8B5E3C",
  "Natural Pine": "#E3C58C",
  Gold: "#D4AF37",
  "Brushed Silver": "#A8A9AD",
  "Warm White": "#FDF5E6",
  Champagne: "#F7E7CE",
  "Dark Brown": "#5A3E36",
  Cream: "#FFFDD0",
  Olive: "#556B2F",
  Terracotta: "#B85C38",
  Brown: "#78350F",
  Tan: "#D2B48C",
  Navy: "#1D3557",
}

function stringToHexColor(value) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
  }

  const color = Math.abs(hash).toString(16).padStart(6, '0').slice(0, 6)
  return `#${color.toUpperCase()}`
}

export function resolveColorToHex(colorName) {
  if (!colorName) return "#9CA3AF"
  return COLOR_HEX_MAP[colorName] ?? stringToHexColor(colorName)
}

function MaterialSwitcher({
  colors = [],
  selectedColor,
  onColorChange,
  materialProps = { roughness: 0.6, metalness: 0.2 },
  onMaterialChange,
}) {
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Material Switcher
        </h2>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-800">Available Colors</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((colorName) => {
            const hex = resolveColorToHex(colorName)
            const isActive = selectedColor === colorName

            return (
              <button
                key={colorName}
                type="button"
                onClick={() => onColorChange?.(colorName, hex)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: hex }}
                />
                <span className="font-medium">{colorName}</span>
                <span className="font-mono text-[10px] uppercase text-slate-500">
                  {hex}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-800">
            Roughness: {materialProps.roughness.toFixed(2)}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={materialProps.roughness}
            onChange={(event) =>
              onMaterialChange?.({
                ...materialProps,
                roughness: Number(event.target.value),
              })
            }
            className="w-full accent-emerald-600"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-800">
            Metalness: {materialProps.metalness.toFixed(2)}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={materialProps.metalness}
            onChange={(event) =>
              onMaterialChange?.({
                ...materialProps,
                metalness: Number(event.target.value),
              })
            }
            className="w-full accent-emerald-600"
          />
        </label>
      </div>
    </section>
  )
}

export default MaterialSwitcher
