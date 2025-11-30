import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Image
} from "react-native";

import { firebase_auth } from "../utils/firebase.config";
import { signOut } from "firebase/auth";
import { Colors } from "../utils/colors";
import { useNavigation } from "@react-navigation/native";

export default function AccountScreen() {

  const navigation = useNavigation();
  const user = firebase_auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(firebase_auth);
      navigation.replace("SignIn");
    } catch (e) {
      Alert.alert("Sign out failed", e.message);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.contentWrapper}>

        {/* App logo */}
        <Image 
          source={require("../../assets/images/that-logo.png")}
          style={styles.logo}
        />

        {/* Screen title */}
        <Text style={styles.header}>Account</Text>

        {/* User info */}
        {user && (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
        )}

        {/* About this app */}
        <View style={styles.aboutBox}>
          <Text style={styles.aboutHeader}>About This App</Text>

          <Text style={styles.aboutText}>
            This app provides up-to-date availability information for 
            transition houses across Metro Vancouver. 
          </Text>

          <Text style={styles.aboutText}>
            Designed as part of our IAT 359 project, it helps house staff to set shelter availability.
          </Text>
        </View>

        {/* Sign out */}
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  

  contentWrapper: {
    width: "80%",
    alignItems: "center",
  },

  logo: {
    width: 230,
    height: 78,
    marginBottom: 20,
  },

  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 25,
  },

  infoBox: {
    width: "100%",
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginBottom: 25,
  },

  infoLabel: {
    fontSize: 13,
    color: "#777",
    marginBottom: 5,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "500",
  },

  aboutBox: {
    width: "100%",
    backgroundColor: "#fff3ef",
    borderRadius: 10,
    padding: 16,
    marginBottom: 25,
  },

  aboutHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: Colors.peach,
  },

  aboutText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 6,
  },

  button: {
    marginTop: 10,
    padding: 14,
    width: "100%",
    backgroundColor: Colors.darkerPeach,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});



