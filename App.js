// App.js
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Image, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "./src/screens/signInScreen";
import HomeScreen from "./src/screens/homeScreen";
import MapScreen from "./src/screens/mapScreen";

import { onAuthStateChanged } from "firebase/auth";
import { firebase_auth } from "./src/utils/firebase.config.js"; // adjust path if yours is different

import { initHousesTable } from "./src/utils/db";

const Stack = createNativeStackNavigator();
const ProtectedStack = createNativeStackNavigator();

// Defines a nested ProtectedStack navigator that contains screens Map and Home.
// ProtectedStack navigator accessible only to signed-in users. 
function ProtectedArea() {
    // put screens that require auth inside this stack
    return (
        // hides header by default. 
        <ProtectedStack.Navigator screenOptions={{ headerShown: false }}>
            <ProtectedStack.Screen name="Map" component={MapScreen} />
            <ProtectedStack.Screen name="Home" component={HomeScreen} />
        </ProtectedStack.Navigator>
    );
}

export default function App() {
    // splash screen state (2s)
    const [splashLoading, setSplashLoading] = useState(true);

    // auth state
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    // splash timer
    useEffect(() => {
        const t = setTimeout(() => setSplashLoading(false), 2000);
        return () => clearTimeout(t);
    }, []);



    // useEffect that runs async call initHousesTable()
    // initHousesTable handles setting up the db & loading data from CSV. 
    useEffect(() => {
        console.log("🔥 App mounted, calling initHousesTable...");
        const setup = async () => {
            await initHousesTable();
        };
        setup();
    }, []);

    // subscribe to firebase auth state, initialize DB & load CSV on first run
    // useEffect(function_that_runs_the_effect, [dependencies]);
    // this function's executed when [initializing] dependency changes. 
    // onAuthStateChanged listens for login/logout event 
    // when user logs in/out, it updates user (u)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebase_auth, (u) => {
            setUser(u);
            if (initializing) setInitializing(false);
        });
        return unsubscribe;
    }, [initializing]);

    if (splashLoading || initializing) {
        return (
            <View style={styles.splashTest}>
                <Image source={require("./assets/images/that-logo.png")} style={styles.logo} />
            </View>
        );
    }


    //   // show splash first
    //   if (splashLoading) {
    //     return (
    //       <View style={styles.splashTest}>
    //         <Image source={require("./assets/images/that-logo.png")} style={styles.logo} />
    //       </View>
    //     );
    //   }

    //   // show spinner while auth state is initializing
    //   if (initializing) {
    //     return (
    //       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //         <ActivityIndicator size="large" />
    //       </View>
    //     );
    //   }

    // main navigator: show protected area if signed in, otherwise sign-in screen
    // this will contain a gropu of screens in this app.
    // navigationContainer must wrap all navigation structure
    // It checks the user state: if user is truthy (logged in): 
    // then, it renders the ProtectedArea stack.
    // otherwise, it renders the SignInScreen -> gating the application access
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name="Protected" component={ProtectedArea} />
                ) : (
                    <Stack.Screen
                        name="SignIn"
                        component={SignInScreen}
                        options={{ title: "Sign In" }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    splashTest: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF0E9",
    },
    logo: {
        width: 230,
        height: 230,
        resizeMode: "contain",
    },
});
