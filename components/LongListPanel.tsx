"use client";

import { useMemo } from "react";
import { COMPANIES } from "@/lib/data/companies";
import { useInvestmentStore } from "@/lib/store";
import { useStockData, StockDataMap } from "@/lib/useStockData";
import { CompanyCard } from "./CompanyCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { List, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function LongListPanel() {
  const {
    longList,
    shortList,
    selectedTrends,
    searchQuery,
    sortBy,
    sortOrder,
    removeFromLongList,
    addToShortList,
    removeFromShortList,
    setSearchQuery,
    setSortBy,
    setSortOrder,
  } = useInvestmentStore();

  const longListCompanies = useMemo(() => {
    return COMPANIES.filter((c) => longList.includes(c.id));
  }, [longList]);

  const tickers = useMemo(
    () => longListCompanies.map((c) => c.ticker),
    [longListCompanies]
  );

  const { data: stockData, loading, lastUpdated, refetch } = useStockData(tickers);

  const filtered = useMemo(() => {
    let companies = longListCompanies;

    // Filter by selected trends
    if (selectedTrends.length > 0) {
      companies = companies.filter((c) =>
        c.trendIds.some((t) => selectedTrends.includes(t))
      );
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      companies = companies.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.ticker.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    // Sort
    companies = [...companies].sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      if (sortBy === "name") {
        aVal = a.name;
        bVal = b.name;
      } else if (sortBy === "marketCap") {
        aVal = stockData[a.ticker]?.marketCap ?? 0;
        bVal = stockData[b.ticker]?.marketCap ?? 0;
      } else if (sortBy === "changePercent") {
        aVal = stockData[a.ticker]?.changePercent ?? -999;
        bVal = stockData[b.ticker]?.changePercent ?? -999;
      } else if (sortBy === "price") {
        aVal = stockData[a.ticker]?.price ?? 0;
        bVal = stockData[b.ticker]?.price ?? 0;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortOrder === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return companies;
  }, [longListCompanies, selectedTrends, searchQuery, sortBy, sortOrder, stockData]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-gray-200">Long List</h2>
            <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded font-mono">
              {filtered.length}/{longList.length}
            </span>
          </div>
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

        {lastUpdated && (
          <div className="text-xs text-gray-600 mb-2">
            Updated {lastUpdated.toLocaleTimeString()}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-600"
          />
        </div>

        {/* Sort controls */}
        <div className="flex gap-2">
          <Select
            value={sortBy}
            onValueChange={(v) =>
              setSortBy(v as "marketCap" | "name" | "changePercent" | "price")
            }
          >
            <SelectTrigger className="h-7 text-xs bg-gray-800 border-gray-700 flex-1">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="marketCap" className="text-xs">Market Cap</SelectItem>
              <SelectItem value="name" className="text-xs">Name</SelectItem>
              <SelectItem value="changePercent" className="text-xs">Day Change %</SelectItem>
              <SelectItem value="price" className="text-xs">Price</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortOrder}
            onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
          >
            <SelectTrigger className="h-7 text-xs bg-gray-800 border-gray-700 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="desc" className="text-xs">Desc</SelectItem>
              <SelectItem value="asc" className="text-xs">Asc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Companies */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <List className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No companies match your filters</p>
          </div>
        ) : (
          filtered.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              stockData={stockData[company.ticker]}
              isLoading={loading && !stockData[company.ticker]}
              mode="longlist"
              onAddToShortList={() => addToShortList(company.id)}
              onRemoveFromShortList={() => removeFromShortList(company.id)}
              onRemove={() => removeFromLongList(company.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
