"use client";

import { useState, useEffect, useRef } from "react";

export interface StockQuote {
  price?: number;
  changePercent?: number;
  change?: number;
  marketCap?: number;
  volume?: number;
  previousClose?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  trailingPE?: number;
  forwardPE?: number;
  sharesOutstanding?: number;
  revenuePerShare?: number;
}

export type StockDataMap = Record<string, StockQuote | null>;

const BATCH_SIZE = 10;
const REFRESH_INTERVAL_MS = 60_000;

export function useStockData(tickers: string[]) {
  const [data, setData] = useState<StockDataMap>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const fetchedRef = useRef<Set<string>>(new Set());

  async function fetchBatch(symbols: string[]) {
    if (!symbols.length) return;
    try {
      const res = await fetch(
        `/api/stocks?symbols=${symbols.join(",")}`
      );
      if (!res.ok) return;
      const json = await res.json();
      setData((prev) => ({ ...prev, ...json }));
    } catch {
      // silently fail
    }
  }

  async function fetchAll(symbols: string[]) {
    setLoading(true);
    const batches: string[][] = [];
    for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
      batches.push(symbols.slice(i, i + BATCH_SIZE));
    }
    await Promise.allSettled(batches.map((b) => fetchBatch(b)));
    setLoading(false);
    setLastUpdated(new Date());
  }

  useEffect(() => {
    const newTickers = tickers.filter((t) => !fetchedRef.current.has(t));
    if (newTickers.length === 0) return;
    newTickers.forEach((t) => fetchedRef.current.add(t));
    fetchAll(newTickers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickers.join(",")]);

  // Periodic refresh
  useEffect(() => {
    if (!tickers.length) return;
    const interval = setInterval(() => {
      fetchAll(tickers);
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickers.join(",")]);

  return { data, loading, lastUpdated, refetch: () => fetchAll(tickers) };
}
