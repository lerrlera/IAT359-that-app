import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Image, 
  Alert, 
  Linking 
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import Accordion from "./accordion";
import { Colors } from "../utils/colors";

export default function MapHouseCard({ house, onClose }) {

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

  const handleCall = () => {
    const number = house.phone || house.toll_free_phone;
    if (!number) {
      Alert.alert("No phone number available");
      return;
    }
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.container}>

      {/* close button to close pop-up card */}
      {onClose && (
        <Pressable style={styles.closeButton} onPress={onClose}>
          <FontAwesome5 name="times" size={18} color={Colors.brown} />
        </Pressable>
      )}

      {/* header part */}
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

      {/* status */}
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

        <Text style={styles.updatedText}>
          {house.last_updated
            ? `Updated: ${house.last_updated}`
            : "Updated: Unknown"}
        </Text>

      </View>

      {/* city */}
      <View style={styles.boxContainer}>
        <FontAwesome5
          name="map-marker-alt"
          size={18}
          color={Colors.peach}
          style={styles.icon}
        />
        <Text style={styles.bodyText}>{house.city}</Text>
      </View>

      {/* More Info */}
      <Accordion title="More info">

        {house.phone && (
          <Pressable 
            style={styles.infoRow}
            onPress={() => Linking.openURL(`tel:${house.phone}`)}
          >
            <FontAwesome5 name="phone" color={Colors.peach} size={16} style={styles.infoIcon}/>
            <Text style={styles.infoText}>{house.phone}</Text>
          </Pressable>
        )}

        {house.toll_free_phone && (
          <Pressable 
            style={styles.infoRow}
            onPress={() => Linking.openURL(`tel:${house.toll_free_phone}`)}
          >
            <FontAwesome5 name="phone-square-alt" color={Colors.peach} size={16} style={styles.infoIcon}/>
            <Text style={styles.infoText}>{house.toll_free_phone}</Text>
          </Pressable>
        )}

        {house.text && (
          <Pressable 
            style={styles.infoRow}
            onPress={() => Linking.openURL(`sms:${house.text}`)}
          >
            <FontAwesome5 name="headset" color={Colors.peach} size={16} style={styles.infoIcon}/>
            <Text style={styles.infoText}>{house.text}</Text>
          </Pressable>
        )}

        {house.email && (
          <Pressable 
            style={styles.infoRow}
            onPress={() => Linking.openURL(`mailto:${house.email}`)}
          >
            <FontAwesome5 name="envelope" color={Colors.peach} size={16} style={styles.infoIcon}/>
            <Text style={styles.infoText}>{house.email}</Text>
          </Pressable>
        )}

        {house.website && (
          <Pressable 
            style={styles.infoRow} 
            onPress={handleOpenWebsite}
          >
            <FontAwesome5 name="external-link-alt" color={Colors.peach} size={16} style={styles.infoIcon}/>
            <Text style={[styles.infoText, styles.infoLink]}>
              Visit website
            </Text>
          </Pressable>
        )}

      </Accordion>

      {/* call */}
      <Pressable style={styles.callButton} onPress={handleCall}>
        <FontAwesome5 name="phone" size={14} color="white" />
        <Text style={styles.callText}>Call</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff9f6ff",      // match HouseCard
    borderWidth: 1,
    borderColor: "#d4d2d2ff",
    borderRadius: 15,
    padding: 15,
    width: "100%",
    alignSelf: "center",
    marginVertical: 8,
    shadowColor: "#ffffffff",          // very soft shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
    zIndex: 10,
  },

  headerContainer: {
    flexDirection: "row",
    padding: 10,
    paddingTop: 6,
    marginBottom: 5,
  },

  image: {
    width: 47,        // match HouseCard
    height: 47,
  },

  subheaderContainer: {
    flex: 1,
    marginLeft: 15,
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
    borderRadius: 6,
    backgroundColor: Colors.green,
    marginRight: 6,
  },

  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.red,
    marginRight: 6,
  },

  availabilityText: {
    fontSize: 13,
  },

  updatedText: {
    fontSize: 13,
    color: "#6d6d6d",
  },

  boxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fbebe4ff",   // match HouseCard
    padding: 14,
    borderRadius: 5,
    marginBottom: 7,
  },

  icon: {
    marginRight: 8,
  },

  bodyText: {
    fontSize: 15,
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

  callButton: {
    marginTop: 5,
    backgroundColor: Colors.brown,
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  callText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
});

