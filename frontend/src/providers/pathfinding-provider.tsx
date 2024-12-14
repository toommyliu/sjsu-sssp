import { ReactNode, createContext, useContext, useState } from "react";
import { GridType } from "../utils/types";
import DefaultGrid from "../assets/grid.json";
import {
  END_TILE_STYLE,
  MAX_COLS,
  MAX_ROWS,
  PATH_TILE_STYLE,
  START_TILE_STYLE,
  TILE_STYLE,
  TRAVERSED_TILE_STYLE,
  WALL_TILE_STYLE,
} from "@/utils/constants";
import { cn } from "@/lib/utils";

const PathfindingProviderContext = createContext<PathfindingProviderProps>({
  grid: [],
  setGrid: () => null,
  resetGrid: () => null,
});

export const PathfindingProvider = ({ children }: { children: ReactNode }) => {
  const [grid, setGrid] = useState<GridType>(
    DefaultGrid as unknown as GridType,
  );

  const resetGrid = () => {
    setGrid(DefaultGrid as unknown as GridType);

    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const tile = grid[row][col];

        let tileTyleStyle;

        const div = document.getElementById(`${tile.row}-${tile.col}`);

        if (div) {
          if (tile.isStart) {
            tileTyleStyle = START_TILE_STYLE;
          } else if (tile.isEnd) {
            tileTyleStyle = END_TILE_STYLE;
          } else if (tile.isWall) {
            tileTyleStyle = WALL_TILE_STYLE;
          } else if (tile.isPath) {
            tileTyleStyle = PATH_TILE_STYLE;
          } else if (tile.isTraversed) {
            tileTyleStyle = TRAVERSED_TILE_STYLE;
          } else {
            tileTyleStyle = TILE_STYLE;
          }

          const borderStyle =
            row === MAX_ROWS - 1 ? "border-b" : col === 0 ? "border-l" : "";
          const edgeStyle = row === MAX_ROWS - 1 && col === 0 ? "border-l" : "";

          div.className = cn(tileTyleStyle, borderStyle, edgeStyle);
        }
      }
    }
  };

  return (
    <PathfindingProviderContext.Provider
      value={{
        grid,
        setGrid,
        resetGrid,
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
  resetGrid: () => void;
};
