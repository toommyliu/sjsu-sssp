import { create } from "zustand";
import type { Location, LocationWithUniqueId } from "@/locations";

export const useStore = create<StoreState>()((set) => ({
  queue: [],
  setQueue: (queue) => set({ queue }),
  addToQueue: (location: Location) =>
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
  queue: LocationWithUniqueId[];
  setQueue: (queue: LocationWithUniqueId[]) => void;
  addToQueue: (location: Location) => void;
  removeFromQueue: (index: number) => void;

  // Search query for building search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};
