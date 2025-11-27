// Map Screen page
// imports
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable,Image } from "react-native";
import Geocoder from "react-native-geocoding";
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";
import { Marker, Circle } from "react-native-maps";
import { Platform } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from "../utils/colors";
import SearchBar from "../modules/SearchBar";
import { useNavigation } from '@react-navigation/native';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase.config";

export default function MapScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  // for colour switch on active search bar
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();

  // for fetching house data on the map as markers
  const [houses, setHouses] = useState([]);
  const [loadingHouses, setLoadingHouses] = useState(true);

  const [selectedHouse, setSelectedHouse] = useState(null);
  const [showPopup, setShowPopup] = useState(false);


  // API key - I created a new one through Google Cloud. API key is stored in .env for privacy as .env is never committed
  Geocoder.init(GOOGLE_MAPS_API_KEY);

  // Creates a reference to the MapView, allowing direct control (e.g., animate camera, move map).
  const mapRef = useRef(null);
  // perform search based on search term entered by the user
  const performSearch = async () => {
    try {
      const json = await Geocoder.from(searchLocation);
      const location = json.results[0].geometry.location;
      const searchedLocation = {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
      mapRef.current?.animateCamera(
        { center: searchedLocation, zoom: 15 },
        { duration: 2000 }
      );
    } catch (error) {
      console.warn(error);
    }
  };
  
  useEffect(() => {
  async function loadHouses() {
    try {
      const colRef = collection(db, "transition_houses");
      const snap = await getDocs(colRef);
      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHouses(list);
      console.log("Houses loaded from Firestore:", list);
    } catch (err) {
      console.log("Error loading houses:", err);
    } finally {
      setLoadingHouses(false);
    }
  }
  loadHouses();
  }, []);

  useEffect(() => {
    // determining current location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let ErrorMsg = [];
      if (status !== "granted") {
        ErrorMsg = "Permission to access location was denied";
        console.log(ErrorMsg)
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        setCurrentLocation(location);
        console.log(`Current location: latitude: ${location.coords.latitude} 
          // longitude: ${location.coords.longitude}`);
      } else {
        ErrorMsg = "Current location not obtained";
        console.log(ErrorMsg)
        return;
      }
    })();
  }, []);

  useEffect(() => {
  console.log("MOUNT: MapScreen");
  return () => console.log("UNMOUNT: MapScreen");
  }, []);

  const goToCurrentLocation = () => {
    if (!currentLocation) return;
    const { latitude, longitude } = currentLocation.coords;
    mapRef.current?.animateCamera(
        { center: { latitude, longitude }, zoom: 15 },
        { duration: 1000 }
        );
    };

  return (
    <View style={styles.container}>
         <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: 49.2827,
          longitude: -123.1207,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      >
        {!loadingHouses && houses.length > 0 && houses.map(h => {
        // safety check - skip items without coordinates
          if (!h.approxLat || !h.approxLng) return null;
          return (
            <View key={h.id}>
                <Marker
                  coordinate={{
                  latitude: Number(h.approxLat),
                  longitude: Number(h.approxLng),
                  }}
                  onPress={() => {
                    setSelectedHouse(h);
                    setShowPopup(true);
                  }}
                  //title={h.program}          // popup title
                  //description={h.city}       // popup subtitle
                >
                  <Image source={
                    h.availability === "Available"
                    ? require("../../assets/images/available-marker.png")
                    : require("../../assets/images/unavailable-marker.png")}
                      style={{ width: 45, height: 45 }}
                      resizeMode="contain"
                  />
                </Marker>
                <Circle center={{
                  latitude: Number(h.approxLat),
                  longitude: Number(h.approxLng),
                  }}
                  radius={h.radius || 1500}
                  strokeColor={
                  h.availability === "Available"
                  ? "rgba(0,200,0,0.8)"    // green outline
                  : "rgba(255,0,0,0.8)"    // red outline
                  }
                  fillColor={
                    h.availability === "Available"
                    ? "rgba(0,200,0,0.2)"    // green transparent
                    : "rgba(255,0,0,0.2)"    // red transparent
                  }
                />
              </View>
              );
            })
          }
        </MapView>
        {showPopup && selectedHouse && (
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>{selectedHouse.program}</Text>
            <Text style={styles.popupCity}>{selectedHouse.city}</Text>
            <Text style={styles.popupStatus}>
            {selectedHouse.availability === "Available" ? "Available" : "Unavailable"}
            </Text>
            <Pressable onPress={() => setShowPopup(false)} style={styles.popupClose}>
              <Text style={{ color: "white" }}>Close</Text>
            </Pressable>
          </View>
        )}

        {/* Reusable search bar from modules */}
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
              <FontAwesome5 name="location-arrow" size={25}  solid={false} color={Colors.peach} style={styles.icon}/>
            </Pressable>
    
              {/* <Pressable style={styles.roundButton} onPress={()=>navigation.navigate("Home")}>
                <FontAwesome5 name="list" size={25}  solid={false} color={Colors.peach} style={styles.icon}/>
              </Pressable> */}
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    map: {
        flex: 1,
    },
    icon: {
        paddingLeft: 6,
        paddingRight: 8,
    },
    buttonContainer: {
        flexDirection: "column",
    },
    roundButton: {
        borderRadius: 60,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent:"center",
        width: 70,
        height: 70,
        marginBottom: 20,
        // Shadow for iOS
        shadowColor: '#171717ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        // Shadow for Android
        elevation: 5,
    },
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
    popupContainer: {
      position: "absolute",
      top: 13,
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
    popupTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    popupCity: {
      fontSize: 14,
      color: "#666",
      marginTop: 4,
    },
    popupStatus: {
      marginTop: 6,
      fontWeight: "600",
    },
    popupClose: {
      marginTop: 10,
      backgroundColor: Colors.peach,
      padding: 10,
      borderRadius: 6,
      alignItems: "center"
    },
});