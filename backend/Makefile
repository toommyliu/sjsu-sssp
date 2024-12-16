# Compiler and flags
JAVAC = javac
JAVA = java
CP = -cp
CLASSPATH = vendor/json.jar:.

# Files
SRC = Entrances.java Tile.java DijkstraAlgorithm.java Grid.java Server.java
MAIN = Server

# Default target
all: compile run

# Compile target
compile:
	$(JAVAC) $(CP) vendor/json.jar $(SRC)

# Run target
run:
	$(JAVA) $(CP) $(CLASSPATH) $(MAIN)

# Clean target
clean:
	rm -f *.class
