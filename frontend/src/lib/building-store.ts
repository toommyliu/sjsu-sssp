import { create } from "zustand";
import type { Building, BuildingWithUniqueId } from "@/utils/buildings";

export const useBuildingStore = create<BuildingStoreState>()((set) => ({
  queue: [],
  setQueue: (queue) => set({ queue }),
  addToQueue: (building: Building) =>
    set((state) => ({
      queue: [
        ...state.queue,
        { ...building, uniqueId: `${building.id}-${Date.now()}` },
      ],
    })),
  removeFromQueue: (index) =>
    set((state) => ({
      queue: state.queue.filter((_, currIdx) => currIdx !== index),
    })),
  searchQuery: "",
  setSearchQuery: (query) => set(() => ({ searchQuery: query })),
}));

type BuildingStoreState = {
  // Priority queue of building locations
  queue: BuildingWithUniqueId[];
  setQueue: (queue: BuildingWithUniqueId[]) => void;
  addToQueue: (building: Building) => void;
  removeFromQueue: (index: number) => void;

  // Search query for building search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};
