public class Grid {
    private Tile[][] tiles;

    public Tile[][] getTiles() {
        return tiles;
    }

    public void setTiles(Tile[][] tiles) {
        this.tiles = tiles;
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
}