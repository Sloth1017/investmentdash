"use client";

import { useState } from "react";
import { Company } from "@/lib/data/companies";
import { TRENDS } from "@/lib/data/trends";
import { useInvestmentStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronRight,
  X,
  Star,
  StarOff,
  ExternalLink,
  BarChart3,
  Users,
} from "lucide-react";
import { DCFModal } from "./DCFModal";

interface StockQuote {
  price?: number;
  changePercent?: number;
  change?: number;
  marketCap?: number;
  volume?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  trailingPE?: number;
  sharesOutstanding?: number;
  revenuePerShare?: number;
}

interface CompanyCardProps {
  company: Company;
  stockData?: StockQuote | null;
  isLoading?: boolean;
  mode: "longlist" | "shortlist";
  onAddToShortList?: () => void;
  onRemoveFromShortList?: () => void;
  onRemove?: () => void;
}

function formatMarketCap(cap?: number): string {
  if (!cap) return "—";
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(1)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(1)}B`;
  return `$${(cap / 1e6).toFixed(0)}M`;
}

function formatVolume(vol?: number): string {
  if (!vol) return "—";
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(1)}M`;
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(0)}K`;
  return `${vol}`;
}

export function CompanyCard({
  company,
  stockData,
  isLoading,
  mode,
  onAddToShortList,
  onRemoveFromShortList,
  onRemove,
}: CompanyCardProps) {
  const [dcfOpen, setDcfOpen] = useState(false);
  const { shortList } = useInvestmentStore();
  const isOnShortList = shortList.includes(company.id);

  const trendBadges = TRENDS.filter((t) => company.trendIds.includes(t.id));

  const priceChange = stockData?.changePercent;
  const isPositive = priceChange !== undefined && priceChange >= 0;

  return (
    <>
      <div
        className={cn(
          "group bg-gray-900 border border-gray-800 rounded-lg p-3",
          "hover:border-gray-700 hover:bg-gray-900/80 transition-all duration-150"
        )}
      >
        {/* Top row: name + ticker + price */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-gray-100 truncate">
                {company.name}
              </span>
              <span className="text-xs font-mono text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                {company.ticker}
              </span>
              <span className="text-xs text-gray-600">{company.exchange}</span>
            </div>
          </div>

          {/* Price section */}
          <div className="text-right flex-shrink-0">
            {isLoading ? (
              <div className="h-5 w-16 bg-gray-800 rounded animate-pulse" />
            ) : stockData?.price ? (
              <>
                <div className="text-sm font-bold font-mono text-gray-100">
                  ${stockData.price.toFixed(2)}
                </div>
                <div
                  className={cn(
                    "text-xs font-mono font-semibold",
                    isPositive ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {priceChange?.toFixed(2)}%
                </div>
              </>
            ) : (
              <div className="text-xs text-gray-600">No data</div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed mb-2 line-clamp-2">
          {company.description}
        </p>

        {/* Trend badges */}
        <div className="flex flex-wrap gap-1 mb-2">
          {trendBadges.map((trend) => (
            <span
              key={trend.id}
              className={cn(
                "text-xs px-1.5 py-0.5 rounded font-medium",
                trend.bgColor,
                trend.textColor
              )}
            >
              {trend.name.split(" ")[0]}
            </span>
          ))}
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
          <div>
            <div className="text-gray-600">Mkt Cap</div>
            <div className="font-mono text-gray-300">
              {isLoading ? (
                <span className="inline-block h-3 w-12 bg-gray-800 rounded animate-pulse" />
              ) : (
                formatMarketCap(stockData?.marketCap)
              )}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Volume</div>
            <div className="font-mono text-gray-300">
              {isLoading ? (
                <span className="inline-block h-3 w-10 bg-gray-800 rounded animate-pulse" />
              ) : (
                formatVolume(stockData?.volume)
              )}
            </div>
          </div>
          <div>
            <div className="text-gray-600">P/E</div>
            <div className="font-mono text-gray-300">
              {isLoading ? (
                <span className="inline-block h-3 w-8 bg-gray-800 rounded animate-pulse" />
              ) : stockData?.trailingPE ? (
                stockData.trailingPE.toFixed(1) + "x"
              ) : (
                "—"
              )}
            </div>
          </div>
        </div>

        {/* 52-week range */}
        {stockData?.fiftyTwoWeekLow && stockData?.fiftyTwoWeekHigh && stockData?.price && (
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>${stockData.fiftyTwoWeekLow.toFixed(0)}</span>
              <span className="text-gray-500">52wk</span>
              <span>${stockData.fiftyTwoWeekHigh.toFixed(0)}</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500/60 rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(0, ((stockData.price - stockData.fiftyTwoWeekLow) / (stockData.fiftyTwoWeekHigh - stockData.fiftyTwoWeekLow)) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Customers */}
        {company.estimatedCustomers && (
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
            <Users className="w-3 h-3" />
            <span>{company.estimatedCustomers}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800 gap-1">
          <div className="flex items-center gap-1">
            {/* Earnings link */}
            <Tooltip>
              <TooltipTrigger className="p-0 border-0 bg-transparent">
                <a
                  href={company.earningsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-blue-400 transition-colors flex"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                </a>
              </TooltipTrigger>
              <TooltipContent>Earnings Reports</TooltipContent>
            </Tooltip>

            {/* Website link */}
            <Tooltip>
              <TooltipTrigger className="p-0 border-0 bg-transparent">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-blue-400 transition-colors flex"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </TooltipTrigger>
              <TooltipContent>Company Website</TooltipContent>
            </Tooltip>

            {/* DCF button */}
            <Tooltip>
              <TooltipTrigger
                onClick={() => setDcfOpen(true)}
                className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-violet-400 transition-colors text-xs font-mono border-0 bg-transparent cursor-pointer"
              >
                DCF
              </TooltipTrigger>
              <TooltipContent>Run DCF Analysis</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-1">
            {/* Short list toggle */}
            {mode === "longlist" && (
              <Tooltip>
                <TooltipTrigger
                  onClick={isOnShortList ? onRemoveFromShortList : onAddToShortList}
                  className={cn(
                    "p-1 rounded transition-colors border-0 bg-transparent cursor-pointer",
                    isOnShortList
                      ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                      : "text-gray-600 hover:text-yellow-400 hover:bg-gray-800"
                  )}
                >
                  {isOnShortList ? (
                    <Star className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <StarOff className="w-3.5 h-3.5" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {isOnShortList ? "Remove from Short List" : "Add to Short List"}
                </TooltipContent>
              </Tooltip>
            )}

            {/* Remove button */}
            {onRemove && (
              <Tooltip>
                <TooltipTrigger
                  onClick={onRemove}
                  className="p-1 rounded text-gray-700 hover:text-red-400 hover:bg-gray-800 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </TooltipTrigger>
                <TooltipContent>Remove from list</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {company.notes && (
          <div className="mt-2 text-xs text-amber-500/70 bg-amber-500/5 border border-amber-500/10 rounded px-2 py-1">
            {company.notes}
          </div>
        )}
      </div>

      <DCFModal
        company={company}
        stockData={stockData}
        open={dcfOpen}
        onClose={() => setDcfOpen(false)}
      />
    </>
  );
}
