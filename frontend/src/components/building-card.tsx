import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Location } from "@/locations";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { PlusCircle } from "lucide-react";

export default function BuildingCard({
  provided,
  snapshot,
  location,
  addToQueue,
}: BuildingCardProps) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="group flex w-[calc(50%-0.5rem)] items-center justify-between rounded border p-3 shadow"
      style={{
        ...provided.draggableProps.style,
        opacity: snapshot.isDragging ? 0.5 : 1,
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center truncate text-sm font-medium text-gray-700">
            {location.name} ({location.id})
          </TooltipTrigger>
          <TooltipContent>
            {location.name} ({location.id})
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <button
        onClick={() => addToQueue(location)}
        className="ml-2 shrink-0 text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <PlusCircle className="h-6 w-6" />
      </button>
    </div>
  );
}

type BuildingCardProps = {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  location: Location;
  addToQueue: (location: Location) => void;
};
