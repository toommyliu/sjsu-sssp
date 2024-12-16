
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.AbstractMap.SimpleEntry;

import org.json.JSONArray;
import org.json.JSONObject;

public class Server {
	private final static int PORT = 3000;

	// Initialize required data to run Dijkstra's Algorithm
	private static void doInitialization() {
		Entrances.initialize();
		Grid.initialize();
	}

	/**
	 * Write a JSON response to the client.
	 *
	 * @param exchange The HTTP exchange object.
	 * @param response The JSON response to send.
	 * @throws IOException If an I/O error occurs.
	 */
	private static void writeJson(HttpExchange exchange, String response, int statusCode) throws IOException {
		if (statusCode == 0) {
			statusCode = 200;
		}

		exchange.getResponseHeaders().set("Content-Type", "application/json");
		byte[] responseBytes = response.getBytes();
		exchange.sendResponseHeaders(statusCode, responseBytes.length);
		try (OutputStream os = exchange.getResponseBody()) {
			os.write(responseBytes);
		}
	}

	public static void main(String[] args) throws IOException {
		Server.doInitialization();
		System.out.println("Initializing server.");

		// Prepare the server
		HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

		// POST /dijkstra route to run Dijkstra Algorithm
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

			try {
				// Parse the request body string
				String jsonStr = requestBody.toString();
				JSONObject json = new JSONObject(jsonStr);

				// Prepare to run Dijsktra's algorithm
				JSONArray locationsArr = (JSONArray) json.get("locations");

				if (!json.has("locations") || locationsArr.length() < 2) {
					String response = new JSONObject()
							.put("status", "error")
							.put("message", "Invalid JSON")
							.toString();

					Server.writeJson(exchange, response, 400);
					return;
				}

				Grid grid = Grid.getDefaultGrid();

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

					// Reset the grid to its default state
					grid.reset();

					System.out.println("Processing pair: [" + startBuilding + ", " + endBuilding + "]");

					SimpleEntry<Integer, Integer> startBuildingEntrance = Entrances.getEntrances().get(startBuilding);
					SimpleEntry<Integer, Integer> endBuildingEntrance = Entrances.getEntrances().get(endBuilding);

					int startTileRow = startBuildingEntrance.getKey();
					int startTileCol = startBuildingEntrance.getValue();

					int endTileRow = endBuildingEntrance.getKey();
					int endTileCol = endBuildingEntrance.getValue();

					Tile startTile = grid.getTileAt(startTileRow, startTileCol);
					Tile endTile = grid.getTileAt(endTileRow, endTileCol);

					// In the frontend, start/end tiles are visualized as walls, so they must be set
					// as a generic tile for Dijkstra to run properly.
					startTile.setIsWall(false);
					startTile.setIsStart(true);
					endTile.setIsEnd(true);
					endTile.setIsWall(false);

					System.out.println("Start: " + startBuilding + " | End: " + endBuilding);

					// Avoid computation time if the start and end building are the same
					if (startBuilding.equalsIgnoreCase(endBuilding)) {
						System.out.println("Start and end buildings are the same: " + startBuilding);

						String res = new JSONObject()
								.put("traversedTiles", new JSONArray())
								.put("path", new JSONArray())
								.put("startTile", startBuilding)
								.put("endTile", endBuilding)
								.put("startTilePosition", new JSONArray().put(startTileCol).put(startTileRow))
								.put("endTilePosition", new JSONArray().put(endTileCol).put(endTileRow)).toString();

						segments.put(new JSONObject(res));
						continue;
					}

					// Run Dijkstra's on this grid
					DijkstraAlgorithm dijkstra = new DijkstraAlgorithm(grid);
					DijkstraAlgorithm.Result result = dijkstra.run();

					// Update response with the result of Dijkstra's Algorthim
					String res = new JSONObject()
							.put("traversedTiles", result.getTraversedTiles())
							.put("path", result.getPath())
							.put("startTile", startBuilding)
							.put("endTile", endBuilding)
							.put("startTilePosition", new JSONArray().put(startTileCol).put(startTileRow))
							.put("endTilePosition", new JSONArray().put(endTileCol).put(endTileRow)).toString();

					segments.put(new JSONObject(res));
				}

				// Reset the grid to its default state
				grid.reset();

				finalRes.put("segments", segments);
				String response = finalRes.toString();

				// Send the JSON rseponse
				exchange.getResponseHeaders().set("Content-Type", "application/json");
				Server.writeJson(exchange, response, 200);
			} catch (Exception e) {
				e.printStackTrace();

				String response = new JSONObject()
						.put("status", "error")
						.put("message", "Invalid JSON")
						.toString();

				Server.writeJson(exchange, response, 400);
			}
		});

		// Start the server
		server.setExecutor(null);
		server.start();
		System.out.println("Server is running on port " + PORT + ".");
	}
}
