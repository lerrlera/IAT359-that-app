import { createNativeStackNavigator} from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, View, Image } from "react-native";
import { useState, useEffect } from "react";

/* added to imitate a splash screen */
import logo from './assets/images/that-logo.png';

import HomeScreen from "./src/screens/homeScreen";
import WelcomeScreen from "./src/screens/welcomeScreen";
import MapScreen from "./src/screens/mapScreen";


const Stack = createNativeStackNavigator();

export default function App() {
    /* added to imitate a splash screen */
    const [loading, setLoading] = useState(true);
    /* added to create a sample splash screen */
    useEffect(() => {
        setTimeout(() => setLoading(false), 2000); 
    }, []);
    /* added to imitate a splash screen */
    if (loading) {
        return (
        <View style={styles.splashTest}>
            <Image source={logo} style={styles.logo} />
        </View>
        );
    }
    return (
   
        <NavigationContainer>
            <Stack.Navigator initialRouteName = "Map">
                <Stack.Screen
                    name="Map"
                    component={MapScreen}
                    options = {{ title: "Map Screen" }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options = {{ title: "Home Screen" }}
                />
                <Stack.Screen
                    name="Welcome"
                    component={WelcomeScreen}
                    options = {{ title: "Weclome Screen" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

/* added to imitate a splash screen */
const styles = StyleSheet.create({
  splashTest: { 
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFF0E9' 
},
    logo: { 
        width: 230, 
        height: 230, 
        resizeMode: 'contain' }
});