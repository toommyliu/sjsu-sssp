import java.util.ArrayList;
import java.util.List;

/**
 * Class that implements Dijkstra's Algorithm to compute the shortest
 * path between a start and end tile in a grid.
 */
public class DijkstraAlgorithm {
    /**
     * The grid Dijkstra's Algorithm will run on.
     */
    private Grid grid;

    /**
     * The start tile in the grid.
     */
    private Tile startTile;

    /**
     * The end tile in the grid.
     */
    private Tile endTile;

    /**
     * Constructor for DijkstraAlgorithm.
     *
     * @param grid The grid Dijkstra's Algorithm will run on.
     */
    public DijkstraAlgorithm(Grid grid) {
        this.grid = grid;
        this.startTile = grid.getStartTile();
        this.endTile = grid.getEndTile();
    }

    // Run Dijkstra's Algorithm on the grid.
    public Result run() {
        List<Tile> traversedTiles = new ArrayList<>();
        List<Tile> untraversedTiles = new ArrayList<>();

        // Initialize the starting tile
        Tile startingTile = grid.getTileAt(startTile.getRow(), startTile.getCol());
        startingTile.setDistance(0);
        untraversedTiles.add(startingTile);

        while (!untraversedTiles.isEmpty()) {
            untraversedTiles.sort((a, b) -> Integer.compare(a.getDistance(), b.getDistance()));
            Tile currentTile = untraversedTiles.remove(0);

            // Skip tiles that are walls
            if (currentTile.isWall()) {
                continue;
            }

            if (currentTile.getDistance() == Integer.MAX_VALUE) {
                break;
            }

            currentTile.setIsTraversed(true);
            traversedTiles.add(currentTile);

            // Check if we've reached the end tile
            if (isEqual(currentTile, endTile)) {
                break;
            }

            // Process the current tile's neighbors
            List<Tile> neighbors = getUntraversedNeighbors(grid, currentTile);
            for (Tile neighbor : neighbors) {
                int newDistance = currentTile.getDistance() + 1;
                if (newDistance < neighbor.getDistance()) {
                    neighbor.setDistance(newDistance);
                    neighbor.setParent(currentTile);
                    // Only add the neighbor if it hasn't been traversed yet
                    if (!untraversedTiles.contains(neighbor)) {
                        untraversedTiles.add(neighbor);
                    }
                }
            }
        }

        // Build the path from the start to end tile
        return constructResult(traversedTiles);
    }

    /**
     * Constructs the result of Dijkstra's Algorithm.
     *
     * @param traversedTiles The list of traversed tiles.
     * @return The result of Dijkstra's Algorithm.
     */
    private Result constructResult(List<Tile> traversedTiles) {
        List<Tile> path = new ArrayList<>();
        Tile tmp = endTile;

        // Construct the path, only if the end tile
        if (tmp.getDistance() != Integer.MAX_VALUE) {
            while (tmp != null) {
                // Mark this tile as part of the path
                tmp.setIsPath(true);
                path.add(0, tmp);
                tmp = tmp.getParent();
            }
        }

        return new Result(traversedTiles, path);
    }

    /**
     * Checks if two tiles are equal.
     *
     * @param a The first tile.
     * @param b The second tile.
     * @return True if the tiles are equal, false otherwise.
     */
    private boolean isEqual(Tile a, Tile b) {
        return a.getRow() == b.getRow() && a.getCol() == b.getCol();
    }

    /**
     * Gets the untraversed neighbors of a tile.
     *
     * @param grid The grid the tile is in.
     * @param tile The tile to get the neighbors of.
     * @return The list of untraversed neighbors.
     */
    private List<Tile> getUntraversedNeighbors(Grid grid, Tile tile) {
        List<Tile> neighbors = new ArrayList<>();
        // List of possible directions to traverse
        // 0, 1: Move right
        // 1, 0: Move down
        // 0, -1: Move left
        // -1, 0: Move up
        int[][] directions = { { 0, 1 }, { 1, 0 }, { 0, -1 }, { -1, 0 } };

        for (int[] dir : directions) {
            int newRow = tile.getRow() + dir[0];
            int newCol = tile.getCol() + dir[1];

            // Ensure that the neighbor is within the grid bounds
            if (isValidPosition(grid, newRow, newCol)) {
                Tile neighbor = grid.getTiles()[newRow][newCol];
                // Only add the neighbor if it hasn't been traversed yet
                if (!neighbor.isTraversed()) {
                    neighbors.add(neighbor);
                }
            }
        }

        return neighbors;
    }

    /**
     * Checks if a position is valid within the grid.
     *
     * @param grid The grid to check the position in.
     * @param row  The row of the position.
     * @param col  The column of the position.
     * @return True if the position is valid, false otherwise.
     */
    private boolean isValidPosition(Grid grid, int row, int col) {
        return row >= 0 && row < grid.getTiles().length &&
                col >= 0 && col < grid.getTiles()[0].length;
    }

    /**
     * Class that represents the result of Dijkstra's Algorithm from a start to end
     * tile. IT contains the list of traversed tiles and the path from the start to
     * end tile.
     */
    public static class Result {
        /**
         * The list of traversed tiles.
         */
        private final List<Tile> traversedTiles;
        /**
         * The path from the start to end tile.
         */
        private final List<Tile> path;

        /**
         * Constructor for Result.
         *
         * @param traversedTiles The list of traversed tiles.
         * @param path           The path from the start to end tile.
         */
        public Result(List<Tile> traversedTiles, List<Tile> path) {
            this.traversedTiles = traversedTiles;
            this.path = path;
        }

        /**
         * Gets the list of traversed tiles.
         *
         * @return The list of traversed tiles.
         */
        public List<Tile> getTraversedTiles() {
            return traversedTiles;
        }

        /**
         * Gets the path from the start to end tile.
         *
         * @return The path from the start to end tile.
         */
        public List<Tile> getPath() {
            return path;
        }
    }
}