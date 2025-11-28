import React, { useState } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Image, 
    Alert, 
    StyleSheet 
} from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { firebase_auth } from "../utils/firebase.config.js";
import { Colors } from "../utils/colors.js";
import { FontAwesome5 } from "@expo/vector-icons";

export default function SignInScreen() {
    // ----- STATES -----
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // ----- SIGN UP -----
    const handleSignUp = async () => {
        try {
            setLoading(true);
            await createUserWithEmailAndPassword(firebase_auth, email.trim(), password);
            Alert.alert("Account created!");
        } catch (e) {
            Alert.alert("Sign up failed", e.message);
        } finally {
            setLoading(false);
        }
    };

    // ----- SIGN IN -----
    const handleSignIn = async () => {
        try {
            setLoading(true);
            await signInWithEmailAndPassword(firebase_auth, email.trim(), password);
        } catch (e) {
            Alert.alert("Sign in failed", e.message);
        } finally {
            setLoading(false);
        }
    };

    // ----- UI -----
    return (
        <View style={styles.container}>
            {/* Logo and Title */}
            <View style={styles.logoContainer}>
                <Image
                    source={require("../../assets/images/that-logo.png")}
                    style={styles.logo}
                />
                <Text style={styles.title}>Get Started</Text>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
                <FontAwesome5
                    name="envelope"
                    size={18}
                    color={Colors.peach}
                    style={styles.icon}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
                <FontAwesome5
                    name="lock"
                    size={18}
                    color={Colors.peach}
                    style={styles.icon}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            {/* Buttons */}
            <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                style={[styles.button, styles.signInButton]}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Working..." : "Sign In"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleSignUp}
                disabled={loading}
                style={[styles.button, styles.signUpButton]}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Working..." : "Create Account"}
                </Text>
            </TouchableOpacity>
        </View>
    );
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
        fontWeight: "bold",
        marginBottom: 12,
    },
    inputContainer: {
        alignItems: "center",
        flexDirection: "row",
        padding: 12,
        backgroundColor: "#F1F1F1",
        borderRadius: 9,
        width: "70%",
        marginBottom: 15,
    },
    input: {
        flex: 1,
    },
    icon: {
        paddingRight: 8,
    },
    button: {
        padding: 14,
        borderRadius: 10,
        width: "70%",
        marginBottom: 12,
    },
    signInButton: {
        backgroundColor: Colors.darkerPeach,
    },
    signUpButton: {
        backgroundColor: Colors.brown,
        
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "600",
    },
});
