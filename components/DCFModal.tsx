"use client";

import { useState } from "react";
import { Company } from "@/lib/data/companies";
import { runDCFScenarios, DEFAULT_SCENARIOS, DCFScenario } from "@/lib/dcf";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StockData {
  price?: number;
  marketCap?: number;
  sharesOutstanding?: number;
  revenuePerShare?: number;
}

interface DCFModalProps {
  company: Company;
  stockData?: StockData | null;
  open: boolean;
  onClose: () => void;
}

function ScenarioCard({
  result,
  currentPrice,
}: {
  result: ReturnType<typeof runDCFScenarios>[0];
  currentPrice: number;
}) {
  const { scenario, intrinsicValuePerShare, upsideDownside } = result;
  const isUp = upsideDownside > 0;
  const isFlat = Math.abs(upsideDownside) < 5;

  return (
    <div
      className={cn(
        "p-4 rounded-lg border",
        scenario.bgColor
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={cn("font-bold text-sm", scenario.color)}>
          {scenario.name}
        </span>
        <div className="flex items-center gap-1">
          {isFlat ? (
            <Minus className="w-3.5 h-3.5 text-gray-400" />
          ) : isUp ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
          )}
          <span
            className={cn(
              "text-sm font-bold",
              isFlat
                ? "text-gray-400"
                : isUp
                ? "text-emerald-400"
                : "text-red-400"
            )}
          >
            {upsideDownside > 0 ? "+" : ""}
            {upsideDownside.toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Intrinsic Value</span>
          <span className={cn("font-mono font-semibold", scenario.color)}>
            ${intrinsicValuePerShare.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Current Price</span>
          <span className="font-mono text-gray-300">
            ${currentPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Rev Growth</span>
          <span className="font-mono">
            {(scenario.revenueGrowthRate * 100).toFixed(0)}%/yr
          </span>
        </div>
        <div className="flex justify-between">
          <span>Discount Rate</span>
          <span className="font-mono">
            {(scenario.discountRate * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span>Terminal Growth</span>
          <span className="font-mono">
            {(scenario.terminalGrowthRate * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span>Margin Expansion</span>
          <span className="font-mono">
            {scenario.marginExpansion > 0 ? "+" : ""}
            {(scenario.marginExpansion * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function DCFModal({ company, stockData, open, onClose }: DCFModalProps) {
  const currentPrice = stockData?.price ?? 0;
  const marketCap = stockData?.marketCap ?? 0;
  const sharesOutstanding = stockData?.sharesOutstanding ?? 1e9;
  const revenuePerShare = stockData?.revenuePerShare ?? 0;
  const currentRevenue = revenuePerShare * sharesOutstanding;
  const netDebt = 0;
  const currentNetMargin = 0.08;

  const [scenarios, setScenarios] = useState<DCFScenario[]>(DEFAULT_SCENARIOS);

  const results = currentPrice > 0 && currentRevenue > 0
    ? runDCFScenarios(
        currentRevenue,
        currentNetMargin,
        sharesOutstanding,
        netDebt,
        currentPrice
      )
    : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-lg font-bold">{company.name}</span>
            <span className="text-sm text-gray-400 font-mono">
              {company.ticker} · {company.exchange}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Metrics */}
          {stockData && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Current Price</div>
                <div className="text-lg font-bold font-mono">
                  ${currentPrice.toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Market Cap</div>
                <div className="text-lg font-bold font-mono">
                  {marketCap >= 1e12
                    ? `$${(marketCap / 1e12).toFixed(1)}T`
                    : marketCap >= 1e9
                    ? `$${(marketCap / 1e9).toFixed(1)}B`
                    : `$${(marketCap / 1e6).toFixed(0)}M`}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Est. Revenue</div>
                <div className="text-lg font-bold font-mono">
                  {currentRevenue >= 1e9
                    ? `$${(currentRevenue / 1e9).toFixed(1)}B`
                    : currentRevenue > 0
                    ? `$${(currentRevenue / 1e6).toFixed(0)}M`
                    : "N/A"}
                </div>
              </div>
            </div>
          )}

          {/* Assumptions note */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-xs text-yellow-400">
              DCF assumptions use estimated 8% starting net margin. Adjust
              scenarios below. Terminal value uses Gordon Growth Model. This is
              illustrative only — not financial advice.
            </p>
          </div>

          {/* DCF Scenarios */}
          {results ? (
            <div className="grid grid-cols-3 gap-3">
              {results.map((result) => (
                <ScenarioCard
                  key={result.scenario.name}
                  result={result}
                  currentPrice={currentPrice}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-500 text-sm">
                Stock data unavailable. DCF requires live price and revenue
                data.
              </p>
            </div>
          )}

          {/* Company Links */}
          <div className="flex gap-2 pt-2 border-t border-gray-800">
            <a
              href={company.earningsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              Earnings Reports
            </a>
            <span className="text-gray-700">·</span>
            <a
              href={company.execTeamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              Exec Team
            </a>
            <span className="text-gray-700">·</span>
            <a
              href={`https://finance.yahoo.com/quote/${company.ticker}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              Yahoo Finance
            </a>
            <span className="text-gray-700">·</span>
            <a
              href={`https://news.google.com/search?q=${encodeURIComponent(company.newsQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              News
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
