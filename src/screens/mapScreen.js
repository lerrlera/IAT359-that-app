// Map Screen page
import * as Location from "expo-location";
import {
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Image
} from "react-native";
import Geocoder from "react-native-geocoding";
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
  Circle,
} from "react-native-maps";
import { Platform } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "../utils/colors";
import SearchBar from "../modules/SearchBar";
import {
  useNavigation,
  useRoute,
  useFocusEffect
} from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import { GOOGLE_MAPS_API_KEY } from "@env";
import MapHouseCard from "../modules/mapHouseCard";

const INITIAL_REGION = {
  latitude: 49.2827,
  longitude: -123.1207,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // user GPS location
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  // transition houses from Firestore
  const [houses, setHouses] = useState([]);
  const [loadingHouses, setLoadingHouses] = useState(true);

  // marker popup
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const mapRef = useRef(null);

  Geocoder.init(GOOGLE_MAPS_API_KEY);

  // ----------------------------------------------------------
  // Load transition houses from Firestore
  // ----------------------------------------------------------
  const loadHouses = async () => {
    try {
      const colRef = collection(db, "transition_houses");
      const snap = await getDocs(colRef);

      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHouses(list);
    } catch (err) {
      console.log("Error loading houses:", err);
    } finally {
      setLoadingHouses(false);
    }
  };

  // initial load
  useEffect(() => {
    loadHouses();
  }, []);

  // ----------------------------------------------------------
  // Get user's device GPS location
  // ----------------------------------------------------------
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let location = await Location.getCurrentPositionAsync({});
      if (location) setCurrentLocation(location);
    })();
  }, []);

  // ----------------------------------------------------------
  // When the Map tab is focused normally
  // (not coming from "Show on Map" button)
  // ----------------------------------------------------------
  useFocusEffect(
    useCallback(() => {
      const { targetLat } = route.params || {};

      // if coming from "View on Map" do not reset camera or popup
      if (targetLat) return;

      // normal tab switch → reload all houses + reset UI
      loadHouses();
      setSelectedHouse(null);
      setShowPopup(false);
      setSearchLocation(null);

      mapRef.current?.animateToRegion(INITIAL_REGION, 0);
    }, [route.params])
  );

  // ----------------------------------------------------------
  // Search bar: convert typed address to map coordinates
  // ----------------------------------------------------------
  const performSearch = async () => {
    try {
      const json = await Geocoder.from(searchLocation);
      const location = json.results[0].geometry.location;

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

  // ----------------------------------------------------------
  // "Show on Map" → move camera to house + always load fresh data
  // ----------------------------------------------------------
  useEffect(() => {
    const { targetLat, targetLng, house } = route.params || {};
    if (!targetLat || !targetLng) return;

    (async () => {
      // get latest data from Firestore (ensures availability is up-to-date)
      const colRef = collection(db, "transition_houses");
      const snap = await getDocs(colRef);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setHouses(list);

      // move camera to the selected house
      mapRef.current?.animateToRegion(
        {
          latitude: Number(targetLat),
          longitude: Number(targetLng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );

      // replace stale house object with fresh version from database
      const fresh = list.find((h) => h.id === house.id) || house;
      setSelectedHouse(fresh);
      setShowPopup(true);
    })();
  }, [route.params]);

  // ----------------------------------------------------------
  // Center map on user's current location
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      >
        {!loadingHouses &&
          houses.map((h) => {
            if (!h.approxLat || !h.approxLng) return null;

            return (
              <View key={h.id}>
                {/* marker for each house */}
                <Marker
                  coordinate={{
                    latitude: Number(h.approxLat),
                    longitude: Number(h.approxLng),
                  }}
                  onPress={() => {
                    setSelectedHouse(h);
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

                {/* approximate protection radius */}
                <Circle
                  center={{
                    latitude: Number(h.approxLat),
                    longitude: Number(h.approxLng),
                  }}
                  radius={h.radius || 1500}
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

      {/* pop-up card on selected marker */}
      {showPopup && selectedHouse && (
        <View style={styles.popupWrapper}>
          <MapHouseCard
            house={selectedHouse}
            onClose={() => setShowPopup(false)}
          />
        </View>
      )}

      {/* search bar */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={searchLocation}
          onChangeText={setSearchLocation}
          onSubmit={performSearch}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
        />
      </View>

      {/* current location button */}
      <View style={styles.overlay}>
        <Pressable style={styles.roundButton} onPress={goToCurrentLocation}>
          <FontAwesome5 name="location-arrow" size={25} color={Colors.peach} />
        </Pressable>
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

  popupWrapper: {
    position: "absolute",
    top: 130,
    left: 20,
    right: 20,
    zIndex: 20,
  },
});

