import BuildingQueue from "@/components/building-queue";
import BuildingSearch from "@/components/building-search";
import Grid from "@/components/grid";
import { Button } from "@/components/ui/button";
import { usePathfinding } from "@/providers/pathfinding-provider";
import { useStore } from "@/lib/store";
import { BUILDING_SEARCH_ID, PRIORITY_QUEUE_ID } from "@/utils/constants";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { BUILDINGS } from "@/utils/buildings";
import { animatePath } from "@/utils/animatePath";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  const { resetGrid, initializeDefaultGridStyles } = usePathfinding();
  const { queue, setQueue, setPath } = useStore((store) => store);

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === BUILDING_SEARCH_ID &&
      destination.droppableId === PRIORITY_QUEUE_ID
    ) {
      const building = BUILDINGS[source.index];
      const newQueue = [
        ...queue.slice(0, destination.index),
        { ...building, uniqueId: `${building.id}-${Date.now()}` },
        ...queue.slice(destination.index),
      ];
      setQueue(newQueue);
    } else if (
      source.droppableId === PRIORITY_QUEUE_ID &&
      destination.droppableId === PRIORITY_QUEUE_ID
    ) {
      const newQueue = Array.from(queue);
      const [reorderedItem] = newQueue.splice(source.index, 1);
      newQueue.splice(destination.index, 0, reorderedItem);
      setQueue(newQueue);
    }
  }

  const startSearch = async () => {
    if (queue.length < 2) {
      toast.error("2 or more buildings are required to start.", {
        id: "error",
      });
      return;
    }

    initializeDefaultGridStyles();

    setPath([]);
    setIsLoading(true);

    try {
      const resp = await axios.post("http://localhost:3000/dijkstra", {
        locations: queue.map((loc) => loc.id),
      });

      if (resp.status === 200 && resp.data?.status === "success") {
        console.log("resp", resp);

        const { data } = resp;
        setPath(data.segments);

        for (let i = 0; i < data.segments.length; i += 1) {
          const segment = data.segments[i];

          if (!Array.isArray(segment.path) && !segment.path.length) {
            return;
          }

          // Style path nodes
          // for (const tile of segment.path) {
          //   const div = document.getElementById(`${tile.row}-${tile.col}`);
          //   if (!div) return;

          //   div.className = PATH_TILE_STYLE;
          // }

          // animatePath(
          //   {
          //     building: segment.startTile,
          //     position: segment.startTilePosition,
          //     index: i,
          //   },
          //   {
          //     building: segment.endTile,
          //     position: segment.endTilePosition,
          //     index: i + 1,
          //   },
          // );

          await new Promise((resolve) => setTimeout(resolve, 5_00));
        }
      } else {
        console.log("resp", resp);
        toast.error("An error occurred");
      }
    } catch (error) {
      console.error(
        "An error occured while trying to run the path:",
        error,
        queue,
      );

      if (error instanceof AxiosError) {
        toast.error(`An error occured: ${error.message}`);
      } else if (error instanceof Error) {
        const err = error as Error;
        toast.error(`An error occured${err?.message ? ` ${err.message}` : ""}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">
          SJSU Shortest Single Source Path (SSSP)
        </h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <h2 className="mb-2 text-xl font-semibold">Buildings</h2>
              <p className="mb-2 inline-block text-sm text-gray-600">
                Add buildings to the priority queue by dragging or clicking +
              </p>
              <BuildingSearch />
            </div>

            <div className="w-full lg:w-1/2">
              <h2 className="mb-2 text-xl font-semibold">Priority Queue</h2>
              <p className="mb-2 text-sm text-gray-600">
                Drag and drop to reorder the priority queue.
              </p>
              <BuildingQueue />
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
              setPath([]);
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
