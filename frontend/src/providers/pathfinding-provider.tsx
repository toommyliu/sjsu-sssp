import { MAX_COLS, MAX_ROWS } from "@/utils/constants";
import { getTileStyle } from "@/utils/getTileStyle";
import { type ReactNode, createContext, useContext, useState } from "react";
import DefaultGrid from "../assets/grid.json";
import type { Grid } from "../utils/types";

const PathfindingProviderContext = createContext<PathfindingProviderProps>({
  grid: [],
  setGrid: () => null,
  resetGrid: () => null,
  initializeDefaultGrid: () => null,
  initializeDefaultGridStyles: () => null,
});

export const PathfindingProvider = ({ children }: { children: ReactNode }) => {
  const [grid, setGrid] = useState<Grid>(DefaultGrid as unknown as Grid);

  const initializeDefaultGrid = () => {
    setGrid(DefaultGrid as unknown as Grid);
  };

  const initializeDefaultGridStyles = () => {
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const tile = grid[row][col];

        const div = document.getElementById(`${tile.row}-${tile.col}`);
        if (!div) return;

        div.className = getTileStyle(tile);
        div.innerHTML = "";
      }
    }
  };

  const resetGrid = () => {
    initializeDefaultGrid();
    initializeDefaultGridStyles();
  };

  return (
    <PathfindingProviderContext.Provider
      value={{
        grid,
        setGrid,
        resetGrid,
        initializeDefaultGrid,
        initializeDefaultGridStyles,
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
  grid: Grid;
  setGrid: (grid: Grid) => void;
  resetGrid: () => void; // Resets to default grid and styles
  initializeDefaultGrid: () => void; // Resets to default grid
  initializeDefaultGridStyles: () => void; // Resets to default grid styles
};
