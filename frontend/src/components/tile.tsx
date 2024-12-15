import { getTileStyle } from "@/utils/getTileStyle";
import type { Tile as TileType } from "@/utils/types";

// Tile component
export default function Tile(tile: TileType) {
  const { row, col } = tile;

  const handleClick = () => console.log({ row, col });

  return (
    <div
      className={getTileStyle(tile)}
      id={`${row}-${col}`}
      onClick={handleClick}
    />
  );
}
