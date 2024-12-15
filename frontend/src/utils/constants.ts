import { cn } from "@/lib/cn";

export const MAX_COLS = 50;
export const MAX_ROWS = 47;

export const TILE_SIZE = {
  lg: 20, // > 1024px
  md: 15, // 768px - 1024px
  sm: 12, // 640px - 768px
  xs: 10, // 480px - 640px
  base: 8, // < 480px
};

export const TILE_STYLE = cn(
  "lg:w-[20px] md:w-[15px] w-[12px] lg:h-[20px] md:h-[15px] h-[12px]",
);
export const WALL_TILE_STYLE = cn(TILE_STYLE, "bg-slate-800");
export const PATH_TILE_STYLE = cn(TILE_STYLE, "bg-emerald-500");
export const BG_TILE_STYLE = cn(TILE_STYLE, "bg-slate-300");

export const BUILDING_SEARCH_ID = "buildings" as const;
export const PRIORITY_QUEUE_ID = "priority-queue" as const;
