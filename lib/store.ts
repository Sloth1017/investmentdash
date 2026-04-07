import { create } from "zustand";
import { persist } from "zustand/middleware";
import { COMPANIES } from "./data/companies";

interface InvestmentStore {
  longList: string[];
  shortList: string[];
  selectedTrends: string[];
  searchQuery: string;
  sortBy: "marketCap" | "name" | "changePercent" | "price";
  sortOrder: "asc" | "desc";
  notes: Record<string, string>;

  addToLongList: (id: string) => void;
  removeFromLongList: (id: string) => void;
  addToShortList: (id: string) => void;
  removeFromShortList: (id: string) => void;
  toggleTrend: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (by: InvestmentStore["sortBy"]) => void;
  setSortOrder: (order: InvestmentStore["sortOrder"]) => void;
  setNote: (id: string, note: string) => void;
}

export const useInvestmentStore = create<InvestmentStore>()(
  persist(
    (set) => ({
      longList: COMPANIES.map((c) => c.id),
      shortList: COMPANIES.filter((c) => c.isOnShortList)
        .map((c) => c.id)
        .slice(0, 30),
      selectedTrends: [],
      searchQuery: "",
      sortBy: "marketCap",
      sortOrder: "desc",
      notes: {},

      addToLongList: (id) =>
        set((s) => ({ longList: [...new Set([...s.longList, id])] })),

      removeFromLongList: (id) =>
        set((s) => ({
          longList: s.longList.filter((i) => i !== id),
          shortList: s.shortList.filter((i) => i !== id),
        })),

      addToShortList: (id) =>
        set((s) =>
          s.shortList.length < 30
            ? { shortList: [...new Set([...s.shortList, id])] }
            : s
        ),

      removeFromShortList: (id) =>
        set((s) => ({ shortList: s.shortList.filter((i) => i !== id) })),

      toggleTrend: (id) =>
        set((s) => ({
          selectedTrends: s.selectedTrends.includes(id)
            ? s.selectedTrends.filter((t) => t !== id)
            : [...s.selectedTrends, id],
        })),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setSortBy: (sortBy) => set({ sortBy }),

      setSortOrder: (sortOrder) => set({ sortOrder }),

      setNote: (id, note) =>
        set((s) => ({ notes: { ...s.notes, [id]: note } })),
    }),
    { name: "investment-dash-store" }
  )
);
