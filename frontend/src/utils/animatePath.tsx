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

export const pinRegistry = new Map<string, PinInfo>();

const MapPin = ({
  orders,
}: {
  orders: { buildingName: string; index: number }[];
}) => {
  const indicies = [...new Set(orders.map((o) => o.index + 1))];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="relative">
          <MapPinIcon
            color="#f1f5f9" // tailwind slate-700
            className="-mt-[17px] ml-[2px] size-2 sm:ml-[0px] sm:mt-[-20px] sm:size-3 md:-ml-[0px] md:-mt-[20px] md:size-4 lg:-mt-[2px] lg:size-5"
          />
          <span className="relative -right-3 -top-[2.7rem] text-nowrap rounded-md bg-slate-900 p-1 text-sm font-bold text-white shadow-2xl">
            {indicies.join(", ")}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {orders[0].buildingName} (
          {indicies.map((idx) => `#${idx}`).join(", ")})
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

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
      // If we already have a pin here, update the list
      const updatedOrders = [
        ...existing.orders,
        { buildingName: building, index },
      ];
      existing.root.render(<MapPin orders={updatedOrders} />);
      pinRegistry.set(tileId, { ...existing, orders: updatedOrders });
    } else {
      // Create new pin
      const div = document.createElement("div");
      const root = createRoot(div);
      const orders = [{ buildingName: building, index }];
      root.render(<MapPin orders={orders} />);
      document.getElementById(tileId)!.appendChild(div);
      pinRegistry.set(tileId, { root, orders });
    }
  };

  const startTileId = `${startTile.position[0]}-${startTile.position[1]}`;
  const endTileId = `${endTile.position[0]}-${endTile.position[1]}`;

  updateOrCreatePin(startTileId, startTile.building, startTile.index);
  updateOrCreatePin(endTileId, endTile.building, endTile.index);
};

type PinInfo = {
  root: Root;
  orders: { buildingName: string; index: number }[];
};
