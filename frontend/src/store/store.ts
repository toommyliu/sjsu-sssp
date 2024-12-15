import { create } from "zustand";
import type { Building, BuildingWithUniqueId } from "@/utils/buildings";

export const useStore = create<StoreState>()((set) => ({
  queue: [],
  setQueue: (queue) => set({ queue }),
  addToQueue: (location: Building) =>
    set((state) => ({
      queue: [
        ...state.queue,
        { ...location, uniqueId: `${location.id}-${Date.now()}` },
      ],
    })),
  removeFromQueue: (index) =>
    set((state) => ({
      queue: state.queue.filter((_, currIdx) => currIdx !== index),
    })),
  searchQuery: "",
  setSearchQuery: (query) => set(() => ({ searchQuery: query })),
}));

type StoreState = {
  // Priority queue of building locations
  queue: BuildingWithUniqueId[];
  setQueue: (queue: BuildingWithUniqueId[]) => void;
  addToQueue: (location: Building) => void;
  removeFromQueue: (index: number) => void;

  // Search query for building search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};
