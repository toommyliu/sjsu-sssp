import { cn } from "@/lib/utils";

export const MAX_COLS = 50;
export const MAX_ROWS = 47;

export const TILE_STYLE = cn(
  "lg:w-[20px] md:w-[15px] w-[12px] lg:h-[20px] md:h-[15px] h-[12px]",
);
export const WALL_TILE_STYLE = cn(TILE_STYLE, "bg-slate-800");
export const PATH_TILE_STYLE = cn(TILE_STYLE, "bg-emerald-500");

export const BUILDING_SEARCH_ID = "buildings" as const;
export const PRIORITY_QUEUE_ID = "priority-queue" as const;