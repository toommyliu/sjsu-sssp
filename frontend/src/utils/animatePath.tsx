import { MapPinIcon } from "lucide-react";
import { createRoot } from "react-dom/client";
import { PATH_TILE_STYLE } from "./constants";
import type { Tile } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MapPin = ({ buildingName }: { buildingName: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <MapPinIcon
            color="white"
            className="ml-[2px] -mt-[17px] size-2
            sm:-mt-[20px] sm:ml-[0px] sm:size-3
            md:-ml-[0px] md:-mt-[4px] md:size-4 lg:-mt-[2px] lg:ml-[0.8px] lg:size-5"
          />
        </TooltipTrigger>
        <TooltipContent>{buildingName ?? "Location"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const animatePath = (
  path: Tile[],
  startTile: {
    building: string;
    position: number[];
  },
  endTile: {
    building: string;
    position: number[];
  },
) => {
  for (const tile of path) {
    document.getElementById(`${tile.row}-${tile.col}`)!.className =
      `${PATH_TILE_STYLE} animate-path`;
  }

  const elStartTile = document.getElementById(
    `${startTile.position[0]}-${startTile.position[1]}`,
  )!;
  const elEndTile = document.getElementById(
    `${endTile.position[0]}-${endTile.position[1]}`,
  )!;

  {
    const div = document.createElement("div");
    createRoot(div).render(<MapPin buildingName={startTile.building} />);

    elStartTile.appendChild(div);
  }

  {
    const div = document.createElement("div");
    createRoot(div).render(<MapPin buildingName={endTile.building} />);

    elEndTile.appendChild(div);
  }

  elStartTile.classList.add("animate-path");
  elEndTile.classList.add("animate-path");
};
