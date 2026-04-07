"use client";

import { Company } from "@/lib/data/companies";
import { StockDataMap } from "@/lib/useStockData";
import { TRENDS } from "@/lib/data/trends";
import { Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExportButtonProps {
  companies: Company[];
  stockData: StockDataMap;
}

export function ExportButton({ companies, stockData }: ExportButtonProps) {
  async function handleExport() {
    // Lazy-load xlsx
    const XLSX = await import("xlsx");

    const rows = companies.map((c) => {
      const stock = stockData[c.ticker];
      const trends = TRENDS.filter((t) => c.trendIds.includes(t.id))
        .map((t) => t.name)
        .join(", ");

      const marketCap = stock?.marketCap
        ? stock.marketCap >= 1e12
          ? `$${(stock.marketCap / 1e12).toFixed(1)}T`
          : `$${(stock.marketCap / 1e9).toFixed(1)}B`
        : "";

      return {
        Name: c.name,
        Ticker: c.ticker,
        Exchange: c.exchange,
        Trends: trends,
        Description: c.description,
        "Est. Customers": c.estimatedCustomers ?? "",
        "Price ($)": stock?.price?.toFixed(2) ?? "",
        "Day Change (%)": stock?.changePercent?.toFixed(2) ?? "",
        "Market Cap": marketCap,
        "52w High": stock?.fiftyTwoWeekHigh?.toFixed(2) ?? "",
        "52w Low": stock?.fiftyTwoWeekLow?.toFixed(2) ?? "",
        "P/E (TTM)": stock?.trailingPE?.toFixed(1) ?? "",
        Website: c.website,
        "Earnings URL": c.earningsUrl,
        "Exec Team URL": c.execTeamUrl,
        Notes: c.notes ?? "",
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto-width columns
    const colWidths = Object.keys(rows[0] ?? {}).map((key) => ({
      wch: Math.max(
        key.length,
        ...rows.map((r) => String(r[key as keyof typeof r]).length)
      ),
    }));
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Short List");

    const date = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `investment-short-list-${date}.xlsx`);
  }

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={handleExport}
        disabled={companies.length === 0}
        className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-emerald-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-0 bg-transparent cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
      </TooltipTrigger>
      <TooltipContent>Export to Excel</TooltipContent>
    </Tooltip>
  );
}
