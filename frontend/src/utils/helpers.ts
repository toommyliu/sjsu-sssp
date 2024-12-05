import { MAX_COLS, MAX_ROWS } from "./constants";
import { GridType, TileType } from "./types";
import jsonGrid from "../assets/grid.json";

// const arr = [];

// The initial grid
export const createGrid = (): GridType => {
  // @ts-expect-error works as expected
  return jsonGrid;
};

// Update the grid, toggling the state of a tile
export const createNewGrid = (grid: GridType, row: number, col: number) => {
  console.log({ row, col });

  const newGrid = grid.slice();
  const newTile = {
    ...newGrid[row][col],
    isWall: !newGrid[row][col].isWall,
  };

  newGrid[row][col] = newTile;
  return newGrid;
};

export const checkIfStartOrEnd = (row: number, col: number) => {
  return (
    (row === 1 && col === 1) || (row === MAX_ROWS - 2 && col === MAX_COLS - 2)
  );
};

export const isEqual = (a: TileType, b: TileType) => {
  return a.row === b.row && a.col === b.col;
};

export const isRowColEqual = (row: number, col: number, tile: TileType) => {
  return row === tile.row && col === tile.col;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getRandInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

export const checkStack = (tile: TileType, stack: TileType[]) => {
  for (let i = 0; i < stack.length; i++) {
    if (isEqual(stack[i], tile)) return true;
  }
  return false;
};

export const dropFromQueue = (tile: TileType, queue: TileType[]) => {
  for (let i = 0; i < queue.length; i++) {
    if (isEqual(tile, queue[i])) {
      queue.splice(i, 1);
      break;
    }
  }
};
