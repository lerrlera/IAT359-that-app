// Map Screen page
// imports
import * as Location from "expo-location";              // for detecting user location
import { useEffect, useRef, useState, useCallback } from "react";    // React hooks
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import Geocoder from "react-native-geocoding";           // geocoding search bar input
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, Marker, Circle } from "react-native-maps"; 
import { Platform } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "../utils/colors";
import SearchBar from "../modules/SearchBar";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import { GOOGLE_MAPS_API_KEY } from "@env";
import MapHouseCard from "../modules/mapHouseCard";

const INITIAL_REGION = {
  latitude: 49.2827,            // Vancouver default location
  longitude: -123.1207,
  latitudeDelta: 0.0922,        // size of map zoom on load
  longitudeDelta: 0.0421,
};

export default function MapScreen() {
  // navigation props (needed for going back and passing params)
  const navigation = useNavigation();
  const route = useRoute();

  // states for map
  const [currentLocation, setCurrentLocation] = useState(null);   // user's GPS location
  const [searchLocation, setSearchLocation] = useState(null);     // search bar input value
  const [isFocused, setIsFocused] = useState(false);              // search bar focus to change color

  // house markers
  const [houses, setHouses] = useState([]);
  const [loadingHouses, setLoadingHouses] = useState(true);

  // pop-up card on marker press
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // initialize geocoder with API key (loaded from .env)
  Geocoder.init(GOOGLE_MAPS_API_KEY);

  // reference to MapView, used to control camera (animate, center map, zoom)
  const mapRef = useRef(null);

  // Search bar: convert typed address → latitude/longitude
  const performSearch = async () => {
    try {
      const json = await Geocoder.from(searchLocation);
      const location = json.results[0].geometry.location;

      // animate smoothly to user searched address
      mapRef.current?.animateToRegion(
        {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    } catch (error) {
      console.warn(error);
    }
  };

  // Fetch transition house data from Firestore
  useEffect(() => {
    async function loadHouses() {
      try {
        const colRef = collection(db, "transition_houses");
        const snap = await getDocs(colRef);
        
        // convert Firestore docs → array
        const list = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHouses(list);
      } catch (err) {
        console.log("Error loading houses:", err);
      } finally {
        setLoadingHouses(false);
      }
    }
    loadHouses();
  }, []);

  // Get user's current device location from GPS
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      // read device coordinates
      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        setCurrentLocation(location);
      }
    })();
  }, []);

  // When the Map tab becomes focused (user taps "Map" in the tab bar)
  // → reset popup, input, and camera to default
  useFocusEffect(
    useCallback(() => {
      const { targetLat } = route.params || {};

      // coming from "View on Map" → let the other effect handle it
      if (targetLat) return;

      // normal Map tab focus → reset
      setSelectedHouse(null);
      setShowPopup(false);
      setSearchLocation(null);

      if (mapRef.current) {
        mapRef.current.animateToRegion(INITIAL_REGION, 0);
      }
    }, [route.params])
  );

  // Run when user taps "View on Map" in HouseCard → Map tab
  useEffect(() => {
    const { targetLat, targetLng, house } = route.params || {};

    if (!targetLat || !targetLng) return;

    // move map camera directly to that house's coordinates
    mapRef.current?.animateToRegion(
      {
        latitude: Number(targetLat),
        longitude: Number(targetLng),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );

    // open popup for that selected house
    if (house) {
      setSelectedHouse(house);
      setShowPopup(true);
    }
  }, [route.params]);

  // Button: center map on user's current real-time location
  const goToCurrentLocation = () => {
    if (!currentLocation) return;

    const { latitude, longitude } = currentLocation.coords;

    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  };

  return (
    <View style={styles.container}>
      
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      >

        {!loadingHouses && houses.length > 0 && houses.map(h => {
          if (!h.approxLat || !h.approxLng) return null;   // skip if no coords

          return (
            <View key={h.id}>
              
              <Marker
                coordinate={{
                  latitude: Number(h.approxLat),
                  longitude: Number(h.approxLng),
                }}
                onPress={() => {
                  setSelectedHouse(h);          // open popup card
                  setShowPopup(true);
                }}
              >
                <Image
                  source={
                    h.availability === "Available"
                      ? require("../../assets/images/available-marker.png")
                      : require("../../assets/images/unavailable-marker.png")
                  }
                  style={{ width: 45, height: 45 }}
                  resizeMode="contain"
                />
              </Marker>

              <Circle
                center={{
                  latitude: Number(h.approxLat),
                  longitude: Number(h.approxLng),
                }}
                radius={h.radius || 1500} // default safety radius
                strokeColor={
                  h.availability === "Available"
                    ? "rgba(0,200,0,0.8)"
                    : "rgba(255,0,0,0.8)"
                }
                fillColor={
                  h.availability === "Available"
                    ? "rgba(0,200,0,0.2)"
                    : "rgba(255,0,0,0.2)"
                }
              />
            </View>
          );
        })}
      </MapView>
      {showPopup && selectedHouse && (
  <View style={styles.popupWrapper}>
    <MapHouseCard 
      house={selectedHouse}
      onClose={() => setShowPopup(false)}
    />
  </View>
)}


      <View style={styles.searchWrapper}>
        <SearchBar
          value={searchLocation}
          onChangeText={setSearchLocation}
          onSubmit={performSearch}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
        />
      </View>

      <View style={styles.overlay}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.roundButton} onPress={goToCurrentLocation}>
            <FontAwesome5 name="location-arrow" size={25} color={Colors.peach} />
          </Pressable>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },

  searchWrapper: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  buttonContainer: {
    flexDirection: "column",
  },

  roundButton: {
    borderRadius: 60,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    marginBottom: 20,
    shadowColor: "#171717ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },

  popupContainer: {
    position: "absolute",
    top: 140,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5,
  },

  popupTitle: { fontSize: 18, fontWeight: "700" },
  popupCity: { fontSize: 14, color: "#666", marginTop: 4 },
  popupStatus: { marginTop: 6, fontWeight: "600" },

  popupClose: {
    marginTop: 10,
    backgroundColor: Colors.peach,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },popupWrapper: {
  position: "absolute",
  top: 130,
  left: 20,
  right: 20,
  zIndex: 20,
},

});
