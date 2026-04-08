export interface Trend {
  id: string;
  name: string;
  description: string;
  tam2035_usd_billions: number;
  social_score: number;
  tech_trends_score: number;
  composite_score: number;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  accentHex: string;
}

export const TRENDS: Trend[] = [
  {
    id: "ai-infrastructure",
    name: "AI Infrastructure",
    description: "Chips, data centers, cloud, networking — the picks & shovels of AI",
    tam2035_usd_billions: 1200,
    social_score: 10,
    tech_trends_score: 10,
    composite_score: 9.8,
    color: "bg-violet-500",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-400",
    borderColor: "border-violet-500",
    accentHex: "#8b5cf6",
  },
  {
    id: "ai-applications",
    name: "AI Applications",
    description: "AI-native software, vertical AI, AI-powered SaaS",
    tam2035_usd_billions: 750,
    social_score: 9,
    tech_trends_score: 9,
    composite_score: 9.0,
    color: "bg-blue-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    borderColor: "border-blue-500",
    accentHex: "#3b82f6",
  },
  {
    id: "fintech-crypto",
    name: "Fintech & Crypto",
    description: "Neo-banks, stablecoins, real-world assets, DeFi infrastructure",
    tam2035_usd_billions: 900,
    social_score: 9,
    tech_trends_score: 8,
    composite_score: 8.7,
    color: "bg-emerald-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500",
    accentHex: "#10b981",
  },
  {
    id: "ai-defense",
    name: "AI Defense & Autonomous Systems",
    description: "Drone warfare, autonomous vehicles, defense AI, surveillance",
    tam2035_usd_billions: 450,
    social_score: 8,
    tech_trends_score: 9,
    composite_score: 8.5,
    color: "bg-red-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
    borderColor: "border-red-500",
    accentHex: "#ef4444",
  },
  {
    id: "health-biotech",
    name: "Health & Biotech AI",
    description: "AI drug discovery, telehealth, digital health platforms",
    tam2035_usd_billions: 500,
    social_score: 7,
    tech_trends_score: 8,
    composite_score: 7.6,
    color: "bg-pink-500",
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-400",
    borderColor: "border-pink-500",
    accentHex: "#ec4899",
  },
  {
    id: "space-robotics",
    name: "Space & Robotics",
    description: "Commercial space, satellite networks, humanoid robots",
    tam2035_usd_billions: 380,
    social_score: 7,
    tech_trends_score: 8,
    composite_score: 7.5,
    color: "bg-orange-500",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-400",
    borderColor: "border-orange-500",
    accentHex: "#f97316",
  },
  {
    id: "energy-climate",
    name: "Energy & Climate Tech",
    description: "Nuclear, grid AI, clean energy, energy storage",
    tam2035_usd_billions: 600,
    social_score: 7,
    tech_trends_score: 8,
    composite_score: 7.4,
    color: "bg-yellow-500",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-500",
    accentHex: "#eab308",
  },
];
