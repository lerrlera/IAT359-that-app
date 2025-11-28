import { useState, useEffect } from "react";
import * as Location from "expo-location";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";

import { Colors } from "../utils/colors";
import HouseCard from "../modules/houseCard";
import { fetchHouses } from "../utils/db";

export default function HomeScreen() {
  const [houses, setHouses] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Only one filter
  const [sortNearest, setSortNearest] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Load houses
  const loadHouses = async () => {
    try {
      const rows = await fetchHouses();
      setHouses(rows);
      setFiltered(rows);
    } catch (e) {
      console.warn("Error fetching houses:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Get user location
  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const loc = await Location.getCurrentPositionAsync({});
    setUserLocation(loc.coords);
  };

  useEffect(() => {
    loadHouses();
    getUserLocation();
  }, []);

  // SORT NEAREST LOGIC
  useEffect(() => {
    let data = [...houses];

    if (sortNearest && userLocation) {
      data.sort((a, b) => {
        const distA = Math.hypot(
          userLocation.latitude - Number(a.approxLat),
          userLocation.longitude - Number(a.approxLng)
        );
        const distB = Math.hypot(
          userLocation.latitude - Number(b.approxLat),
          userLocation.longitude - Number(b.approxLng)
        );
        return distA - distB;
      });
    }

    setFiltered(data);
  }, [sortNearest, houses, userLocation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.peach} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.mainContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadHouses} />
      }
    >
      {/* HEADER */}
      <View style={styles.greetingContainer}>
        <Text style={styles.header}>List of Transition Houses</Text>
        <Text style={styles.subheader}>
          Browse available transition houses in your area
        </Text>
      </View>

      {/* NEAREST FILTER */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersRow}
      >
        <Pressable
          onPress={() => setSortNearest(!sortNearest)}
          style={[styles.filterPill, sortNearest && styles.filterActive]}
        >
          <Text
            style={[
              styles.filterText,
              sortNearest && { color: "white" }, // ACTIVE TEXT WHITE
            ]}
          >
            Nearest
          </Text>
        </Pressable>
      </ScrollView>

      {/* LIST OF HOUSES */}
      <View style={{ paddingBottom: 40 }}>
        {filtered.map((h) => (
          <HouseCard key={h.id} house={h} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  greetingContainer: {
    marginTop: 75,
    padding: 20,
    paddingBottom: 10,
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

  filtersRow: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    marginRight: 10,
  },

  filterActive: {
    backgroundColor: Colors.peach,
  },

  filterText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
});
