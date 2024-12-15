import { cn } from "@/lib/utils";
import {
  MAX_ROWS,
  PATH_TILE_STYLE,
  TILE_STYLE,
  WALL_TILE_STYLE,
} from "@/utils/constants";
import type { Tile as TileType } from "@/utils/types";

export default function Tile({ row, col, isWall, isPath }: TileType) {
  let tileTyleStyle = TILE_STYLE;

  if (isWall) {
    tileTyleStyle = WALL_TILE_STYLE;
  } else if (isPath) {
    tileTyleStyle = PATH_TILE_STYLE;
  }

  const borderStyle =
    row === MAX_ROWS - 1 ? "border-b" : col === 0 ? "border-l" : "";
  const edgeStyle = row === MAX_ROWS - 1 && col === 0 ? "border-l" : "";

  const handleClick = () => console.log({ row, col });

  return (
    <div
      className={cn(tileTyleStyle, borderStyle, edgeStyle)}
      id={`${row}-${col}`}
      onClick={handleClick}
    />
  );
}
