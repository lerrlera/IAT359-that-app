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

const Stack = createNativeStackNavigator();
const ProtectedStack = createNativeStackNavigator();

function ProtectedArea() {
  // put screens that require auth inside this stack
  return (
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

  // subscribe to firebase auth state
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
