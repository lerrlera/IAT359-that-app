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

// navigation prop = provides methods & properties for navigating between screens
// and controlling the navigation state. 
// navigation prop's passed down to every screen component in the stack navigator.
export default function HomeScreen({ navigation }) {

    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // calls the Firebase signOut method to terminate user session. 
    const handleSignOut = async () => {
        try {
            await signOut(firebase_auth);
            // uses navigation.replace
            // go back to SignInScreen after signing out
            navigation.replace("SignIn");
        } catch (e) {
            Alert.alert("Sign out failed", e.message);
        }
    };


    // defines an async function for fetching house data - could take some time. 
    const loadHouses = async () => {
        try {
            // await keyword - used to pause the execution of async function 
            // until the promise resolves. Promise = result returned inside the function. 
            // await keyword ensures that data's fully fetched before proceeding. 
            const rows = await fetchHouses();
            console.log("📌 fetchHouses returned:", rows.length);
            setHouses(rows);
        } catch (e) {
            console.warn("Error fetching houses:", e);
        } finally {
            // ensures that loading & refreshing states are reset to false
            // this runs regardless of whether the data fetch's successful or not. 
            setLoading(false);
            setRefreshing(false);
        }

    };

    const user = firebase_auth.currentUser;

    // useEffect() = code to create schema. 
    // useEffect() hook used to handle 'side effects' in React component
    // side effects include things like data fetching from external APIs, connecting to servers, setting timers...
    // also setting up a database table. 
    // useEffect() hook runs once when the component mounts to initiate data loading process. 
    useEffect(() => {
        loadHouses();
    }, []);
    // first argument = function that runs the effect
    // 2nd argument: array of dependencies (optional). This controls when the useEffect runs

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

            {/* navigate method navigation.navigate used to switch to a new screen */}
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