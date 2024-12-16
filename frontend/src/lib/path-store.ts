import { Tile } from "@/utils/types";
import { create } from "zustand";

export const usePathStore = create<PathStoreState>()((set) => ({
  // Path segments
  path: [],
  setPath: (path) => set({ path }),
}));

export type PathStoreState = {
  path: PathSegment[];
  setPath: (paths: PathSegment[]) => void;
};

export type PathSegment = {
  path: Tile[];
  traversedTiles: []; // unused
  startTile: string; // building id
  endTile: string; // building id
  startTilePosition: [number, number];
  endTilePosition: [number, number];
};
