import java.util.HashMap;
import java.util.AbstractMap;

public class Entrances {
    // Mapping of building ids to the entrance tile position on the grid
    private static HashMap<String, AbstractMap.SimpleEntry<Integer, Integer>> mapping = new HashMap<>();
    private static boolean initialized = false;

    public static HashMap<String, AbstractMap.SimpleEntry<Integer, Integer>> getEntrances() {
        return mapping;
    }

    public static boolean hasInitialized() {
        return initialized;
    }

    public static void setInitialized(boolean initialized) {
        Entrances.initialized = initialized;
    }

    public static void addEntrance(String building, int row, int col) {
        mapping.put(building, new AbstractMap.SimpleEntry<>(row, col));
    }

    public static void removeEntrance(String building) {
        mapping.remove(building);
    }

    public static void initialize() {
        Entrances.addEntrance("KING", 13, 3);
        Entrances.addEntrance("HGH", 11, 8);
        Entrances.addEntrance("DMH-IRC", 11, 11);
        Entrances.addEntrance("CRC-ADM", 11, 21);
        Entrances.addEntrance("ENG", 14, 31);
        Entrances.addEntrance("IS", 12, 38);
        Entrances.addEntrance("CYA", 10, 43);
        Entrances.addEntrance("CYB", 15, 47);
        Entrances.addEntrance("SSC-NPG", 5, 44);
        Entrances.addEntrance("IT", 15, 15);
        Entrances.addEntrance("CL", 17, 21);
        Entrances.addEntrance("ASH", 18, 47);
        Entrances.addEntrance("SCI-WSQ", 20, 4);
        Entrances.addEntrance("TH", 18, 12);
        Entrances.addEntrance("CCB", 20, 21);
        Entrances.addEntrance("SU", 18, 28);
        Entrances.addEntrance("BT", 17, 47);
        Entrances.addEntrance("BBC", 27, 44);
        Entrances.addEntrance("DBH", 23, 18);
        Entrances.addEntrance("MUS", 24, 27);
        Entrances.addEntrance("ART", 24, 31);
        Entrances.addEntrance("YUH", 27, 3);
        Entrances.addEntrance("SPM", 27, 6);
        Entrances.addEntrance("FOB", 26, 11);
        Entrances.addEntrance("SPXC-SPXE", 28, 15);
        Entrances.addEntrance("SWC", 26, 21);
        Entrances.addEntrance("PCUEC", 27, 27);
        Entrances.addEntrance("HB", 27, 38);
        Entrances.addEntrance("CP", 29, 43);
        Entrances.addEntrance("WPG", 35, 3);
        Entrances.addEntrance("ISB", 34, 6);
        Entrances.addEntrance("DH", 39, 8);
        Entrances.addEntrance("MH", 37, 16);
        Entrances.addEntrance("SH", 36, 18);
        Entrances.addEntrance("SPG", 42, 19);
        Entrances.addEntrance("SRAC", 36, 27);
        Entrances.addEntrance("WSH", 41, 27);
        Entrances.addEntrance("DC-JWH", 44, 35);
        Entrances.addEntrance("CV2", 35, 38);
        Entrances.addEntrance("CVC", 38, 43);
        Entrances.addEntrance("CVB", 39, 45);
        Entrances.addEntrance("CVA", 41, 43);
    }

    public static String getBuildingFromEntrance(int row, int col) {
        for (HashMap.Entry<String, AbstractMap.SimpleEntry<Integer, Integer>> entry : mapping.entrySet()) {
            if (entry.getValue().getKey() == row && entry.getValue().getValue() == col) {
                return entry.getKey();
            }
        }
        return null;
    }
}
