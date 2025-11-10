import { useState, useEffect } from "react";
import { firebase_auth } from "../utils/firebase.config";
import { signOut } from "firebase/auth";
import {
    Button,
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Pressable,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import { Colors } from "../utils/colors";
import { FontAwesome5 } from '@expo/vector-icons';

import HouseCard from "../modules/houseCard";
import Header from "../modules/header";
import { fetchHouses } from "../utils/db";

export default function HomeScreen({ navigation }) {

    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(firebase_auth);
            // go back to SignInScreen after signing out
            navigation.replace("SignIn");
        } catch (e) {
            Alert.alert("Sign out failed", e.message);
        }
    };


    const loadHouses = async () => {
        try {
            const rows = await fetchHouses();
            setHouses(rows);
        } catch (e) {
            console.warn("Error fetching houses:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }

    };

    const user = firebase_auth.currentUser;

    useEffect(() => {
        loadHouses();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.peach} />
            </View>

        );

    }

    return (
        <View style={styles.mainContainer}>
            <Header title="Transition House List" />

            <View style={styles.greetingContainer}>
                <Text style={styles.header}>Hello!</Text>
                {user && <Text style={styles.subheader}>Your email: {user.email}</Text>}

                <TouchableOpacity onPress={handleSignOut} style={styles.button}>
                    <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>


            <ScrollView style={styles.cardContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={loadHouses} />

                }
            >
                {houses.map((h) => (
                    <HouseCard key={h.id}
                        house={h} />

                ))}


            </ScrollView>
            <View style={styles.overlay}>
                <Pressable style={styles.roundButton} onPress={() => navigation.navigate("Map")}>
                    <FontAwesome5 name="map" size={25} solid={false} color="white" style={styles.icon} />
                </Pressable>
            </View>

        </View>

    );


}

const styles = StyleSheet.create({

    greetingContainer: {
        flexDirection: 'column',
        margin: 10,
        justifyContent: "center",
        alignItems: "center",

    },

    header: {
        fontSize: 20,
        fontWeight: "600",
        flexShrink: 1,
        flexWrap: "wrap",
    },

    subheader: {
        fontSize: 15,
        fontWeight: "500",
        flexShrink: 1,
        flexWrap: "wrap",
    },

    buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },

    button: {
        marginTop: 8,
        padding: 12,
        width: "100%",
        backgroundColor: Colors.peach,
        borderRadius: 8,
        alignItems: "center",
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    cardContainer: {
        width: "100%",
        overflow: "visible",
    },
    roundButton: {
        borderRadius: 60,
        backgroundColor: Colors.peach,
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        height: 70,
        marginBottom: 20,
        zIndex: 999,
        // Shadow for iOS
        shadowColor: '#686868ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        // Shadow for Android
        elevation: 5,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        padding: 20,
    }
})