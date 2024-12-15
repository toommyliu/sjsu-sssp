import MapPin from "@/components/map-pin";
import { createRoot, type Root } from "react-dom/client";

export const pinRegistry = new Map<string, PinInfo>();

export const animatePath = (
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
