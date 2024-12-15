import { create } from "zustand";

export const usePathStore = create<PathStoreState>()((set) => ({
  path: [],
  setPath: (path) => set({ path }),
}));

type PathStoreState = {
  path: Array<any>;
  setPath: (paths: Array<any>) => void;
};
