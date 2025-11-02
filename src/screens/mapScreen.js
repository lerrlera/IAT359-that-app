import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {Button, StyleSheet, Text, TextInput, View,} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Geocoder from "react-native-geocoding";
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";
import { Platform } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from "../utils/colors";


export default function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  // API key - I created the new one
  Geocoder.init("AIzaSyCyVrYXWjAjwhTSKFKz3baEsNlSIS68xJM");

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


  return (
    <View style={styles.container}>
        <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          // rendering the map with an initial region
            latitude: 49.2827,       // Vancouver city center
            longitude: -123.1207,
            latitudeDelta: 0.0922,  
            longitudeDelta: 0.0421,
        }}
        showsMyLocationButton // show the current location button on map
        showsUserLocation // show current location on map
        // note: actual current location will only show on physical device (not on simulators)

        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      />
        <View style={[styles.searchContainer, 
            {borderColor: isFocused ? Colors.peach : Colors.grey}]}>
            <FontAwesome name="search" size={18} color="#888" style={styles.icon} />
            <TextInput
                style={styles.searchBar}
                placeholder="Search for location"
                placeholderTextColor={Colors.grey}
                value={searchLocation}
                onChangeText={setSearchLocation}
                returnKeyType="search"
                onSubmitEditing={performSearch}
                onFocus={()=>setIsFocused(true)}
                onBlur={()=>setIsFocused(false)}
            />
            {/* <FontAwesome name="location-arrow" size={20} color="gray" style={styles.icon} /> */}
        </View>
      </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
  title: {
    marginTop: 10,
    padding: 5,
    fontWeight: "bold",
    fontSize: 20,
  },
  map: {
    flex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
    borderRadius: 5,
    margin: 10,
  },
  searchRow: {
    flexDirection: "row",
  },

searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 100,
    padding: 15,
    margin: 10,
    backgroundColor: "white",
    position: "absolute",

    // Shadow for iOS
    shadowColor: '#171717ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    // Shadow for Android
    elevation: 5,
    zIndex: 10,

},
searchBar: {
    flex:1,
},
icon: {
    marginRight: 8,
},
});