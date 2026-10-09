export type Project = {
  slug: string;
  title: string;
  kicker: string;
  meta: string;
  href?: string;
  status?: string;
};

export const projects: Project[] = [
  {
    slug: "della",
    title: "Della",
    kicker: "AI operator for nail salons",
    meta: "Started Mar 11, 2026",
    href: "/work/della",
    status: "hardening communications",
  },
  {
    slug: "vialgrade",
    title: "VialGrade",
    kicker: "Evidence-backed peptide market intelligence",
    meta: "Live at vialgrade.com",
    href: "/work/vialgrade",
    status: "production",
  },
  {
    slug: "transformer",
    title: "Transformer",
    kicker: "10.79M parameter GPT-style model + visualizer",
    meta: "PyTorch · Next.js · Three.js",
    href: "/work/transformer",
    status: "shipped",
  },
  {
    slug: "lot",
    title: "LOT",
    kicker: "Real-estate acquisition research system",
    meta: "public data · underwriting · decisions",
    href: "https://github.com/pegg-dot/real-estate-platform",
    status: "building",
  },
  {
    slug: "webbuddy",
    title: "WebBuddy",
    kicker: "Website generator for salons",
    meta: "onboarding · templates · integrations",
    status: "building",
  },
  {
    slug: "npgktrades",
    title: "NPGKTrades",
    kicker: "Deterministic copy-trading system",
    meta: "detect · size · risk-check · execute",
    href: "https://github.com/pegg-dot/NPGKTrades",
    status: "built",
  },
  {
    slug: "plastic",
    title: "Say No To Plastic",
    kicker: "Interactive science + book experience",
    meta: "research communication · WebGL",
    href: "https://saynotoplastic.com",
    status: "live",
  },
  {
    slug: "grounds-guide",
    title: "Grounds Guide",
    kicker: "Campus routing + spatial truth",
    meta: "GIS · entrances · route verification",
    href: "/work/grounds-guide",
    status: "building",
  },
  {
    slug: "hoos-moving",
    title: "HOOS Moving",
    kicker: "UVA project",
    meta: "details coming in",
    status: "building",
  },
];
