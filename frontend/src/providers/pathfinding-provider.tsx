import { ReactNode, createContext, useContext, useState } from "react";
import { createGrid } from "../utils/helpers";
import { GridType } from "../utils/types";

const PathfindingProviderContext = createContext<PathfindingProviderProps>({
  grid: [],
  setGrid: () => null,
});

export const PathfindingProvider = ({ children }: { children: ReactNode }) => {
  const [grid, setGrid] = useState<GridType>(createGrid());

  return (
    <PathfindingProviderContext.Provider
      value={{
        grid,
        setGrid,
      }}
    >
      {children}
    </PathfindingProviderContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePathfinding = () => {
  const context = useContext(PathfindingProviderContext);
  if (!context)
    throw new Error("usePathfinding must be used within PathfindingProvider");

  return context;
};

type PathfindingProviderProps = {
  grid: GridType;
  setGrid: (grid: GridType) => void;
};
