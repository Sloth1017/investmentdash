import { NextRequest, NextResponse } from "next/server";
import YahooFinanceClass from "yahoo-finance2";

// yahoo-finance2 v3 requires instantiation
const yahooFinance = new YahooFinanceClass();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbols = searchParams.get("symbols")?.split(",").filter(Boolean) || [];

  if (!symbols.length) {
    return NextResponse.json({ error: "No symbols" }, { status: 400 });
  }

  try {
    const results: Record<string, unknown> = {};

    await Promise.allSettled(
      symbols.map(async (symbol) => {
        try {
          const quote = await yahooFinance.quote(symbol);
          results[symbol] = {
            price: quote.regularMarketPrice,
            changePercent: quote.regularMarketChangePercent,
            change: quote.regularMarketChange,
            marketCap: quote.marketCap,
            volume: quote.regularMarketVolume,
            previousClose: quote.regularMarketPreviousClose,
            fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
            trailingPE: quote.trailingPE,
            forwardPE: quote.forwardPE,
            revenuePerShare: quote.revenuePerShare,
            sharesOutstanding: quote.sharesOutstanding,
          };
        } catch {
          results[symbol] = null;
        }
      })
    );

    return NextResponse.json(results, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
