import { create } from "zustand";
import type { Building, BuildingWithUniqueId } from "@/utils/buildings";

export const useBuildingStore = create<BuildingStoreState>()((set) => ({
  // Priority queue of building locations
  queue: [],
  setQueue: (queue) => set({ queue }),
  // Add a building to the queue
  addToQueue: (building: Building) =>
    set((state) => ({
      queue: [
        ...state.queue,
        { ...building, uniqueId: `${building.id}-${Date.now()}` },
      ],
    })),
  // Remove a building from the queue by index
  removeFromQueue: (index) =>
    set((state) => ({
      queue: state.queue.filter((_, currIdx) => currIdx !== index),
    })),
  // Search query for building search
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
