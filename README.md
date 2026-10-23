# VHS // CYBERPUNK: EDGERUNNERS (SEASON 1)

> Vintage CRT Studio Monitor & 3D Cylindrical VHS Braindance Shard Archive for **Cyberpunk: Edgerunners**.

An interactive, high-fidelity archival experience inspired by analog broadcast studio hardware (Sony Trinitron PVM), curved CRT phosphors, and vintage physical VHS cassette sleeves. Showcasing all 10 episodes of Studio Trigger and CD Projekt Red's *Cyberpunk: Edgerunners*.

---

## Architecture & Tech Stack

- **Core Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack) & [React 19](https://react.dev/)
- **3D Graphics & Scene Graph**: [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) v9
- **Smooth Kinetic Scrolling**: [Lenis](https://github.com/darkroomengineering/lenis) horizontal inertia gallery
- **Optical Post-Processing**: Custom WebGL2 Offscreen FBO Fragment Shader simulating subtle CRT barrel distortion ($K = 0.07$)
- **Styling & Layout**: [Tailwind CSS](https://tailwindcss.com/)
- **Audio Synthesis**: Native Web Audio API procedural oscillator synthesis (zero-latency mechanical clicks, cartridge snaps, and tape hums)
- **Typography & CRT Filter**: Symmetrical CRT chassis (`border-radius: 46px`), parabolic curved scanlines, and dynamic SVG `<feDisplacementMap>` DOM text curvature.

---

## Braindance Shard Archives (Season 1 // 10 Episodes)

1. **`EP.01` : LET YOU DOWN** (2076, David & Gloria Martinez, Sandevistan Mk.V)
2. **`EP.02` : LIKE A BOY** (2076, David Martinez & Lucy, The Moon Braindance)
3. **`EP.03` : SMOOTH CRIMINAL** (2076, Maine, Dorio, Kiwi, Pilar & David, Highway Heist)
4. **`EP.04` : LUCKY YOU** (2076, Rebecca, Pilar, Lucy & David, Maelstrom Laboratory)
5. **`EP.05` : ALL EYEZ ON ME** (2076, Jimmy Kurosaki, David & Faraday, Psychosis Feedback Loop)
6. **`EP.06` : GIRL ON FIRE** (2076, Maine & Dorio, Terminal Berserk Rage & MaxTac Siege)
7. **`EP.07` : STRONGER** (2076, Chromed David Martinez, Lucy, Rebecca & Falco, Quadra Convoy)
8. **`EP.08` : STAY** (2076, Lucy, Faraday, Kiwi & David, Deep-Net ICE Breaker War)
9. **`EP.09` : HUMANITY** (2076, Prototype Cyberskeleton, Rebecca, Falco & Badlands War)
10. **`EP.10` : MY MOON MY MAN** (2076, David Martinez, Lucy, Rebecca & Adam Smasher, Lunar Horizon)

---

## Key Features

- **Bespoke VHS Sleeves**: Handcrafted high-resolution front covers and custom vector color-matched spines for all 10 episodes.
- **3D Tape Carousel**: Seamless cylindrical carousel with realistic card wear, spine labels, and dynamic Three.js lighting.
- **Horizontal Narrative Gallery**: Full-screen horizontal scroll exhibiting 40 curated 1080p Studio Trigger anime stills.
- **Interactive CRT Filter**: Balanced CRT monochrome scanline treatment with smooth hover color reveal.
- **Night City Lore & Telemetry**: 100% English street-level antislop prose, memorable dialogue quotes, and operational combat metrics.
- **Archive Matrix**: Quick-jump catalogue index supporting direct episode selection.

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
- **Click / Enter / Space**: Select tape and open the Horizontal Exhibition detail view.
- **Escape**: Return to the 3D tape carousel from detail view or close modals.
- **PROFILE**: Open creator dossier and bio.
- **ARCHIVE**: Open full 10-episode searchable catalogue index.
- **EMAIL**: One-click clipboard copy with procedural audio feedback.

---

## License

(c) 2026 Ferrel Rashad Akeyla (FRA c'26) & Studio Trigger / CD PROJEKT RED fan project.
