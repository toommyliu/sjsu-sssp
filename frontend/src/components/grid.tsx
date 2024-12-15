import Tile from "@/components/tile";
import { cn } from "@/lib/cn";
import { usePathfinding } from "@/providers/pathfinding-provider";
import { MAX_COLS, MAX_ROWS, TILE_SIZE } from "@/utils/constants";
import { useStore } from "@/store/store";
import PathOverlay from "./path-overlay";

// Grid component
export default function Grid() {
  const { grid } = usePathfinding();
  const { path } = useStore((store) => store);

  return (
    <div className="relative">
      <div
        className={cn(
          // Base classes
          "mb-10 flex flex-col items-center justify-center",
          // Control Grid height
          `lg:min-h-[${MAX_ROWS * TILE_SIZE.lg}px] md:min-h-[${
            MAX_ROWS * TILE_SIZE.md
          }px] sm:min-h-[${MAX_ROWS * TILE_SIZE.sm}px] xs:min-h-[${MAX_ROWS * TILE_SIZE.xs}] min-h-[${MAX_ROWS * TILE_SIZE.base}px]`,
          // Controlling grid width
          `lg:w-[${MAX_COLS * TILE_SIZE.lg}px] md:w-[${MAX_COLS * TILE_SIZE.md}px] sm:w-[${
            MAX_COLS * TILE_SIZE.sm
          }px] xs:min-w-h-[${MAX_ROWS * TILE_SIZE.sm}] w-[${MAX_COLS * TILE_SIZE.base}px]`,
        )}
      >
        {grid.map((row, rowIndex) => (
          <div className="flex" key={rowIndex}>
            {row.map((tile, tileIndex) => {
              const { row, col, isPath, isWall } = tile;

              return (
                <Tile
                  row={row}
                  col={col}
                  key={`${row}-${col}-${tileIndex}`}
                  isPath={isPath}
                  isWall={isWall}
                />
              );
            })}
          </div>
        ))}
      </div>
      <PathOverlay paths={path} />
    </div>
  );
}
