export interface ThemeVars {
  primary: string;
  background: string;
  card: string;
  border: string;
  muted: string;
  mutedForeground: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  primaryHex: string;
  bgHex: string;
  vars: ThemeVars;
}

export const THEMES: Theme[] = [
  {
    id: "neon-cyan",
    name: "Neon Cyan",
    description: "Electric cyan on deep dark — the default signature look",
    primaryHex: "#00BFFF",
    bgHex: "#0a0a14",
    vars: {
      primary: "195 100% 50%",
      background: "240 20% 5%",
      card: "222 25% 9%",
      border: "240 10% 15%",
      muted: "240 10% 15%",
      mutedForeground: "240 5% 65%",
    },
  },
  {
    id: "purple-galaxy",
    name: "Purple Galaxy",
    description: "Vibrant violet on a deep cosmic dark",
    primaryHex: "#A855F7",
    bgHex: "#080810",
    vars: {
      primary: "271 91% 65%",
      background: "265 30% 4%",
      card: "265 25% 8%",
      border: "265 15% 14%",
      muted: "265 15% 14%",
      mutedForeground: "265 10% 60%",
    },
  },
  {
    id: "green-matrix",
    name: "Green Matrix",
    description: "Neon green on near-black — hacker aesthetic",
    primaryHex: "#00CC44",
    bgHex: "#030a04",
    vars: {
      primary: "135 100% 40%",
      background: "130 30% 3%",
      card: "130 20% 7%",
      border: "130 15% 12%",
      muted: "130 15% 12%",
      mutedForeground: "130 10% 55%",
    },
  },
  {
    id: "crimson-red",
    name: "Crimson Red",
    description: "Bold red on dark — intense and powerful",
    primaryHex: "#FF3B3B",
    bgHex: "#0f0404",
    vars: {
      primary: "0 100% 61%",
      background: "0 25% 4%",
      card: "0 20% 8%",
      border: "0 15% 14%",
      muted: "0 15% 14%",
      mutedForeground: "0 5% 60%",
    },
  },
  {
    id: "amber-gold",
    name: "Amber Gold",
    description: "Warm golden amber on a rich dark background",
    primaryHex: "#F59E0B",
    bgHex: "#0b0800",
    vars: {
      primary: "43 96% 56%",
      background: "40 30% 4%",
      card: "40 20% 8%",
      border: "40 15% 14%",
      muted: "40 15% 14%",
      mutedForeground: "40 10% 58%",
    },
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Deep sky blue on a dark navy — calm and professional",
    primaryHex: "#0EA5E9",
    bgHex: "#020810",
    vars: {
      primary: "199 89% 48%",
      background: "215 40% 4%",
      card: "215 30% 8%",
      border: "215 20% 14%",
      muted: "215 20% 14%",
      mutedForeground: "215 10% 60%",
    },
  },
];

export const DEFAULT_THEME_ID = "neon-cyan";

export function getThemeById(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const { vars } = theme;
  root.style.setProperty("--primary", vars.primary);
  root.style.setProperty("--ring", vars.primary);
  root.style.setProperty("--sidebar-primary", vars.primary);
  root.style.setProperty("--sidebar-ring", vars.primary);
  root.style.setProperty("--chart-1", vars.primary);
  root.style.setProperty("--background", vars.background);
  root.style.setProperty("--sidebar", vars.background);
  root.style.setProperty("--popover", vars.background);
  root.style.setProperty("--card", vars.card);
  root.style.setProperty("--secondary", vars.card);
  root.style.setProperty("--accent", vars.card);
  root.style.setProperty("--sidebar-accent", vars.card);
  root.style.setProperty("--border", vars.border);
  root.style.setProperty("--card-border", vars.border);
  root.style.setProperty("--sidebar-border", vars.border);
  root.style.setProperty("--popover-border", vars.border);
  root.style.setProperty("--input", vars.border);
  root.style.setProperty("--muted", vars.muted);
  root.style.setProperty("--muted-foreground", vars.mutedForeground);
}
