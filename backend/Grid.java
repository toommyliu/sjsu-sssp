import java.io.BufferedReader;
import java.io.FileReader;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Class that represents the grid of tiles.
 */
public class Grid {
    /**
     * The default grid of tiles.
     */
    private static Grid defaultGrid;

    /**
     * The default tiles of the grid.
     */
    private static Tile[][] defaultTiles;

    /**
     * The tiles of the grid.
     */
    private Tile[][] tiles;

    /**
     * Gets the tiles of the grid.
     *
     * @return The tiles of the grid.
     */
    public Tile[][] getTiles() {
        return tiles;
    }

    /**
     * Sets the tiles of the grid.
     *
     * @param tiles The tiles of the grid.
     */
    public void setTiles(Tile[][] tiles) {
        this.tiles = tiles;
    }

    /**
     * Gets the tile at a specific row and column.
     *
     * @param row The row of the tile.
     * @param col The column of the tile.
     * @return The tile at the specified row and column.
     */
    public Tile getTileAt(int row, int col) {
        // Ensure row and col are within grid bounds
        if (row < 0 || row >= tiles.length || col < 0 || col >= tiles[0].length) {
            return null;
        }

        return tiles[row][col];
    }

    /**
     * Gets the start tile of the grid.
     *
     * @return The start tile of the grid.
     */
    public Tile getStartTile() {
        for (Tile[] row : tiles) {
            for (Tile tile : row) {
                if (tile.isStart()) {
                    return tile;
                }
            }
        }

        return null;
    }

    /**
     * Gets the end tile of the grid.
     *
     * @return The end tile of the grid.
     */
    public Tile getEndTile() {
        for (Tile[] row : tiles) {
            for (Tile tile : row) {
                if (tile.isEnd()) {
                    return tile;
                }
            }
        }

        return null;
    }

    // Reads the default grid from a JSON file
    public static void initialize() {
        try {
            // The JSON string representation of the grid
            String gridStr = "";

            // Stream the file into a string
            try (FileReader fr = new FileReader("../frontend/src/assets/grid.json");
                    BufferedReader br = new BufferedReader(fr)) {

                String line;
                while ((line = br.readLine()) != null)
                    gridStr += line;
            }

            // Parse the JSON string into JSON array
            JSONArray gridArr = new JSONArray(gridStr);

            int rows = gridArr.length();
            int cols = gridArr.getJSONArray(0).length();

            Tile[][] tiles = new Tile[rows][cols];

            for (int i = 0; i < rows; i++) {
                JSONArray row = gridArr.getJSONArray(i);
                for (int j = 0; j < cols; j++) {
                    // Construct tile at row i, col j
                    JSONObject tileObj = row.getJSONObject(j);
                    Tile tile = new Tile();
                    // Keys provided in object
                    tile.setRow(tileObj.getInt("row"));
                    tile.setCol(tileObj.getInt("col"));
                    tile.setIsWall(tileObj.getBoolean("isWall"));

                    // Generic defaults, not defined in the json file
                    tile.setDistance(Integer.MAX_VALUE);
                    tile.setIsStart(false);
                    tile.setIsEnd(false);
                    tile.setIsPath(false);
                    tile.setIsTraversed(false);

                    tiles[i][j] = tile;
                }
            }

            // Cache defaults to avoid re-computation
            defaultTiles = tiles;

            Grid tmpGrid = new Grid();
            tmpGrid.setTiles(tiles);

            defaultGrid = tmpGrid;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Get the default grid.
     *
     * @return The default grid.
     */
    public static Grid getDefaultGrid() {
        return defaultGrid;
    }

    /**
     * Get the default tiles.
     *
     * @return The default tiles.
     */
    public static Tile[][] getDefaultTiles() {
        return defaultTiles;
    }

    /**
     * Constructs a deep copy of the grid tiles. Used to reset the grid to its
     * default state.
     *
     * @param ogTiles The original tiles.
     * @return A deep copy of the grid tiles.
     */
    private static Tile[][] deepCopyTiles(Tile[][] ogTiles) {
        if (ogTiles == null)
            return null;

        Tile[][] copyGrid = new Tile[ogTiles.length][ogTiles[0].length];

        for (int i = 0; i < ogTiles.length; i++) {
            for (int j = 0; j < ogTiles[0].length; j++) {
                Tile originalTile = ogTiles[i][j];
                Tile newTile = new Tile();

                newTile.setRow(originalTile.getRow());
                newTile.setCol(originalTile.getCol());
                newTile.setIsWall(originalTile.isWall());
                newTile.setDistance(originalTile.getDistance());
                newTile.setIsStart(originalTile.isStart());
                newTile.setIsEnd(originalTile.isEnd());
                newTile.setIsPath(originalTile.isPath());
                newTile.setIsTraversed(originalTile.isTraversed());

                copyGrid[i][j] = newTile;
            }
        }
        return copyGrid;
    }

    /**
     * Reset the grid tiles to a default state.
     * Use to ensure the grid is in a consistent state before running Dijkstra's
     * Algorithm.
     */
    public void reset() {
        this.tiles = Grid.deepCopyTiles(defaultTiles);
    }
}