export interface ThemeVars {
  primary: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
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
  mode: "dark" | "light";
  vars: ThemeVars;
}

const DARK_FG = "210 40% 98%";
const DARK_CARD_FG = "210 40% 98%";

export const THEMES: Theme[] = [
  {
    id: "neon-cyan",
    name: "Neon Cyan",
    description: "Electric cyan on deep dark — the default signature look",
    primaryHex: "#00BFFF",
    bgHex: "#0a0a14",
    mode: "dark",
    vars: {
      primary: "195 100% 50%",
      background: "240 20% 5%",
      foreground: DARK_FG,
      card: "222 25% 9%",
      cardForeground: DARK_CARD_FG,
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
    mode: "dark",
    vars: {
      primary: "271 91% 65%",
      background: "265 30% 4%",
      foreground: DARK_FG,
      card: "265 25% 8%",
      cardForeground: DARK_CARD_FG,
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
    mode: "dark",
    vars: {
      primary: "135 100% 40%",
      background: "130 30% 3%",
      foreground: DARK_FG,
      card: "130 20% 7%",
      cardForeground: DARK_CARD_FG,
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
    mode: "dark",
    vars: {
      primary: "0 100% 61%",
      background: "0 25% 4%",
      foreground: DARK_FG,
      card: "0 20% 8%",
      cardForeground: DARK_CARD_FG,
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
    mode: "dark",
    vars: {
      primary: "43 96% 56%",
      background: "40 30% 4%",
      foreground: DARK_FG,
      card: "40 20% 8%",
      cardForeground: DARK_CARD_FG,
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
    mode: "dark",
    vars: {
      primary: "199 89% 48%",
      background: "215 40% 4%",
      foreground: DARK_FG,
      card: "215 30% 8%",
      cardForeground: DARK_CARD_FG,
      border: "215 20% 14%",
      muted: "215 20% 14%",
      mutedForeground: "215 10% 60%",
    },
  },
  {
    id: "rose-pink",
    name: "Rose Pink",
    description: "Hot pink neon on dark — bold and vibrant",
    primaryHex: "#FF2D78",
    bgHex: "#0f0208",
    mode: "dark",
    vars: {
      primary: "341 100% 58%",
      background: "330 30% 4%",
      foreground: DARK_FG,
      card: "330 22% 8%",
      cardForeground: DARK_CARD_FG,
      border: "330 15% 14%",
      muted: "330 15% 14%",
      mutedForeground: "330 8% 58%",
    },
  },
  {
    id: "electric-lime",
    name: "Electric Lime",
    description: "Neon yellow-green on pitch black — high contrast energy",
    primaryHex: "#B5FF00",
    bgHex: "#050803",
    mode: "dark",
    vars: {
      primary: "75 100% 50%",
      background: "80 25% 3%",
      foreground: DARK_FG,
      card: "80 18% 7%",
      cardForeground: DARK_CARD_FG,
      border: "80 14% 12%",
      muted: "80 14% 12%",
      mutedForeground: "80 8% 52%",
    },
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    description: "Vivid orange on deep dark — warm and energetic",
    primaryHex: "#FF6B1A",
    bgHex: "#0d0502",
    mode: "dark",
    vars: {
      primary: "22 100% 56%",
      background: "20 28% 4%",
      foreground: DARK_FG,
      card: "20 22% 8%",
      cardForeground: DARK_CARD_FG,
      border: "20 15% 14%",
      muted: "20 15% 14%",
      mutedForeground: "20 8% 58%",
    },
  },
  {
    id: "deep-violet",
    name: "Deep Violet",
    description: "Royal violet on near-black — mysterious and rich",
    primaryHex: "#7B2FBE",
    bgHex: "#080510",
    mode: "dark",
    vars: {
      primary: "277 61% 47%",
      background: "270 35% 4%",
      foreground: DARK_FG,
      card: "270 28% 8%",
      cardForeground: DARK_CARD_FG,
      border: "270 18% 13%",
      muted: "270 18% 13%",
      mutedForeground: "270 10% 58%",
    },
  },
  {
    id: "arctic-teal",
    name: "Arctic Teal",
    description: "Icy teal on deep space dark — clean and futuristic",
    primaryHex: "#00E5CC",
    bgHex: "#020d0b",
    mode: "dark",
    vars: {
      primary: "174 100% 45%",
      background: "174 35% 3%",
      foreground: DARK_FG,
      card: "174 25% 7%",
      cardForeground: DARK_CARD_FG,
      border: "174 18% 12%",
      muted: "174 18% 12%",
      mutedForeground: "174 10% 55%",
    },
  },
  {
    id: "blood-moon",
    name: "Blood Moon",
    description: "Deep burgundy red — dark and dramatic",
    primaryHex: "#CC2200",
    bgHex: "#0d0101",
    mode: "dark",
    vars: {
      primary: "8 100% 40%",
      background: "5 30% 4%",
      foreground: DARK_FG,
      card: "5 22% 8%",
      cardForeground: DARK_CARD_FG,
      border: "5 15% 13%",
      muted: "5 15% 13%",
      mutedForeground: "5 5% 55%",
    },
  },
  {
    id: "solar-gold",
    name: "Solar Gold",
    description: "Bright gold on dark — regal and prestigious",
    primaryHex: "#FFD700",
    bgHex: "#0a0900",
    mode: "dark",
    vars: {
      primary: "51 100% 50%",
      background: "50 35% 3%",
      foreground: DARK_FG,
      card: "50 25% 7%",
      cardForeground: DARK_CARD_FG,
      border: "50 18% 12%",
      muted: "50 18% 12%",
      mutedForeground: "50 10% 55%",
    },
  },
  {
    id: "neon-mint",
    name: "Neon Mint",
    description: "Fresh mint green on dark — cool and refreshing",
    primaryHex: "#00FF88",
    bgHex: "#020a05",
    mode: "dark",
    vars: {
      primary: "152 100% 50%",
      background: "150 30% 3%",
      foreground: DARK_FG,
      card: "150 22% 7%",
      cardForeground: DARK_CARD_FG,
      border: "150 15% 12%",
      muted: "150 15% 12%",
      mutedForeground: "150 8% 55%",
    },
  },
  /* ── Light themes ── */
  {
    id: "clean-white",
    name: "Clean White",
    description: "Pure white background with cyan accent — bright and minimal",
    primaryHex: "#0099CC",
    bgHex: "#ffffff",
    mode: "light",
    vars: {
      primary: "196 100% 40%",
      background: "0 0% 100%",
      foreground: "222 47% 11%",
      card: "210 20% 96%",
      cardForeground: "222 47% 11%",
      border: "214 20% 88%",
      muted: "210 20% 93%",
      mutedForeground: "215 16% 47%",
    },
  },
  {
    id: "soft-light",
    name: "Soft Light",
    description: "Warm light gray with indigo accent — soft and professional",
    primaryHex: "#4F46E5",
    bgHex: "#f8f9fc",
    mode: "light",
    vars: {
      primary: "243 75% 59%",
      background: "230 30% 97%",
      foreground: "222 47% 11%",
      card: "0 0% 100%",
      cardForeground: "222 47% 11%",
      border: "220 20% 88%",
      muted: "220 20% 92%",
      mutedForeground: "215 16% 47%",
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

  root.style.setProperty("--foreground", vars.foreground);
  root.style.setProperty("--card-foreground", vars.cardForeground);
  root.style.setProperty("--popover-foreground", vars.cardForeground);
  root.style.setProperty("--sidebar-foreground", vars.foreground);
  root.style.setProperty("--secondary-foreground", vars.foreground);
  root.style.setProperty("--accent-foreground", vars.foreground);

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

  root.setAttribute("data-theme-mode", theme.mode);
}
