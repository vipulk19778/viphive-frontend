import { create } from "zustand";

interface CatalogState {
  query: string;
  setQuery: (query: string) => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));
