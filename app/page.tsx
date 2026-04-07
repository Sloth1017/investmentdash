"use client";

import { TrendsPanel } from "@/components/TrendsPanel";
import { LongListPanel } from "@/components/LongListPanel";
import { ShortListPanel } from "@/components/ShortListPanel";
import { useInvestmentStore } from "@/lib/store";
import { Activity, BarChart2, Layers } from "lucide-react";

export default function DashboardPage() {
  const { selectedTrends } = useInvestmentStore();

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
      {/* Top Header */}
      <header className="flex-shrink-0 border-b border-gray-800 bg-gray-950/90 backdrop-blur px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-violet-400" />
              <span className="text-base font-bold text-gray-100 tracking-tight">
                Investment Dashboard
              </span>
            </div>
            <span className="text-xs text-gray-600 border border-gray-800 px-2 py-0.5 rounded">
              Stock Analysis Funnel
            </span>
          </div>
          <div className="flex items-center gap-4">
            {selectedTrends.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs text-violet-400">
                  Filtering by {selectedTrends.length} trend
                  {selectedTrends.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-gray-500">
                Live data · 60s refresh
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 3-Column Kanban Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Column 1: Trends */}
        <div className="w-64 flex-shrink-0 border-r border-gray-800 bg-gray-950 overflow-hidden flex flex-col">
          <TrendsPanel />
        </div>

        {/* Column 2: Long List */}
        <div className="flex-1 border-r border-gray-800 bg-gray-950/50 overflow-hidden flex flex-col min-w-0">
          <LongListPanel />
        </div>

        {/* Column 3: Short List */}
        <div className="w-96 flex-shrink-0 bg-gray-950 overflow-hidden flex flex-col">
          <ShortListPanel />
        </div>
      </div>
    </div>
  );
}
