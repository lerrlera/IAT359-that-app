import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  Modal,
} from "react-native";

import { Colors } from "../utils/colors";
import HouseCard from "../modules/houseCard";
import { fetchHouses, FIRESTORE_COLLECTION } from "../utils/db";

// Firestore
import { db } from "../utils/firebase.config.js";
import { doc, updateDoc } from "firebase/firestore";

export default function AvailabilityScreen() {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedHouse, setSelectedHouse] = useState(null);

  // dropdown modal
  const [pickerVisible, setPickerVisible] = useState(false);

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
    if (!selectedProgram) {
      setSelectedHouse(null);
      return;
    }

    const house = programs.find((item) => item.program === selectedProgram);
    setSelectedHouse(house || null);
  }, [selectedProgram, programs]);

  function formatDate(date) {
    if (!date) return "Unavailable data";

    if (date.toDate && typeof date.toDate === "function") {
      date = date.toDate();
    }

    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    if (isNaN(date)) return "Invalid";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

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

              setSelectedHouse({
                ...selectedHouse,
                availability: newStatus,
                last_updated: formatDate(new Date()),
              });

              Alert.alert("Success", "Availability has been updated.");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  // When user chooses a program from modal
  const handleSelectProgram = (programName) => {
    setSelectedProgram(programName);
    setPickerVisible(false);
  };

  return (
    
    <View style={styles.root}>
      
       {/* HEADER */}
      <View style={styles.greetingContainer}>
        <Text style={styles.header}>Update availability</Text>
        <Text style={styles.subheader}>
          Change your transition house's availability
        </Text>
      </View>

      {/* Label */}
      <Text style={styles.label}>Select Program</Text>

      {/* Custom "picker" button */}
      <Pressable
        style={styles.dropdownButton}
        onPress={() => setPickerVisible(true)}
      >
        <Text
          style={[
            styles.dropdownButtonText,
            !selectedProgram && { color: "#999" },
          ]}
          numberOfLines={1}
        >
          {selectedProgram || "Select a program..."}
        </Text>
      </Pressable>

      {/* Scrollable content below the picker */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Organization */}
        {selectedHouse && (
          <View style={styles.organizationBox}>
            <Text style={styles.organizationLabel}>Organization</Text>
            <Text style={styles.organizationValue}>{selectedHouse.organization}</Text>
          </View>     
        )}

        {/* Change Availability Button */}
        {selectedHouse && (
          <Pressable
            style={styles.actionButton}
            onPress={handleChangeAvailability}
          >
            <Text style={styles.actionText}>Change Availability</Text>
          </Pressable>
        )}

        {/* Preview label */}
{selectedHouse && (
  <View style={styles.previewBox}>
    <Text style={styles.previewLabel}>
      This is how your house will appear in the list and on the map
    </Text>
  </View>
)}

        {/* Single HouseCard */}
        {selectedHouse && <HouseCard house={selectedHouse} />}

        <View style={{ height: 40 }} />
      </ScrollView>



      {/* FULL-SCREEN MODAL PICKER (works same on iOS + Android) */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Program</Text>

            <ScrollView style={styles.modalList}>
              {programs.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.modalItem}
                  onPress={() => handleSelectProgram(item.program)}
                >
                  <Text style={styles.modalItemText}>{item.program}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              style={styles.modalCancelButton}
              onPress={() => setPickerVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  greetingContainer: {
    marginTop: 75,
    padding: 20,
    paddingBottom: 20,
    alignItems: "flex-start",
  },

  header: {
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  subheader: {
    fontSize: 15,
    color: "#8d8d8dff",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  dropdownButton: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: "center",
    backgroundColor: "white",
  },

  dropdownButtonText: {
    fontSize: 15,
    color: "#333",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 32,
  },

  organization: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
  },
  organizationBox: {
    backgroundColor: "#f4f4f4",
    padding: 14,
    borderRadius: 10,
    marginBottom: 2,
  },
  organizationLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  organizationValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
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
    fontSize: 14,
  },
  previewBox: {
    marginTop: 25,
    marginBottom: 6,
    backgroundColor: "#f4f4f4",
    padding: 14,
    borderRadius: 10,
  },
  previewLabel: {
    fontSize: 12,
    color: "#777",
},

  /* Modal styles */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modalCard: {
    maxHeight: "70%",
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 10,
  },

  modalList: {
    maxHeight: "100%",
  },

  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  modalItemText: {
    fontSize: 15,
  },

  modalCancelButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: "center",
  },

  modalCancelText: {
    fontSize: 15,
    color: Colors.darkerPeach,
    fontWeight: "600",
  },
});

