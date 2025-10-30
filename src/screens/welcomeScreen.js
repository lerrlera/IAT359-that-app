import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function WelcomeScreen({ route, navigation }) {
  const initialName = route?.params?.userName ?? "";
  const initialColor = route?.params?.backgroundColor ?? "#fff";

  const [userName] = useState(initialName);
  const [backgroundColor] = useState(initialColor);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text>
        Welcome{userName ? `, ${userName}` : ""}!
      </Text>
      <Button title="Back to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
});
