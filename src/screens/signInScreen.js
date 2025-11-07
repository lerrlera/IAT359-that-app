import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { firebase_auth } from "../utils/firebase.config.js";
import { Alert, StyleSheet, View, Image, Text, TextInput } from "react-native";
import { Colors } from "../utils/colors.js";
import { FontAwesome5 } from '@expo/vector-icons';

export default function SignInScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        try {
            setLoading(true);
            await createUserWithEmailAndPassword(firebase_auth, email.trim(), password);
            Alert.alert("Account created");
        } catch (e) {
            Alert.alert("Failed to create an account");
        } finally {
            setLoading(false);
        }
    };
    // Sign In

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                source={require("../../assets/images/that-logo.png")}
                style={styles.logo} />
                <Text style={styles.title}>Get Started</Text>
            </View>
            <View style={styles.inputContainer}>
                <FontAwesome5
              name="clock"
              size={18}
              solid={true}
              color={Colors.peach}
              style={styles.icon}
            />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={""}/>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "white",
        alignItems: "center",
    },
    logoContainer: {
        alignItems: "center",
        gap: 40,
    },
    logo: {
        width: 170,
        height: 60,
        marginTop: 200,
    },
    title: {
        fontSize: 23,
        fontWeight: "bold"
    },
    inputContainer: {
        alignItems: "center",
        flexDirection: "row",
        padding: 12,
        backgroundColor: "#F1F1F1",
        borderRadius: 9,
        width: "70%",
    },
    input: {

    },
    icon: {
        paddingRight: 8,
    },
});
