"use client";

import { TRENDS, Trend } from "@/lib/data/trends";
import { COMPANIES } from "@/lib/data/companies";
import { useInvestmentStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { TrendingUp, Users, Target, CheckCircle2 } from "lucide-react";

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all"
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
      <span className="text-xs font-mono text-gray-400 w-6 text-right">
        {score}
      </span>
    </div>
  );
}

function TrendCard({ trend }: { trend: Trend }) {
  const { selectedTrends, toggleTrend, longList } = useInvestmentStore();
  const isSelected = selectedTrends.includes(trend.id);
  const companyCount = COMPANIES.filter(
    (c) => longList.includes(c.id) && c.trendIds.includes(trend.id)
  ).length;

  return (
    <button
      onClick={() => toggleTrend(trend.id)}
      style={isSelected ? {
        borderColor: trend.accentHex,
        boxShadow: `0 0 0 1px ${trend.accentHex}40, inset 0 0 20px ${trend.accentHex}12`,
      } : undefined}
      className={cn(
        "w-full text-left p-3 rounded-lg border-2 transition-all duration-150",
        isSelected
          ? "bg-gray-800 border-transparent"
          : "bg-gray-900/60 border-gray-800 hover:border-gray-700 hover:bg-gray-800/40"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5", trend.color)} />
          <span className={cn("text-sm font-semibold leading-tight", isSelected ? "text-white" : "text-gray-200")}>
            {trend.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {isSelected && (
            <CheckCircle2 className={cn("w-3.5 h-3.5 flex-shrink-0", trend.textColor)} />
          )}
          <span
            className={cn(
              "text-xs font-mono font-bold px-1.5 py-0.5 rounded",
              isSelected ? cn(trend.bgColor, trend.textColor) : "bg-gray-800 text-gray-400"
            )}
          >
            {trend.composite_score.toFixed(1)}
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-3 leading-relaxed">
        {trend.description}
      </p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Social</span>
          <span>Tech Report</span>
        </div>
        <ScoreBar score={trend.social_score} />
        <ScoreBar score={trend.tech_trends_score} />
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-800">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Target className="w-3 h-3" />
          <span>TAM 2035</span>
        </div>
        <span className={cn("text-xs font-semibold font-mono", trend.textColor)}>
          ${trend.tam2035_usd_billions.toLocaleString()}B
        </span>
      </div>

      <div className="flex items-center justify-between mt-1.5">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Users className="w-3 h-3" />
          <span>Companies</span>
        </div>
        <span className="text-xs font-mono text-gray-400">{companyCount}</span>
      </div>
    </button>
  );
}

export function TrendsPanel() {
  const { selectedTrends, toggleTrend } = useInvestmentStore();
  const sortedTrends = [...TRENDS].sort(
    (a, b) => b.composite_score - a.composite_score
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-gray-200">Trends</h2>
          </div>
          {selectedTrends.length > 0 ? (
            <button
              onClick={() => selectedTrends.forEach((id) => toggleTrend(id))}
              className="text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2"
            >
              Clear {selectedTrends.length} filter{selectedTrends.length > 1 ? "s" : ""}
            </button>
          ) : (
            <span className="text-xs text-gray-600">Click to filter</span>
          )}
        </div>
      </div>

      {/* Trend Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sortedTrends.map((trend) => (
          <TrendCard key={trend.id} trend={trend} />
        ))}
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-gray-800 flex-shrink-0">
        <p className="text-xs text-gray-600 text-center">
          Score = weighted avg of social + tech trends
        </p>
      </div>
    </div>
  );
}
