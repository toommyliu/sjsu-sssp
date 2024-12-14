import { cn } from "@/lib/utils";
import { usePathfinding } from "../hooks/usePathfinding";
import { MAX_COLS, MAX_ROWS } from "../utils/constants";
import { Tile } from "./Tile";

export function Grid() {
  const { grid } = usePathfinding();

  return (
    <div
      className={cn(
        // Base classes
        "flex items-center flex-col justify-center border-sky-300 mb-10",
        // Control Grid height
        `lg:min-h-[${MAX_ROWS * 20}px] md:min-h-[${
          MAX_ROWS * 15
        }px] xs:min-h-[${MAX_ROWS * 10}px] min-h-[${MAX_ROWS * 8}px]`,
        // Controlling grid width
        `lg:w-[${MAX_COLS * 20}px] md:w-[${MAX_COLS * 15}px] xs:w-[${
          MAX_COLS * 10
        }px] w-[${MAX_COLS * 8}px]`
      )}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((tile, tileIndex) => {
            const { isEnd, isStart, isPath, isTraversed, isWall } = tile;
            return (
              <Tile
                key={tileIndex}
                row={tile.row}
                col={tile.col}
                isEnd={isEnd}
                isStart={isStart}
                isPath={isPath}
                isTraversed={isTraversed}
                isWall={isWall}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
