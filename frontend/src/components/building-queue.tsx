import { Button } from "@/components/ui/button";
import { useStore } from "@/store/store";
import { PRIORITY_QUEUE_ID } from "@/utils/constants";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { GripVertical, X } from "lucide-react";

export default function BuildingQueue() {
  const { queue, removeFromQueue } = useStore((store) => store);

  return (
    <Droppable droppableId={PRIORITY_QUEUE_ID}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="h-[40vh] space-y-2 overflow-y-auto rounded-lg border-2 border-dashed border-gray-200 p-4"
        >
          {queue.map((item, index) => (
            <Draggable
              key={item.uniqueId}
              draggableId={item.uniqueId}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className="flex items-center justify-between rounded border p-2 shadow"
                >
                  <span className="flex items-center">
                    <span
                      {...provided.dragHandleProps}
                      className="mr-2 cursor-move"
                    >
                      <GripVertical
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="truncate">{item.name}</span>
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeFromQueue(index)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4 text-red-500 hover:text-red-700" />
                  </Button>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
