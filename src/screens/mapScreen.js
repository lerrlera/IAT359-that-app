// Map Screen page

// imports
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import Geocoder from "react-native-geocoding";
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";
import { Platform } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from "../utils/colors";
import SearchBar from "../modules/SearchBar";
import { useNavigation } from '@react-navigation/native';


export default function MapScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  // for colour switch on active search bar
  const [isFocused, setIsFocused] = useState(false);

  const navigation = useNavigation();


  // API key - I created a new one thorugh Google Cloud.
  // It should work for you too! Let me know if it does not. Maybe you might need to create your own.
  Geocoder.init("AIzaSyCyVrYXWjAjwhTSKFKz3baEsNlSIS68xJM");

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
          // rendering the map with an initial region
            latitude: 49.2827,       // Vancouver city center - can be updated later
            longitude: -123.1207,
            latitudeDelta: 0.0922,  
            longitudeDelta: 0.0421,
        }}
        showsMyLocationButton // show the current location button on map
        showsUserLocation // show current location on map
        // note: actual current location will only show on physical device (not on simulators)
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      />
      
    {/* Reusable search bar from modules */}
      <SearchBar
        value={searchLocation}
        onChangeText={setSearchLocation}
        onSubmit={performSearch}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
      />
      <View style={styles.overlay}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.roundButton} onPress={goToCurrentLocation}>
            <FontAwesome5 name="location-arrow" size={25}  solid={false} color={Colors.peach} style={styles.icon}/>
          </Pressable>
          <Pressable style={styles.roundButton} onPress={()=>navigation.navigate("Home")}>
            <FontAwesome5 name="list" size={25}  solid={false} color={Colors.peach} style={styles.icon}/>
          </Pressable>
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
        shadowRadius: 20,
        // Shadow for Android
        elevation: 5,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject, 
      justifyContent: "flex-end", 
      alignItems: "flex-end",
      padding: 20, 
    }
});