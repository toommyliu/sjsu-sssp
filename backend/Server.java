
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.AbstractMap.SimpleEntry;

import org.json.JSONArray;
import org.json.JSONObject;

public class Server {

	public static void main(String[] args) throws IOException {
		int port;
		try {
			port = Integer.parseInt(args[0]);
		} catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
			port = 3000;
		}

		Entrances.initialize();

		// Prepare the server
		HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

		// /dijkstra route to run Dijkstra Algorithm
		server.createContext("/dijkstra", (final HttpExchange exchange) -> {
			// Set CORS headers for all responses
			exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
			exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, OPTIONS");
			exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

			// Handle preflight OPTIONS request
			if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
				exchange.sendResponseHeaders(200, -1);
				return;
			}

			// Ensure correct HTTP request method
			if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
				String msg = "Method Not Allowed";
				exchange.sendResponseHeaders(405, msg.length());
				try (OutputStream os = exchange.getResponseBody()) {
					os.write(msg.getBytes());
				}
				return;
			}

			// Read the request body
			StringBuilder requestBody = new StringBuilder();
			try (InputStream is = exchange.getRequestBody();
					InputStreamReader isr = new InputStreamReader(is, "UTF-8");
					BufferedReader br = new BufferedReader(isr)) {
				String line;
				while ((line = br.readLine()) != null) {
					requestBody.append(line);
				}
			}

			String gridStr = "";
			try (FileReader fr = new FileReader("../frontend/src/assets/grid.json");
					BufferedReader br = new BufferedReader(fr)) {

				String line;
				while ((line = br.readLine()) != null)
					gridStr += line;
			}

			// Parse the json string
			try {
				String jsonStr = requestBody.toString();
				JSONObject json = new JSONObject(jsonStr);
				json.put("grid", new JSONArray(gridStr));

				// Prepare to run Dijsktra's algorithm

				JSONArray locationsArr = (JSONArray) json.get("locations");
				JSONArray gridArr = (JSONArray) json.get("grid");

				Grid grid = new Grid();
				int rows = gridArr.length();
				int cols = gridArr.getJSONArray(0).length();
				Tile[][] tiles = new Tile[rows][cols];

				for (int i = 0; i < rows; i++) {
					JSONArray row = gridArr.getJSONArray(i);
					for (int j = 0; j < cols; j++) {
						JSONObject tileObj = row.getJSONObject(j);
						Tile tile = new Tile();

						tile.setRow(tileObj.getInt("row"));
						tile.setCol(tileObj.getInt("col"));
						tile.setDistance(Integer.MAX_VALUE);
						tile.setEnd(tileObj.getBoolean("isEnd"));
						tile.setWall(tileObj.getBoolean("isWall"));
						tile.setPath(tileObj.getBoolean("isPath"));
						tile.setTraversed(tileObj.getBoolean("isTraversed"));
						tile.setStart(tileObj.getBoolean("isStart"));

						tiles[i][j] = tile;
					}
				}

				Grid cloneGrid = new Grid();
				cloneGrid.setTiles(tiles);

				JSONObject finalRes = new JSONObject();
				finalRes.put("status", "success");

				JSONArray segments = new JSONArray();

				for (int i = 0; i < locationsArr.length() - 1; i++) {
					String startBuilding = locationsArr.getString(i);
					String endBuilding = locationsArr.getString(i + 1);

					if (startBuilding == null || endBuilding == null) {
						System.out.println("Invalid location pair found");
						continue;
					}

					for (int x = 0; x < rows; x++) {
						JSONArray row = gridArr.getJSONArray(x);
						for (int y = 0; y < cols; y++) {
							JSONObject tileObj = row.getJSONObject(y);
							Tile tile = new Tile();

							tile.setRow(tileObj.getInt("row"));
							tile.setCol(tileObj.getInt("col"));
							tile.setDistance(Integer.MAX_VALUE);
							tile.setEnd(tileObj.getBoolean("isEnd"));
							tile.setWall(tileObj.getBoolean("isWall"));
							tile.setPath(tileObj.getBoolean("isPath"));
							tile.setTraversed(tileObj.getBoolean("isTraversed"));
							tile.setStart(tileObj.getBoolean("isStart"));

							tiles[x][y] = tile;
						}
					}

					System.out.println("Processing pair: [" + startBuilding + ", " + endBuilding + "]");

					SimpleEntry<Integer, Integer> startBuildingEntrance = Entrances.getEntrances().get(startBuilding);

					// System.out.println(startBuilding + " | " + startBuildingEntrance);

					// disable iswall
					tiles[startBuildingEntrance.getKey()][startBuildingEntrance.getValue()].setWall(false);
					tiles[startBuildingEntrance.getKey()][startBuildingEntrance.getValue()].setStart(true);

					System.out.println("Start: " + startBuilding + " | End: " + endBuilding);

					SimpleEntry<Integer, Integer> endBuildingEntrance = Entrances.getEntrances().get(endBuilding);

					// System.out.println(endBuilding + " | " + endBuildingEntrance);

					// disable iswall
					tiles[startBuildingEntrance.getKey()][startBuildingEntrance.getValue()].setWall(false);
					tiles[endBuildingEntrance.getKey()][endBuildingEntrance.getValue()].setEnd(true);

					grid.setTiles(tiles);

					DijkstraAlgorithm dijkstra = new DijkstraAlgorithm(grid);

					// System.out.println("Start Tile isWall: "
					// +
					// tiles[startBuildingEntrance.getKey()][startBuildingEntrance.getValue()].isWall());
					// System.out.println("End Tile isWall: "
					// +
					// tiles[endBuildingEntrance.getKey()][endBuildingEntrance.getValue()].isWall());

					DijkstraAlgorithm.Result result = dijkstra.run();

					String res = new JSONObject()
							.put("traversedTiles", result.getTraversedTiles())
							.put("path", result.getPath())
							.put("startTile", startBuilding)
							.put("endTile", endBuilding)
							.put("startTilePosition",
									new JSONArray().put(startBuildingEntrance.getKey())
											.put(startBuildingEntrance.getValue()))
							.put("endTilePosition",
									new JSONArray().put(endBuildingEntrance.getKey())
											.put(endBuildingEntrance.getValue()))
							.toString();

					segments.put(new JSONObject(res));
				}

				finalRes.put("segments", segments);
				String response = finalRes.toString();

				exchange.getResponseHeaders().set("Content-Type", "application/json");
				byte[] responseBytes = response.getBytes();
				exchange.sendResponseHeaders(200, responseBytes.length);
				try (OutputStream os = exchange.getResponseBody()) {
					os.write(responseBytes);
				}
			} catch (Exception e) {
				e.printStackTrace();

				String response = new JSONObject()
						.put("status", "error")
						.put("message", "Invalid JSON")
						.toString();

				exchange.getResponseHeaders().set("Content-Type", "application/json");
				byte[] responseBytes = response.getBytes();
				exchange.sendResponseHeaders(400, responseBytes.length);
				try (OutputStream os = exchange.getResponseBody()) {
					os.write(responseBytes);
				}
			}
		});

		// Start the server
		server.setExecutor(null);
		server.start();
		System.out.println("Server is running on port " + port);
	}
}
