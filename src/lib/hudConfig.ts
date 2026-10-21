export interface HudConfig {
  // 1. Text Labels
  navHome: string;
  navReels: string;
  brandText: string;
  navProfile: string;
  navArchive: string;
  navContact: string;
  footerSource: string;
  footerEmailLabel: string;

  // 2. Header Spacing & Geometry (in px)
  headerPaddingTop: number;
  headerPaddingX: number;
  headerGapLeft: number;   // Spacing between HOME & Timecode
  headerGapRight: number;  // Spacing between Nav Links
  brandFontSize: number;
  navFontSize: number;
  timecodeFontSize: number;

  // 3. Footer Spacing & Geometry (in px)
  footerPaddingBottom: number;
  footerPaddingX: number;
  footerGapLeft: number;
  footerGapRight: number;
  footerFontSize: number;
}

export const DEFAULT_HUD_CONFIG: HudConfig = {
  // Texts
  navHome: "HOME",
  navReels: "← REELS",
  brandText: "FRA ©'26",
  navProfile: "PROFILE",
  navArchive: "ARCHIVE",
  navContact: "CONTACT",
  footerSource: "SOURCE: MAC",
  footerEmailLabel: "EMAIL",

  // Header Geometry
  headerPaddingTop: 42,
  headerPaddingX: 48,
  headerGapLeft: 110,
  headerGapRight: 52,
  brandFontSize: 28,
  navFontSize: 12,
  timecodeFontSize: 12,

  // Footer Geometry
  footerPaddingBottom: 42,
  footerPaddingX: 48,
  footerGapLeft: 24,
  footerGapRight: 24,
  footerFontSize: 12,
};

const STORAGE_KEY = "vhs_hud_calibration_v1";

export function loadHudConfig(): HudConfig {
  if (typeof window === "undefined") return DEFAULT_HUD_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HUD_CONFIG;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_HUD_CONFIG, ...parsed };
  } catch {
    return DEFAULT_HUD_CONFIG;
  }
}

export function saveHudConfig(cfg: HudConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {}
}

export function exportConfigAsText(cfg: HudConfig): string {
  return JSON.stringify(cfg, null, 2);
}
