import jsonGrid from "../assets/grid.json";
import type { GridType } from "./types";

export const createGrid = (): GridType => {
  return jsonGrid as unknown as GridType;
};
