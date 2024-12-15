export type Tile = {
  row: number;
  col: number;
  isWall: boolean;
  isPath: boolean;
};

export type Grid = Tile[][];
