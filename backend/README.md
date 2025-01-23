# SJSU SSSP - Backend

The backend server for the SJSU Single Source Shortest Path (SSSP) project, implementing Dijkstra's algorithm for pathfinding between campus buildings.

## Technologies Used

- **[com.sun.net.httpserver](https://docs.oracle.com/javase/8/docs/jre/api/net/httpserver/spec/com/sun/net/httpserver/package-summary.html):** Provides a simple high-level Http server API, which can be used to build embedded HTTP servers.

- **[org.json](https://github.com/stleary/JSON-java):** A reference implementation of a JSON package in Java (Library)

## Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

Before you begin, ensure you have the following tools installed:

- **[Java JDK](https://www.oracle.com/java/technologies/downloads/)**

Note: we use `make` (which should be built-in on macOS systems) to compile and run the Java code. See the [Makefile](./Makefile).

#### Verify Installations

Run the following commands in your Terminal to confirm the required tools are installed:

```bash
# Verify JDK Installation
java --version
```

---

### Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/toommyliu/sjsu-sssp/
cd backend
```

2. **Compile All Java Source Files**

```bash
javac -cp vendor/json.jar Entrances.java Tile.java DijkstraAlgorithm.java Grid.java Server.java
# or simply
make compile
```

3. **Run the backend server**

```bash
java -cp vendor/json.jar:. Server 3000
# or simply
make run
```

> [!TIP]
> You can execute `make all` to compile and run the backend server.

4. **Access the application**
   A message saying that "Server is running on port 3000." indicates that the server has initialized and ready.
