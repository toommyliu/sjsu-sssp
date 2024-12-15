import { MapPinIcon } from 'lucide-react';
import { createRoot } from "react-dom/client";
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

const createSVGPath = (path: Tile[], tileSize: number) => {
  const pathPoints = path.map(tile => ({
    x: tile.col * tileSize + tileSize / 2,
    y: tile.row * tileSize + tileSize / 2
  }));

  const d = pathPoints.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${acc} L ${point.x} ${point.y}`;
  }, "");

  return d;
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
  const gridElement = document.querySelector('#grid'); // Assuming there's a container for the grid
  if (!gridElement) return console.log("no grid element");

  const tileSize = 40; // Adjust this value based on your tile size
  const svgNS = "http://www.w3.org/2000/svg";

  // Create SVG element
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.pointerEvents = "none";

  // Create path element
  const pathElement = document.createElementNS(svgNS, "path");
  const pathD = createSVGPath(path, tileSize);
  pathElement.setAttribute("d", pathD);
  pathElement.setAttribute("fill", "none");
  pathElement.setAttribute("stroke", "#3b82f6"); // Adjust color as needed
  pathElement.setAttribute("stroke-width", "3");
  pathElement.setAttribute("stroke-linecap", "round");
  pathElement.setAttribute("stroke-linejoin", "round");

  // Animate the path
  const pathLength = pathElement.getTotalLength();
  pathElement.style.strokeDasharray = pathLength + " " + pathLength;
  pathElement.style.strokeDashoffset = pathLength.toString();
  pathElement.style.animation = "drawPath 2s ease-in-out forwards";

  svg.appendChild(pathElement);
  gridElement.appendChild(svg);

  // Add start and end markers
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
};

