# Compiler and flags
JAVAC = javac
JAVA = java
CP = -cp
CLASSPATH = vendor/json.jar:.

# Files
SRC = Buildings.java Entrances.java Tile.java DijkstraAlgorithm.java Grid.java Server.java
MAIN = Server

# Port for the server
PORT = 3000

# Default target
all: compile run

# Compile target
compile:
	$(JAVAC) $(CP) vendor/json.jar $(SRC)

# Run target
run:
	$(JAVA) $(CP) $(CLASSPATH) $(MAIN) $(PORT)

# Clean target
clean:
	rm -f *.class
