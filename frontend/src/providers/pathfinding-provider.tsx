import { ReactNode, createContext, useContext, useState } from "react";
import { GridType } from "../utils/types";
import DefaultGrid from "../assets/grid.json";

const PathfindingProviderContext = createContext<PathfindingProviderProps>({
  grid: [],
  setGrid: () => null,
});

export const PathfindingProvider = ({ children }: { children: ReactNode }) => {
  const [grid, setGrid] = useState<GridType>(DefaultGrid as unknown as GridType);

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
