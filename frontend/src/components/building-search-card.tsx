import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Building } from "@/utils/buildings";
import { useStore } from "@/lib/store";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { PlusCircle } from "lucide-react";

/**
 * Building search card component to display building information. Cards be directly interacted to
 * add a building onto the priority queue.
 */
export default function BuildingSearchCard({
  provided,
  snapshot,
  building,
}: BuildingSearchCardProps) {
  const { addToQueue } = useStore((store) => store);

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
      {/* Display a tooltip with the building name and id when the text is clipping */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center truncate text-sm font-medium text-gray-700">
            {building.name} ({building.id})
          </TooltipTrigger>
          <TooltipContent>
            {building.name} ({building.id})
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* Button to directly add the building to the queue */}
      <button
        onClick={() => addToQueue(building)}
        className="ml-2 shrink-0 text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <PlusCircle className="h-6 w-6" />
      </button>
    </div>
  );
}

type BuildingSearchCardProps = {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  building: Building;
};
