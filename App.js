import { createNativeStackNavigator} from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import HomeScreen from "./src/screens/homeScreen";
import WelcomeScreen from "./src/screens/welcomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName = "Home">
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