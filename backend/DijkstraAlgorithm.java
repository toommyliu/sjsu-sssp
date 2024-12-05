import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class DijkstraAlgorithm {
    private Grid grid;
    private Tile startTile;
    private Tile endTile;

    public DijkstraAlgorithm(Grid grid) {
        this.grid = grid;
        this.startTile = grid.getStartTile();
        this.endTile = grid.getEndTile();
    }

    public Result run() {
        List<Tile> traversedTiles = new ArrayList<>();
        List<Tile> untraversedTiles = new ArrayList<>();

        // Initialize starting tile
        Tile base = grid.getTiles()[startTile.getRow()][startTile.getCol()];
        base.setDistance(0);
        untraversedTiles.add(base);

        while (!untraversedTiles.isEmpty()) {
            untraversedTiles.sort((a, b) -> Integer.compare(a.getDistance(), b.getDistance()));
            Tile currentTile = untraversedTiles.remove(0);

            if (currentTile.isWall()) {
                continue;
            }

            if (currentTile.getDistance() == Integer.MAX_VALUE) {
                break;
            }

            currentTile.setTraversed(true);
            traversedTiles.add(currentTile);

            // Check if we've reached the end tile
            if (isEqual(currentTile, endTile)) {
                break;
            }

            // Process neighbors
            List<Tile> neighbors = getUntraversedNeighbors(grid, currentTile);
            for (Tile neighbor : neighbors) {

                int newDistance = currentTile.getDistance() + 1;
                if (newDistance < neighbor.getDistance()) {
                    neighbor.setDistance(newDistance);
                    neighbor.setParent(currentTile);
                    // No need to drop from queue if it's not there yet
                    if (!untraversedTiles.contains(neighbor)) {
                        untraversedTiles.add(neighbor);
                    }
                }
            }
        }

        return constructResult(traversedTiles);
    }

    private Result constructResult(List<Tile> traversedTiles) {
        List<Tile> path = new ArrayList<>();
        Tile current = grid.getTiles()[endTile.getRow()][endTile.getCol()];

        // Only construct path if end tile was reached (has a finite distance)
        if (current.getDistance() != Integer.MAX_VALUE) {
            while (current != null) {
                current.setPath(true);
                path.add(0, current);
                current = current.getParent();
            }
        }

        return new Result(traversedTiles, path);
    }

    private boolean isEqual(Tile a, Tile b) {
        return a.getRow() == b.getRow() && a.getCol() == b.getCol();
    }

    private List<Tile> getUntraversedNeighbors(Grid grid, Tile tile) {
        List<Tile> neighbors = new ArrayList<>();
        int[][] directions = { { 0, 1 }, { 1, 0 }, { 0, -1 }, { -1, 0 } };

        for (int[] dir : directions) {
            int newRow = tile.getRow() + dir[0];
            int newCol = tile.getCol() + dir[1];

            if (isValidPosition(newRow, newCol, grid)) {
                Tile neighbor = grid.getTiles()[newRow][newCol];
                if (!neighbor.isTraversed()) {
                    neighbors.add(neighbor);
                }
            }
        }

        return neighbors;
    }

    private boolean isValidPosition(int row, int col, Grid grid) {
        return row >= 0 && row < grid.getTiles().length &&
                col >= 0 && col < grid.getTiles()[0].length;
    }

    public static class Result {
        private final List<Tile> traversedTiles;
        private final List<Tile> path;

        public Result(List<Tile> traversedTiles, List<Tile> path) {
            this.traversedTiles = traversedTiles;
            this.path = path;
        }

        public List<Tile> getTraversedTiles() {
            return traversedTiles;
        }

        public List<Tile> getPath() {
            return path;
        }
    }
}