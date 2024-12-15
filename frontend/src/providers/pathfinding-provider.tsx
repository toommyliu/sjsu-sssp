import { cn } from "@/lib/utils";
import {
  MAX_COLS,
  MAX_ROWS,
  PATH_TILE_STYLE,
  TILE_STYLE,
  WALL_TILE_STYLE,
} from "@/utils/constants";
import { ReactNode, createContext, useContext, useState } from "react";
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

        if (div) {
          const { isPath, isWall } = tile;

          let tileStyle;

          if (isWall) {
            tileStyle = WALL_TILE_STYLE;
          } else if (isPath) {
            tileStyle = PATH_TILE_STYLE;
          } else {
            tileStyle = cn(TILE_STYLE, "bg-slate-200");
          }

          // Only applies to the outer edge of the grid (first/last rows and columns)
          const contrastStyle = cn(
            "border-sky-300",
            // Top-left corner
            row === 0 &&
              col === 0 &&
              "border-t border-l shadow-2xl rounded-tl-lg",
            // Top-right corner
            row === 0 &&
              col === MAX_COLS - 1 &&
              "border-t border-r-none shadow-2xl rounded-tr-lg",
            row === 0 && col === MAX_COLS - 1 && "border-t border-r shadow-2xl",
            // Bottom-left corner
            row === MAX_ROWS - 1 &&
              col === 0 &&
              "border-b border-l shadow-2xl rounded-bl-lg",
            // Bottom-right corner
            row === MAX_ROWS - 1 &&
              col === MAX_COLS - 1 &&
              "border-b border-r shadow-2xl rounded-br-lg",

            // Top edge (excluding corners)
            row === 0 &&
              col !== 0 &&
              col !== MAX_COLS - 1 &&
              "border-t shadow-2xl",
            // Left edge (excluding corners)
            col === 0 &&
              row !== 0 &&
              row !== MAX_ROWS - 1 &&
              "border-l shadow-2xl",
            // Bottom edge (excluding corners)
            row === MAX_ROWS - 1 &&
              col !== 0 &&
              col !== MAX_COLS - 1 &&
              "border-b shadow-2xl",
            // Right edge (excluding corners and avoiding bottom border overlap)
            col === MAX_COLS - 1 &&
              row !== 0 &&
              row !== MAX_ROWS - 1 &&
              "border-r shadow-2xl",
            // Inner tiles (no border or shadow)
            row !== 0 &&
              row !== MAX_ROWS - 1 &&
              col !== 0 &&
              col !== MAX_COLS - 1 &&
              TILE_STYLE,
          );

          div.className = cn(tileStyle, contrastStyle);
          div.innerHTML = "";
        }
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
