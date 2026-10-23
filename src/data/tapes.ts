export type ArchiveCategoryFilter = "all" | "web" | "creative" | "ml" | "games";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectHighlight {
  title: string;
  detail: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
  tag?: string;
}

export interface ProjectShot {
  title: string;
  tag: string;
  caption: string;
  mediaUrl?: string;
  accent?: string;
}

export interface TapeProject {
  id: string;
  code: string;
  title: string;
  headline: string;
  year: number;
  category: string;
  categoryFilter: ArchiveCategoryFilter;
  role: string;
  client: string;
  system: string;
  tags: string[];
  summary: string;
  description?: string;
  story: string;
  color: string;
  wearSeed: number;
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  metrics?: ProjectMetric[];
  problem?: {
    headline: string;
    description: string;
  };
  architecture?: {
    headline: string;
    description: string;
    highlights: ProjectHighlight[];
  };
  features?: ProjectFeature[];
  takeaways?: string[];
  shots: ProjectShot[];
  meta: {
    duration: string;
    format: string;
    channel: string;
    quality: string;
  };
}

export const ARCHIVE_CATEGORIES: { id: ArchiveCategoryFilter; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "web", label: "WEB & APPS" },
  { id: "creative", label: "CREATIVE MOTION" },
  { id: "ml", label: "MACHINE LEARNING" },
  { id: "games", label: "3D & GAMES" },
];

export const TAPE_PROJECTS: TapeProject[] = [
  {
    id: "araki-art",
    code: "FRA_00",
    title: "ARAKI ART ARCHIVE",
    headline: "Haute-couture editorial web archive exploring Hirohiko Araki.",
    year: 2026,
    category: "HAUTE-COUTURE EDITORIAL ARCHIVE",
    categoryFilter: "creative",
    role: "Creative Developer & UI Engineer",
    client: "Hirohiko Araki Retrospective",
    system: "Vue 3 · TypeScript · Tailwind CSS · GSAP · Lenis",
    tags: ["Vue 3", "TypeScript", "Tailwind CSS", "GSAP 3", "Lenis"],
    summary:
      "Haute-couture editorial web archive exploring Hirohiko Araki’s intersection with high-fashion, classical sculpture, and Swiss architectural grid design.",
    story:
      "Structured upon a persistent 12-column Swiss modernist grid overlay with kinetic GSAP timelines, dual-palette chromatic state machine, expanding anatomical accordions, and a live fashion capital world clock.",
    color: "#080f24",
    wearSeed: 198701,
    image: "/projects/Araki Poster.png",
    liveUrl: "https://araki-art.vercel.app",
    githubUrl: "https://github.com/FerrelHD/Araki-Art",
    metrics: [
      { label: "Grid Architecture", value: "12-Col Swiss" },
      { label: "Motion Frame Rate", value: "60 FPS Locked" },
      { label: "Theme States", value: "Dual Palette Engine" },
      { label: "Curated Milestones", value: "4 Capsules" },
    ],
    problem: {
      headline: "Elevating manga narrative artistry into high-fashion architectural digital curation.",
      description:
        "Most anime and manga web exhibits resort to casual, cluttered fansite conventions, failing to reflect that Hirohiko Araki is a world-class artist exhibited at the Musée du Louvre and an official collaborator of historic luxury houses like Gucci and Bulgari. The challenge was crafting an avant-garde digital lookbook inspired by European editorial benchmarks while preserving the signature dramatic tension and color fluidity of JoJo’s Bizarre Adventure.",
    },
    architecture: {
      headline: "Swiss 12-column architectural blueprint with kinetic GSAP timelines and zero-jank Lenis scrolling.",
      description:
        "Engineered an editorial experience structured upon a persistent 12-column Swiss modernist grid overlay. Micro-interactions and typography are strictly aligned to coordinate boundaries, decoupling layout calculations from the viewport to guarantee 60 FPS motion even during complex height expansions and theme shifts.",
      highlights: [
        {
          title: "Modular 12-Column Blueprint Grid",
          detail: "Hardware-accelerated grid overlay dynamically adapting from a 4-column mobile matrix to a full 12-column architectural framework on desktop.",
        },
        {
          title: "Dual Palette Chromatic State Machine",
          detail: "Instant theme toggling between high-fashion 'Runway Paper' (#f4ede2) and psychological 'Menacing Color Shift' (#170b1e violet & acid chartreuse).",
        },
        {
          title: "Kinetic Slot-Machine Micro-Interactions",
          detail: "GSAP-powered vertical rolling text buttons, infinite live-timezone capital tickers (Paris, Milan, Tokyo), and dynamic silhouette hover displacement.",
        },
      ],
    },
    features: [
      {
        title: "Curated Runway Capsules Slider",
        description: "Interactive showcase documenting historic collaborations with Gucci (2011, 2013), Musée du Louvre (2009), and Bulgari (2017) with interactive silhouettes.",
        tag: "Editorial",
      },
      {
        title: "Fashion Capital Live Clock Marquee",
        description: "Real-time multi-timezone clocks tracking international fashion capitals and exhibition landmarks with hover-pause physics.",
        tag: "Kinetic Motion",
      },
      {
        title: "Expanding Anatomy Accordion",
        description: "Deep-dive analytical accordion deconstructing The Pose (contrapposto), Chromatic Fluidity, Rock & Roll Heritage, and Couture Tailoring.",
        tag: "Interactive",
      },
    ],
    takeaways: [
      "Strict architectural grid systems provide a timeless foundation that allows aggressive, avant-garde typography and motion to coexist harmoniously.",
      "Decoupling layout transformations from native scroll events using Lenis and requestAnimationFrame is crucial for zero-jank editorial micro-interactions.",
    ],
    shots: [
      {
        title: "12-COLUMN BLUEPRINT GRID",
        tag: "EDITORIAL GRID",
        caption: "Swiss typographic blueprint with modular hairline division rules.",
        accent: "#f59e0b",
      },
      {
        title: "CHROMATIC STATE MACHINE",
        tag: "PALETTE ENGINE",
        caption: "Instant dual-palette shift between monochromatic noir and runway crimson.",
        accent: "#ef4444",
      },
      {
        title: "KINETIC RUNWAY CAPSULES",
        tag: "MICRO-INTERACTIONS",
        caption: "Physics-driven horizontal carousel showcasing curated luxury collaborations.",
        accent: "#eab308",
      },
    ],
    meta: {
      duration: "01:45:00",
      format: "NTSC-SP",
      channel: "CH 02",
      quality: "HQ-HI-FI",
    },
  },
  {
    id: "tactiq",
    code: "FRA_02",
    title: "TACTIQ ANALYTICS",
    headline: "Real-time football telemetry, tactical overlays & player intelligence.",
    year: 2026,
    category: "FOOTBALL ANALYTICS • TELEMETRY",
    categoryFilter: "web",
    role: "Front-End Lead & UI Engineer",
    client: "Tactical Performance Labs",
    system: "Next.js 14 · TypeScript · HTML5 Canvas · Socket.io · Tailwind · Chart.js",
    tags: ["Next.js 14", "TypeScript", "HTML5 Canvas", "Socket.io", "Chart.js", "Tailwind CSS"],
    summary:
      "Enterprise-grade football intelligence platform featuring real-time 2D pitch tracking overlay, multi-criteria player scouting, and AI match probability forecasting.",
    story:
      "High-frequency Canvas 2D telemetry synchronized over WebSockets. Isolating high-frequency coordinate broadcasts from React DOM reconciliations via double-buffered HTML5 Canvas 2D engine driven by requestAnimationFrame.",
    color: "#141410",
    wearSeed: 199402,
    image: "/projects/TactIQ Poster.png",
    githubUrl: "https://github.com/LuthfiMirza/TactIQ",
    metrics: [
      { label: "Render Frame Rate", value: "60 FPS" },
      { label: "Socket Latency", value: "< 45ms" },
      { label: "Radar Dimensions", value: "7 Axes" },
      { label: "Match Data Points", value: "10K+ / match" },
    ],
    problem: {
      headline: "Bridging the gap between raw computer vision tracking and tactical decision-making.",
      description:
        "Modern football coaching staff and analysts face an information overload: telemetry data streams, raw tracking coordinates, and delayed video recordings exist in fragmented silos. Analysts spent hours manually reconciling coordinate feeds with video timestamps, lacking an intuitive platform capable of overlaying spatial vectors and predicting match trajectories in real time.",
    },
    architecture: {
      headline: "High-frequency Canvas 2D telemetry synchronized over WebSockets.",
      description:
        "As Front-End Lead, I architected the core visualization pipeline. We isolated high-frequency coordinate broadcasts from React DOM reconciliations by utilizing a double-buffered HTML5 Canvas 2D engine driven by requestAnimationFrame. Incoming player and ball coordinates are interpolated smoothly to prevent packet jitter, ensuring fluid 60 FPS motion.",
      highlights: [
        {
          title: "Sub-50ms Socket.io Transport",
          detail: "Real-time coordinate broadcasts from computer-vision tracking feeds parsed into spatial vectors with linear interpolation to eliminate visual stutter.",
        },
        {
          title: "Canvas 2D Pitch Heatmaps",
          detail: "Custom particle density accumulation algorithm producing live spatial dominance heatmaps and passing corridors directly over the pitch layout.",
        },
        {
          title: "Multivariate Similarity Engine",
          detail: "Euclidean distance algorithms matching players across 25+ statistical attributes to identify stylistic alternatives for tactical scouting.",
        },
      ],
    },
    features: [
      {
        title: "Interactive 2D Pitch Telemetry",
        description: "Smooth 60 FPS canvas visualization showing real-time player vectors, passing lanes, and team defensive compactness.",
        tag: "Core Visualization",
      },
      {
        title: "7-Axis Multivariate Radar",
        description: "Bespoke Chart.js radar charts comparing player metrics against league percentiles with instant side-by-side scouting comparison.",
        tag: "Analytics Engine",
      },
      {
        title: "Live Match Forecast Simulator",
        description: "Predictive win and draw probability curves updating dynamically based on tactical momentum shifts and territory dominance.",
        tag: "Machine Learning",
      },
    ],
    takeaways: [
      "Decoupling high-frequency data ingestion from the DOM render loop is essential for maintaining a silky 60 FPS on data-heavy dashboards.",
      "Data visualization is only as good as its cognitive legibility: complex multidimensional matrices require clear hierarchical design.",
    ],
    shots: [
      {
        title: "SUB-50MS WEBSOCKET TRANSPORT",
        tag: "REAL-TIME PIPELINE",
        caption: "High-frequency player spatial coordinates stream over bi-directional websockets.",
        accent: "#10b981",
      },
      {
        title: "CANVAS 2D PITCH HEATMAPS",
        tag: "SPATIAL ENGINE",
        caption: "Real-time gaussian density heatmaps rendering territory dominance.",
        accent: "#06b6d4",
      },
      {
        title: "7-AXIS MULTIVARIATE RADAR",
        tag: "ANALYTICS DSP",
        caption: "Multivariate player intelligence comparing tactical profiles across top leagues.",
        accent: "#3b82f6",
      },
    ],
    meta: {
      duration: "02:15:30",
      format: "PAL-HQ",
      channel: "CH 04",
      quality: "STEREO-DOLBY",
    },
  },
  {
    id: "persona-3",
    code: "FRA_03",
    title: "PERSONA 3 RELOAD",
    headline: "Authentic 60 FPS console experience featuring procedural Web Audio.",
    year: 2026,
    category: "GAME CONSOLE UI • WEB AUDIO ENGINE",
    categoryFilter: "creative",
    role: "Creative Developer & UI Engineer",
    client: "Creative Technologist Showcase",
    system: "React 18 · TypeScript · Web Audio API · Tailwind · CSS 3D",
    tags: ["React 18", "TypeScript", "Web Audio API", "CSS 3D Transforms", "Tailwind CSS"],
    summary:
      "Cinematic game-console developer portfolio inspired by Persona 3 Reload, featuring procedural Web Audio synthesis, 1080p character loop videos, and zero-scroll canvas navigation.",
    story:
      "Acoustic feedback engine using native Web Audio API oscillators and gain nodes (avoiding bulky sound MP3 assets) while providing zero-latency acoustic clicks, thuds, and menu swooshes. Navigation is driven by a finite state machine mimicking console controller inputs.",
    color: "#0c1936",
    wearSeed: 200607,
    image: "/projects/Retro VHS Persona Poster.png",
    liveUrl: "https://persona.ferrelrashadakeyla2014.workers.dev/",
    githubUrl: "https://github.com/FerrelHD/Persona",
    metrics: [
      { label: "Target Framerate", value: "60 FPS Locked" },
      { label: "Audio Latency", value: "0ms Procedural" },
      { label: "Viewport Mode", value: "1080p Zero-Scroll" },
      { label: "Asset Audio Size", value: "0 KB (Synthesized)" },
    ],
    problem: {
      headline: "Pushing web interactivity beyond sterile modern UI conventions.",
      description:
        "Most developer portfolios follow identical grid patterns and neutral aesthetics. I wanted to break the mold entirely by building an authentic, 60 FPS console experience inspired by Persona 3 Reload that pushes web browser audio and animation to its absolute limit.",
    },
    architecture: {
      headline: "Procedural Web Audio synthesis and zero-scroll state machines.",
      description:
        "Built an acoustic feedback engine using native Web Audio API oscillators and gain nodes while providing zero-latency acoustic clicks, thuds, and menu swooshes. Navigation is driven by a finite state machine mimicking console controller inputs.",
      highlights: [
        {
          title: "Procedural Audio Synthesizer",
          detail: "Native Web Audio API oscillators synthesizing UI mechanical sounds, eliminating audio load latency entirely.",
        },
        {
          title: "Dynamic Stylized Typography",
          detail: "Procedural angle, padding, and font-weight jitter algorithms creating the signature Persona 3 Reload visual style.",
        },
        {
          title: "CSS 3D Diagonal Perspective",
          detail: "Hardware-accelerated CSS transforms giving menus sharp diagonal angularity without dropping frames.",
        },
      ],
    },
    features: [
      {
        title: "Console Menu State Machine",
        description: "Full keyboard and mouse navigation modeled after game controller menus with sound feedback.",
        tag: "State Machine",
      },
      {
        title: "1080p Character Loop Integration",
        description: "Hardware-accelerated video loop integration with alpha blending and dynamic UI color shifting.",
        tag: "Creative Tech",
      },
      {
        title: "Themed Interactive System",
        description: "Atmospheric UI system styled with iconic Persona 3 Reload aesthetics and sound design.",
        tag: "Interactive UI",
      },
    ],
    takeaways: [
      "The Web Audio API is immensely powerful for UI feedback: synthesizing micro-sounds on the fly delivers zero network lag and a tiny bundle footprint.",
      "Crafting bold, rule-breaking aesthetics requires disciplined performance profiling to ensure heavy visual styling doesn't compromise smoothness.",
    ],
    shots: [
      {
        title: "PROCEDURAL AUDIO SYNTHESIZER",
        tag: "DSP ENGINE",
        caption: "Zero-sample Web Audio synthesizers recreating mechanical menu clicks and gunshots.",
        accent: "#38bdf8",
      },
      {
        title: "CSS 3D DIAGONAL PERSPECTIVE",
        tag: "TRANSFORM MATRIX",
        caption: "Sheared menu ribbons with synchronized kinetic character choreography.",
        accent: "#60a5fa",
      },
      {
        title: "ZERO-SCROLL CANVAS ARCHITECTURE",
        tag: "VIEWPORT ENGINE",
        caption: "State machine orchestrating instant scene transitions with zero layout shift.",
        accent: "#818cf8",
      },
    ],
    meta: {
      duration: "00:54:12",
      format: "NTSC-SP",
      channel: "CH 03",
      quality: "HI-FI STEREO",
    },
  },
  {
    id: "nusantara-observatory",
    code: "FRA_01",
    title: "NUSANTARA OBSERVATORY",
    headline: "Interactive geospatial hazard observatory consolidating archipelago feeds.",
    year: 2026,
    category: "GEOSPATIAL HAZARD • EVENT REPLAY",
    categoryFilter: "web",
    role: "Frontend & Geospatial Engineer",
    client: "Indonesian Crustal Research",
    system: "React 19 · TypeScript · Canvas 2D · GeoJSON · Tailwind",
    tags: ["React 19", "TypeScript", "HTML5 Canvas 2D", "GeoJSON", "Tailwind CSS", "Vite"],
    summary:
      "Interactive geospatial hazard tracker integrating real-time disaster feeds into visual 2D mapping with custom zero-dependency projections and temporal replay.",
    story:
      "Bespoke Canvas 2D rendering pipeline using custom equirectangular coordinate transforms. Kept the initial payload under 90 KB while sustaining 60 FPS rendering of thousands of historical earthquake epicenters, plate boundary polygons, and active volcano alerts.",
    color: "#1f1810",
    wearSeed: 202604,
    image: "/projects/Crustal Poster.png",
    liveUrl: "https://nusantara-observatory.vercel.app/",
    githubUrl: "https://github.com/FerrelHD/Global-Seismic-Tracker",
    metrics: [
      { label: "Render Engine", value: "Canvas 2D" },
      { label: "Feed Sources", value: "Real-time APIs" },
      { label: "Bundle Footprint", value: "< 90 KB" },
      { label: "Replay Speed", value: "1x - 100x" },
    ],
    problem: {
      headline: "Consolidating fragmented archipelago hazard feeds into unified situational awareness.",
      description:
        "Indonesia sits along the Pacific Ring of Fire, experiencing frequent tectonic shifts, volcanic eruptions, and tsunami warnings. Historically, public information has been scattered across separate agency portals. Researchers and disaster response teams struggled to visualize spatial clusters, event depth correlations, and historical patterns in a single coherent interface.",
    },
    architecture: {
      headline: "Lightweight coordinate projection engine and in-memory temporal event scrubber.",
      description:
        "Rather than bundling heavy multi-megabyte GIS libraries, engineered a bespoke Canvas 2D rendering pipeline using custom equirectangular coordinate transforms, sustaining 60 FPS rendering without thermal throttling.",
      highlights: [
        {
          title: "Zero-Dependency Map Projection",
          detail: "Mathematical projection routines translating spherical latitude/longitude into viewport coordinates with smooth mouse and touch zoom/pan matrix transformations.",
        },
        {
          title: "Temporal Event Replay Engine",
          detail: "Time-scrubber allowing historical replay of seismic swarms with adjustable playback speeds and depth coloring.",
        },
        {
          title: "Proximity Exposure Analysis",
          detail: "Sub-millisecond Haversine distance calculations determining earthquake proximity to densely populated urban centers and coastal infrastructures.",
        },
      ],
    },
    features: [
      {
        title: "Real-Time Seismic Swarm Visualizer",
        description: "Epicenters scaled dynamically by Richter magnitude and colored according to focal depth to highlight subduction zone mechanics.",
        tag: "Geospatial",
      },
      {
        title: "Volcanic Alert Matrix",
        description: "Active volcano monitoring tracking real-time status levels (Normal to Awas) with elevation profiles and regional alert zones.",
        tag: "Monitoring",
      },
      {
        title: "Historical Timeline Scrubber",
        description: "Intuitive playback controls enabling researchers to scrub through months of seismic activity to identify swarm precursors.",
        tag: "Analytics",
      },
    ],
    takeaways: [
      "Custom lightweight canvas rendering often outperforms heavy general-purpose map libraries when rendering thousands of custom dynamic particles.",
      "Accessibility and clarity during crisis information visualization requires strict color contrast and unambiguous typography.",
    ],
    shots: [
      {
        title: "SEISMIC SWARM VISUALIZER",
        tag: "REAL-TIME GEO",
        caption: "Cluster analysis tracking subduction zone micro-tremors in real time.",
        accent: "#f59e0b",
      },
      {
        title: "VOLCANIC ALERT MATRIX",
        tag: "EARLY WARNING",
        caption: "Multi-parameter telemetry monitoring Magma Indonesia active volcanic statuses.",
        accent: "#dc2626",
      },
      {
        title: "TEMPORAL TIMELINE SCRUBBER",
        tag: "HISTORICAL REPLAY",
        caption: "Scrubbable 4D event timeline recreating historical mega-thrust tsunamis.",
        accent: "#ea580c",
      },
    ],
    meta: {
      duration: "03:00:00",
      format: "PAL-HQ",
      channel: "CH 08",
      quality: "HQ-HI-FI",
    },
  },
  {
    id: "charles-leclerc",
    code: "FRA_04",
    title: "CHARLES LECLERC #16",
    headline: "High-octane Formula 1 telemetry & kinetic motion showcase.",
    year: 2025,
    category: "CREATIVE MOTION • F1 PHYSICS",
    categoryFilter: "creative",
    role: "Creative Frontend Developer",
    client: "Motorsport Visual Lab",
    system: "React 18 · GSAP · Canvas 2D · Tailwind",
    tags: ["React 18", "GSAP", "HTML5 Canvas", "Tailwind CSS"],
    summary:
      "High-octane Formula 1 showcase with canvas telemetry visualizers, velocity-driven tachometer, dynamic redline shaders, and fluid kinetic transitions.",
    story:
      "Translating the sensory velocity and telemetry of Formula 1 into interactive web form. Interactive tachometer dial that revs based on user scroll velocity, paired with smooth video scrub triggers and microsecond sector deltas.",
    color: "#1f0606",
    wearSeed: 201916,
    image: "/projects/Leclerc Poster.png",
    liveUrl: "https://leclerc-redline.vercel.app/",
    githubUrl: "https://github.com/FerrelHD",
    metrics: [
      { label: "Animation Engine", value: "GSAP 3" },
      { label: "Telemetry Visuals", value: "RPM & G-Force" },
      { label: "Theme", value: "Scuderia Ferrari" },
      { label: "Frame Pacing", value: "Smooth 60 FPS" },
    ],
    problem: {
      headline: "Translating the sensory velocity and telemetry of Formula 1 into interactive web form.",
      description:
        "Motorsport enthusiasts love granular telemetry: throttle traces, braking curves, and sector deltas. This project explores high-impact sports storytelling using typography, audio cues, and telemetry charts.",
    },
    architecture: {
      headline: "Canvas-driven RPM tachometer and kinetic scrub animations.",
      description:
        "Engineered an interactive tachometer dial that revs based on user scroll velocity, paired with smooth video scrub triggers and glow filters simulating steering wheel shift LEDs.",
      highlights: [
        {
          title: "Velocity-Driven UI Feedback",
          detail: "Scroll velocity feeds directly into tachometer needle position with spring physics.",
        },
        {
          title: "Dynamic Redline Shader",
          detail: "Glow filters simulating race steering wheel shift indicator LEDs.",
        },
      ],
    },
    features: [
      {
        title: "Interactive F1 Tachometer",
        description: "Dynamic RPM gauge reacting to scroll speed with redline sound triggers.",
        tag: "Interactive",
      },
      {
        title: "Sector Delta Timeline",
        description: "Qualifying lap breakdown comparing telemetry across Monaco and Monza.",
        tag: "Telemetry",
      },
    ],
    takeaways: [
      "Tying scroll velocity to mechanical feedback creates an immediate physical connection between user input and visual response.",
    ],
    shots: [
      {
        title: "CANVAS F1 TACHOMETER",
        tag: "REAL-TIME TELEMETRY",
        caption: "RPM redline indicator syncing needle momentum with throttle acceleration curves.",
        accent: "#dc2626",
      },
      {
        title: "SECTOR DELTA TIMELINE",
        tag: "LAP COMPARISON",
        caption: "Microsecond telemetry comparing pole position qualifying micro-deltas.",
        accent: "#ef4444",
      },
      {
        title: "V10 ACOUSTIC DRIFT",
        tag: "AUDIO SYNTHESIS",
        caption: "Frequency-modulated oscillator bank synthesizing high-revving Ferrari engine notes.",
        accent: "#b91c1c",
      },
    ],
    meta: {
      duration: "01:16:16",
      format: "PAL-HQ",
      channel: "CH 16",
      quality: "MONO-RAW",
    },
  },
  {
    id: "ecobite",
    code: "FRA_05",
    title: "ECOBITE RESCUE",
    headline: "Campus food rescue & SDG 12 sustainability platform.",
    year: 2026,
    category: "CAMPUS FOOD RESCUE • SDG 12 PLATFORM",
    categoryFilter: "web",
    role: "Fullstack Engineer & UI Lead",
    client: "Campus Sustainability Initiative",
    system: "Next.js 14 · TypeScript · Prisma · Tailwind · Supabase",
    tags: ["Next.js 14", "TypeScript", "Prisma ORM", "Tailwind CSS", "PostgreSQL"],
    summary:
      "Campus food rescue platform with real-time GPS radar, dynamic QR rescue passes, and ESG carbon reduction & EcoPoints tracking.",
    story:
      "Transactional reservation flow with cryptographic QR claim verification. Inventory locking mechanism using PostgreSQL transactions and Prisma to prevent race conditions during end-of-day surplus meal claims.",
    color: "#18261e",
    wearSeed: 202602,
    image: "/projects/Eco-Bite.png",
    githubUrl: "https://github.com/FerrelHD/Eco-Bite",
    metrics: [
      { label: "Impact Focus", value: "SDG 12" },
      { label: "Pass Generation", value: "Dynamic QR" },
      { label: "Tracking", value: "ESG Carbon Reductions" },
      { label: "Stack", value: "Next.js 14" },
    ],
    problem: {
      headline: "Preventing campus cafeteria food waste through rapid-response redistributions.",
      description:
        "Excess food from campus cafeterias and vendors frequently ended up discarded despite high student demand for affordable meals. EcoBite bridges supply and demand with a real-time rescue marketplace.",
    },
    architecture: {
      headline: "Transactional reservation flow with cryptographic QR claim verification.",
      description:
        "Engineered an inventory locking mechanism using PostgreSQL transactions and Prisma to prevent race conditions during end-of-day surplus meal claims, paired with verifiable dynamic QR codes.",
      highlights: [
        {
          title: "Inventory Concurrency Guard",
          detail: "Row-level locking ensuring zero double-claiming when meal batches hit clearance discounts.",
        },
        {
          title: "Carbon Footprint Calculator",
          detail: "Real-time metric calculation translating saved meals into CO2 reduction statistics.",
        },
        {
          title: "Geo-Radius Discovery",
          detail: "Proximity sorting highlighting immediate food pickup opportunities within walking distance.",
        },
      ],
    },
    features: [
      {
        title: "Live Rescue Radar",
        description: "Map and list feeds showing remaining food servings with countdown timers.",
        tag: "Surplus Radar",
      },
      {
        title: "Dynamic QR Pass",
        description: "Time-expiring QR passes scanned by vendors for instant contactless verification.",
        tag: "Verification",
      },
    ],
    takeaways: [
      "Food rescue platforms require ultra-low friction checkout flows because vendor surplus windows are typically under 30 minutes.",
    ],
    shots: [
      {
        title: "GEO-RADIUS RESCUE RADAR",
        tag: "GPS TELEMETRY",
        caption: "Live proximity scanner highlighting available surplus portions across campus venues.",
        accent: "#10b981",
      },
      {
        title: "INVENTORY CONCURRENCY GUARD",
        tag: "TRANSACTION ACID",
        caption: "Pessimistic locking preventing race conditions on last-minute meal claims.",
        accent: "#059669",
      },
    ],
    meta: {
      duration: "00:45:00",
      format: "NTSC-SP",
      channel: "CH 12",
      quality: "STEREO",
    },
  },
  {
    id: "spidey-dev",
    code: "FRA_06",
    title: "SPIDEY DEV PORTFOLIO",
    headline: "Cinematic Spider-Man portfolio with interactive Web Audio.",
    year: 2025,
    category: "CREATIVE FRONTEND • WEB AUDIO",
    categoryFilter: "creative",
    role: "Creative Technologist",
    client: "Interactive Creative Experiment",
    system: "React 19 · GSAP · Web Audio API · Tailwind",
    tags: ["React 19", "GSAP", "Web Audio API", "Tailwind CSS"],
    summary:
      "Cinematic Spider-Man-themed portfolio with interactive Web Audio soundscapes, kinetic typography, elastic web physics, and halftone screen shaders.",
    story:
      "Choreographed GSAP scroll timelines and interactive canvas webs. Implemented custom cursor physics simulating web slinging alongside synchronized multi-layer parallax scenes.",
    color: "#2e1818",
    wearSeed: 200205,
    image: "/projects/spider-dev.png",
    liveUrl: "https://spidey-portfolio-ferrel.vercel.app/",
    githubUrl: "https://github.com/FerrelHD/Portofolio",
    metrics: [
      { label: "Kinetic Motion", value: "GSAP Timeline" },
      { label: "Audio Engine", value: "Procedural Web Audio" },
      { label: "Theme", value: "Spider-Verse" },
      { label: "Interactive Cursor", value: "Canvas Web" },
    ],
    problem: {
      headline: "Recreating comic-book dynamism through kinetic motion and tactile audio.",
      description:
        "Exploring how comic art principles (halftone textures, action lines, and kinetic impact typography) can be translated into modern web interfaces without sacrificing scroll responsiveness.",
    },
    architecture: {
      headline: "Choreographed GSAP scroll timelines and interactive canvas webs.",
      description:
        "Implemented custom cursor physics simulating web slinging alongside synchronized multi-layer parallax scenes.",
      highlights: [
        {
          title: "Canvas String Simulation",
          detail: "Verlet integration physics simulating elastic spider webbing following mouse cursor momentum.",
        },
        {
          title: "Halftone Shading Shaders",
          detail: "Lightweight SVG filters and CSS masks producing dynamic comic dot patterns.",
        },
      ],
    },
    features: [
      {
        title: "Interactive Web Physics",
        description: "Elastic spider-web cursor trails reacting to cursor velocity.",
        tag: "Physics",
      },
      {
        title: "Comic Sound FX Synthesizer",
        description: "Web Audio API synthesizing retro cartoon sound effects on click events.",
        tag: "Web Audio",
      },
    ],
    takeaways: [
      "Complex animations must respect user preferences such as prefers-reduced-motion without losing character.",
    ],
    shots: [
      {
        title: "CANVAS STRING PHYSICS",
        tag: "VERLET SIMULATION",
        caption: "Real-time spring tension cords responding dynamically to pointer pluck gestures.",
        accent: "#ef4444",
      },
      {
        title: "HALFTONE SHADING SHADER",
        tag: "GLSL SCREEN-TONE",
        caption: "Custom fragment shader rendering authentic Marvel-style benday dot halftone screens.",
        accent: "#f43f5e",
      },
      {
        title: "COMIC SOUND SYNTHESIS",
        tag: "WEB AUDIO",
        caption: "Dynamic FM oscillators producing tactile web-thwip sound transients.",
        accent: "#fb7185",
      },
    ],
    meta: {
      duration: "01:10:00",
      format: "NTSC-SP",
      channel: "CH 07",
      quality: "HQ-HI-FI",
    },
  },
  {
    id: "fersya-shop",
    code: "FRA_07",
    title: "FERSYA SHOP",
    headline: "Modern storefront with Filament admin dashboard & granular RBAC.",
    year: 2025,
    category: "ORGANIC E-COMMERCE STOREFRONT",
    categoryFilter: "web",
    role: "Fullstack Laravel Developer",
    client: "Retail Commerce Platform",
    system: "Laravel 11 · Filament Admin · MySQL · Tailwind",
    tags: ["Laravel 11", "Filament Admin", "MySQL", "Tailwind CSS", "Blade"],
    summary:
      "Modern storefront with Filament admin dashboard, granular RBAC, and inventory management.",
    story:
      "Modular Laravel architecture with reactive Filament tables and automated audit trails. Designed database schemas with foreign key constraints and transactional order placement to guarantee inventory integrity.",
    color: "#241f1a",
    wearSeed: 202504,
    image: "/projects/fersya-shop.webp",
    githubUrl: "https://github.com/FerrelHD/Fersya-Shop",
    metrics: [
      { label: "Backend", value: "Laravel 11" },
      { label: "Admin Panel", value: "Filament 3" },
      { label: "Architecture", value: "MVC + RBAC" },
      { label: "Database", value: "MySQL" },
    ],
    problem: {
      headline: "Streamlining organic retail commerce with automated stock management and staff permissions.",
      description:
        "Small businesses often struggle with managing offline and online stock counts. Fersya Shop provides a unified back-office with role-based staff access.",
    },
    architecture: {
      headline: "Modular Laravel architecture with reactive Filament tables and automated audit trails.",
      description:
        "Designed database schemas with foreign key constraints and transactional order placement to guarantee inventory integrity.",
      highlights: [
        {
          title: "Granular Role-Based Access",
          detail: "Multi-guard authentication separating store managers, fulfillment staff, and customers.",
        },
        {
          title: "Stock Ledger Logging",
          detail: "Immutable inventory change logs tracking stock additions, sales, and expirations.",
        },
      ],
    },
    features: [
      {
        title: "Filament 3 Back-Office",
        description: "High-speed administrative panel for product curation and order fulfillment.",
        tag: "Back-Office",
      },
      {
        title: "Responsive Customer Storefront",
        description: "Clean organic-themed shopping experience with fast category filtering.",
        tag: "Storefront",
      },
    ],
    takeaways: [
      "Using mature ecosystem tools like Filament drastically accelerates back-office delivery while preserving enterprise security.",
    ],
    shots: [
      {
        title: "FILAMENT 3 ADMIN ENGINE",
        tag: "BACK-OFFICE",
        caption: "Granular RBAC role matrices managing real-time stock intake and fulfillment.",
        accent: "#d97706",
      },
      {
        title: "TRANSACTION STOCK LEDGER",
        tag: "DATABASE ACID",
        caption: "Pessimistic concurrency guards ensuring zero overselling across physical and digital storefronts.",
        accent: "#b45309",
      },
    ],
    meta: {
      duration: "01:05:00",
      format: "PAL-HQ",
      channel: "CH 11",
      quality: "STEREO",
    },
  },
  {
    id: "student-life",
    code: "FRA_08",
    title: "STUDENT LIFE",
    headline: "All-in-one offline-first academic productivity ecosystem.",
    year: 2025,
    category: "PRODUCTIVITY PWA • WORKER PERSISTENCE",
    categoryFilter: "web",
    role: "Lead Developer & Product Designer",
    client: "Academic Productivity Product",
    system: "React 19 · TypeScript · Supabase · PWA · Tailwind",
    tags: ["React 19", "TypeScript", "Supabase", "Progressive Web App", "IndexedDB", "Tailwind CSS"],
    summary:
      "All-in-one offline-first academic productivity ecosystem consolidating schedules, tasks, and precision focus sessions.",
    story:
      "Progressive Web App with optimistic local-first state synchronization. Designed an offline-first architecture utilizing IndexedDB for instantaneous local reads and writes, paired with Supabase for cloud persistence.",
    color: "#1c202a",
    wearSeed: 202509,
    image: "/projects/student-life.png",
    liveUrl: "https://ferrelhd.github.io/Student-Life/",
    githubUrl: "https://github.com/FerrelHD/Student-Life",
    metrics: [
      { label: "Offline Support", value: "100% PWA Cache" },
      { label: "Sync Engine", value: "Local-First" },
      { label: "Focus Modules", value: "Timer & Kanban" },
      { label: "PWA Lighthouse", value: "100 / 100" },
    ],
    problem: {
      headline: "Consolidating fragmented student productivity tools into a single offline-ready hub.",
      description:
        "Students frequently juggle assignments, course schedules, and Pomodoro timers across three or four separate disconnected applications. Unreliable campus Wi-Fi often leads to lost edits or out-of-sync schedules.",
    },
    architecture: {
      headline: "Progressive Web App with optimistic local-first state synchronization.",
      description:
        "Designed an offline-first architecture utilizing IndexedDB for instantaneous local reads and writes, paired with Supabase for cloud persistence. State changes queue locally in IndexedDB and reconcile on reconnect.",
      highlights: [
        {
          title: "Optimistic State Architecture",
          detail: "Immediate UI updates for task completions and schedule shifts with background Supabase mutation queues.",
        },
        {
          title: "Dedicated Worker Focus Timer",
          detail: "Web Worker-backed Pomodoro cycle preventing background tab throttling and maintaining precision timing.",
        },
        {
          title: "Academic Schedule Matrix",
          detail: "Conflict-detecting schedule calendar with automated reminders and priority weighting.",
        },
      ],
    },
    features: [
      {
        title: "Smart Coursework Manager",
        description: "Kanban and list views with due-date countdowns and priority tags.",
        tag: "Productivity",
      },
      {
        title: "Precision Pomodoro Timer",
        description: "Customizable work/break cycles running on dedicated Web Workers.",
        tag: "Focus Tool",
      },
      {
        title: "Offline PWA Support",
        description: "Installable on desktop and mobile with full offline functionality and automatic sync.",
        tag: "PWA",
      },
    ],
    takeaways: [
      "Building for students means designing for imperfect network conditions: optimistic local-first storage transforms the UX from fragile to dependable.",
      "Web Workers are critical for web timers to avoid browser background tab sleep throttling.",
    ],
    shots: [
      {
        title: "OFFLINE INDEXEDDB SYNC",
        tag: "CACHE-FIRST ARCHITECTURE",
        caption: "Background synchronization worker merging offline updates upon reconnection.",
        accent: "#3b82f6",
      },
      {
        title: "DEDICATED WEB WORKER TIMER",
        tag: "BACKGROUND THREAD",
        caption: "Drift-free focus countdown maintaining millisecond accuracy across backgrounded tabs.",
        accent: "#6366f1",
      },
    ],
    meta: {
      duration: "01:30:00",
      format: "PAL-HQ",
      channel: "CH 09",
      quality: "HQ-HI-FI",
    },
  },
  {
    id: "stock-prediction",
    code: "FRA_09",
    title: "STOCK PREDICTION ML",
    headline: "Time-series machine learning model analyzing equities with volatility curves.",
    year: 2024,
    category: "QUANT ML & ANALYTICS",
    categoryFilter: "ml",
    role: "Machine Learning Engineer",
    client: "Financial Quantitative Research",
    system: "Python · Streamlit · XGBoost · LightGBM · Pandas",
    tags: ["Python", "Streamlit", "XGBoost", "LightGBM", "Scikit-Learn", "Pandas"],
    summary:
      "Time-series machine learning model analyzing equities with predictive volatility curves and Streamlit dashboard.",
    story:
      "Walk-forward rolling validation with technical indicator feature pipelines. Implemented rolling time-series splits to prevent future data leakage, extracting momentum, volatility, and mean-reversion indicators before training gradient-boosted ensembles.",
    color: "#192429",
    wearSeed: 202410,
    image: "/projects/stock-prediction.png",
    githubUrl: "https://github.com/FerrelHD/Stock-Prediction-System",
    metrics: [
      { label: "ML Models", value: "XGBoost & LightGBM" },
      { label: "Feature Engineering", value: "RSI, MACD, Bollinger" },
      { label: "Framework", value: "Python / Streamlit" },
      { label: "Validation", value: "Rolling Walk-Forward" },
    ],
    problem: {
      headline: "Building robust feature pipelines for non-stationary financial time series.",
      description:
        "Financial market data suffers from low signal-to-noise ratios and regime shifts. Standard regressions often overfit historical data without providing actionable confidence bands.",
    },
    architecture: {
      headline: "Walk-forward rolling validation with technical indicator feature pipelines.",
      description:
        "Implemented rolling time-series splits to prevent future data leakage, extracting momentum, volatility, and mean-reversion indicators before training gradient-boosted ensembles.",
      highlights: [
        {
          title: "Leakage-Free Feature Engineering",
          detail: "Strict lag transforms ensuring zero lookahead bias during feature computation.",
        },
        {
          title: "Interactive Volatility Bands",
          detail: "Streamlit dashboard rendering confidence envelopes alongside historical moving averages.",
        },
      ],
    },
    features: [
      {
        title: "Predictive Price Curve",
        description: "Ensemble model projection with adjustable forecast horizons and risk boundaries.",
        tag: "Forecasting",
      },
      {
        title: "Technical Indicator Matrix",
        description: "Automated calculation of MACD, RSI, and exponential moving averages.",
        tag: "Feature Store",
      },
    ],
    takeaways: [
      "In financial machine learning, leak-free validation architecture is vastly more important than tuning complex model hyperparameters.",
    ],
    shots: [
      {
        title: "ROLLING WALK-FORWARD MATRIX",
        tag: "ML VALIDATION",
        caption: "Strict sequential cross-validation preventing temporal lookahead leakage.",
        accent: "#06b6d4",
      },
      {
        title: "VOLATILITY ENVELOPE",
        tag: "RISK DSP",
        caption: "Dynamic confidence intervals adjusting to market macroeconomic regimes.",
        accent: "#0891b2",
      },
    ],
    meta: {
      duration: "00:58:00",
      format: "NTSC-SP",
      channel: "CH 14",
      quality: "DATA-STREAM",
    },
  },
  {
    id: "street-rush",
    code: "FRA_10",
    title: "STREET RUSH",
    headline: "Fast-paced mobile 3D endless runner with procedural obstacle spawning.",
    year: 2024,
    category: "3D ARCADE RUNNER MOBILE GAME",
    categoryFilter: "games",
    role: "Game Developer & 3D Designer",
    client: "Mobile Game Project",
    system: "Unity 3D · C# · Mobile Physics",
    tags: ["Unity 3D", "C#", "Blender", "Mobile Optimization"],
    summary:
      "Fast-paced mobile 3D endless runner featuring dynamic procedural obstacle spawning and custom physics.",
    story:
      "Object pooling architecture and procedural obstacle chunk recycling. Architected a ring-buffer object pool that recycles track chunks and obstacles ahead of the camera, eliminating runtime memory allocations during active gameplay.",
    color: "#281c22",
    wearSeed: 202408,
    image: "/projects/street-rush.webp",
    githubUrl: "https://github.com/FerrelHD/Street-Rush-Unity",
    metrics: [
      { label: "Engine", value: "Unity 3D" },
      { label: "Target Platform", value: "Android / iOS" },
      { label: "Framerate", value: "Stable 60 FPS" },
      { label: "Generation", value: "Procedural" },
    ],
    problem: {
      headline: "Maintaining consistent mobile frame pacing with procedural 3D world streaming.",
      description:
        "Continuous object instantiation and garbage collection spikes cause noticeable stutters on mobile devices. Street Rush required zero-allocation pooling to guarantee smooth 60 FPS gameplay.",
    },
    architecture: {
      headline: "Object pooling architecture and procedural obstacle chunk recycling.",
      description:
        "Architected a ring-buffer object pool that recycles track chunks and obstacles ahead of the camera, eliminating runtime memory allocations during active gameplay.",
      highlights: [
        {
          title: "Zero-Allocation Pooler",
          detail: "Recycling 3D road meshes, coins, and barriers to prevent garbage collector hitches.",
        },
        {
          title: "Responsive Swipe Controller",
          detail: "Custom touch gesture recognizer with sub-pixel lane snapping physics.",
        },
      ],
    },
    features: [
      {
        title: "Endless Track Generator",
        description: "Dynamic procedural generation with curve difficulty ramping as player speed increases.",
        tag: "Game Loop",
      },
      {
        title: "Mobile Touch Controls",
        description: "Ultra-low latency swipe detection for lane changes, slide rolls, and jump physics.",
        tag: "Input",
      },
    ],
    takeaways: [
      "Object pooling is non-negotiable for mobile 3D games: garbage collection spikes ruin player immersion faster than anything else.",
    ],
    shots: [
      {
        title: "RING BUFFER POOLING",
        tag: "ZERO-ALLOCATION",
        caption: "Chunk instancing without garbage collector spikes on low-tier mobile GPUs.",
        accent: "#ec4899",
      },
      {
        title: "PROCEDURAL CURVE TRACK",
        tag: "BEZIER GENERATION",
        caption: "Dynamic difficulty scaling based on player survival timecode.",
        accent: "#f43f5e",
      },
    ],
    meta: {
      duration: "00:40:00",
      format: "NTSC-SP",
      channel: "CH 20",
      quality: "STEREO-DOLBY",
    },
  },
  {
    id: "gunung-gede",
    code: "FRA_11",
    title: "GUNUNG GEDE SIMULATION",
    headline: "Realistic environmental simulation replicating Mount Gede hiking trail.",
    year: 2024,
    category: "3D TRAIL & ENVIRONMENT DESIGN",
    categoryFilter: "games",
    role: "Environment Artist & Scripter",
    client: "Virtual Trail Simulation",
    system: "Luau · Roblox Studio · Terrain Modeling",
    tags: ["Luau", "Roblox Studio", "Terrain Sculpting", "Atmospheric Lighting"],
    summary:
      "Realistic environmental simulation replicating the Mount Gede hiking trail via Gunung Putri route.",
    story:
      "Heightmap terrain sculpting and altitude-triggered volumetric weather zones. Scripted altitude-based weather zones that dynamically adjust ambient temperature, fog density, and wind audio cues as players hike up the mountain slope.",
    color: "#1b241c",
    wearSeed: 202405,
    image: "/projects/Gunung-Gede.webp",
    liveUrl: "https://www.roblox.com/games/125712163693709/Mount-Gede-Via-Gunung-Putri",
    githubUrl: "https://github.com/FerrelHD",
    metrics: [
      { label: "Trail Length", value: "Full Virtual Route" },
      { label: "Lighting", value: "Dynamic Volumetric" },
      { label: "Terrain", value: "Custom Heightmaps" },
      { label: "Platform", value: "Roblox Engine" },
    ],
    problem: {
      headline: "Recreating authentic mountaineering topography and atmospheric conditions virtually.",
      description:
        "Simulating the physical feel of ascending the Gunung Putri route on Mount Gede, spanning dense lower tropical rainforest to the rocky summit plateau and Surya Kencana meadow.",
    },
    architecture: {
      headline: "Heightmap terrain sculpting and altitude-triggered volumetric weather zones.",
      description:
        "Scripted altitude-based weather zones that dynamically adjust ambient temperature, fog density, and wind audio cues as players hike up the mountain slope.",
      highlights: [
        {
          title: "Altitude Atmosphere Controller",
          detail: "Dynamic Luau scripts transitioning sunlight scattering, wind particles, and fog as elevation increases.",
        },
        {
          title: "Topographic Accuracy",
          detail: "Modeled after real GPS trail waypoints from Pos 1 to Surya Kencana savanna.",
        },
      ],
    },
    features: [
      {
        title: "Realistic Rainforest Foliage",
        description: "Carefully staged Indonesian mossy forest vegetation and root-strewn trail obstacles.",
        tag: "Environment",
      },
      {
        title: "Surya Kencana Edelweiss Meadow",
        description: "Vast volcanic savanna with iconic edelweiss fields and morning mist effects.",
        tag: "Atmosphere",
      },
    ],
    takeaways: [
      "Atmospheric cues (ambient soundscapes, subtle fog depth, and directional lighting) do the heaviest lifting in creating environmental immersion.",
    ],
    shots: [
      {
        title: "VOLUMETRIC FOG CONTROLLER",
        tag: "ATMOSPHERE",
        caption: "Elevation-dependent Rayleigh scattering and tropical cloud layers.",
        accent: "#10b981",
      },
      {
        title: "SURYA KENCANA MEADOW",
        tag: "TERRAIN TOPOGRAPHY",
        caption: "1:1 GPS elevation survey replication from Pos 1 to summit saddle.",
        accent: "#84cc16",
      },
    ],
    meta: {
      duration: "01:20:00",
      format: "PAL-HQ",
      channel: "CH 22",
      quality: "HQ-HI-FI",
    },
  },
];
