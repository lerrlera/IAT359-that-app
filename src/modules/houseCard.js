import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Image, 
  Linking, 
  Alert 
} from "react-native";

import { Colors } from "../utils/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import Accordion from "./accordion";

export default function HouseCard({ house }) {

  // 1️⃣ Open website
  const handleOpenWebsite = async () => { 
    if (!house.website) {
      Alert.alert("No website available");
      return;
    }
    const supported = await Linking.canOpenURL(house.website);
    if (supported) {
      await Linking.openURL(house.website);
    } else {
      Alert.alert(`Can't open URL: ${house.website}`);
    }
  };

  // 2️⃣ Call
  const handleCall = () => {
    const number = house.phone || house.toll_free_phone;
    if (!number) {
      Alert.alert("No phone number available");
      return;
    }
    Linking.openURL(`tel:${number}`);
  };

  // 3️⃣ Directions
  const handleDirections = () => {
    if (!house.approxLat || !house.approxLng) {
      Alert.alert("Location unavailable");
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${house.approxLat},${house.approxLng}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.headerContainer}>
        <Image 
          source={require("../../assets/images/house.png")} 
          style={styles.image} 
        />
        <View style={styles.subheaderContainer}>
          <Text style={styles.title}>{house.program}</Text>
          <Text style={styles.subheaderText}>{house.organization}</Text>
        </View>
      </View>

      {/* Availability + Last Updated Row */}
      <View style={styles.statusRow}>
        
        {/* Availability */}
        <View style={styles.availabilityContainer}>
          <View
            style={
              house.availability?.toLowerCase() === "available"
                ? styles.greenDot
                : styles.redDot
            }
          />
          <Text
            style={[
              styles.availabilityText,
              {
                color:
                  house.availability?.toLowerCase() === "available"
                    ? Colors.green
                    : Colors.red,
              },
            ]}
          >
            {house.availability || "Unknown"}
          </Text>
        </View>

        {/* Updated text */}
        <Text style={styles.updatedText}>
          {house.last_updated ? `Updated: ${house.last_updated}` : "Updated: Unknown"}
        </Text>

      </View>

      {/* City */}
      <View style={styles.locationContainer}>
        <View style={styles.boxContainer}>
          <FontAwesome5 
            name="map-marker-alt" 
            size={18} 
            color={Colors.peach} 
            style={styles.icon} 
          />
          <Text style={styles.bodyText}>{house.city}</Text>
        </View>
      </View>
      {/* Accordion */}
      <Accordion title="More info">
        {house.phone ? <Text>📞 {house.phone}</Text> : null}
        {house.toll_free_phone ? <Text>📞 {house.toll_free_phone}</Text> : null}
        {house.text ? <Text>💬 {house.text}</Text> : null}
        {house.email ? <Text>📧 {house.email}</Text> : null}
        {house.website ? (
          <Text style={styles.link} onPress={handleOpenWebsite}>
            Visit website
          </Text>
        ) : null}
      </Accordion>


      {/* Call + Directions Buttons */}
      <View style={styles.actionsRow}>
        <Pressable style={styles.actionButton} onPress={handleCall}>
          <FontAwesome5 name="phone" size={16} color="white" />
          <Text style={styles.actionText}>Call</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleDirections}>
          <FontAwesome5 name="directions" size={16} color="white" />
          <Text style={styles.actionText}>Directions</Text>
        </Pressable>
      </View>



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "95%",
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 8,
    padding: 15,
    shadowColor: "#6c6c6cff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  headerContainer: {
    flexDirection: "row",
    padding: 10,
    paddingTop: 6,
  },

  subheaderContainer: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 15,
  },

  image: {
    width: 47,
    height: 47,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    flexShrink: 1,
  },

  subheaderText: {
    fontSize: 15,
    fontWeight: "600",
    flexShrink: 1,
  },

  /* ROW: Availability + Updated */
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
  },

  /* Availability section */
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  greenDot: {
    width: 12,
    height: 12,
    backgroundColor: Colors.green,
    borderRadius: 10,
    marginRight: 6,
  },

  redDot: {
    width: 12,
    height: 12,
    backgroundColor: Colors.red,
    borderRadius: 10,
    marginRight: 6,
  },

  availabilityText: {
    fontSize: 15,
  },

  /* Updated text */
  updatedText: {
    fontSize: 13,
    color: "#6d6d6d",
  },

  bodyText: {
    fontSize: 15,
  },

  boxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCF2ED",
    padding: 14,
    borderRadius: 5,
    marginBottom: 7,
  },

  icon: {
    paddingRight: 8,
  },

  /* Buttons */
  actionsRow: {
    flexDirection: "row",
    marginTop: 6,
    width: "100%",
    marginBottom: 5,
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.peach,
    padding: 16,
    marginHorizontal: 5,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },

  link: {
    color: Colors.peach,
    textDecorationLine: "underline",
    marginTop: 5,
  },
});



