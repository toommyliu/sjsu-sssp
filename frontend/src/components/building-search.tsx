import BuildingSearchCard from "@/components/building-search-card";
import { Input } from "@/components/ui/input";
import { BUILDINGS } from "@/utils/buildings";
import { useStore } from "@/store/store";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { BUILDING_SEARCH_ID } from "@/utils/constants";

export default function BuildingSearch() {
  const { searchQuery, setSearchQuery } = useStore((store) => store);

  const filteredBuildings = BUILDINGS.filter(
    (building) =>
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Droppable droppableId={BUILDING_SEARCH_ID}>
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
            {filteredBuildings.length === 0 ? (
              <div className="w-full p-3 text-center text-gray-500">
                No results found
              </div>
            ) : (
              filteredBuildings.map((building, index) => (
                <Draggable
                  key={building.id}
                  draggableId={building.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <BuildingSearchCard
                      provided={provided}
                      snapshot={snapshot}
                      building={building}
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
  );
}
