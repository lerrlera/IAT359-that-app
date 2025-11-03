import { View, Text, Pressable, StyleSheet, Image, Button } from "react-native";
import { Colors } from "../utils/colors";
import { Button } from "react-native/types_generated/index";

export default function HouseCard() {

  return (
    <Pressable style={styles.container}>
        <View>
            <Image></Image>
            <Text></Text>
            <Text></Text>
        </View>
        <View>
            <Text></Text>
            <Text></Text>
        </View>
        <View>
            <Button>

            </Button>
    
        </View>
    </Pressable>
      
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "90%",
    height: 500,
    alignSelf:"center",
    alignItems: "center",
    borderRadius: 10,
    // Shadow for iOS
    shadowColor: '#6c6c6cff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // Shadow for Android
    elevation: 5,
  },
});
