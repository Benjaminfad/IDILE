# FurnitureAR NG (MVP)

FurnitureAR NG is a React + Three.js MVP for the Nigerian furniture market. It helps buyers preview furniture in 3D (and AR fallback), customize materials/colors, and contact sellers directly through WhatsApp.

The goal is simple: reduce buyer uncertainty before purchase by making furniture exploration visual, interactive, and mobile-friendly.

---

## Why This App Exists

Furniture shopping in many local markets still depends on static photos and chat-based negotiation. Buyers often ask:

- "Will this fit my space?"
- "How does this material look in another color?"
- "Is it available, and can it be delivered to my location?"

FurnitureAR NG answers these questions earlier in the buying flow using:

- Interactive 3D previews
- AR-ready model fallback flow
- Market-specific filters and pricing
- One-tap seller outreach on WhatsApp

---

## Current MVP Capabilities

### Catalog & Discovery

- Product grid with responsive cards
- Search by product name, seller, and category
- Filter by:
  - Category
  - Price range (Naira)
  - Location
  - Popular hotspots (Ikeja, VI, Lekki, Abuja)
- Sort by popularity and price
- Mobile filter drawer/modal (instead of desktop sidebar layout)

### Product Detail Experience

- Split product layout:
  - Left: large 3D viewer
  - Right: full product information panel
- Product details:
  - Name, seller, location
  - Naira price formatting
  - Dimensions badges
  - Materials list
- Material customization:
  - Color swatches with hex values
  - Roughness and metalness sliders (real-time)

### 3D/AR Layer

- GLB model loading with React Three Fiber + Drei
- Orbit controls (rotate/zoom)
- Lighting + environment setup
- Loading percentage indicator while models load
- Error fallback when model fails
- Progressive fallback loading scene
- AR fallback via `<model-viewer>`:
  - WebXR check
  - Launch AR button
  - 3D fallback modal when AR is unavailable

### Lead Generation

- "Inquire on WhatsApp" CTA on product page
- Prefilled seller message including product and location intent
- Seller-specific phone linking through `wa.me`

### Nigerian Market Specifics

- `NGN`/Naira formatting
- Localized location filtering flow
- Mobile-first navigation and filters
- Low-bandwidth mode toggle:
  - Reduced render quality for 3D scenes
  - Lighter viewer settings for constrained devices/networks

### UX Foundation

- Dark/Light theme toggle (moon/sun)
- Theme persistence in local storage
- Low-data mode persistence in local storage

---

## Tech Stack

- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **3D:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **AR Fallback:** `@google/model-viewer`
- **State Style:** Hook-driven local state + reusable utility hooks

---

## Project Structure

```txt
furniture-ar-mvp/
├── public/
│   ├── images/                 # Static image assets
│   ├── models/                 # .glb/.gltf models
│   └── textures/               # Progressive loading textures
├── src/
│   ├── components/
│   │   ├── furniture/
│   │   │   ├── ARViewButton.jsx
│   │   │   ├── FurnitureCard.jsx
│   │   │   ├── FurnitureViewer3D.jsx
│   │   │   ├── MaterialSwitcher.jsx
│   │   │   └── WhatsAppButton.jsx
│   │   ├── layout/
│   │   │   ├── Footer.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── Navbar.jsx
│   │   └── ui/
│   │       ├── DimensionsBadge.jsx
│   │       └── Loader.jsx
│   ├── data/
│   │   └── products.js
│   ├── hooks/
│   │   ├── useLowBandwidthMode.js
│   │   ├── useThemeMode.js
│   │   └── useWhatsAppShare.js
│   ├── pages/
│   │   ├── CatalogPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── ProductPage.jsx
│   │   └── SellerDashboard.jsx
│   └── utils/
│       └── formatters.js
└── ...
```

---

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build locally

```bash
npm run preview
```

---

## Key Routes

- `/` - Home / landing page
- `/catalog` - Product discovery with filters
- `/product/:productId` - 3D product detail page
- `/seller` - Placeholder seller dashboard (future)

---

## Data Model (MVP)

Products are currently mock/local data in `src/data/products.js`.

Each product includes fields such as:

- `id`, `name`, `seller`, `sellerPhone`
- `category`, `price`, `location`
- `dimensions`, `materials`, `colors`
- `modelPath`, `thumbnail`, `inStock`

---

## Current In-Progress Areas

This is still an active MVP. Planned/next logical upgrades include:

- Better chunk splitting for large 3D bundles
- Real backend for products, sellers, and leads
- Analytics for product views and WhatsApp click-through
- True AR asset pipeline (including `usdz` for richer iOS support)
- Seller dashboard implementation
- Authentication and role-based views

---

## Notes for 3D Assets

- Place GLB models in `public/models/`
- Reference them with `/models/<file>.glb` in product data
- If a model is unavailable, the viewer currently shows graceful fallback states

---

## License

Internal MVP / private project (update this section when publishing).

---

## Acknowledgement

Built as a practical, iterative MVP for modern furniture commerce in Nigeria: visual first, mobile-ready, and conversion-oriented.
