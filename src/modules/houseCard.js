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
import { useNavigation } from "@react-navigation/native";

export default function HouseCard({ house }) {
  const navigation = useNavigation();

  // open website
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

  // call
  const handleCall = () => {
    const number = house.phone || house.toll_free_phone;
    if (!number) {
      Alert.alert("No phone number available");
      return;
    }
    Linking.openURL(`tel:${number}`);
  };

  // show on map 
  const handleDirections = () => {
    if (!house.approxLat || !house.approxLng) {
      Alert.alert("Location unavailable");
      return;
    }

    navigation.navigate("Map", {
      targetLat: Number(house.approxLat),
      targetLng: Number(house.approxLng),
      house: house
    });
  };


  function formatUpdated(value) {
  if (!value) return "Unknown";

  // Firestore timestamps
  if (value?.toDate) {
    value = value.toDate();
  }

  const date = new Date(value);
  if (isNaN(date)) return "Unknown";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}


  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.headerContainer}>
        <Image
  source={
    house.availability?.toLowerCase() === "available"
      ? require("../../assets/images/available-marker.png")
      : require("../../assets/images/unavailable-marker.png")
  }
  style={styles.image}
/>
        <View style={styles.subheaderContainer}>
          <Text style={styles.title}>{house.program}</Text>
          <Text style={styles.subheaderText}>{house.organization}</Text>
        </View>
      </View>

      {/* Status Row */}
      <View style={styles.statusRow}>
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

        <Text style={styles.updatedText}>Updated: {formatUpdated(house.last_updated)}</Text>
        
      </View>

      {/* City Row */}
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

      {/* More Info */}
      <Accordion title="More info">

        {house.phone && (
          <Pressable 
            style={styles.infoRow} 
            onPress={() => Linking.openURL(`tel:${house.phone}`)}
          >
            <FontAwesome5 
              name="phone" 
              size={16} 
              color={Colors.peach} 
              style={styles.infoIcon} 
            />
            <Text style={styles.infoText}>{house.phone}</Text>
          </Pressable>
        )}

        {house.toll_free_phone && (
          <Pressable 
            style={styles.infoRow} 
            onPress={() => Linking.openURL(`tel:${house.toll_free_phone}`)}
          >
            <FontAwesome5 
              name="phone-square-alt" 
              size={16} 
              color={Colors.peach} 
              style={styles.infoIcon} 
            />
            <Text style={styles.infoText}>{house.toll_free_phone}</Text>
          </Pressable>
        )}

        {house.text && (
          <Pressable 
            style={styles.infoRow} 
            onPress={() => Linking.openURL(`sms:${house.text}`)}
          >
            <FontAwesome5 
              name="headset" 
              size={16} 
              color={Colors.peach} 
              style={styles.infoIcon} 
            />
            <Text style={styles.infoText}>{house.text}</Text>
          </Pressable>
        )}

        {house.email && (
          <Pressable 
            style={styles.infoRow} 
            onPress={() => Linking.openURL(`mailto:${house.email}`)}
          >
            <FontAwesome5 
              name="envelope" 
              size={16} 
              color={Colors.peach} 
              style={styles.infoIcon} 
            />
            <Text style={styles.infoText}>{house.email}</Text>
          </Pressable>
        )}

        {house.website && (
          <Pressable 
            style={styles.infoRow} 
            onPress={handleOpenWebsite}
          >
            <FontAwesome5 
              name="external-link-alt" 
              size={16} 
              color={Colors.peach} 
              style={styles.infoIcon} 
            />
            <Text style={[styles.infoText, styles.infoLink]}>
              Visit website
            </Text>
          </Pressable>
        )}

      </Accordion>

      {/* Call + Directions Buttons */}
      <View style={styles.actionsRow}>
        <Pressable style={styles.actionButton} onPress={handleCall}>
          <FontAwesome5 name="phone" size={13} color="white" />
          <Text style={styles.actionText}>Call</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleDirections}>
          <FontAwesome5 name="map-marker-alt" size={13} color="white" />
          <Text style={styles.actionText}>View on Map</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff9f6ff",
    borderWidth: 1,
    borderColor: "#e8dadaff",
    width: "92%",
    alignSelf: "center",
    borderRadius: 15,
    marginVertical: 8,
    padding: 15,
    shadowColor: "#ffffffff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  headerContainer: {
    flexDirection: "row",
    padding: 2,
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
    fontSize: 18,
    fontWeight: "800",
    flexShrink: 1,
  },

  subheaderText: {
    fontSize: 15,
    fontWeight: "500",
    flexShrink: 1,
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
  },

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
    fontSize: 13,
  },

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
    backgroundColor: "#fbebe4ff",
    padding: 14,
    borderRadius: 5,
    marginBottom: 7,
  },

  icon: {
    paddingRight: 8,
  },

  actionsRow: {
    flexDirection: "row",
    marginTop: 6,
    marginBottom: 5,
    gap: 8,
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.darkerPeach,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 12,
  },

  link: {
    color: Colors.peach,
    textDecorationLine: "underline",
    marginTop: 5,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },

  infoIcon: {
    marginRight: 12,
  },

  infoText: {
    fontSize: 15,
    color: "#333",
  },

  infoLink: {
    textDecorationLine: "underline",
    color: Colors.peach,
  },
});

