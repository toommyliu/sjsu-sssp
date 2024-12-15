import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MapPinIcon } from "lucide-react";

/**
 * A MapPin shows the build name and order in which it should be visited in the path.
 */
export default function MapPin({
  orders,
}: {
  orders: { buildingName: string; index: number }[];
}) {
  const indicies = [...new Set(orders.map((o) => o.index + 1))];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="relative">
          <MapPinIcon
            color="#f1f5f9" // tailwind slate-700
            className="-mt-[17px] ml-[2px] size-2 sm:ml-[0px] sm:mt-[-20px] sm:size-3 md:-ml-[0px] md:-mt-[20px] md:size-4 lg:-mt-[2px] lg:size-5"
          />
          <span className="relative -right-3 -top-[2.7rem] text-nowrap rounded-md bg-slate-900 p-1 text-sm font-bold text-white shadow-2xl">
            {indicies.join(", ")}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {orders[0].buildingName} (
          {indicies.map((idx) => `#${idx}`).join(", ")})
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
