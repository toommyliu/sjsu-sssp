import {
  END_TILE_STYLE,
  PATH_TILE_STYLE,
  START_TILE_STYLE
} from "./constants";
import { TileType } from "./types";

export const animatePath = (
  path: TileType[],
  startTile: number[],
  endTile: number[]
) => {
  console.log('animatePath');
  for (let i = 0; i < path.length; i++) {
      const tile = path[i];
      // Skip drawing for start and end tiles
      // if (!isEqual(tile, startTile) && !isEqual(tile, endTile)) {
      if (true) {
        // console.log(`${tile.row}-${tile.col}`);
        document.getElementById(
          `${tile.row}-${tile.col}`
        )!.className = `${PATH_TILE_STYLE} animate-path`;
      }
  }
  document.getElementById(`${startTile[0]}-${startTile[1]}`)!.className = `${START_TILE_STYLE} animate-path`;
  document.getElementById(`${endTile[0]}-${endTile[1]}`)!.className = `${END_TILE_STYLE} animate-path`;
};
