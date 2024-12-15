import java.io.BufferedReader;
import java.io.FileReader;

public class Grid {
    private static String gridStr = "";

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
        try {
            try (FileReader fr = new FileReader("../frontend/src/assets/grid.json");
                    BufferedReader br = new BufferedReader(fr)) {

                String line;
                while ((line = br.readLine()) != null)
                    gridStr += line;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String getGridStr() {
        return gridStr;
    }
}