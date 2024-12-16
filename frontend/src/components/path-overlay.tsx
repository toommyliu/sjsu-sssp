import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PathSegment } from "@/lib/path-store";
import { MAX_COLS, MAX_ROWS, TILE_SIZE } from "@/utils/constants";
import { MapPinIcon } from "lucide-react";
import { useEffect, useState } from "react";

const MapPin = ({ index }: { index: number }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <g className="group cursor-pointer">
          <MapPinIcon fill="#7e22ce" className="size-6 text-purple-700" />
          <text
            className="text-xs font-bold opacity-100 shadow-xl drop-shadow-xl transition-opacity duration-200"
            x="12"
            y="16"
            textAnchor="middle"
          >
            {index + 1}
          </text>
        </g>
      </TooltipTrigger>
      <TooltipContent>Point #{index + 1}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default function PathOverlay({ paths }: { paths: PathSegment[] }) {
  if (!paths?.length) {
    return null;
  }

  const [currentTileSize, setCurrentTileSize] = useState(TILE_SIZE.base);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  // Update tile size based on viewport size
  useEffect(() => {
    const updateTileSize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setCurrentTileSize(TILE_SIZE.lg);
      } else if (window.matchMedia("(min-width: 768px)").matches) {
        setCurrentTileSize(TILE_SIZE.md);
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setCurrentTileSize(TILE_SIZE.sm);
      } else if (window.matchMedia("(min-width: 480px)").matches) {
        setCurrentTileSize(TILE_SIZE.xs);
      } else {
        setCurrentTileSize(TILE_SIZE.base);
      }
    };

    updateTileSize();

    const mediaQueries = [
      window.matchMedia("(min-width: 1024px)"),
      window.matchMedia("(min-width: 768px)"),
      window.matchMedia("(min-width: 640px)"),
      window.matchMedia("(min-width: 480px)"),
    ];

    const cb = () => updateTileSize();
    for (const mediaQuery of mediaQueries)
      mediaQuery.addEventListener("change", cb);

    // Cleanup
    return () => {
      for (const mediaQuery of mediaQueries)
        mediaQuery.removeEventListener("change", cb);
    };
  }, []);

  const getViewBox = () => {
    const width = MAX_COLS * currentTileSize;
    const height = MAX_ROWS * currentTileSize;
    return `0 0 ${width} ${height}`;
  };

  const gridToSvgCoords = (row: number, col: number) => ({
    x: (col + 0.5) * currentTileSize,
    y: (row + 0.5) * currentTileSize,
  });

  const getPathStyles = (segmentIndex: number) => {
    const isActive = activeSegment === segmentIndex;
    const isHovered = hoveredSegment === segmentIndex;
    const isSecondary = activeSegment !== null && !isActive;

    return {
      strokeWidth: isActive || isHovered ? "4" : "3",
      stroke: isActive
        ? "#2563eb"
        : isHovered
          ? "#3b82f6"
          : isSecondary
            ? "#94a3b8"
            : "#22c55e",
      opacity: isSecondary ? 0.4 : 1,
      transition: "all 0.2s ease-in-out",
    };
  };

  const getSegmentInfo = (segment: PathSegment) => {
    // const distance = segment.path.length * currentTileSize;
    return `${segment.startTile} → ${segment.endTile}`;
  };

  return (
    <div className="absolute inset-0">
      <svg
        className="z-10 h-full w-full"
        viewBox={getViewBox()}
        preserveAspectRatio="xMidYMid meet"
      >
        {paths.map((segment, segmentIndex) => {
          // TODO: buildings are the same?
          if (!segment?.path?.length) return null;

          const pathData = segment.path.reduce((acc, tile, i) => {
            const { x, y } = gridToSvgCoords(tile.row, tile.col);
            return `${acc}${i === 0 ? "M" : "L"}${x},${y}`;
          }, "");

          const styles = getPathStyles(segmentIndex);

          const startPoint = gridToSvgCoords(
            segment.path[0].row,
            segment.path[0].col,
          );
          const endPoint = gridToSvgCoords(
            segment.path[segment.path.length - 1].row,
            segment.path[segment.path.length - 1].col,
          );

          return (
            <TooltipProvider key={segmentIndex}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <g
                    onMouseEnter={() => setHoveredSegment(segmentIndex)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    onClick={() =>
                      setActiveSegment(
                        activeSegment === segmentIndex ? null : segmentIndex,
                      )
                    }
                    className="cursor-pointer"
                  >
                    {/* Invisible wider path for better click handling */}
                    <path
                      d={pathData}
                      stroke="transparent"
                      strokeWidth="20"
                      fill="none"
                    />
                    {/* Visible path */}
                    <path
                      d={pathData}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-300"
                      {...styles}
                    />
                    {/* Start point */}
                    <g
                      transform={`translate(${startPoint.x - 12}, ${startPoint.y - 24})`}
                    >
                      <MapPin index={segmentIndex} />
                    </g>
                    {/* End point */}
                    <g
                      transform={`translate(${endPoint.x - 12}, ${endPoint.y - 24})`}
                    >
                      <MapPin index={segmentIndex + 1} />
                    </g>
                  </g>
                </TooltipTrigger>
                <TooltipContent>{getSegmentInfo(segment)}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </svg>
    </div>
  );
}
