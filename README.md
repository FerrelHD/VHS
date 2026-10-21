# VHS // FRA ©'26

> Vintage CRT Studio Monitor & 3D Cylindrical VHS Tape Deck Portfolio for **Ferrel Rashad Akeyla**.

An interactive, high-fidelity portfolio experience inspired by analog broadcast studio hardware (Sony Trinitron PVM) and vintage home video cassettes.

---

## Architecture & Tech Stack

- **Core Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack) & [React 19](https://react.dev/)
- **3D Graphics & Scene Graph**: [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) v9
- **Optical Post-Processing**: Custom WebGL2 Offscreen FBO Fragment Shader simulating subtle CRT barrel distortion ($K = 0.07$)
- **Styling & Layout**: [Tailwind CSS](https://tailwindcss.com/)
- **Audio Synthesis**: Native Web Audio API procedural oscillator synthesis (zero-latency mechanical clicks, snaps, and tape hums)
- **Typography & CRT Filter**: Symmetrical CRT chassis (`border-radius: 46px`), parabolic curved scanlines, and dynamic SVG `<feDisplacementMap>` DOM text curvature.

---

## Featured Archives (12 Reels)

1. **`FRA_00` — Araki Art Archive** (2026, Vue 3, TS, Tailwind, GSAP 3, Lenis)
2. **`FRA_01` — Nusantara Observatory** (2026, React 19, TS, Canvas 2D, GeoJSON)
3. **`FRA_02` — TactIQ Analytics** (2026, Next.js 14, TS, Canvas, Socket.io, Chart.js)
4. **`FRA_03` — Persona 3 Reload Portfolio** (2026, React 18, Web Audio API, CSS 3D)
5. **`FRA_04` — Charles Leclerc #16** (2025, React 18, GSAP 3, Canvas 2D)
6. **`FRA_05` — EcoBite Rescue** (2026, Next.js 14, Prisma, PostgreSQL)
7. **`FRA_06` — Spidey Dev Portfolio** (2025, React 19, GSAP, Web Audio API)
8. **`FRA_07` — Fersya Shop** (2025, Laravel 11, Filament 3, MySQL)
9. **`FRA_08` — Student Life PWA** (2025, React 19, Supabase, PWA, IndexedDB)
10. **`FRA_09` — Stock Prediction ML** (2024, Python, Streamlit, XGBoost, LightGBM)
11. **`FRA_10` — Street Rush** (2024, Unity 3D, C#, Mobile Physics)
12. **`FRA_11` — Gunung Gede Simulation** (2024, Luau, Roblox Studio, Terrain Modeling)

---

## Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- npm / pnpm / yarn

### Installation

```bash
# Clone repository
git clone https://github.com/FerrelHD/VHS.git
cd VHS

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Key Controls

- **Mouse Drag / Wheel / Arrow Keys**: Cycle through 3D VHS tapes along the cylindrical arc.
- **Click / Enter / Space**: Select tape and open the Horizontal Editorial Exhibition detail view.
- **Escape**: Return to the 3D tape carousel from detail view or close modals.
- **PROFILE**: Open Ferrel Rashad's CRT dossier & capabilities overview.
- **ARCHIVE**: Open full 12-reel searchable catalogue index with category filters.
- **EMAIL**: One-click clipboard copy with audio feedback.

---

## License

© 2026 Ferrel Rashad Akeyla (`FRA ©'26`). All rights reserved.
