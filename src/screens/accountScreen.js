import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
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
      <View style={styles.greetingContainer}>
        
        <Text style={styles.header}>Account</Text>

        {user && (
          <Text style={styles.subheader}>Logged in as: {user.email}</Text>
        )}

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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  greetingContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },

  header: {
    fontSize: 22,
    fontWeight: "700",
  },

  subheader: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 8,
  },

  button: {
    marginTop: 20,
    padding: 12,
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


