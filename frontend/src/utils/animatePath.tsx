import { MapPinIcon } from "lucide-react";
import { createRoot, type Root } from "react-dom/client";
import { PATH_TILE_STYLE } from "./constants";
import type { Tile } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MapPin = ({
  buildingName,
  index,
}: {
  buildingName: string;
  index: number;
}) => {
  const displayIndex = index + 1;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="relative">
          <MapPinIcon
            color="#f1f5f9" // tailwind slate-700
            className="-mt-[17px] ml-[2px] size-2 sm:ml-[0px] sm:mt-[-20px] sm:size-3 md:-ml-[0px] md:-mt-[20px] md:size-4 lg:-mt-[2px] lg:size-5"
          />
          <span className="relative -right-3 -top-[2.7rem] rounded-md bg-gray-800 p-1 text-sm font-bold text-red-500 shadow-2xl">
            {displayIndex}
          </span>
        </TooltipTrigger>
        <TooltipContent>{`${buildingName} (#${displayIndex})`}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const pinRegistry = new Map<string, { root: Root; index: number }>();

export const animatePath = (
  path: Tile[],
  startTile: {
    building: string;
    position: number[];
    index: number;
  },
  endTile: {
    building: string;
    position: number[];
    index: number;
  },
) => {
  for (const tile of path) {
    // Don't style the start and end tiles
    if (
      (tile.row === startTile.position[0] &&
        tile.col === startTile.position[1]) ||
      (tile.row === endTile.position[0] && tile.col === endTile.position[1])
    ) {
      continue;
    }

    document.getElementById(`${tile.row}-${tile.col}`)!.className =
      PATH_TILE_STYLE;
  }

  const updateOrCreatePin = (
    tileId: string,
    building: string,
    index: number,
  ) => {
    const existing = pinRegistry.get(tileId);

    if (existing) {
      // If we already have a pin here, update it
      existing.root.render(<MapPin buildingName={building} index={index} />);
    } else {
      // Create new pin
      const div = document.createElement("div");
      const root = createRoot(div);
      root.render(<MapPin buildingName={building} index={index} />);
      document.getElementById(tileId)!.appendChild(div);
      pinRegistry.set(tileId, { root, index });
    }
  };

  const startTileId = `${startTile.position[0]}-${startTile.position[1]}`;
  const endTileId = `${endTile.position[0]}-${endTile.position[1]}`;

  updateOrCreatePin(startTileId, startTile.building, startTile.index);
  updateOrCreatePin(endTileId, endTile.building, endTile.index);
};
