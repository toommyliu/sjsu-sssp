import { cn } from "@/lib/cn";
import { usePathfinding } from "@/providers/pathfinding-provider";
import { MAX_COLS, MAX_ROWS } from "../utils/constants";
import Tile from "@/components/tile";

// Grid component
export default function Grid() {
  const { grid } = usePathfinding();

  return (
    <div
      className={cn(
        // Base classes
        "mb-10 flex flex-col items-center justify-center",
        // Control Grid height
        `lg:min-h-[${MAX_ROWS * 20}px] md:min-h-[${
          MAX_ROWS * 15
        }px] xs:min-h-[${MAX_ROWS * 10}px] min-h-[${MAX_ROWS * 8}px]`,
        // Controlling grid width
        `lg:w-[${MAX_COLS * 20}px] md:w-[${MAX_COLS * 15}px] xs:w-[${
          MAX_COLS * 10
        }px] w-[${MAX_COLS * 8}px]`,
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
  );
}
