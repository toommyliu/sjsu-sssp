import { MAX_COLS, MAX_ROWS, TILE_SIZE } from "@/utils/constants";
import { useEffect, useState } from "react";

export default function PathOverlay({ paths }) {
  const [currentTileSize, setCurrentTileSize] = useState(8);

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

    const listener = () => updateTileSize();
    mediaQueries.forEach((query) => query.addListener(listener));

    // Cleanup
    return () => {
      mediaQueries.forEach((query) => query.removeListener(listener));
    };
  }, []);

  const getViewBox = () => {
    const width = MAX_COLS * currentTileSize;
    const height = MAX_ROWS * currentTileSize;
    return `0 0 ${width} ${height}`;
  };

  const gridToSvgCoords = (row, col) => {
    return {
      x: (col + 0.5) * currentTileSize,
      y: (row + 0.5) * currentTileSize,
    };
  };

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full"
        viewBox={getViewBox()}
        preserveAspectRatio="xMidYMid meet"
      >
        {paths.map((segment, segmentIndex) => {
          if (!segment.path?.length) return null;

          const pathData = segment.path.reduce((acc, tile, i) => {
            const { x, y } = gridToSvgCoords(tile.row, tile.col);
            return `${acc}${i === 0 ? "M" : "L"}${x},${y}`;
          }, "");

          return (
            <g key={segmentIndex}>
              <path
                d={pathData}
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw-path"
                style={{
                  strokeDasharray: 1000,
                  strokeDashoffset: 1000,
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
