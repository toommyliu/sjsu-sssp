import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, PlusCircle, X } from "lucide-react";
import { useRef, useState } from "react";
import { Grid } from "./components/Grid";
import { PathfindingProvider } from "./context/PathfindingContext";
import { TileProvider } from "./context/TileContext";
import { animatePath } from "./utils/animatePath";
import { Input } from "@/components/ui/input";
import {
  LOCATIONS,
  type Location,
  type LocationWithUniqueId,
} from "./locations";

export default function App() {
  const [queue, setQueue] = useState<LocationWithUniqueId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [path, setPath] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const isRunningRef = useRef(false);

  function addToQueue(location: Location) {
    setQueue([
      ...queue,
      { ...location, uniqueId: `${location.id}-${Date.now()}` },
    ]);
  }

  function removeFromQueue(index: number) {
    setQueue(queue.filter((_, i) => i !== index));
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === "locations" &&
      destination.droppableId === "priority-queue"
    ) {
      const location = LOCATIONS[source.index];
      const newQueue = [
        ...queue.slice(0, destination.index),
        { ...location, uniqueId: `${location.id}-${Date.now()}` },
        ...queue.slice(destination.index),
      ];
      setQueue(newQueue);
    } else if (
      source.droppableId === "priority-queue" &&
      destination.droppableId === "priority-queue"
    ) {
      const newQueue = Array.from(queue);
      const [reorderedItem] = newQueue.splice(source.index, 1);
      newQueue.splice(destination.index, 0, reorderedItem);
      setQueue(newQueue);
    }
  }

  const startSearch = async () => {
    setPath(null);
    setIsLoading(true);

    await fetch("http://localhost:3000/dijkstra", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locations: queue.map((loc) => loc.id),
      }),
    })
      .then(async (res) => res.json())
      .then(async (data) => {
        console.log("data", data);
        if (data?.status === "success") {
          console.log("yes (1)");
          if (Array.isArray(data.segments) && data.segments.length > 0) {
            console.log("yes (2)");
            setPath(data.segments);
            for (const segment of data.segments) {
              if (Array.isArray(segment.path) && segment.path.length > 0) {
                console.log(
                  `animate path from ${segment.startTile} to ${segment.endTile}`
                );
                animatePath(
                  segment.path,
                  segment.startTilePosition,
                  segment.endTilePosition
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }
            }
          } else {
            console.log(
              "no (2)",
              Array.isArray(data.segments),
              data.segments.length
            );
          }
        } else {
          console.log("no (1)");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const filteredLocations = LOCATIONS.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          SJSU Shortest Single Source Path (SSSP)
        </h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Buildings */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-xl font-semibold mb-2">Buildings</h2>
              <p className="text-sm text-gray-600 mb-2">
                Search for a building, drag a building, or click the plus to add
                it to the priority queue.
              </p>
              <Droppable droppableId="locations">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-col gap-4 p-4 border-2 border-dashed border-gray-200 rounded-lg h-[40vh] overflow-x-auto overflow-y-auto"
                  >
                    <Input
                      type="text"
                      placeholder="Search buildings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="sticky top-0 z-10 bg-white"
                    />
                    <div className="flex flex-wrap content-start gap-4">
                      {filteredLocations.map((location, index) => (
                        <Draggable
                          key={location.id}
                          draggableId={location.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
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
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Priority queue */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-xl font-semibold mb-2">Priority Queue</h2>
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop to reorder the priority queue.
              </p>
              <Droppable droppableId="priority-queue">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 h-[40vh] overflow-y-auto border-2 border-dashed border-gray-200 p-4 rounded-lg"
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
                            className="flex items-center justify-between p-2 bg-white border rounded shadow"
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
            </div>
          </div>
        </DragDropContext>

        <div className="flex justify-center mt-4 gap-4">
          <Button
            onClick={async () => await startSearch()}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Start Search"}
          </Button>
          <Button onClick={() => setQueue([])} disabled={isLoading}>
            Reset
          </Button>
        </div>
      </div>

      <PathfindingProvider>
        <Grid />
      </PathfindingProvider>
    </>
  );
}
