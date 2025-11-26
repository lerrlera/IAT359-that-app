import { View, Text, Pressable, StyleSheet, Image, Linking, Alert } from "react-native"; // components in screen 
import { Colors } from "../utils/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import Accordion from "./accordion";

export default function HouseCard({ house }) {
  const handleOpenWebsite = async () => { 
    // async/await - used to handle operations that take some time to complete.
    // asynchronous function that handles navigation to an external website. 
    if (!house.website) {
      Alert.alert("No website available");
      return;
    }
    const supported = await Linking.canOpenURL(house.website);
    if (supported) {
      await Linking.openURL(house.website);
      // await: used to pause execution of async function until promise resolves/rejects. 
      // await can only be used for async function. 
      // promise = result returned inside the function. 
      // Uses the Linking API to check if the device can open the website URL. 
    } else {
      Alert.alert(`Can't open URL: ${house.website}`);
    }
  };


  return (
    <Pressable style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require("../../assets/images/house.png")} style={styles.image} />
        <View style={styles.subheaderContainer}>
          <Text style={styles.title}>{house.program}</Text>
          <Text style={styles.subheaderText}>{house.organization}</Text>

        </View>
      </View>


      <View style={styles.availabilityContainer}>
        {/* This uses a Ternary Operator to conditionally apply the greenDot or redDot style based on the house's availability status (case-insensitive check). */}
        {/* condition ? trueResult : falseResult */}
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
          {house.availability || "Availability unknown"}
        </Text>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.boxContainer}>
          <FontAwesome5 name="map-marker-alt" size={18} color={Colors.peach} style={styles.icon} />
          <Text style={styles.bodyText}>{house.city}</Text>
        </View>
      </View>

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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 5,
    padding: 20,
    shadowColor: "#6c6c6cff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: "row",
    padding: 10,
    paddingTop: 0,
  },
  subheaderContainer: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 15,
  },
  image: {
    width: 47,
    height: 47
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  subheaderText: {
    fontSize: 15,
    fontWeight: "600",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  bodyText: {
    fontSize: 15,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingLeft: 10,
  },
  greenDot: {
    width: 12,
    height: 12,
    backgroundColor: Colors.green,
    borderRadius: 10,
    marginRight: 5
  },
  redDot: {
    width: 12,
    height: 12,
    backgroundColor: Colors.red,
    borderRadius: 10,
    marginRight: 5
  },
  availabilityText: {
    fontSize: 15,
    color: Colors.green
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
    paddingRight: 8
  },
  link: {
    color: Colors.peach,
    textDecorationLine: "underline",
    marginTop: 5
  },
});


