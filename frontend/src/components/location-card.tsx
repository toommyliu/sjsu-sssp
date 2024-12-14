import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Location } from "@/locations";
import type {
  DraggableProvided,
  DraggableStateSnapshot
} from "@hello-pangea/dnd";
import { PlusCircle } from "lucide-react";

export default function LocationCard({
  provided,
  snapshot,
  location,
  addToQueue,
}: LocationCardProps) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="flex items-center justify-between p-3 bg-white border rounded shadow group w-[calc(50%-0.5rem)]"
      style={{
        ...provided.draggableProps.style,
        opacity: snapshot.isDragging ? 0.5 : 1,
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center text-sm font-medium text-gray-700 truncate">
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

type LocationCardProps = {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;

  location: Location;
  addToQueue: (location: Location) => void;
};
