import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Alert 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "../utils/colors";
import HouseCard from "../modules/houseCard";
import { fetchHouses, FIRESTORE_COLLECTION } from "../utils/db";

// Firestore
import { db } from "../utils/firebase.config.js";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function AvailabilityScreen() {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedHouse, setSelectedHouse] = useState(null);

  // Load houses using fetchHouses() in db.js
  useEffect(() => {
    const load = async () => {
      const houses = await fetchHouses();
      setPrograms(houses);
    };
    load();
  }, []);

  // When a program is selected, load its matching house data
  useEffect(() => {
    if (!selectedProgram) return;

    const house = programs.find((item) => item.program === selectedProgram);
    setSelectedHouse(house || null);
  }, [selectedProgram, programs]);

  // Toggle availability
  const handleChangeAvailability = () => {
    if (!selectedHouse) return;

    Alert.alert(
      "Confirm change",
      "Are you sure you want to toggle availability?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes", 
          onPress: async () => {
            try {
              const newStatus =
                selectedHouse.availability?.toLowerCase() === "available"
                  ? "Unavailable"
                  : "Available";

              const houseRef = doc(db, FIRESTORE_COLLECTION, selectedHouse.id);

              await updateDoc(houseRef, {
                availability: newStatus,
                last_updated: new Date().toISOString(),
              });

              // Refresh UI
              setSelectedHouse({
                ...selectedHouse,
                availability: newStatus,
                last_updated: new Date().toISOString(),
              });

              Alert.alert("Success", "Availability has been updated.");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* Dropdown */}
      <Text style={styles.label}>Select Program</Text>
      <View style={styles.dropdownWrapper}>
        <Picker
          selectedValue={selectedProgram}
          onValueChange={(value) => setSelectedProgram(value)}
          style={styles.dropdown}
        >
          <Picker.Item label="Select a program..." value="" />
          {programs.map((item) => (
            <Picker.Item 
              key={item.id} 
              label={item.program} 
              value={item.program} 
            />
          ))}
        </Picker>
      </View>

      {/* Organization */}
      {selectedHouse && (
        <Text style={styles.organization}>
          Organization: <Text style={{ fontWeight: "600" }}>
            {selectedHouse.organization}
          </Text>
        </Text>
      )}

      {/* Change Availability Button */}
      {selectedHouse && (
        <Pressable style={styles.actionButton} onPress={handleChangeAvailability}>
          <Text style={styles.actionText}>
            Change Availability
          </Text>
        </Pressable>
      )}

      {/* Single HouseCard */}
      {selectedHouse && (
        <HouseCard house={selectedHouse} />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },

  dropdown: {
    height: 50,
    width: "100%",
  },

  organization: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 10,
  },

  // EXACT COPY OF actionButton from HouseCard
  actionButton: {
    flexDirection: "row",
    backgroundColor: Colors.darkerPeach,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
  },

  actionText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
});
