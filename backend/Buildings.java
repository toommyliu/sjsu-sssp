import java.util.HashMap;

public class Buildings {
    private static HashMap<String, String> mapping = new HashMap<String, String>();
    private static boolean initialized = false;

    public static HashMap<String, String> getBuildings() {
        return mapping;
    }

    public static boolean hasInitialized() {
        return initialized;
    }

    public static void setInitialized(boolean initialized) {
        Buildings.initialized = initialized;
    }

    public static void addBuilding(String building, String name) {
        mapping.put(building, name);
    }

    public static void removeBuilding(String building) {
        mapping.remove(building);
    }
}
