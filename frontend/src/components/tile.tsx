import { cn } from "@/lib/utils";
import {
  MAX_ROWS,
  MAX_COLS,
  PATH_TILE_STYLE,
  TILE_STYLE,
  WALL_TILE_STYLE,
} from "@/utils/constants";
import type { Tile as TileType } from "@/utils/types";

export default function Tile({ row, col, isWall, isPath }: TileType) {
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
    row === 0 && col === 0 && "border-t border-l shadow-2xl rounded-tl-lg",
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
    row === 0 && col !== 0 && col !== MAX_COLS - 1 && "border-t shadow-2xl",
    // Left edge (excluding corners)
    col === 0 && row !== 0 && row !== MAX_ROWS - 1 && "border-l shadow-2xl",
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

  const handleClick = () => console.log({ row, col });

  return (
    <div
      className={cn(tileStyle, contrastStyle)}
      id={`${row}-${col}`}
      onClick={handleClick}
    />
  );
}
