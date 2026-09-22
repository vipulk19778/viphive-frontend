import { create } from "zustand";

interface AdminSearchState {
  query: string;
  setQuery: (query: string) => void;
}

export const useAdminSearchStore = create<AdminSearchState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));
