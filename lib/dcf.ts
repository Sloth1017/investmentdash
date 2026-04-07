export interface DCFScenario {
  name: "Bear" | "Base" | "Bull";
  revenueGrowthRate: number;
  terminalGrowthRate: number;
  discountRate: number;
  marginExpansion: number;
  color: string;
  bgColor: string;
}

export interface DCFResult {
  scenario: DCFScenario;
  intrinsicValuePerShare: number;
  upsideDownside: number;
}

export const DEFAULT_SCENARIOS: DCFScenario[] = [
  {
    name: "Bear",
    revenueGrowthRate: 0.05,
    terminalGrowthRate: 0.02,
    discountRate: 0.12,
    marginExpansion: -0.02,
    color: "text-red-400",
    bgColor: "bg-red-500/10 border-red-500/20",
  },
  {
    name: "Base",
    revenueGrowthRate: 0.15,
    terminalGrowthRate: 0.03,
    discountRate: 0.10,
    marginExpansion: 0.02,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    name: "Bull",
    revenueGrowthRate: 0.30,
    terminalGrowthRate: 0.04,
    discountRate: 0.09,
    marginExpansion: 0.05,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
  },
];

export function calculateDCF(
  currentRevenue: number,
  currentNetMargin: number,
  sharesOutstanding: number,
  netDebt: number,
  scenario: DCFScenario,
  years = 10
): number {
  let revenue = currentRevenue;
  let margin = currentNetMargin;
  let totalPV = 0;

  for (let i = 1; i <= years; i++) {
    revenue *= 1 + scenario.revenueGrowthRate;
    margin += scenario.marginExpansion / years;
    const fcf = revenue * Math.max(margin, 0.01);
    const pv = fcf / Math.pow(1 + scenario.discountRate, i);
    totalPV += pv;
  }

  const terminalFCF =
    revenue * Math.max(margin, 0.01) * (1 + scenario.terminalGrowthRate);
  const terminalValue =
    terminalFCF / (scenario.discountRate - scenario.terminalGrowthRate);
  const terminalPV =
    terminalValue / Math.pow(1 + scenario.discountRate, years);

  const enterpriseValue = totalPV + terminalPV;
  const equityValue = enterpriseValue - netDebt;
  return Math.max(equityValue / sharesOutstanding, 0);
}

export function runDCFScenarios(
  currentRevenue: number,
  currentNetMargin: number,
  sharesOutstanding: number,
  netDebt: number,
  currentPrice: number
): DCFResult[] {
  return DEFAULT_SCENARIOS.map((scenario) => {
    const intrinsicValuePerShare = calculateDCF(
      currentRevenue,
      currentNetMargin,
      sharesOutstanding,
      netDebt,
      scenario
    );
    const upsideDownside =
      currentPrice > 0
        ? ((intrinsicValuePerShare - currentPrice) / currentPrice) * 100
        : 0;
    return { scenario, intrinsicValuePerShare, upsideDownside };
  });
}
