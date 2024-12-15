import { MapPinIcon } from "lucide-react";
import { createRoot } from "react-dom/client";
import { PATH_TILE_STYLE } from "./constants";
import type { TileType } from "./types";
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
          <MapPinIcon size={16} color="white" className="ml-[1.7px]" />
        </TooltipTrigger>
        <TooltipContent>{buildingName ?? "Location"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const animatePath = (
  path: TileType[],
  /**
   * The start tile coordinates as a tuple
   */
  startTile: {
    building: string;
    position: number[];
  },
  /**
   * The end tile coordinates as a tuple
   */
  endTile: {
    building: string;
    position: number[];
  },
) => {
  console.log("startTile", startTile);
  console.log("endTile", endTile);

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
