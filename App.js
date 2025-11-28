// App.js
import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignInScreen from "./src/screens/signInScreen";
import HomeScreen from "./src/screens/homeScreen";
import MapScreen from "./src/screens/mapScreen";
import AvailabilityScreen from "./src/screens/availabilityScreen";
import AccountScreen from "./src/screens/accountScreen";

import { Colors } from "./src/utils/colors";
import { onAuthStateChanged } from "firebase/auth";
import { firebase_auth } from "./src/utils/firebase.config";
import { FontAwesome5 } from "@expo/vector-icons";

// Navigators
const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

// Bottom tabs after login
function ProtectedArea() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.peach,
        tabBarInactiveTintColor: "#a29b9aff",
        tabBarStyle: {
          backgroundColor: "#fbebe4ff",
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Houses",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="list" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="map-marked-alt" size={22} color={color} />
          ),
        }}
      />

      {/* NEW TAB: Availability */}
      <Tabs.Screen
        name="Availability"
        component={AvailabilityScreen}
        options={{
          tabBarLabel: "Availability",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="calendar-check" size={22} color={color} />
          ),
        }}
      />

      {/* NEW TAB: Account */}
      <Tabs.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

export default function App() {
  const [splashLoading, setSplashLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Splash screen
  useEffect(() => {
    const t = setTimeout(() => setSplashLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebase_auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsub;
  }, [initializing]);

  if (splashLoading || initializing) {
    return (
      <View style={styles.splashTest}>
        <Image
          source={require("./assets/images/that-logo.png")}
          style={styles.logo}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Protected" component={ProtectedArea} />
        ) : (
          <Stack.Screen name="SignIn" component={SignInScreen} />
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
