import { View, Text, Pressable, StyleSheet, Image, Button } from "react-native";
import { Colors } from "../utils/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import Accordion from "./accordion";
import React, {useCallback} from 'react';


export default function HouseCard() {
  const websiteURL = "https://www.saraforwomen.ca/";

  const handleOpenWebsite = async () => {
    const supported = await Linking.canOpenURL(websiteURL);
    if (supported) {
      await Linking.openURL(websiteURL);
    } else {
      Alert.alert(`Can't open URL: ${websiteURL}`);
    }
  };
  
  return (
    <Pressable style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/images/house.png")}
            style={styles.image}
          />
          <Text style={styles.title}>SARA' s Abbotsford Transition House</Text>
        </View>
        <View style={styles.availabilityContainer}>
          <View style={styles.greenDot} />
          <Text style={styles.availabilityText}>Available space</Text>
        </View>
        <View style={styles.locationContainer}>
          <View style={styles.boxContainer}>
            <FontAwesome5
              name="clock"
              size={18}
              solid={true}
              color={Colors.peach}
              style={styles.icon}
            />
            <Text style={styles.timeText}>Updated: Oct 11, 2025 11:24 PM</Text>
          </View>
          <View style={styles.boxContainer}>
            <FontAwesome5
              name="map-marker-alt"
              size={18}
              solid={false}
              color={Colors.peach}
              style={styles.icon}
            />
            <Text style={styles.locationText}>Abbotsford</Text>
          </View>
        </View>
        <Accordion title="More info">
          <Text style={{paddingBottom:5}}>Please note that we do not accept pets. Call us toll free: 1-800-123-1234.</Text>
          <Text style={styles.link} onPress={handleOpenWebsite}>SARA for Women Society</Text>          
        </Accordion>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Directions</Text>
          </Pressable>
           <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Call</Text>
          </Pressable>
           <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Email</Text>
          </Pressable>
        </View>
    </Pressable>
      
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "90%",
    alignSelf:"center",
    borderRadius: 10,
    marginVertical: 5,
    padding: 20,       // optional padding inside card
    // Shadow
    shadowColor: '#6c6c6cff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  headerContainer: {
    flexDirection: "row",
    padding: 10,
    paddingTop:0,
  },
  image: {
    width: 47,
    height: 47,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    flexShrink: 1,
    marginLeft: 15,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 10,
    marginBottom: 10,
  },
  greenDot: {
    width: 12,
    height: 12,
    backgroundColor: Colors.green,
    borderRadius: 10,
    marginRight: 5,
  },
  availabilityText: {
    fontSize: 15,
    color: Colors.green,
  },
  boxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCF2ED",
    padding: 14,
    borderRadius: 5,
    marginBottom: 7,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "500"
  },
  icon: { paddingRight: 8 },
  link: {
    color: Colors.peach,
    textDecorationLine: "underline",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },
  button: {
    padding: 15,
    width: "31%",
    backgroundColor: Colors.brown,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});
