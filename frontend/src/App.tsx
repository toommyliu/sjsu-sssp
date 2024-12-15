import BuildingSearchCard from "@/components/building-search-card";
import Grid from "@/components/grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathfinding } from "@/providers/pathfinding-provider";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, X } from "lucide-react";
import { useState } from "react";
import {
  LOCATIONS,
  type Location,
  type LocationWithUniqueId,
} from "./locations";
import { animatePath } from "./utils/animatePath";
import toast from "react-hot-toast";

export default function App() {
  const [queue, setQueue] = useState<LocationWithUniqueId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setPath] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { resetGrid } = usePathfinding();

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
    // TODO: display alert
    if (queue.length < 2) {
      toast.error("2 or more buildings are required to start.", {
        id: "error",
      });
      return;
    }

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
                  `animate path from ${segment.startTile} to ${segment.endTile}`,
                );
                animatePath(
                  segment.path,
                  {
                    building: segment.startTile,
                    position: segment.startTilePosition,
                  },
                  {
                    building: segment.endTile,
                    position: segment.endTilePosition,
                  },
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }
            }
          } else {
            console.log(
              "no (2)",
              Array.isArray(data.segments),
              data.segments.length,
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
      location.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">
          SJSU Shortest Single Source Path (SSSP)
        </h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Buildings */}
            <div className="w-full lg:w-1/2">
              <h2 className="mb-2 text-xl font-semibold">Buildings</h2>
              <p className="mb-2 inline-block text-sm text-gray-600">
                Add buildings to the priority queue by dragging or clicking +
              </p>
              <Droppable droppableId="locations">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex h-[40vh] flex-col overflow-x-auto overflow-y-auto rounded-lg border-2 border-dashed border-gray-200"
                  >
                    <div className="sticky top-0 z-10 bg-white p-2">
                      <Input
                        type="text"
                        placeholder="Search for a building..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap content-start gap-4 p-2">
                      {filteredLocations.length === 0 ? (
                        <div className="w-full p-3 text-center text-gray-500">
                          No results found
                        </div>
                      ) : (
                        filteredLocations.map((location, index) => (
                          <Draggable
                            key={location.id}
                            draggableId={location.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <BuildingSearchCard
                                provided={provided}
                                snapshot={snapshot}
                                location={location}
                                addToQueue={addToQueue}
                              />
                            )}
                          </Draggable>
                        ))
                      )}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Priority queue */}
            <div className="w-full lg:w-1/2">
              <h2 className="mb-2 text-xl font-semibold">Priority Queue</h2>
              <p className="mb-2 text-sm text-gray-600">
                Drag and drop to reorder the priority queue.
              </p>
              <Droppable droppableId="priority-queue">
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
            </div>
          </div>
        </DragDropContext>

        <div className="mt-4 flex justify-center gap-4">
          <Button
            onClick={async () => await startSearch()}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Start Search"}
          </Button>
          <Button
            onClick={() => {
              setQueue([]);
              setPath(null);
              resetGrid();
            }}
            disabled={isLoading}
          >
            Reset
          </Button>
        </div>
      </div>

      <Grid />
    </>
  );
}
