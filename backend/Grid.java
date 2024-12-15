import java.io.BufferedReader;
import java.io.FileReader;

import org.json.JSONArray;
import org.json.JSONObject;

public class Grid {
    private static String gridStr = "";

    private static Grid defaultGrid;

    private static Tile[][] defaultTiles;

    private Tile[][] tiles;

    public Tile[][] getTiles() {
        return tiles;
    }

    public void setTiles(Tile[][] tiles) {
        this.tiles = tiles;
    }

    public Tile getTileAt(int row, int col) {
        // Ensure row and col are within grid bounds
        if (row < 0 || row >= tiles.length || col < 0 || col >= tiles[0].length) {
            return null;
        }

        return tiles[row][col];
    }

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
        // Prevent re-initialization
        if (Grid.gridStr.length() > 0) {
            return;
        }

        try {
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
                    tile.setWall(tileObj.getBoolean("isWall"));
                    // Generic defaults
                    tile.setDistance(Integer.MAX_VALUE);
                    tile.setStart(false);
                    tile.setEnd(false);
                    tile.setPath(false);
                    tile.setTraversed(false);

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

    public static String getGridStr() {
        return gridStr;
    }

    public static Grid getDefault() {
        return defaultGrid;
    }

    public static Tile[][] getDefaultTiles() {
        return defaultTiles;
    }

    public void reset() {
        this.setTiles(defaultTiles);
    }
}