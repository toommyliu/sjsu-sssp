import BuildingSearchCard from "@/components/building-search-card";
import { Input } from "@/components/ui/input";
import { LOCATIONS } from "@/locations";
import { useStore } from "@/store/store";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { BUILDING_SEARCH_ID } from "@/utils/constants";

export default function BuildingSearch() {
  const { searchQuery, setSearchQuery } = useStore((store) => store);

  const filteredLocations = LOCATIONS.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.id.toLowerCase().includes(searchQuery.toLowerCase()),
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
