/**
 * Represents a tile in the grid.
 */
public class Tile {
    /**
     * The row of the tile.
     */
    private int row;

    /**
     * The column of the tile.
     */
    private int col;

    /**
     * Whether the tile is the start tile.
     */
    private boolean isStart;

    /**
     * Whether the tile is the end tile.
     */
    private boolean isEnd;

    /**
     * Whether the tile is a wall.
     */
    private boolean isWall;

    /**
     * Whether the tile is part of final path.
     */
    private boolean isPath;

    /**
     * The distance of the tile from the start tile.
     */
    private int distance;

    /**
     * Whether the tile has been traversed.
     */
    private boolean isTraversed;

    /**
     * The parent tile of the tile.
     */
    private Tile parent;

    /**
     * Get the row of the tile.
     *
     * @return The row of the tile.
     */
    public int getRow() {
        return row;
    }

    /**
     * Set the row of the tile.
     *
     * @param row The row of the tile.
     */
    public void setRow(int row) {
        this.row = row;
    }

    /**
     * Get the column of the tile.
     *
     * @return The column of the tile.
     */
    public int getCol() {
        return col;
    }

    /**
     * Set the column of the tile.
     *
     * @param col The column of the tile.
     */
    public void setCol(int col) {
        this.col = col;
    }

    /**
     * Check if the tile is the start tile.
     *
     * @return Whether the tile is the start tile.
     */
    public boolean isStart() {
        return isStart;
    }

    /**
     * Set whether the tile is the start tile.
     *
     * @param start Whether the tile is the start tile.
     */
    public void setIsStart(boolean start) {
        isStart = start;
    }

    /**
     * Check if the tile is the end tile.
     *
     * @return Whether the tile is the end tile.
     */
    public boolean isEnd() {
        return isEnd;
    }

    /**
     * Set whether the tile is the end tile.
     *
     * @param end Whether the tile is the end tile.
     */
    public void setIsEnd(boolean end) {
        isEnd = end;
    }

    /**
     * Check if the tile is a wall.
     *
     * @return Whether the tile is a wall.
     */
    public boolean isWall() {
        return isWall;
    }

    /**
     * Set whether the tile is a wall.
     *
     * @param wall Whether the tile is a wall.
     */
    public void setIsWall(boolean wall) {
        isWall = wall;
    }

    /**
     * Check if the tile is part of the final path.
     *
     * @return Whether the tile is part of the final path.
     */
    public boolean isPath() {
        return isPath;
    }

    /**
     * Set whether the tile is part of the final path.
     *
     * @param path Whether the tile is part of the final path.
     */
    public void setIsPath(boolean path) {
        isPath = path;
    }

    /**
     * Get the distance of the tile from the start tile.
     *
     * @return The distance of the tile from the start tile.
     */
    public int getDistance() {
        return distance;
    }

    /**
     * Set the distance of the tile from the start tile.
     *
     * @param distance The distance of the tile from the start tile.
     */
    public void setDistance(int distance) {
        this.distance = distance;
    }

    /**
     * Check if the tile has been traversed.
     *
     * @return Whether the tile has been traversed.
     */
    public boolean isTraversed() {
        return isTraversed;
    }

    /**
     * Set whether the tile has been traversed.
     *
     * @param traversed Whether the tile has been traversed.
     */
    public void setIsTraversed(boolean traversed) {
        isTraversed = traversed;
    }

    /**
     * Get the parent tile of the tile.
     *
     * @return The parent tile of the tile.
     */
    public Tile getParent() {
        return parent;
    }

    /**
     * Set the parent tile of the tile.
     *
     * @param parent The parent tile of the tile.
     */
    public void setParent(Tile parent) {
        this.parent = parent;
    }
}
