"use client";

import { useMemo, useState } from "react";
import { COMPANIES } from "@/lib/data/companies";
import { useInvestmentStore } from "@/lib/store";
import { useStockData } from "@/lib/useStockData";
import { CompanyCard } from "./CompanyCard";
import { ExportButton } from "./ExportButton";
import { Star, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShortListPanel() {
  const { shortList, removeFromShortList, removeFromLongList } =
    useInvestmentStore();

  const shortListCompanies = useMemo(() => {
    return COMPANIES.filter((c) => shortList.includes(c.id));
  }, [shortList]);

  const tickers = useMemo(
    () => shortListCompanies.map((c) => c.ticker),
    [shortListCompanies]
  );

  const { data: stockData, loading, lastUpdated, refetch } = useStockData(tickers);

  // Portfolio summary stats
  const stats = useMemo(() => {
    const withData = shortListCompanies.filter(
      (c) => stockData[c.ticker]?.changePercent != null
    );
    if (!withData.length) return null;

    const gainers = withData.filter(
      (c) => (stockData[c.ticker]?.changePercent ?? 0) > 0
    ).length;
    const losers = withData.filter(
      (c) => (stockData[c.ticker]?.changePercent ?? 0) < 0
    ).length;
    const avgChange =
      withData.reduce(
        (sum, c) => sum + (stockData[c.ticker]?.changePercent ?? 0),
        0
      ) / withData.length;
    const totalMarketCap = shortListCompanies.reduce(
      (sum, c) => sum + (stockData[c.ticker]?.marketCap ?? 0),
      0
    );

    return { gainers, losers, avgChange, totalMarketCap };
  }, [shortListCompanies, stockData]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <h2 className="text-sm font-semibold text-gray-200">Short List</h2>
            <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded font-mono">
              {shortList.length}/30
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ExportButton companies={shortListCompanies} stockData={stockData} />
            <button
              onClick={refetch}
              className={cn(
                "p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors",
                loading && "animate-spin"
              )}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {lastUpdated && (
          <div className="text-xs text-gray-600 mb-2">
            Updated {lastUpdated.toLocaleTimeString()}
          </div>
        )}

        {/* Portfolio Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-800 rounded p-2 text-center">
              <div className="text-xs text-gray-500">Companies</div>
              <div className="text-sm font-bold font-mono">
                {shortList.length}
              </div>
            </div>
            <div className="bg-gray-800 rounded p-2 text-center">
              <div className="text-xs text-gray-500">Gainers</div>
              <div className="text-sm font-bold font-mono text-emerald-400">
                {stats.gainers}
              </div>
            </div>
            <div className="bg-gray-800 rounded p-2 text-center">
              <div className="text-xs text-gray-500">Losers</div>
              <div className="text-sm font-bold font-mono text-red-400">
                {stats.losers}
              </div>
            </div>
            <div className="bg-gray-800 rounded p-2 text-center">
              <div className="text-xs text-gray-500">Avg %</div>
              <div
                className={cn(
                  "text-sm font-bold font-mono",
                  stats.avgChange >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {stats.avgChange >= 0 ? "+" : ""}
                {stats.avgChange.toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Companies */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {shortListCompanies.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm mb-1">Your short list is empty</p>
            <p className="text-xs text-gray-700">
              Click the star icon on any company in the Long List to add it here
            </p>
          </div>
        ) : (
          shortListCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              stockData={stockData[company.ticker]}
              isLoading={loading && !stockData[company.ticker]}
              mode="shortlist"
              onRemoveFromShortList={() => removeFromShortList(company.id)}
              onRemove={() => {
                removeFromShortList(company.id);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
